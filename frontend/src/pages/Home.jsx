import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, Search, Target, ShieldAlert, CheckCircle2, ArrowRight, Zap, 
  Activity, Clock, FileText, BarChart3, LayoutDashboard, FileOutput, Server, Code, XCircle, BrainCircuit
} from 'lucide-react';
import UploadBox from '../components/UploadBox';

export default function Home() {
  const demoRef = useRef(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { icon: <Target className="w-5 h-5" />, title: "Scope Creep Detection" },
    { icon: <Database className="w-5 h-5" />, title: "Traceability Matrix" },
    { icon: <ShieldAlert className="w-5 h-5" />, title: "Requirement Quality" },
    { icon: <Zap className="w-5 h-5" />, title: "TF-IDF Comparison" },
    { icon: <LayoutDashboard className="w-5 h-5" />, title: "Interactive Dashboard" },
    { icon: <FileOutput className="w-5 h-5" />, title: "PDF Report" },
    { icon: <Clock className="w-5 h-5" />, title: "Timeline Analysis" },
    { icon: <Activity className="w-5 h-5" />, title: "Impact Analysis" }
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute top-40 -left-40 w-[500px] h-[500px] bg-accent-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], y: [0, -50, 0] }} 
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 left-1/2 w-[500px] h-[500px] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        />
      </div>

      {/* Navbar Placeholder */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-primary-600" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">ReqVision<span className="text-primary-600">AI</span></span>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/dashboard" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Dashboard</Link>
          <button onClick={scrollToDemo} className="hidden md:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Live Demo</button>
          <a href="https://github.com/PrathamMrana/ReqVision-AI" target="_blank" rel="noreferrer" className="hidden md:flex text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors items-center gap-1"><Code className="w-4 h-4"/> GitHub</a>
          <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
          <button className="text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors">Log In</button>
          <button onClick={scrollToDemo} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 transition-all">Get Started</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* 1. Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ opacity: { duration: 0.5 }, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-primary-100 text-primary-700 text-sm font-bold mb-8 shadow-sm"
          >
            <Zap className="w-4 h-4 text-accent-500" /> Powered by TF-IDF & Cosine Similarity
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
          >
            Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Requirement Drift</span> <br className="hidden md:block"/> Analysis
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Instantly compare Software Requirement Specifications (SRS). Detect modifications, track scope creep, and mitigate project risks before they impact your sprint.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToDemo} 
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xl shadow-slate-900/20 transition-colors flex items-center justify-center gap-2 group text-lg"
            >
              Analyze SRS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToDemo} 
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-bold shadow-sm transition-colors flex items-center justify-center gap-2 text-lg"
            >
              View Live Demo
            </motion.button>
          </motion.div>
        </div>

        {/* 2. Animated Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white shadow-xl shadow-slate-200/50"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 mt-1">Unlimited</div>
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Requirements Capacity</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-primary-600 mb-2 mt-1">High</div>
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Detection Accuracy</div>
          </div>
          <div className="text-center flex flex-col justify-center">
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 mb-2 mt-1">TF-IDF</div>
            <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Core NLP Engine</div>
          </div>
        </motion.div>

        {/* 11. Live Demo / Upload Box */}
        <div className="mt-40 scroll-mt-32" ref={demoRef}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Live Interactive Demo</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-lg">Upload your Baseline and Updated SRS text files below to instantly generate a comprehensive change impact dashboard.</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <UploadBox />
          </motion.div>
        </div>

        {/* 3. How It Works */}
        <div className="mt-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-slate-600 mt-3 text-lg">A seamless NLP pipeline built for software engineering.</p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1.5 bg-gradient-to-r from-primary-100 via-accent-200 to-primary-100 -translate-y-1/2 -z-10 rounded-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Baseline SRS", desc: "Upload original requirements document", icon: <FileText /> },
                { step: "2", title: "Updated SRS", desc: "Upload modified/new version", icon: <FileOutput /> },
                { step: "3", title: "TF-IDF Engine", desc: "Calculate cosine similarity & map IDs", icon: <Activity /> },
                { step: "4", title: "AI Dashboard", desc: "Review impact & trace requirements", icon: <LayoutDashboard /> }
              ].map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white/80 backdrop-blur p-8 rounded-3xl shadow-xl shadow-slate-200/30 border border-white relative group transition-colors duration-300"
                >
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20 group-hover:scale-110 group-hover:bg-primary-600 transition-all duration-300">
                    {s.icon}
                  </div>
                  <div className="absolute top-6 right-6 text-6xl font-black text-slate-100 -z-10 select-none transition-colors group-hover:text-primary-50">{s.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Why ReqVision AI (Comparison) */}
        <div className="mt-40 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Why ReqVision AI?</h2>
            <p className="text-slate-600 mt-3 text-lg">Ditch manual reviews for automated quantitative intelligence.</p>
          </div>
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="p-8 text-lg font-bold text-slate-500 uppercase tracking-widest w-1/2">Traditional Review</th>
                  <th className="p-8 text-lg font-black text-primary-700 uppercase tracking-widest bg-primary-50/50 w-1/2">
                    <div className="flex items-center gap-3"><Zap className="w-6 h-6 text-accent-500"/> ReqVision AI</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Manual requirement scanning", "Automated TF-IDF vector matching"],
                  ["Time consuming (hours/days)", "Analyzed locally in seconds"],
                  ["Error prone & inconsistent", "100% Consistent execution rules"],
                  ["No quantitative impact analysis", "Dynamic module impact & risk level"],
                  ["Undetected scope creep", "Precise scope creep index calculation"],
                  ["Static PDF reports", "Interactive tracing & animated dashboard"]
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-8">
                      <div className="text-slate-600 font-medium text-lg flex items-center gap-4"><XCircle className="w-6 h-6 text-slate-300 group-hover:text-red-400 transition-colors shrink-0"/> {row[0]}</div>
                    </td>
                    <td className="p-8 bg-primary-50/20">
                      <div className="text-slate-900 font-bold text-lg flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0"/> {row[1]}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Feature Grid & 5. Tech Stack */}
        <div className="mt-40 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 tracking-tight">Powerful Capabilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  key={i} 
                  className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                    {f.icon}
                  </div>
                  <span className="font-bold text-slate-800">{f.title}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Technology Stack</h3>
              <div className="flex flex-wrap gap-3">
                {['React', 'FastAPI', 'Python', 'TF-IDF', 'Scikit-learn', 'TailwindCSS', 'Recharts', 'Framer Motion'].map(tech => (
                  <span key={tech} className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:bg-primary-600 transition-colors cursor-default">{tech}</span>
                ))}
              </div>
            </div>
          </div>
          
          {/* 7. Dashboard Showcase Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            animate={{ y: [0, -15, 0] }}
            transition={{ 
              opacity: { duration: 0.5 }, 
              x: { duration: 0.5 },
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
            }}
            viewport={{ once: true }}
            className="relative perspective-1000"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-[2.5rem] transform rotate-3 scale-105 opacity-20 filter blur-2xl"></div>
            <motion.div 
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-700 relative z-10 transform -rotate-2 ease-out"
            >
              <div className="bg-slate-800/80 backdrop-blur px-6 py-4 flex items-center gap-3 border-b border-slate-700/50">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <div className="ml-6 text-sm font-mono text-slate-400 bg-slate-900/50 border border-slate-700/50 px-6 py-1.5 rounded-full flex-1 text-center truncate">reqvision-ai.demo / dashboard</div>
              </div>
              <div className="p-8 bg-slate-50 h-[500px] overflow-hidden flex flex-col gap-6">
                {/* Mock UI Elements */}
                <div className="h-24 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between animate-pulse">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center"><ShieldAlert className="w-7 h-7 text-primary-600"/></div>
                      <div>
                        <div className="w-40 h-5 bg-slate-200 rounded-md mb-3"></div>
                        <div className="w-64 h-4 bg-slate-100 rounded-md"></div>
                      </div>
                   </div>
                   <div className="w-32 h-10 bg-emerald-100 rounded-full"></div>
                </div>
                <div className="grid grid-cols-4 gap-6">
                   {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between"><div className="w-10 h-10 bg-slate-100 rounded-xl"></div><div className="w-20 h-6 bg-slate-200 rounded-md"></div></div>)}
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="w-48 h-6 bg-slate-200 rounded-md mb-6"></div>
                  <div className="w-full h-4 bg-slate-100 rounded-md mb-3"></div>
                  <div className="w-full h-4 bg-slate-100 rounded-md mb-3"></div>
                  <div className="w-3/4 h-4 bg-slate-100 rounded-md"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* 10. Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 mt-32 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BrainCircuit className="w-10 h-10 text-primary-600" />
              <span className="text-2xl font-bold text-white tracking-tight">ReqVision<span className="text-primary-500">AI</span></span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-md text-sm font-medium">An advanced NLP-powered Software Requirement Specification (SRS) analyzer utilizing TF-IDF and Cosine Similarity to automatically detect scope creep and requirement drift.</p>
          </div>
          <div className="flex md:justify-end gap-10 text-sm font-bold">
            <a href="https://github.com/PrathamMrana/ReqVision-AI" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><Code className="w-5 h-5"/> GitHub</a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2"><FileText className="w-5 h-5"/> Documentation</a>
            <span className="flex items-center gap-2 text-slate-600"><Server className="w-5 h-5"/> v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
