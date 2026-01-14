import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Brain, 
  Database, 
  Globe, 
  Layout, 
  Search, 
  Settings, 
  Share2, 
  Cpu,
  Map as MapIcon,
  User,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- 引入子组件 ---
// 请确保这两个文件与本文件在同一目录下
import DigitalExpertPanel from './DigitalExpertPanel';
import SpatiotemporalMap from './SpatiotemporalMap';

// --- 类型定义 ---
type ViewState = 'dashboard' | 'expert' | 'map';

// --- 组件部分 ---

const SystemStatus = () => (
  <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
    <div className="flex items-center">
      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
      <span>Neo4j Cluster: Online</span>
    </div>
    <div className="flex items-center">
      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
      <span>C++ Engine: Idle</span>
    </div>
  </div>
);

// NavItem 组件
const NavItem = ({ icon: Icon, active = false, onClick }: { icon: any, active?: boolean, onClick?: () => void }) => (
  <motion.div 
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick && onClick(); } }}
    whileHover={{ scale: 1.05, x: 5 }}
    whileTap={{ scale: 0.95 }}
    aria-pressed={active}
    className={`p-3 rounded-xl cursor-pointer transition-colors duration-300 ${active ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}
  >
    <Icon size={24} strokeWidth={1.5} />
  </motion.div>
);

const MetricCard = ({ title, value, unit, trend, icon: Icon, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500"
  >
    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={40} />
    </div>
    <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</h3>
    <div className="flex items-baseline space-x-1">
      <span className="text-2xl font-bold text-slate-100 font-mono">{value}</span>
      <span className="text-xs text-emerald-400 font-mono">{unit}</span>
    </div>
    <div className="mt-2 text-xs text-slate-500 flex items-center">
      <span className="text-emerald-500 mr-1">▲ {trend}</span> 较上周
    </div>
  </motion.div>
);

// --- 重构后的首页视图 (HomeView) ---
// 包含了知识图谱、指标卡、以及您要求的“内容丰富”的地图预览和数字人预览
const HomeView = ({ onRequestChangeView }: { onRequestChangeView: (view: ViewState) => void }) => {
    const [isInferring, setIsInferring] = useState(false);
    const [inferenceLog, setInferenceLog] = useState("");

    const handleInference = () => {
        setIsInferring(true);
        setInferenceLog("Initializing C++ Engine...");
        setTimeout(() => setInferenceLog("Loading Graph Subgraph..."), 800);
        setTimeout(() => setInferenceLog("Matching Cases..."), 1600);
        setTimeout(() => {
          setIsInferring(false);
          setInferenceLog("Done. Confidence: 98.4%");
        }, 2500);
    };

    return (
        <div className="grid grid-cols-12 grid-rows-12 gap-6 h-full overflow-y-auto pb-4">
             {/* 1. 核心看板：知识图谱拓扑 */}
             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-8 row-span-7 bg-slate-900/40 border border-slate-700/50 rounded-3xl relative overflow-hidden shadow-2xl backdrop-blur-sm group"
            >
              <div className="absolute top-6 left-6 z-10">
                <h2 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                  <Share2 className="text-emerald-400" size={18} />
                  知识图谱拓扑
                </h2>
                <p className="text-xs text-slate-500 mt-1">Neo4j Graph Database Integration</p>
              </div>

              {/* 背景 SVG 动画 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-60">
                <svg width="100%" height="100%" viewBox="0 0 800 600" className="pointer-events-none">
                  <defs>
                    <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" style={{ stopColor: 'rgb(16, 185, 129)', stopOpacity: 0.2 }} />
                      <stop offset="100%" style={{ stopColor: 'rgb(15, 23, 42)', stopOpacity: 0 }} />
                    </radialGradient>
                  </defs>
                  <circle cx="400" cy="300" r="250" fill="url(#grad1)" />
                  <g stroke="#334155" strokeWidth="1">
                     <motion.path d="M400 300 L200 150" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
                     <motion.path d="M400 300 L600 150" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2 }} />
                     <motion.path d="M400 300 L200 450" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8 }} />
                     <motion.path d="M400 300 L600 450" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5 }} />
                  </g>
                  <motion.circle cx="400" cy="300" r="8" fill="#10B981" animate={{ r: [8, 12, 8] }} transition={{ repeat: Infinity, duration: 4 }} />
                  <circle cx="200" cy="150" r="4" fill="#94A3B8" />
                  <circle cx="600" cy="150" r="4" fill="#94A3B8" />
                  <text x="420" y="300" fill="#E2E8F0" fontSize="12">温病条辨</text>
                  <text x="180" y="140" fill="#64748B" fontSize="10">叶天士</text>
                  <text x="610" y="140" fill="#64748B" fontSize="10">吴鞠通</text>
                </svg>
              </div>

              {/* 底部操作栏 */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="bg-slate-950/80 backdrop-blur border border-slate-700 rounded-lg p-3 text-xs text-slate-400 font-mono w-64 h-24 overflow-y-auto">
                  <div className="text-emerald-500 mb-1">[SYSTEM LOG]</div>
                  <div>{'>'} System Ready</div>
                  <div>{'>'} Neo4j Driver connected</div>
                  {isInferring && <div className="text-amber-300">{'>'} {inferenceLog}</div>}
                </div>
                
                <button 
                  onClick={handleInference}
                  disabled={isInferring}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
                    isInferring 
                    ? 'bg-slate-800 text-slate-500' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  }`}
                >
                   {isInferring ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
                   {isInferring ? '推理计算中...' : '启动辩证推理'}
                </button>
              </div>
            </motion.div>

            {/* 2. 右侧指标卡 */}
            <div className="col-span-4 row-span-7 flex flex-col gap-4">
              <MetricCard title="知识节点总数" value="124,592" unit="个" trend="2.4%" icon={Database} delay={0.1} />
              <MetricCard title="C++ 引擎延迟" value="42" unit="ms" trend="-12%" icon={Cpu} delay={0.2} />
              <MetricCard title="逻辑置信度" value="98.4" unit="%" trend="0.8%" icon={Brain} delay={0.3} />
              <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 flex items-end justify-between gap-1">
                 {[30, 45, 35, 60, 75, 50, 80, 65, 55, 40].map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="w-full bg-emerald-500/20 rounded-t-sm" 
                    />
                 ))}
              </div>
            </div>

            {/* 3. 时空动力学分析 (预览模块) - 恢复了丰富的地图网格内容 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => onRequestChangeView('map')} // 点击跳转
              className="col-span-4 row-span-5 bg-slate-900/40 border border-slate-700/50 rounded-3xl p-6 relative group overflow-hidden cursor-pointer hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                   <h2 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                    <MapIcon className="text-amber-200" size={18} />
                    时空动力学分析
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">2024 春季 · 江苏省温病证候热力</p>
                </div>
              </div>
              
              {/* 恢复：抽象地图可视化 */}
              <div className="absolute inset-0 top-12 p-4 flex items-center justify-center opacity-60 group-hover:opacity-80 transition-opacity">
                <div className="relative w-full h-full">
                   {/* Grid representing map */}
                   <div className="grid grid-cols-6 grid-rows-5 gap-2 h-full w-full">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`rounded-lg ${
                            [4, 9, 14, 15, 20].includes(i) ? 'bg-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)] animate-pulse' : 
                            [10, 11, 16].includes(i) ? 'bg-emerald-500/20' : 
                            'bg-slate-800/30'
                          }`} 
                        />
                      ))}
                   </div>
                   {/* Labels overlay */}
                   <div className="absolute top-1/4 left-1/4 text-[10px] text-slate-400">南京</div>
                   <div className="absolute top-1/3 right-1/4 text-[10px] text-amber-200 font-bold">苏州 (热盛)</div>
                   <div className="absolute bottom-1/4 left-1/3 text-[10px] text-slate-400">扬州</div>
                </div>
              </div>

              {/* 恢复：提示文字 (以覆盖层的形式) */}
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-950 to-transparent flex items-end p-4">
                 <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                   点击侧边栏 <Globe size={12}/> 图标查看全屏地图 <ArrowRight size={12} className="ml-1"/>
                 </div>
              </div>
            </motion.div>

             {/* 4. 数字人名家入口 (预览模块) - 恢复了丰富的对话和剪影内容 */}
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                onClick={() => onRequestChangeView('expert')} // 点击跳转
                className="col-span-8 row-span-5 bg-gradient-to-br from-slate-900/60 to-emerald-900/10 border border-slate-700/50 rounded-3xl p-6 relative overflow-hidden flex cursor-pointer hover:border-emerald-500/40 transition-colors group"
             >
                {/* Decorative Background */}
                <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />

                <div className="w-1/2 z-10 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                            <User className="text-amber-200" size={18} />
                            温病名家 · 叶天士数字人
                        </h2>
                        <p className="text-xs text-amber-200/60 mt-1 font-serif">"温邪上受，首先犯肺，逆传心包..."</p>
                    </div>
                    
                    {/* 恢复：模拟对话框 */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mt-2 group-hover:bg-slate-950/70 transition-colors">
                        <div className="flex gap-3 mb-2">
                            <div className="w-6 h-6 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-[10px]">Dr</div>
                            <div className="bg-slate-800 rounded-lg rounded-tl-none p-2 text-[10px] text-slate-300 truncate">
                                脉浮数，舌红苔黄，是否为风温初起？
                            </div>
                        </div>
                        <div className="flex gap-3 flex-row-reverse">
                            <div className="w-6 h-6 rounded-full bg-emerald-800 border border-emerald-600 flex-shrink-0 flex items-center justify-center text-[10px] font-serif text-emerald-100">叶</div>
                            <div className="bg-emerald-900/40 border border-emerald-800/50 rounded-lg rounded-tr-none p-2 text-[10px] text-emerald-100">
                                <span className="font-serif">"当先辨卫气营血。此乃肺热之征..."</span>
                            </div>
                        </div>
                    </div>

                    {/* 恢复：提示文字 */}
                    <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
                        点击侧边栏 <Brain size={12}/> 图标进入深度问诊模式 <ArrowRight size={12} className="ml-1"/>
                    </div>
                </div>

                {/* 恢复：3D 模型占位符 */}
                {/* 3D Model Placeholder */}
               <div className="w-1/2 relative flex items-center justify-center">
                  <div className="absolute w-48 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                  {/* Silhouette of a classic scholar */}
                  <div className="relative z-10 w-40 h-56 border border-emerald-500/30 rounded-full flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
                     <Brain size={64} className="text-emerald-500/50" />
                     <div className="absolute bottom-4 text-xs text-emerald-400 font-mono animate-bounce">Live Model Active</div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0">
                     {[...Array(5)].map((_, i) => (
                       <motion.div
                         key={i}
                         className="absolute w-1 h-1 bg-amber-200 rounded-full"
                         initial={{ x: Math.random() * 200, y: Math.random() * 200, opacity: 0 }}
                         animate={{ y: [0, -50], opacity: [0, 1, 0] }}
                         transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() }}
                         style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}
                       />
                     ))}
                  </div>
               </div>
            </motion.div>
        </div>
    )
}

// --- Main Dashboard Shell ---

const WenbingDashboard = () => {
  // 核心：状态管理，默认显示 dashboard
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      {/* Global Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex h-screen max-w-[1920px] mx-auto">
        
        {/* --- Sidebar --- */}
        <aside className="w-24 border-r border-slate-800/50 flex flex-col items-center py-8 bg-slate-950/80 backdrop-blur-xl z-20">
          <div className="mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)]">
              <span className="font-serif font-bold text-white text-xl">温</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-6 w-full px-4 items-center">
            {/* 1. Dashboard (Layout Icon) */}
            <NavItem 
                icon={Layout} 
                active={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')} 
            />
            <NavItem icon={Search} />
            <NavItem icon={Database} />
            
            {/* 2. Digital Expert (Brain Icon) - 倒数第二个 */}
            <NavItem 
                icon={Brain} 
                active={activeView === 'expert'} 
                onClick={() => setActiveView('expert')} 
            />
            
            {/* 3. Spatiotemporal Map (Globe Icon) - 最后一个 */}
            <NavItem 
                icon={Globe} 
                active={activeView === 'map'} 
                onClick={() => setActiveView('map')} 
            />
          </div>
          <div className="mt-auto flex flex-col space-y-6 w-full px-4 items-center">
            <NavItem icon={Settings} />
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 overflow-hidden cursor-pointer">
              <img src="/api/placeholder/32/32" alt="User" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>
        </aside>

        {/* --- Main Content Area --- */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          
          {/* Header */}
          <header className="h-20 px-8 flex items-center justify-between border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm z-10 shrink-0">
            <div>
              <h1 className="text-2xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-emerald-100 to-amber-100">
                江苏温病经典可视化知识平台
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1 tracking-widest">
                JIANGSU WENBING CLASSIC VISUALIZATION PLATFORM
              </p>
            </div>
            
            <div className="flex items-center space-x-8">
              <SystemStatus />
              <div className="h-8 w-px bg-slate-800"></div>
              <div className="text-right">
                <div className="text-lg font-mono text-emerald-400 font-bold">
                  {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                </div>
                <div className="text-xs text-slate-500 font-serif">
                  {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Content Body */}
          <div className="flex-1 p-8 overflow-hidden relative">
            {/* View Switch Logic */}
            {activeView === 'dashboard' && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="h-full"
                >
                    {/* 传递回调函数给子组件，允许内部卡片点击跳转 */}
                    <HomeView onRequestChangeView={setActiveView} />
                </motion.div>
            )}

            {activeView === 'expert' && (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="h-full flex flex-col justify-center"
                >
                    {/* Render Digital Expert Component */}
                    <div className="h-full max-h-[850px]">
                        <DigitalExpertPanel />
                    </div>
                </motion.div>
            )}

            {activeView === 'map' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="h-full flex flex-col justify-center"
                >
                    {/* Render Spatiotemporal Map Component */}
                    <div className="h-full max-h-[850px]">
                        <SpatiotemporalMap />
                    </div>
                </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WenbingDashboard;