import React, { useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { FeedPost } from '../types';

interface MerchLightboxModalProps {
  activeMerchLightbox: {
    post: FeedPost;
    images: string[];
    activeIndex: number;
  };
  unlockedVipPosts: Record<string, boolean>;
  selectedSizesMap: Record<string, string>;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  onBuyNow: (post: FeedPost, size: string, price: number) => void;
}

export const MerchLightboxModal: React.FC<MerchLightboxModalProps> = ({
  activeMerchLightbox,
  unlockedVipPosts,
  selectedSizesMap,
  onClose,
  onSelectIndex,
  onBuyNow,
}) => {
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [lightboxPan, setLightboxPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingLightbox, setIsDraggingLightbox] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none overflow-hidden"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      tabIndex={0}
    >
      {/* Top Bar / Header Controls */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-3 z-20">
        <div className="min-w-0">
          <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest block">
            {activeMerchLightbox.post.merchData?.category || 'MERCH DESIGN INSPECTION'}
          </span>
          <h3 className="text-sm sm:text-base font-mono font-black text-white truncate">
            {activeMerchLightbox.post.merchData?.name}
          </h3>
        </div>

        {/* Zoom Controls Bar */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => {
              setLightboxZoom(z => Math.max(1, z - 0.5));
              if (lightboxZoom <= 1.5) setLightboxPan({ x: 0, y: 0 });
            }}
            className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-mono font-extrabold text-orange-400 px-2 min-w-[42px] text-center">
            {Math.round(lightboxZoom * 100)}%
          </span>

          <button
            onClick={() => setLightboxZoom(z => Math.min(4, z + 0.5))}
            className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setLightboxZoom(1);
              setLightboxPan({ x: 0, y: 0 });
            }}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer border-l border-zinc-800 ml-0.5"
            title="Reset Zoom (100%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-300 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Stage Canvas with Mouse/Touch Zoom & Pan */}
      <div 
        className="flex-1 relative flex items-center justify-center overflow-hidden my-4 cursor-grab active:cursor-grabbing group/canvas"
        onWheel={(e) => {
          e.preventDefault();
          const delta = e.deltaY < 0 ? 0.25 : -0.25;
          setLightboxZoom(z => {
            const next = Math.min(4, Math.max(1, z + delta));
            if (next === 1) setLightboxPan({ x: 0, y: 0 });
            return next;
          });
        }}
        onMouseDown={(e) => {
          if (lightboxZoom > 1) {
            setIsDraggingLightbox(true);
            dragStartRef.current = { x: e.clientX - lightboxPan.x, y: e.clientY - lightboxPan.y };
          }
        }}
        onMouseMove={(e) => {
          if (isDraggingLightbox && lightboxZoom > 1) {
            setLightboxPan({
              x: e.clientX - dragStartRef.current.x,
              y: e.clientY - dragStartRef.current.y
            });
          }
        }}
        onMouseUp={() => setIsDraggingLightbox(false)}
        onMouseLeave={() => setIsDraggingLightbox(false)}
        onDoubleClick={() => {
          if (lightboxZoom > 1) {
            setLightboxZoom(1);
            setLightboxPan({ x: 0, y: 0 });
          } else {
            setLightboxZoom(2.5);
          }
        }}
      >
        {/* Gallery Image Display */}
        <div className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-100 ease-out">
          <img
            src={activeMerchLightbox.images[activeMerchLightbox.activeIndex]}
            alt={activeMerchLightbox.post.merchData?.name}
            style={{
              transform: `scale(${lightboxZoom}) translate(${lightboxPan.x / lightboxZoom}px, ${lightboxPan.y / lightboxZoom}px)`,
              maxHeight: 'calc(80vh - 120px)',
              maxWidth: '90vw'
            }}
            className="object-contain rounded-xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-transform duration-150 ease-out select-none pointer-events-none"
          />
        </div>

        {/* Previous / Next Angle Arrows if multiple images */}
        {activeMerchLightbox.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectIndex((activeMerchLightbox.activeIndex - 1 + activeMerchLightbox.images.length) % activeMerchLightbox.images.length);
                setLightboxZoom(1);
                setLightboxPan({ x: 0, y: 0 });
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 hover:bg-orange-500 text-white hover:text-black border border-zinc-800 rounded-full transition-all cursor-pointer shadow-2xl z-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectIndex((activeMerchLightbox.activeIndex + 1) % activeMerchLightbox.images.length);
                setLightboxZoom(1);
                setLightboxPan({ x: 0, y: 0 });
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 hover:bg-orange-500 text-white hover:text-black border border-zinc-800 rounded-full transition-all cursor-pointer shadow-2xl z-30"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Pinch/Zoom Instruction Hint overlay */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-zinc-400 border border-zinc-800 text-[10px] font-mono px-3 py-1 rounded-full pointer-events-none z-20 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-orange-400" />
          <span>Scroll wheel, pinch or double-click to zoom in/out</span>
        </div>
      </div>

      {/* Bottom Bar: Thumbnails & Quick Buy Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-800/80 z-20">
        {/* Additional Angles / Images Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
          {activeMerchLightbox.images.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectIndex(idx);
                setLightboxZoom(1);
                setLightboxPan({ x: 0, y: 0 });
              }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                activeMerchLightbox.activeIndex === idx
                  ? 'border-orange-500 ring-2 ring-orange-500/50 scale-105'
                  : 'border-zinc-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Quick Checkout in Lightbox */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-zinc-400 block">TOTAL PRICE</span>
            <span className="text-lg font-mono font-black text-orange-400">
              ${(activeMerchLightbox.post.merchData?.price || 0).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => {
              const p = activeMerchLightbox.post;
              const baseP = (p.isVipExclusive || unlockedVipPosts[p.id])
                ? p.merchData!.price * 0.8
                : p.merchData!.price;
              const sz = selectedSizesMap[p.id] || p.merchData?.sizes[0] || 'Standard';
              onBuyNow(p, sz, baseP);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-mono font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer transition-all transform hover:scale-105"
          >
            <Zap className="w-4 h-4 fill-black" /> BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};
