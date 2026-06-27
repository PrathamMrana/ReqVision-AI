import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, PlusCircle, XCircle, ArrowRight, Lightbulb, Award, Zap, AlertTriangle, MessageSquareWarning } from 'lucide-react';

export default function DiffCard({ change, index }) {
  const { req_id, old: oldText, new: newText, status, similarity, module, risk, confidence, quality, priority, complexity, recommendations, detected_changes } = change;

  const getStatusConfig = () => {
    switch (status) {
      case 'Unchanged':
        return { color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-300', icon: <CheckCircle2 className="w-5 h-5" /> };
      case 'Modified':
        return { color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-300', icon: <AlertCircle className="w-5 h-5" /> };
      case 'Added':
        return { color: 'text-primary-700', bg: 'bg-primary-100', border: 'border-primary-300', icon: <PlusCircle className="w-5 h-5" /> };
      case 'Removed':
        return { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300', icon: <XCircle className="w-5 h-5" /> };
      default:
        return { color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300', icon: null };
    }
  };

  const getConfidenceColor = (conf) => {
    switch (conf) {
      case 'Very High': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'High': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };
  
  const getPriorityColor = (pri) => {
    switch(pri) {
      case 'Must Have': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Should Have': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Could Have': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSimilarityBadge = (sim) => {
    if (!sim) return <span className="text-slate-500 font-bold">—</span>;
    const val = Math.round(sim * 100);
    let colorClass = "bg-red-50 text-red-700 border-red-200";
    if (val >= 95) colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    else if (val >= 75) colorClass = "bg-blue-50 text-blue-700 border-blue-200";
    else if (val >= 50) colorClass = "bg-orange-50 text-orange-700 border-orange-200";
    
    return <span className={`px-3 py-1 rounded-full border text-sm font-extrabold shadow-sm ${colorClass}`}>{val}%</span>;
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2, shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
      className={`relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm border-l-4 ${config.border} mb-6 hover:shadow-xl hover:border-slate-200 transition-all duration-300 group`}
    >
      <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="font-mono text-sm font-extrabold text-slate-800 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 shadow-sm mr-1 group-hover:bg-white transition-colors">
            {req_id}
          </span>
          <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm ${config.bg} ${config.color}`}>
            {config.icon}
            {status}
          </div>
          {module && (
            <span className="text-xs font-bold bg-slate-50 text-slate-600 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {module}
            </span>
          )}
          {priority && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${getPriorityColor(priority)}`}>
              {priority}
            </span>
          )}
          {complexity && (
            <span className="text-xs font-bold px-3 py-1 rounded-full border bg-slate-50 text-slate-600 flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3 h-3 text-amber-500" /> {complexity} Complexity
            </span>
          )}
          {quality?.score !== undefined && (
            <div className="relative group/tooltip">
              <span className={`cursor-help text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm ${quality.score >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : quality.score >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                <Award className="w-3 h-3" /> Q: {quality.score}/100
              </span>
              <div className="absolute top-full mt-2 left-0 w-48 p-3 bg-slate-800 text-slate-100 text-[10px] rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 shadow-xl border border-slate-700">
                <div className="font-bold mb-1 border-b border-slate-600 pb-1 text-slate-300 uppercase tracking-widest">Quality Factors</div>
                <ul className="space-y-1.5 mt-2 font-medium">
                  <li className="flex justify-between items-center"><span>Grammar/Passive</span> <span className="text-emerald-400">Pass</span></li>
                  <li className="flex justify-between items-center"><span>Atomicity</span> <span className={quality.atomic ? 'text-emerald-400' : 'text-amber-400'}>{quality.atomic ? 'Pass' : 'Fail'}</span></li>
                  <li className="flex justify-between items-center"><span>Ambiguity</span> <span className={quality.ambiguous_words?.length === 0 ? 'text-emerald-400' : 'text-amber-400'}>{quality.ambiguous_words?.length || 0} issues</span></li>
                </ul>
              </div>
            </div>
          )}
          {confidence && (
            <div className="relative group/conf inline-block">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm ${change.similarity_breakdown ? 'cursor-help' : ''} ${getConfidenceColor(confidence)}`}>
                {confidence} Confidence
              </span>
              {change.similarity_breakdown && (
                <div className="absolute top-full mt-2 left-0 w-56 p-3 bg-slate-800 text-slate-100 text-[10px] rounded-lg opacity-0 invisible group-hover/conf:opacity-100 group-hover/conf:visible transition-all z-20 shadow-xl border border-slate-700 text-left">
                  <div className="font-bold mb-1 border-b border-slate-600 pb-1 text-slate-300 uppercase tracking-widest">Confidence Score Basis</div>
                  <ul className="space-y-1.5 mt-2 font-medium">
                    <li className="flex justify-between items-center"><span>Semantic Similarity</span> <span className="text-emerald-400">{Math.round(change.similarity_breakdown.semantic * 100)}%</span></li>
                    <li className="flex justify-between items-center"><span>Keyword Overlap</span> <span className="text-emerald-400">{Math.round(change.similarity_breakdown.keyword * 100)}%</span></li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-right hidden sm:block pl-4 relative group/sim">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1.5">Similarity</div>
          <div className="cursor-help inline-block">{getSimilarityBadge(similarity)}</div>
          
          {change.similarity_breakdown && (
            <div className="absolute right-0 top-full mt-2 w-48 p-3 bg-white text-slate-600 text-[10px] rounded-lg opacity-0 invisible group-hover/sim:opacity-100 group-hover/sim:visible transition-all z-20 shadow-xl border border-slate-200 text-left">
              <div className="font-bold mb-1 border-b border-slate-100 pb-1 text-slate-800 uppercase tracking-widest">Similarity Breakdown</div>
              <ul className="space-y-1.5 mt-2 font-medium">
                <li className="flex justify-between items-center"><span>Semantic Match</span> <span className="font-bold text-primary-600">{Math.round(change.similarity_breakdown.semantic * 100)}%</span></li>
                <li className="flex justify-between items-center"><span>Keyword Match</span> <span className="font-bold text-primary-600">{Math.round(change.similarity_breakdown.keyword * 100)}%</span></li>
                <li className="flex justify-between items-center border-t border-slate-50 pt-1 mt-1"><span>Overall Match</span> <span className="font-extrabold text-slate-900">{Math.round(change.similarity_breakdown.overall * 100)}%</span></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-6">
        {/* Old Requirement */}
        <div className={`p-4 rounded-xl ${status === 'Added' ? 'bg-slate-50/50 opacity-50' : 'bg-red-50/30 border border-red-100'}`}>
          <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Baseline</div>
          <p className={`text-sm ${status === 'Added' ? 'text-slate-400 italic' : 'text-slate-700'}`}>
            {oldText || "New capability introduced in Version 2.0. No corresponding requirement exists in the baseline document."}
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex justify-center text-slate-300">
          <ArrowRight className="w-6 h-6" />
        </div>

        {/* New Requirement */}
        <div className={`p-4 rounded-xl ${status === 'Removed' ? 'bg-slate-50/50 opacity-50' : 'bg-emerald-50/30 border border-emerald-100'}`}>
          <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Updated</div>
          <p className={`text-sm ${status === 'Removed' ? 'text-slate-400 italic' : 'text-slate-800'}`}>
            {newText || "— Requirement removed —"}
          </p>
        </div>
      </div>
      
      {/* Quality Warnings */}
      {quality?.ambiguous_words?.length > 0 && (
        <div className="mb-4 bg-amber-50/50 rounded-xl p-4 border border-amber-100">
          <h4 className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-2">
            <MessageSquareWarning className="w-4 h-4 text-amber-500" /> Ambiguous Language Detected
          </h4>
          <p className="text-xs text-amber-800 mb-2">The terms <strong>{quality.ambiguous_words.join(', ')}</strong> are highly subjective and unmeasurable.</p>
          <p className="text-xs text-amber-700 italic">Recommendation: Replace subjective adjectives with measurable metrics.</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Detected Changes */}
        {status === 'Modified' && detected_changes && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Change Insight
            </h4>
            <ul className="space-y-1 mb-2">
              {detected_changes.highlights.map((hl, i) => (
                <li key={i} className={`text-xs font-medium ${hl.startsWith('+') ? 'text-primary-600' : hl.startsWith('-') ? 'text-red-600' : 'text-emerald-600'}`}>
                  {hl}
                </li>
              ))}
            </ul>
            <div className="text-xs text-slate-600 italic">
              <span className="font-semibold not-italic text-slate-700">Reason:</span> {detected_changes.reason}
            </div>
          </div>
        )}
        
        {/* Recommendations */}
        {recommendations && status !== 'Removed' && (
          <div className="bg-indigo-50/30 rounded-xl p-4 border border-indigo-100">
            <h4 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-indigo-500" /> AI Recommendations
            </h4>
            <p className="text-xs text-indigo-800 mb-2 font-medium">{recommendations.review}</p>
            <div className="flex gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Components:</span>
              <span className="text-[10px] font-medium text-indigo-700">{recommendations.components.join(', ')}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Testing:</span>
              <span className="text-[10px] font-medium text-indigo-700">{recommendations.tests.join(', ')}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
