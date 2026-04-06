'use client';

import React from 'react';
import { 
  TransformWrapper, 
  TransformComponent, 
  useControls 
} from 'react-zoom-pan-pinch';
import { Anomaly } from '@/types/anomalies';
import { Maximize2, Minimize2, RefreshCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface AnomalyVisualizerProps {
  anomaly: Anomaly;
}

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
      <button 
        onClick={() => zoomIn()} 
        className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg backdrop-blur-sm transition-all border border-slate-700"
        title="Aumentar Zoom"
      >
        <ZoomIn size={18} />
      </button>
      <button 
        onClick={() => zoomOut()} 
        className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg backdrop-blur-sm transition-all border border-slate-700"
        title="Diminuir Zoom"
      >
        <ZoomOut size={18} />
      </button>
      <button 
        onClick={() => resetTransform()} 
        className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg backdrop-blur-sm transition-all border border-slate-700 font-bold"
        title="Resetar Câmera"
      >
        <RefreshCcw size={18} />
      </button>
    </div>
  );
};

const BoundingBoxOverlay = ({ x, y, width, height }: { x: number, y: number, width: number, height: number }) => (
  <div 
    data-testid="bounding-box"
    className="absolute border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] bg-amber-500/10 rounded-sm pointer-events-none animate-pulse"
    style={{
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      width: `${width * 100}%`,
      height: `${height * 100}%`,
      zIndex: 10
    }}
  >
    <div className="absolute -top-6 left-0 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter whitespace-nowrap">
      Anomalia Detectada
    </div>
  </div>
);

const AnomalyVisualizer: React.FC<AnomalyVisualizerProps> = ({ anomaly }) => {
  return (
    <div className="relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col group">
      
      {/* Overlay de Título e Sincronização */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-slate-950/80 to-transparent flex justify-between items-start pointer-events-none">
        <div className="space-y-1">
          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
            Digital Twin Sincronizado
          </h4>
          <p className="text-[10px] text-slate-400 font-medium">Modo: Duplo Canal (Ref. {anomaly.id})</p>
        </div>
        <div className="flex bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full px-3 py-1 items-center">
           <Maximize2 size={10} className="text-amber-500 mr-2" />
           <span className="text-[9px] font-black text-slate-300 uppercase">Sincronização Ativa</span>
        </div>
      </div>

      {/* Visualizador Sincronizado */}
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        centerOnInit={true}
      >
        <div className="relative flex-1 cursor-crosshair">
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 w-full h-full min-h-[450px]">
              
              {/* CANAL TÉRMICO (IR) */}
              <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden border-r border-slate-800">
                <img 
                  src={anomaly.irUrl} 
                  alt="Termografia Infravermelha" 
                  className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
                <BoundingBoxOverlay {...anomaly.boundingBox} />
                <div className="absolute top-16 left-4 z-10 px-2 py-0.5 bg-red-600/90 text-white text-[10px] font-black rounded uppercase tracking-widest">
                  TÉRMICO (IR)
                </div>
              </div>

              {/* CANAL VISUAL (RGB) */}
              <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <img 
                  src={anomaly.rgbUrl} 
                  alt="Imagem Visual RGB" 
                  className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
                <BoundingBoxOverlay {...anomaly.boundingBox} />
                <div className="absolute top-16 left-4 z-10 px-2 py-0.5 bg-blue-600/90 text-white text-[10px] font-black rounded uppercase tracking-widest">
                  VISUAL (RGB)
                </div>
              </div>

            </div>
          </TransformComponent>
          
          <Controls />
        </div>
      </TransformWrapper>
      
      {/* Barra Inferior informativa */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex justify-between items-center z-20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 outline-none text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
            <Minimize2 size={12} />
            <span className="text-[10px] font-bold uppercase">Auto-Align</span>
          </div>
        </div>
        <div className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">
          cal: IEC TS 62446-3-std
        </div>
      </div>

    </div>
  );
};

export default AnomalyVisualizer;
