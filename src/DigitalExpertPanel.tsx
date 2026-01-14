import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Cpu, 
  BookOpen, 
  GitCommit, 
  Database,
  Search,
  Zap,
  Microscope,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Mock Data ---

type Message = {
  id: number;
  role: 'user' | 'system' | 'expert';
  content: string;
};

type InferenceStep = {
  id: string;
  label: string;
  value: string;
  icon: any;
  status: 'pending' | 'processing' | 'completed';
  confidence: number;
  details?: string;
};

// --- Sub-Components ---

const TechBadge = () => (
  <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-700/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg z-30">
    <div className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </div>
    <span className="text-[10px] font-mono text-emerald-400 tracking-wider font-bold">
      POWERED BY C++ LIBTORCH ENGINE
    </span>
  </div>
);

const InferenceNode = ({ step, index }: { step: InferenceStep; index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      className={`relative pl-4 pb-6 border-l-2 ${
        step.status === 'completed' ? 'border-emerald-500/50' : 
        step.status === 'processing' ? 'border-amber-400/50' : 'border-slate-800'
      } last:border-0`}
    >
      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        step.status === 'completed' ? 'bg-slate-900 border-emerald-500 text-emerald-500' : 
        step.status === 'processing' ? 'bg-slate-900 border-amber-400 animate-pulse' : 'bg-slate-800 border-slate-700'
      }`}>
        {step.status === 'completed' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 backdrop-blur-sm hover:bg-slate-800/60 transition-colors group">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <step.icon size={10} /> {step.label}
          </span>
          {step.status === 'completed' && (
            <span className="text-[10px] text-emerald-400 font-mono">
              Conf: {step.confidence}%
            </span>
          )}
        </div>
        <div className={`text-sm font-medium ${step.status === 'processing' ? 'text-amber-200' : 'text-slate-200'}`}>
          {step.value || "等待计算..."}
        </div>
        {step.details && (
          <div className="mt-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-800/50 font-serif leading-relaxed">
            {step.details}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Ye Tianshi Hologram SVG Component ---
const YeTianshiHologram = ({ isProcessing }: { isProcessing: boolean }) => (
  <div className="relative w-64 h-96 flex items-end justify-center">
    
    {/* 1. Projector Base Light */}
    <div className="absolute bottom-0 w-40 h-10 bg-emerald-500/20 rounded-[100%] blur-xl animate-pulse" />
    <div className="absolute bottom-4 w-32 h-4 bg-emerald-400/30 rounded-[100%] blur-md" />

    {/* 2. Hologram Figure SVG */}
    <motion.svg 
      viewBox="0 0 200 400" 
      className="w-full h-full drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10"
      initial={{ opacity: 0.8 }}
      animate={{ 
        opacity: [0.8, 1, 0.8],
        y: [0, -5, 0] 
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <defs>
        {/* Hologram Gradient */}
        <linearGradient id="holoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.9" /> {/* Emerald 400 */}
          <stop offset="50%" stopColor="#059669" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#064E3B" stopOpacity="0.1" />
        </linearGradient>
        {/* Scanline Pattern */}
        <pattern id="scanlines" x="0" y="0" width="10" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="10" height="1" fill="#10B981" fillOpacity="0.3" />
        </pattern>
        <mask id="bodyMask">
           <path d="M100,20 C115,20 125,30 125,45 C125,55 120,65 110,70 L130,80 L160,120 L150,250 L170,380 L30,380 L50,250 L40,120 L70,80 L90,70 C80,65 75,55 75,45 C75,30 85,20 100,20 Z" fill="white" />
        </mask>
      </defs>

      {/* --- The Scholar Figure --- */}
      <g stroke="#34D399" strokeWidth="1" fill="url(#holoGrad)">
        
        {/* Head & Hat (Qing Scholar Style) */}
        <path d="M85,15 L115,15 L120,35 L80,35 Z" fill="#065F46" opacity="0.8" /> {/* Hat Top */}
        <ellipse cx="100" cy="50" rx="22" ry="28" /> {/* Face */}
        <path d="M90,75 Q100,90 110,75" fill="none" strokeWidth="1" /> {/* Beard Hint */}

        {/* Body / Robes */}
        <path d="
          M 100,78 
          Q 70,85 60,110 
          L 40,180 
          Q 30,220 35,380 
          L 165,380 
          Q 170,220 160,180 
          L 140,110 
          Q 130,85 100,78 Z
        " />

        {/* Sleeves (Folded Hands) */}
        <path d="M 60,110 Q 40,150 70,200 Q 100,220 130,200 Q 160,150 140,110" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.7"/>
        
        {/* Internal Wireframe Lines (The "Digital" look) */}
        <g strokeWidth="0.5" opacity="0.4" fill="none">
           <path d="M100,78 L100,380" /> {/* Center line */}
           <path d="M60,110 L100,140 L140,110" /> {/* Collar/Chest */}
           <path d="M40,180 Q100,200 160,180" /> {/* Waist/Sleeves */}
           <path d="M35,300 Q100,320 165,300" /> {/* Lower Robe */}
        </g>
      </g>

      {/* --- Processing Effects --- */}
      {isProcessing && (
        <g>
          {/* Brain Node */}
          <circle cx="100" cy="40" r="3" fill="#fff" className="animate-ping" />
          {/* Heart/Dantian Node */}
          <circle cx="100" cy="180" r="4" fill="#FCD34D" className="animate-pulse delay-75">
             <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Data Flow Lines */}
          <path d="M100,40 L100,180" stroke="#FCD34D" strokeWidth="2" strokeDasharray="4 4" className="animate-dash" />
        </g>
      )}

      {/* Scanlines Overlay */}
      <rect x="0" y="0" width="200" height="400" fill="url(#scanlines)" mask="url(#bodyMask)" opacity="0.3" />

    </motion.svg>
    
    {/* 3. Rising Particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
       {[...Array(8)].map((_, i) => (
         <motion.div
           key={i}
           className="absolute w-1 h-1 bg-emerald-300 rounded-full"
           initial={{ y: 380, x: 100 + (Math.random() - 0.5) * 60, opacity: 0 }}
           animate={{ y: 0, opacity: [0, 1, 0] }}
           transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
         />
       ))}
    </div>

    {/* 4. Scanning Beam (Vertical) */}
    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent animate-scan z-20 pointer-events-none" style={{ backgroundSize: '100% 50%' }} />
  </div>
);

// --- Main Component ---

const DigitalExpertPanel = () => {
  const [inputValue, setInputValue] = useState("苏州夏季湿热感冒，身热不扬，午后热甚，如何治？");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'expert', content: '吾乃叶天士数字分身。请输入患者症状，吾将调取《温热论》图谱库为您推演辩证。' }
  ]);
  
  // State for the right-side inference chain
  const [inferenceChain, setInferenceChain] = useState<InferenceStep[]>([
    { id: '1', label: '症状提取 (NER)', value: '待输入...', icon: Search, status: 'pending', confidence: 0 },
    { id: '2', label: '病机辩证 (GNN)', value: '待推理...', icon: GitCommit, status: 'pending', confidence: 0 },
    { id: '3', label: '治法确立 (Logic)', value: '待决策...', icon: Zap, status: 'pending', confidence: 0 },
    { id: '4', label: '选方化裁 (Match)', value: '待检索...', icon: Database, status: 'pending', confidence: 0 },
    { id: '5', label: '经典溯源 (Ref)', value: '待关联...', icon: BookOpen, status: 'pending', confidence: 0 },
  ]);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isProcessing) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), role: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);
    setInputValue("");

    // --- Simulation Sequence ---

    // Step 1: NER (0.5s)
    setTimeout(() => {
      updateStep('1', { 
        value: "[地点:苏州] [季节:长夏] [症状:身热不扬, 午后热甚]", 
        status: 'completed', 
        confidence: 99.2 
      });
    }, 500);

    // Step 2: GNN Pattern (1.5s)
    setTimeout(() => {
      updateStep('2', { 
        value: "湿热酿痰，蒙蔽心包，热郁于内", 
        status: 'completed', 
        confidence: 94.5,
        details: "节点激活：湿热 > 气分 > 心包。C++ 引擎判定为湿温病初起。"
      });
    }, 1500);

    // Step 3: Method (2.5s)
    setTimeout(() => {
      updateStep('3', { 
        value: "清热化湿，宣气开闭", 
        status: 'completed', 
        confidence: 96.0 
      });
    }, 2500);

    // Step 4: Formula (3.5s)
    setTimeout(() => {
      updateStep('4', { 
        value: "三仁汤 加减", 
        status: 'completed', 
        confidence: 98.1,
        details: "推荐药味：杏仁、白蔻仁、薏苡仁、厚朴、通草、滑石、竹叶、半夏。"
      });
    }, 3500);

    // Step 5: Source & Reply (4.5s)
    setTimeout(() => {
      updateStep('5', { 
        value: "《温病条辨》 上焦篇 / 《温热论》 第八条", 
        status: 'completed', 
        confidence: 100 
      });
      
      const expertMsg = { 
        id: Date.now() + 1, 
        role: 'expert' as const, 
        content: "此乃湿热之邪，郁阻气分。据《温病条辨》法，宜用三仁汤开上、畅中、渗下。苏州地处江南，长夏多湿，切忌纯用寒凉，以免冰伏湿邪。" 
      };
      setMessages(prev => [...prev, expertMsg]);
      setIsProcessing(false);
    }, 4500);
  };

  const updateStep = (id: string, updates: Partial<InferenceStep>) => {
    setInferenceChain(prev => prev.map(step => step.id === id ? { ...step, ...updates } : step));
  };

  return (
    <div className="w-full h-[800px] bg-slate-950 flex flex-col md:flex-row rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-emerald-900/10 to-transparent" />
         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      </div>

      {/* --- LEFT: Chat Interface --- */}
      <div className="w-full md:w-1/3 flex flex-col border-r border-slate-800/50 bg-slate-950/50 backdrop-blur-sm z-10">
        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-200 to-amber-500 flex items-center justify-center text-slate-900 font-serif font-bold">
               患
             </div>
             <div>
               <div className="text-sm font-medium text-slate-200">临床问诊输入</div>
               <div className="text-[10px] text-slate-500 font-mono">Patient Input Interface</div>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-slate-800 text-slate-200 rounded-tr-none border border-slate-700' 
                  : 'bg-emerald-900/20 text-emerald-100 rounded-tl-none border border-emerald-500/20'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-900/80 border-t border-slate-800">
          <div className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="描述症状、舌脉或询问治法..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
            />
            <button 
              onClick={handleSend}
              disabled={isProcessing}
              className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors ${
                isProcessing ? 'bg-slate-800 text-slate-600' : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* --- CENTER: Digital Human Stage --- */}
      <div className="w-full md:w-1/3 relative flex flex-col items-center justify-end overflow-hidden border-r border-slate-800/50 pb-8">
        
        {/* Header Overlay */}
        <div className="absolute top-6 w-full flex flex-col items-center z-20 space-y-2">
           <TechBadge />
           <div className="text-xs text-slate-500 font-serif mt-2">温病四大家 · 叶天士 (AI Digital Clone)</div>
        </div>

        {/* 3D Visualization Component */}
        <div className="flex-1 w-full flex items-center justify-center relative z-10">
           <YeTianshiHologram isProcessing={isProcessing} />
        </div>

        {/* Status Text */}
        <div className="z-20 h-8 flex items-center justify-center mt-[-20px]">
           <AnimatePresence mode="wait">
             {isProcessing ? (
               <motion.div 
                 key="processing"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex items-center space-x-2 bg-slate-900/80 px-4 py-1 rounded-full border border-amber-500/30"
               >
                  <Cpu size={14} className="text-amber-400 animate-spin-slow" />
                  <span className="text-xs text-amber-200 font-mono">Inference Engine Active...</span>
               </motion.div>
             ) : (
               <motion.div 
                 key="idle"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex items-center space-x-2"
               >
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-xs text-slate-400 font-mono">System Standby</span>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* --- RIGHT: Logic & Evidence Panel --- */}
      <div className="w-full md:w-1/3 flex flex-col bg-slate-950/30 backdrop-blur-sm z-10 overflow-hidden">
        
        {/* Top: Inference Chain */}
        <div className="flex-1 p-6 overflow-y-auto relative custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
               <Microscope className="text-emerald-400" size={16} />
               推理链路追踪
             </h3>
             <span className="text-[10px] text-slate-600 font-mono border border-slate-700 px-1 rounded">DEBUG_MODE: ON</span>
          </div>

          <div className="space-y-0">
             {inferenceChain.map((step, index) => (
               <InferenceNode key={step.id} step={step} index={index} />
             ))}
          </div>
        </div>

        {/* Bottom: Evidence Source Visualization */}
        <div className="h-64 border-t border-slate-800 bg-slate-900/50 p-6 relative">
           <div className="flex items-center justify-between mb-4 relative z-10">
             <h3 className="text-sm font-bold text-amber-100 flex items-center gap-2">
               <BookOpen className="text-amber-400" size={16} />
               经典医案溯源
             </h3>
             <span className="text-xs text-amber-400/80 font-mono">Similarity: 92.8%</span>
           </div>

           {/* SVG Evidence Graph */}
           <div className="absolute inset-0 top-12 left-0 w-full h-full pointer-events-none">
             <svg width="100%" height="100%" className="opacity-80">
               {/* Central Node (Current Case) */}
               <circle cx="50%" cy="40%" r="6" fill="#10B981" />
               <text x="52%" y="42%" fontSize="10" fill="#fff">当前病例</text>

               {/* Target Node (Classic Case) */}
               <circle cx="80%" cy="70%" r="20" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 2" className="animate-spin-slow-reverse" style={{ transformOrigin: '80% 70%' }}/>
               <circle cx="80%" cy="70%" r="4" fill="#F59E0B" />
               <text x="70%" y="85%" fontSize="10" fill="#FCD34D">温病条辨·上焦篇</text>

               {/* Connection Line */}
               {inferenceChain[4].status === 'completed' && (
                 <motion.path 
                   d="M 50% 40% Q 65% 55% 80% 70%" 
                   fill="none" 
                   stroke="#F59E0B" 
                   strokeWidth="2"
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: 1 }}
                   transition={{ duration: 1 }}
                 />
               )}

               {/* Other dim nodes (background noise) */}
               <circle cx="20%" cy="60%" r="3" fill="#334155" />
               <circle cx="30%" cy="20%" r="3" fill="#334155" />
               <line x1="50%" y1="40%" x2="20%" y2="60%" stroke="#334155" strokeWidth="1" strokeOpacity="0.3" />
               <line x1="50%" y1="40%" x2="30%" y2="20%" stroke="#334155" strokeWidth="1" strokeOpacity="0.3" />
             </svg>
           </div>
           
           {/* Source Text Card */}
           <AnimatePresence>
           {inferenceChain[4].status === 'completed' && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="absolute bottom-4 left-4 right-4 bg-amber-950/40 border border-amber-700/30 p-3 rounded-lg backdrop-blur-md z-20"
             >
                <div className="flex gap-2">
                  <div className="w-1 h-full bg-amber-500 rounded-full" />
                  <div>
                    <div className="text-[10px] text-amber-300 font-bold mb-1">EVIDENCE #1024 (VECTOR DIST: 0.08)</div>
                    <p className="text-xs text-amber-100/90 font-serif italic leading-relaxed">
                      "头痛恶寒，身重疼痛... 甚至午后热甚... 宜三仁汤主之。"
                    </p>
                  </div>
                </div>
             </motion.div>
           )}
           </AnimatePresence>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.8);
          border-radius: 4px;
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        @keyframes scan {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin 6s linear infinite reverse;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-dash {
          stroke-dasharray: 4;
          animation: dash 1s linear infinite;
        }
        @keyframes dash {
          to { stroke-dashoffset: -8; }
        }
      `}</style>
    </div>
  );
};

export default DigitalExpertPanel;