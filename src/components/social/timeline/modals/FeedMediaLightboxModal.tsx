import React from 'react';
import { X, ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface FeedMediaLightboxModalProps {
  lightbox: { images: string[]; index: number };
  onClose: () => void;
  onSetIndex: (index: number) => void;
}

export const FeedMediaLightboxModal: React.FC<FeedMediaLightboxModalProps> = ({
  lightbox,
  onClose,
  onSetIndex,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full h-full max-w-7xl flex items-center justify-center">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-zinc-900/50 hover:bg-zinc-800 text-white transition-colors border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        {lightbox.index > 0 && (
          <button 
            onClick={(e) => { e.stopPropagation(); onSetIndex(lightbox.index - 1); }}
            className="absolute left-4 z-50 p-3 rounded-full bg-zinc-900/50 hover:bg-zinc-800 text-white transition-colors border border-white/10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Next Button */}
        {lightbox.index < lightbox.images.length - 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); onSetIndex(lightbox.index + 1); }}
            className="absolute right-4 z-50 p-3 rounded-full bg-zinc-900/50 hover:bg-zinc-800 text-white transition-colors border border-white/10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}

        {/* Image Container */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img 
            src={lightbox.images[lightbox.index]} 
            alt={`Lightbox image ${lightbox.index + 1}`} 
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://cyjnpuneruonskfzpmqo.supabase.co/storage/v1/object/public/public-assets/High%20energy%20live%20music%20concert%201.png';
            }}
            className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Image Counter */}
          {lightbox.images.length > 1 && (
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-zinc-900/80 px-4 py-2 rounded-full border border-white/10 text-white font-mono text-sm tracking-wider">
              {lightbox.index + 1} / {lightbox.images.length}
            </div>
          )}
        </div>

        {/* Comments Panel (Right Side on Desktop, Bottom on Mobile) */}
        <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-80 bg-zinc-950 border-l border-white/10 flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="p-4 border-b border-white/10 bg-zinc-900/50">
            <h3 className="text-white font-mono font-bold uppercase tracking-widest text-sm">Comments</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Dummy comments */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 border border-white/5"></div>
              <div>
                <span className="text-white text-xs font-bold mr-2">metalhead99</span>
                <span className="text-zinc-500 text-[10px] font-mono">2h ago</span>
                <p className="text-zinc-300 text-sm mt-1">This composition is insane!</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 border border-white/5"></div>
              <div>
                <span className="text-white text-xs font-bold mr-2">shutterbug</span>
                <span className="text-zinc-500 text-[10px] font-mono">1h ago</span>
                <p className="text-zinc-300 text-sm mt-1">What lens did you use for this? The lighting is perfectly captured.</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-white/10 bg-zinc-900/50">
            <div className="flex items-center gap-2 bg-black rounded-lg border border-white/10 p-2">
              <input type="text" placeholder="Add a comment..." className="flex-1 bg-transparent border-none outline-none text-white text-sm" />
              <button className="text-red-500 hover:text-red-400 p-1">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
