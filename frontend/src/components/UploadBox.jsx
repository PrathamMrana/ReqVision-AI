import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function UploadBox() {
  const [baseline, setBaseline] = useState('');
  const [updated, setUpdated] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'text/plain') {
      toast.error('Please upload a .txt file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setter(e.target.result);
    reader.readAsText(file);
    toast.success(`${file.name} loaded successfully`);
  };

  const handleCompare = async () => {
    if (!baseline.trim() || !updated.trim()) {
      toast.error('Please provide both Baseline and Updated requirements.');
      return;
    }

    setLoading(true);
    try {
      // Setup backend API URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api/compare';
      const response = await axios.post(apiUrl, {
        baseline,
        updated
      });
      
      // Store result in local storage or pass via state (passing via state is better for React Router)
      navigate('/dashboard', { state: { result: response.data } });
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to analyze requirements. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 glass-panel p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Baseline Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-lg">
            <FileText className="text-primary-500" />
            <h3>Baseline SRS</h3>
          </div>
          <div className="relative">
            <textarea
              className="w-full h-64 p-4 border border-slate-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none font-mono text-sm"
              placeholder="Paste original requirements here..."
              value={baseline}
              onChange={(e) => setBaseline(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 font-medium">Click to upload Baseline .txt</p>
              </div>
              <input type="file" className="hidden" accept=".txt" onChange={(e) => handleFileUpload(e, setBaseline)} />
            </label>
          </div>
        </div>

        {/* Updated Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-lg">
            <FileText className="text-accent-500" />
            <h3>Updated SRS</h3>
          </div>
          <div className="relative">
            <textarea
              className="w-full h-64 p-4 border border-slate-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all outline-none resize-none font-mono text-sm"
              placeholder="Paste new requirements here..."
              value={updated}
              onChange={(e) => setUpdated(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 font-medium">Click to upload Updated .txt</p>
              </div>
              <input type="file" className="hidden" accept=".txt" onChange={(e) => handleFileUpload(e, setUpdated)} />
            </label>
          </div>
        </div>

      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={handleCompare}
          disabled={loading}
          className="flex items-center gap-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary-500/30 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing Impact...
            </>
          ) : (
            <>
              Run AI Analysis
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
