import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface PhotoLightboxModalProps {
  previewImage: string | null;
  setPreviewImage: (val: string | null) => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  previewImage,
  setPreviewImage,
}) => {
  const [zoomScale, setZoomScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const touchStartDistanceRef = useRef<number>(0);
  const touchStartScaleRef = useRef<number>(1);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (previewImage) {
      setZoomScale(1);
      setPan({ x: 0, y: 0 });
    }
  }, [previewImage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistanceRef.current = dist;
      touchStartScaleRef.current = zoomScale;
    } else if (e.touches.length === 1 && zoomScale > 1) {
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistanceRef.current > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = dist / touchStartDistanceRef.current;
      const newScale = Math.min(Math.max(1, touchStartScaleRef.current * scaleFactor), 4);
      setZoomScale(newScale);
    } else if (e.touches.length === 1 && isDraggingRef.current && zoomScale > 1) {
      const deltaX = e.touches[0].clientX - dragStartRef.current.x;
      const deltaY = e.touches[0].clientY - dragStartRef.current.y;
      setPan({ x: deltaX, y: deltaY });
    }
  };

  const handleTouchEnd = () => {
    touchStartDistanceRef.current = 0;
    isDraggingRef.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale > 1) {
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current && zoomScale > 1) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setPan({ x: deltaX, y: deltaY });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <AnimatePresence>
      {previewImage && (
        <motion.div
          key="photo-lightbox-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between items-center py-4 px-4 select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Top Toolbar */}
          <div className="w-full flex items-center justify-between max-w-4xl z-10 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-zinc-900">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-wider text-white">Photo Viewer</span>
              <span className="text-[10px] text-zinc-500 font-mono">Pinch / Scroll to zoom • Drag to pan</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setZoomScale(1);
                  setPan({ x: 0, y: 0 });
                }}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                Reset Zoom
              </button>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Viewport for Image */}
          <div
            className="flex-1 w-full max-w-4xl flex items-center justify-center overflow-hidden my-4 relative"
            onMouseDown={handleMouseDown}
          >
            <img
              src={previewImage}
              alt="Preview attachment"
              className={`max-h-[75vh] max-w-[95vw] object-contain select-none transition-transform duration-75 ${
                zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
              }`}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`,
              }}
              draggable={false}
            />
          </div>

          {/* Bottom Scale Slider controls */}
          <div className="w-full max-w-md z-10 bg-[#121214] border border-zinc-900 rounded-xl p-3 flex items-center gap-4">
            <button
              onClick={() => setZoomScale((prev) => Math.max(1, prev - 0.25))}
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center font-black text-white hover:text-rose-400 transition-colors border border-zinc-800"
            >
              -
            </button>
            <div className="flex-1 flex flex-col gap-1 items-center">
              <div className="flex justify-between w-full text-[9px] font-mono text-zinc-500 uppercase">
                <span>Zoom Level</span>
                <span>{Math.round(zoomScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="0.1"
                value={zoomScale}
                onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                className="w-full accent-rose-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <button
              onClick={() => setZoomScale((prev) => Math.min(4, prev + 0.25))}
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center font-black text-white hover:text-rose-400 transition-colors border border-zinc-800"
            >
              +
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
