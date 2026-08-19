import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  X,
  Ticket,
  Clock,
  QrCode,
  Shield,
  Music,
  ArrowRight
} from 'lucide-react';

interface EventCompanionModalProps {
  isEventModeActive: boolean;
  setIsEventModeActive: (val: boolean) => void;
  activeEventData: any;
  eventModeTab: 'info' | 'setlist' | 'chat';
  setEventModeTab: (tab: 'info' | 'setlist' | 'chat') => void;
  isTicketScanned: boolean;
  setIsTicketScanned: (val: boolean) => void;
  scanTime: string | null;
  setScanTime: (time: string | null) => void;
  liveSetlists: Record<string, any>;
  venueMessages: any[];
  setVenueMessages: React.Dispatch<React.SetStateAction<any[]>>;
  venueMessageInput: string;
  setVenueMessageInput: (val: string) => void;
  userProfile?: any;
  getSupabase?: () => any;
}

export const EventCompanionModal: React.FC<EventCompanionModalProps> = ({
  isEventModeActive,
  setIsEventModeActive,
  activeEventData,
  eventModeTab,
  setEventModeTab,
  isTicketScanned,
  setIsTicketScanned,
  scanTime,
  setScanTime,
  liveSetlists,
  venueMessages,
  setVenueMessages,
  venueMessageInput,
  setVenueMessageInput,
  userProfile,
  getSupabase
}) => {
  return (
    <AnimatePresence>
      {isEventModeActive && activeEventData && (
        <motion.div key="modal-backdrop-eventcompanionmodal-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[150] flex flex-col  zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-4 py-4 border-b border-zinc-900 bg-black/50 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/50">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-black uppercase tracking-wider leading-tight">
                {activeEventData.headliner}
              </h2>
              <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {activeEventData.venue} • LIVE NOW
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEventModeActive(false)}
            className="w-10 h-10 bg-zinc-900 hover:bg-zinc-800 rounded-full flex items-center justify-center transition-colors border border-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-900 bg-zinc-950/50">
          <button
            onClick={() => setEventModeTab('info')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              eventModeTab === 'info'
                ? 'text-rose-500 border-rose-500 bg-rose-500/5'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            Access
          </button>
          <button
            onClick={() => setEventModeTab('setlist')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              eventModeTab === 'setlist'
                ? 'text-rose-500 border-rose-500 bg-rose-500/5'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            Tour Reference
          </button>
          <button
            onClick={() => setEventModeTab('chat')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              eventModeTab === 'chat'
                ? 'text-rose-500 border-rose-500 bg-rose-500/5'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            Venue Chat
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {eventModeTab === 'info' && (
            <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
              {/* Ticket Status */}
              <div className="bg-[#0b0d10] border border-zinc-800 rounded-2xl p-5 text-center space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500" />

                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500">
                  <Ticket className="w-8 h-8" />
                </div>

                <div>
                  <div className="inline-block px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[9px] font-bold uppercase tracking-widest border border-rose-500/30 mb-2">
                    NEXUS PASS VERIFIED
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">VIP FLOOR ACCESS</h3>
                  <p className="text-xs text-zinc-400 mt-1">Present barcode at venue gate for entry</p>
                </div>

                {isTicketScanned ? (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1">
                    <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> SCANNED & ADMITTED
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">Timestamp: {scanTime}</div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsTicketScanned(true);
                      setScanTime(new Date().toLocaleTimeString());
                    }}
                    className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" /> Simulate Door Scan
                  </button>
                )}
              </div>

              {/* Event Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0b0d10] p-3.5 rounded-2xl border border-zinc-900 text-left font-mono">
                  <Clock className="w-4 h-4 text-rose-500 mb-1.5" />
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest font-black">Gate Schedule</div>
                  <div className="text-xs text-white font-black mt-2">
                    Doors: {activeEventData.time?.includes('Doors') ? activeEventData.time.replace('Doors', '').trim() : '8:00 PM'}
                  </div>
                </div>
                <div className="bg-[#0b0d10] p-3.5 rounded-2xl border border-zinc-900 text-left font-mono">
                  <Shield className="w-4 h-4 text-rose-500 mb-1.5" />
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest font-black">Safety Code</div>
                  <div className="text-xs text-zinc-400 font-bold mt-2 leading-tight">
                    Bag search / 18+ ID check / Ear protection req
                  </div>
                </div>
              </div>
            </div>
          )}

          {eventModeTab === 'setlist' && (
            <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
              <div className="bg-[#0b0d10] border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div className="space-y-1">
                  <span className="text-[9px] font-black tracking-widest text-rose-500 uppercase font-mono block">
                    TOUR REFERENCE MODE
                  </span>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    {activeEventData.headliner} SETLIST
                  </h3>
                  <p className="text-[10px] text-zinc-400 leading-normal max-w-xs">
                    Official expected live roster. Provided as a zero-maintenance static reference—no live checking required, perfect for spotty venue connections.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shrink-0 shadow">
                  <Music className="w-5 h-5 text-rose-500" />
                </div>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-3 divide-y divide-zinc-900">
                {(liveSetlists[activeEventData.headliner?.toUpperCase()] || ['Inner Paths (To Outer Space)', 'The Giza Power Plant', 'Starspawn']).map((song: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 px-2 hover:bg-zinc-900/20 transition-all rounded-lg group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-[10px] text-rose-500/70 font-bold tracking-widest shrink-0 w-6">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors truncate">
                        {song}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        STANDARD ROSTER
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-rose-500/50 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center py-2">
                <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                  • CURATED BY NEXUS TOUR DESK • DATA CACHED SECURELY •
                </p>
              </div>
            </div>
          )}

          {eventModeTab === 'chat' && (
            <div className="flex flex-col h-full max-w-md mx-auto">
              <div className="flex-1 overflow-y-auto space-y-4 pb-4 custom-scrollbar">
                <div className="text-center text-xs text-zinc-500 my-4 uppercase tracking-widest font-bold">
                  Live venue chat started
                </div>
                {venueMessages.map((msg, i) => {
                  const isMe = msg.user_id === userProfile?.id;
                  return (
                    <div key={i} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full ${isMe ? 'bg-rose-600' : 'bg-zinc-800'} flex items-center justify-center text-xs text-white font-bold shrink-0 overflow-hidden`}>
                        {msg.avatar_url ? (
                          <img src={msg.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          msg.username?.[0] || 'A'
                        )}
                      </div>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-xs ${isMe ? 'bg-rose-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-200'}`}>
                        <div className="text-[9px] text-zinc-400 font-mono mb-1">{msg.username}</div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                {venueMessages.length === 0 && (
                  <div className="text-center text-sm text-zinc-500 py-10">
                    Be the first to say something!
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="relative mt-auto pt-2">
                <input
                  type="text"
                  placeholder="Message the venue..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  value={venueMessageInput}
                  onChange={(e) => setVenueMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (!venueMessageInput.trim() || !activeEventData || !userProfile) return;

                      const payload = {
                        user_id: userProfile.id,
                        username: userProfile.username || userProfile.full_name || 'Anonymous',
                        avatar_url: userProfile.avatar_url,
                        text: venueMessageInput.trim(),
                        timestamp: new Date().toISOString()
                      };

                      const supabaseClient = getSupabase ? getSupabase() : null;
                      if (supabaseClient) {
                        supabaseClient.channel(`venue_chat_${activeEventData.id}`).send({
                          type: 'broadcast',
                          event: 'venue_msg',
                          payload: payload
                        });

                        supabaseClient.from('nexus_venue_chat').insert({
                          event_id: activeEventData.id,
                          profile_id: userProfile.id,
                          message: venueMessageInput.trim(),
                          created_at: new Date().toISOString()
                        }).then(({ error }: any) => {
                          if (error) console.error("Failed to persist message:", error);
                        });
                      }

                      setVenueMessageInput('');
                    }
                  }}
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                  disabled={!venueMessageInput.trim()}
                  onClick={() => {
                    if (!venueMessageInput.trim() || !activeEventData || !userProfile) return;

                    const payload = {
                      user_id: userProfile.id,
                      username: userProfile.username || userProfile.full_name || 'Anonymous',
                      avatar_url: userProfile.avatar_url,
                      text: venueMessageInput.trim(),
                      timestamp: new Date().toISOString()
                    };

                    const supabaseClient = getSupabase ? getSupabase() : null;
                    if (supabaseClient) {
                      supabaseClient.channel(`venue_chat_${activeEventData.id}`).send({
                        type: 'broadcast',
                        event: 'venue_msg',
                        payload: payload
                      });
                    }

                    setVenueMessageInput('');
                  }}
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};
