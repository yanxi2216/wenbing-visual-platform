import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Map as MapIcon, 
  Clock, 
  Activity,
  Droplets,
  Wind,
  Navigation,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---

type CityData = {
  id: string;
  name: string;
  x: number; // Based on viewBox 0 0 600 700
  y: number;
  school: string;
  type: 'hub' | 'node';
};

// 1. 高精度坐标校准 (基于 viewBox 0 0 600 700)
// 江苏地形：徐州在西北突出，连云港在东北，长江主要在南部横穿，太湖在最南端
const CITIES: CityData[] = [
  { id: 'xuzhou', name: '徐州', x: 130, y: 100, school: '彭城医派', type: 'node' },
  { id: 'lianyungang', name: '连云港', x: 420, y: 80, school: '海滨分支', type: 'node' },
  { id: 'huaian', name: '淮安', x: 260, y: 280, school: '山阳医派', type: 'hub' }, // 吴鞠通
  { id: 'yancheng', name: '盐城', x: 400, y: 300, school: '淮扬分支', type: 'node' },
  { id: 'yangzhou', name: '扬州', x: 300, y: 460, school: '江淮医派', type: 'hub' }, // 运河枢纽
  { id: 'nanjing', name: '南京', x: 180, y: 500, school: '金陵医派', type: 'hub' }, // 省会，长江南
  { id: 'zhenjiang', name: '镇江', x: 260, y: 510, school: '丹徒医家', type: 'node' },
  { id: 'changzhou', name: '常州', x: 320, y: 550, school: '孟河医派', type: 'hub' }, // 孟河
  { id: 'wuxi', name: '无锡', x: 380, y: 570, school: '锡山医派', type: 'node' },
  { id: 'suzhou', name: '苏州', x: 440, y: 590, school: '吴门医派', type: 'hub' }, // 叶天士
  { id: 'nantong', name: '南通', x: 500, y: 520, school: '通州医派', type: 'node' },
];

const TIME_PERIODS = [
  { year: 1644, label: '清初 (1644)', desc: '明末清初，疫病频发，温疫论始出' },
  { year: 1746, label: '乾隆 (1746)', desc: '叶天士《温热论》传世，吴门医派全盛' },
  { year: 1798, label: '嘉庆 (1798)', desc: '吴鞠通《温病条辨》成书，山阳医派兴起' },
  { year: 1852, label: '咸丰 (1852)', desc: '孟河医派崛起，南北温病学术交融' },
  { year: 1911, label: '民国 (1911)', desc: '京杭大运河交通变迁，中西医汇通' },
  { year: 2024, label: '现代 (2024)', desc: '长三角医疗一体化，AI 赋能中医传承' },
];

// 模拟数据强度逻辑
const getIntensity = (cityId: string, year: number, layer: 'schools' | 'syndromes') => {
  let val = 0.2;
  const isSouth = ['suzhou', 'wuxi', 'changzhou', 'nanjing', 'nantong', 'zhenjiang'].includes(cityId);
  
  if (layer === 'schools') {
    if (cityId === 'suzhou') val = year > 1700 && year < 1900 ? 1.0 : 0.6;
    else if (cityId === 'huaian') val = year > 1780 && year < 1880 ? 0.9 : 0.3;
    else if (cityId === 'changzhou') val = year > 1820 ? 0.95 : 0.3; // 孟河晚清最强
    else if (cityId === 'yangzhou') val = 0.7; // 运河枢纽一直强
    else val = 0.3;
  } else {
    // 湿温病主要在江南水乡
    const wave = Math.sin(year / 20);
    if (isSouth) val = 0.5 + wave * 0.4;
    else val = 0.3 + wave * 0.2;
  }
  return val;
};

// --- SVG Geometries (Refined High-Fidelity) ---

// 1. 江苏省精细轮廓 (模拟真实行政区划的锯齿感和走势)
const JIANGSU_HIGH_RES = `
  M 120,60 L 180,50 L 220,90 L 380,60 L 460,50 L 480,150 
  L 520,180 L 520,300 L 580,450 L 560,540 L 520,560 
  L 540,580 L 500,620 L 440,610 L 440,650 L 400,660 
  L 360,630 L 320,650 L 280,620 L 220,580 L 160,560 
  L 140,520 L 100,500 L 120,400 L 80,300 L 100,200 
  L 80,150 Z
`;

// 2. 长江 (Wide active water body)
const YANGTZE_RIVER = "M 140,520 Q 200,480 250,500 T 400,500 T 560,540";

// 3. 京杭大运河 (Vertical lifeline) - 模拟纵向连接
const GRAND_CANAL = "M 320,650 L 300,560 L 280,510 L 300,460 L 280,350 L 260,280 L 240,150";

// 4. 太湖 (Lake Taihu)
const TAIHU_LAKE = "M 380,600 Q 360,630 400,650 Q 440,640 420,600 Q 400,580 380,600";

// 5. 洪泽湖 (Lake Hongze)
const HONGZE_LAKE = "M 220,300 Q 260,280 280,320 Q 250,360 220,340 Z";

// --- Visual Effect Components ---

const ScanningLine = () => (
  <motion.div
    className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent"
    initial={{ top: '-10%' }}
    animate={{ top: '110%' }}
    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    style={{ height: '10%' }}
  />
);

const ParticleCloud = () => {
  // 生成随机粒子模拟"湿热之气"
  const particles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: 200 + Math.random() * 300,
    y: 400 + Math.random() * 200,
    r: Math.random() * 20 + 10,
    duration: Math.random() * 5 + 5
  })), []);

  return (
    <g className="pointer-events-none mix-blend-screen">
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill="url(#mistGradient)"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 0.4, 0], 
            scale: [0.5, 1.2, 1.5],
            cx: p.x + (Math.random() - 0.5) * 50,
            cy: p.y - 50 // 上升趋势
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </g>
  );
};

const TransmissionLine = ({ start, end, active }: { start: CityData, end: CityData, active: boolean }) => {
  if (!active) return null;
  // 计算贝塞尔曲线控制点，使线条带有弧度
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2 - 50; // 向上弯曲

  return (
    <motion.path
      d={`M ${start.x},${start.y} Q ${midX},${midY} ${end.x},${end.y}`}
      fill="none"
      stroke="url(#lineGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  );
};

// --- Main Map Component ---

const SpatiotemporalMap = () => {
  const [currentYear, setCurrentYear] = useState(1746);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'schools' | 'syndromes'>('schools');
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null);

  // Playback Loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear((prev) => (prev >= 2024 ? 1644 : prev + 1));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentEra = useMemo(() => TIME_PERIODS.slice().reverse().find(p => currentYear >= p.year) || TIME_PERIODS[0], [currentYear]);

  // Find active transmission paths (Simplified logic for demo)
  const activePaths = useMemo(() => {
    const paths = [];
    if (activeLayer === 'schools') {
      const suzhou = CITIES.find(c => c.id === 'suzhou')!;
      const yangzhou = CITIES.find(c => c.id === 'yangzhou')!;
      const huaian = CITIES.find(c => c.id === 'huaian')!;
      const changzhou = CITIES.find(c => c.id === 'changzhou')!;
      
      // 模拟医派传播
      if (currentYear > 1720) paths.push({ start: suzhou, end: yangzhou }); // 叶天士影响北传
      if (currentYear > 1790) paths.push({ start: yangzhou, end: huaian }); // 影响吴鞠通
      if (currentYear > 1840) paths.push({ start: suzhou, end: changzhou }); // 孟河吸收吴门
    }
    return paths;
  }, [currentYear, activeLayer]);

  return (
    <div className="w-full h-[700px] bg-slate-950 rounded-3xl border border-slate-800 flex flex-col overflow-hidden relative shadow-2xl group">
      
      {/* 1. Header UI */}
      <div className="h-16 px-6 border-b border-slate-800/50 bg-slate-900/90 backdrop-blur-md flex items-center justify-between z-40 relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-lg font-serif tracking-wide">
            <MapIcon className="text-emerald-500" />
            江苏温病 · GIS 时空演化
          </div>
          
          <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
             <button onClick={() => setActiveLayer('schools')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${activeLayer === 'schools' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
               <Navigation size={12} /> 医脉传播
             </button>
             <button onClick={() => setActiveLayer('syndromes')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${activeLayer === 'syndromes' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
               <Droplets size={12} /> 湿热证候
             </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="text-right">
             <div className="text-2xl font-mono font-bold text-emerald-400 leading-none">{currentYear}</div>
             <div className="text-[10px] text-slate-500 font-serif italic">{currentEra.label}</div>
           </div>
           <button onClick={() => setIsPlaying(!isPlaying)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-800 text-emerald-500 border border-slate-700 hover:bg-slate-700'}`}>
             {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
           </button>
        </div>
      </div>

      {/* 2. Map Container */}
      <div className="flex-1 relative bg-[#060b14] overflow-hidden">
        
        {/* Effects: Scanning Line */}
        <ScanningLine />
        
        {/* Effects: Background Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none" />

        {/* --- THE SVG MAP LAYER --- */}
        <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Gradients */}
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="mistGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(244, 63, 94, 0.6)" />
              <stop offset="100%" stopColor="rgba(244, 63, 94, 0)" />
            </linearGradient>
            <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
               <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.1)" />
            </pattern>
          </defs>

          {/* Layer 1: Landmass */}
          <path 
            d={JIANGSU_HIGH_RES} 
            fill="url(#landGradient)" 
            stroke="#334155" 
            strokeWidth="1"
            className="drop-shadow-2xl"
          />
          <path d={JIANGSU_HIGH_RES} fill="url(#gridPattern)" opacity="0.3" pointerEvents="none" />

          {/* Layer 2: Water Systems (Crucial for Damp-Warmth) */}
          <g className="mix-blend-overlay">
            {/* Yangtze River - Flowing Animation */}
            <path d={YANGTZE_RIVER} fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" opacity="0.3" filter="url(#neonGlow)" />
            <motion.path 
              d={YANGTZE_RIVER} 
              fill="none" 
              stroke="#bae6fd" 
              strokeWidth="2" 
              strokeDasharray="10 10" 
              opacity="0.5"
              animate={{ strokeDashoffset: -200 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            {/* Lakes */}
            <path d={TAIHU_LAKE} fill="#0ea5e9" opacity="0.2" className="animate-pulse" />
            <path d={HONGZE_LAKE} fill="#0ea5e9" opacity="0.2" />
            {/* Grand Canal */}
            <path d={GRAND_CANAL} fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
          </g>

          {/* Layer 3: Particle Effects (Mist/Qi) */}
          {activeLayer === 'syndromes' && <ParticleCloud />}

          {/* Layer 4: Transmission Lines (Schools) */}
          {activePaths.map((path, idx) => (
             <TransmissionLine key={idx} start={path.start} end={path.end} active={true} />
          ))}

          {/* Layer 5: City Nodes */}
          {CITIES.map((city) => {
            const intensity = getIntensity(city.id, currentYear, activeLayer);
            const color = activeLayer === 'schools' ? '#fbbf24' : '#f43f5e';
            
            return (
              <g 
                key={city.id} 
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse Ring */}
                <motion.circle 
                  cx={city.x} 
                  cy={city.y} 
                  r={intensity * 20} 
                  fill="none" 
                  stroke={color} 
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                  animate={{ r: [5, 30], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                
                {/* Secondary Ring for Hubs */}
                {city.type === 'hub' && (
                  <motion.circle 
                    cx={city.x} 
                    cy={city.y} 
                    r={intensity * 15} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                    animate={{ r: [5, 25], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                  />
                )}

                {/* Core Node */}
                <circle cx={city.x} cy={city.y} r={city.type === 'hub' ? 4 : 2} fill={color} filter="url(#neonGlow)" />

                {/* Labels (Only show for hubs or prominent nodes) */}
                {(intensity > 0.5 || city.type === 'hub') && (
                  <text 
                    x={city.x} 
                    y={city.y - 12} 
                    textAnchor="middle" 
                    fill="#94a3b8" 
                    fontSize="10" 
                    fontWeight="bold"
                    className="select-none pointer-events-none"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    {city.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* 3. Floating HUD & Tooltips */}
        <AnimatePresence>
          {hoveredCity && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-50 bg-slate-900/90 border border-emerald-500/30 rounded-lg p-3 shadow-2xl backdrop-blur-md pointer-events-none"
              style={{ 
                left: `${(hoveredCity.x / 600) * 100}%`, 
                top: `${(hoveredCity.y / 700) * 100}%`,
                transform: 'translate(10px, -50%)'
              }}
            >
               <div className="flex items-center gap-2 mb-1">
                 <div className={`w-2 h-2 rounded-full ${activeLayer === 'schools' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                 <span className="text-sm font-bold text-white">{hoveredCity.name}</span>
                 <span className="text-[9px] text-slate-400 border border-slate-700 px-1 rounded">{hoveredCity.type.toUpperCase()}</span>
               </div>
               <div className="text-xs text-slate-300 font-serif">
                 {activeLayer === 'schools' ? hoveredCity.school : '湿热高发区'}
               </div>
               <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div 
                    className={`h-full ${activeLayer === 'schools' ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: `${getIntensity(hoveredCity.id, currentYear, activeLayer) * 100}%` }}
                 />
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Static HUD */}
        <div className="absolute top-4 left-4 z-30 pointer-events-none">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-700 p-3 rounded-lg w-48">
             <div className="text-[10px] text-slate-400 mb-1 flex justify-between">
               <span>活跃节点</span>
               <span className="text-emerald-400 font-mono">
                 {CITIES.filter(c => getIntensity(c.id, currentYear, activeLayer) > 0.5).length} / {CITIES.length}
               </span>
             </div>
             <div className="text-[10px] text-slate-400 flex justify-between">
               <span>水系影响因子</span>
               <span className="text-blue-400 font-mono">HIGH</span>
             </div>
          </div>
        </div>
      </div>

      {/* 3. Footer: Timeline Slider */}
      <div className="h-14 bg-slate-900/90 border-t border-slate-800 px-8 flex items-center relative z-40">
        <div className="w-full relative group">
          <div className="w-full h-1 bg-slate-800 rounded-full" />
          {TIME_PERIODS.map((period) => {
             const percent = ((period.year - 1644) / (2024 - 1644)) * 100;
             const isActive = currentYear >= period.year;
             return (
               <div key={period.year} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${percent}%` }}>
                 <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-slate-600'}`} />
               </div>
             );
          })}
          <input type="range" min="1644" max="2024" value={currentYear} onChange={(e) => { setCurrentYear(parseInt(e.target.value)); setIsPlaying(false); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg pointer-events-none z-10 transition-all" style={{ left: `${((currentYear - 1644) / (2024 - 1644)) * 100}%`, transform: 'translate(-50%, -50%)' }} />
        </div>
      </div>
    </div>
  );
};

export default SpatiotemporalMap;