import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { getSupabase } from '../supabase';

const concertBg = "https://cyjnpuneruonskfzpmqo.supabase.co/storage/v1/object/public/public-assets/High%20energy%20concert%202.png";
const nexusIconBrackets = "https://cyjnpuneruonskfzpmqo.supabase.co/storage/v1/object/public/public-assets/Nexus%20Icon%20brackets.png";
const nexusIconCircuits = "https://cyjnpuneruonskfzpmqo.supabase.co/storage/v1/object/public/public-assets/Nexus%20Icon%20Circuits.png";
const nexusIconBars = "https://cyjnpuneruonskfzpmqo.supabase.co/storage/v1/object/public/public-assets/Nexus%20Icon%20bars.png";
const nexusCoreLogoText = "https://cyjnpuneruonskfzpmqo.supabase.co/storage/v1/object/public/public-assets/Nexus%20Core%20Logo%20copy.png";

interface SplashViewProps {
  onGoToDashboard: () => void;
  onCreateAccount: () => void;
  isLoggedOut?: boolean;
}

interface Flash {
  id: number;
  x: number;
  y: number;
  scale: number;
}

export default function SplashView({ onGoToDashboard, onCreateAccount }: SplashViewProps) {
  const [flashes, setFlashes] = useState<Flash[]>([]);
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'completed' | 'error'>('idle');
  const [apkFileName, setApkFileName] = useState('Nexus-Core-v1.0.apk');
  const [apkFileSize, setApkFileSize] = useState('7.5 MB');
  const [apkDownloadUrl, setApkDownloadUrl] = useState(
    'https://cyjnpuneruonskfzpmqo.supabase.co/storage/v1/object/public/downloads/Nexus-Core-v1.0.apk'
  );

  // Dynamic APK fetch from Supabase Storage 'downloads' bucket
  useEffect(() => {
    const fetchApkDetails = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase.storage.from('downloads').list('');
        if (!error && data && data.length > 0) {
          const apkFile = data.find((f: any) => f.name.toLowerCase().endsWith('.apk')) || data[0];
          if (apkFile) {
            setApkFileName(apkFile.name);
            if (apkFile.metadata?.size) {
              const mb = (apkFile.metadata.size / (1024 * 1024)).toFixed(1);
              setApkFileSize(`${mb} MB`);
            }
            const { data: urlData } = supabase.storage.from('downloads').getPublicUrl(apkFile.name);
            if (urlData?.publicUrl) {
              setApkDownloadUrl(urlData.publicUrl);
            }
          }
        }
      } catch (err) {
        console.warn('Unable to query downloads storage:', err);
      }
    };

    fetchApkDetails();
  }, []);

  // Live crowd flashes simulation
  useEffect(() => {
    const triggerFlash = () => {
      const newFlash: Flash = {
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 15,
        scale: Math.random() * 1.6 + 0.6
      };

      setFlashes(prev => [...prev.slice(-3), newFlash]);

      setTimeout(() => {
        setFlashes(prev => prev.filter(f => f.id !== newFlash.id));
      }, 400);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerFlash();
        if (Math.random() > 0.7) {
          setTimeout(triggerFlash, 120);
        }
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadApk = () => {
    setDownloadState('downloading');
    try {
      const link = document.createElement('a');
      link.href = apkDownloadUrl;
      link.download = apkFileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadState('completed');
        setTimeout(() => setDownloadState('idle'), 4000);
      }, 1200);
    } catch (err) {
      console.error('Download trigger error:', err);
      setDownloadState('error');
      setTimeout(() => setDownloadState('idle'), 3000);
    }
  };

  return (
    <div className="bg-[#07080a] flex-1 w-full flex flex-col items-center justify-between p-6 text-white font-sans select-none pb-10 relative isolate overflow-x-hidden overflow-y-auto min-h-screen">
      {/* Background concert image overlayed with grayscale filter */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 filter grayscale contrast-125 brightness-50 pointer-events-none z-0"
        style={{ backgroundImage: `url("${concertBg}")` }}
      />
      
      {/* Subtle monochrome radial vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95 pointer-events-none z-1" />

      {/* Camera Flashes Effect Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5 mix-blend-screen opacity-60">
        {flashes.map((flash) => (
          <div key={flash.id}>
            {/* Primary flash center core */}
            <motion.div
              className="absolute bg-white rounded-full filter blur-[8px] shadow-[0_0_40px_20px_rgba(255,255,255,0.9)]"
              style={{
                left: `${flash.x}%`,
                top: `${flash.y}%`,
                width: '6px',
                height: '6px',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [1, flash.scale * 3.5, 0.1], opacity: [0, 1, 0.9, 0] }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
            {/* Silver glow ring */}
            <motion.div
              className="absolute bg-white/15 rounded-full filter blur-[40px]"
              style={{
                left: `${flash.x}%`,
                top: `${flash.y}%`,
                width: '200px',
                height: '200px',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: [0.1, flash.scale, flash.scale * 1.3, 0], opacity: [0, 0.8, 0.3, 0] }}
              transition={{ duration: 0.38, ease: "easeOut" }}
            />
          </div>
        ))}
        
        {flashes.length > 0 && (
          <motion.div 
            className="absolute inset-0 bg-white/5 z-4 mix-blend-overlay pointer-events-none"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </div>

      {/* Silver ambient halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[380px] h-[380px] bg-white opacity-[0.04] rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Top minimal status indicator */}
      <header className="w-full max-w-sm mx-auto flex items-center justify-between z-10 pt-2 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-zinc-400 uppercase">
            NEXUS CORE // ARCHITECTURE
          </span>
        </div>
        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest border border-zinc-800/80 bg-zinc-900/60 px-2 py-0.5 rounded-full">
          v1.0.0
        </div>
      </header>

      {/* Main emblem & logo section */}
      <div className="w-full flex flex-col items-center justify-center my-auto py-2 max-w-sm mx-auto z-10">
        
        {/* Layered Emblem (Grayscale) */}
        <motion.div 
          className="relative flex items-center justify-center w-full my-2"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Pulsing Silver Backlight */}
          <motion.div
            className="absolute inset-0 bg-white/10 blur-[70px] rounded-full w-[260px] h-[260px] mx-auto"
            animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex items-center justify-center w-[250px] h-[250px] sm:w-[280px] sm:h-[280px] filter grayscale">
            
            {/* 1. BRACKETS LAYER */}
            <motion.img 
              src={nexusIconBrackets} 
              alt="Nexus Icon Brackets" 
              className="absolute w-full h-full object-contain pointer-events-none z-10 filter grayscale contrast-125 brightness-110"
              referrerPolicy="no-referrer"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* 2. CIRCUITS LAYER with Silver Pulsing Glow */}
            <motion.img 
              src={nexusIconCircuits} 
              alt="Nexus Icon Circuits" 
              className="absolute w-full h-full object-contain pointer-events-none z-15 filter grayscale contrast-150 brightness-200"
              referrerPolicy="no-referrer"
              animate={{
                filter: [
                  'grayscale(100%) contrast(150%) brightness(140%) drop-shadow(0 0 4px rgba(255,255,255,0.25))',
                  'grayscale(100%) contrast(150%) brightness(200%) drop-shadow(0 0 16px rgba(255,255,255,0.8))',
                  'grayscale(100%) contrast(150%) brightness(140%) drop-shadow(0 0 4px rgba(255,255,255,0.25))'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            {/* 3. BARS LAYER */}
            <img 
              src={nexusIconBars} 
              alt="Nexus Icon Bars" 
              className="absolute w-full h-full object-contain pointer-events-none z-20 filter grayscale contrast-125 brightness-125"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

          </div>
        </motion.div>

        {/* Branding Logo & Monochromatic Tagline */}
        <motion.div 
          className="flex flex-col items-center justify-center text-center w-full mt-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-2 w-full px-4 min-h-[40px]">
            <img 
              src={nexusCoreLogoText} 
              alt="Nexus Core Logo" 
              className="w-full max-w-[320px] sm:max-w-[380px] h-auto object-contain filter grayscale contrast-125 brightness-150"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('.logo-text-fallback')) {
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = 'logo-text-fallback text-3xl sm:text-4xl font-black tracking-wider text-white font-display uppercase text-center [text-shadow:0_0_20px_rgba(255,255,255,0.4)]';
                  fallbackDiv.innerHTML = 'NEXUS<span class="text-zinc-400">CORE</span>';
                  parent.appendChild(fallbackDiv);
                }
              }}
            />
          </div>
          <p className="text-zinc-400 font-mono text-[10px] tracking-[0.22em] uppercase text-center max-w-xs sm:max-w-sm leading-relaxed">
            The Complete Architecture for Independent Music Culture
          </p>
        </motion.div>

      </div>

      {/* Buttons & Action Controls */}
      <motion.div 
        className="w-full max-w-sm space-y-3 z-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        {/* Glowing Direct APK Download Button */}
        <button
          type="button"
          onClick={handleDownloadApk}
          disabled={downloadState === 'downloading'}
          className="group relative w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-zinc-100 text-black font-black text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-between shadow-[0_0_30px_rgba(255,255,255,0.35),0_0_60px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5),0_0_80px_rgba(255,255,255,0.25)] active:scale-[0.98] border border-white/80"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black/10 flex items-center justify-center text-black">
              {downloadState === 'downloading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : downloadState === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xs sm:text-sm tracking-wider text-black">
                {downloadState === 'downloading' 
                  ? 'Downloading APK...' 
                  : downloadState === 'completed' 
                    ? 'Download Initiated!' 
                    : 'Download APK File'}
              </span>
              <span className="text-[9.5px] font-mono font-bold text-zinc-600 tracking-normal normal-case">
                {apkFileName} • {apkFileSize}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold text-zinc-800 uppercase tracking-wider">
            <Smartphone className="w-3 h-3" />
            <span>Android</span>
          </div>
        </button>

        {/* Secondary web access actions: Sign In & Create Account */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button 
            type="button"
            onClick={onGoToDashboard}
            className="py-3 px-3 text-zinc-200 hover:text-white text-xs font-bold bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all rounded-xl tracking-wider uppercase active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </button>
          
          <button 
            type="button"
            onClick={onCreateAccount}
            className="py-3 px-3 text-zinc-300 hover:text-white text-xs font-bold bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all rounded-xl tracking-wider uppercase active:scale-[0.98] cursor-pointer text-center"
          >
            Create Account
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-4 flex flex-col items-center gap-1 text-[9px] text-zinc-500 font-mono text-center">
          <div className="flex items-center gap-2 text-[8.5px] uppercase tracking-widest text-zinc-500">
            <ShieldCheck className="w-2.5 h-2.5 text-zinc-400" />
            <span>SUPABASE STORAGE ENCRYPTED</span>
          </div>
          <p className="tracking-wider text-zinc-600">
            BY ACCESSING, YOU AGREE TO TERMS OF SERVICE &amp; PRIVACY POLICY
          </p>
        </div>
      </motion.div>
    </div>
  );
}
