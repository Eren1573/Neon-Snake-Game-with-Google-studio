import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "NULL_POINTER",
    artist: "SYS.ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "MEMORY_LEAK",
    artist: "KERNEL_PANIC",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "STACK_OVERFLOW",
    artist: "DAEMON",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "SEGFAULT",
    artist: "ROOTKIT",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    playNext();
  };

  return (
    <div className="w-full mt-2 font-mono">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
        preload="auto"
      />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-black border-2 border-[#ff00ff] flex items-center justify-center shrink-0">
          <Music className={`text-[#00ffff] ${isPlaying ? 'animate-pulse' : ''}`} size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#ff00ff] text-xs uppercase tracking-widest font-bold mb-1">STREAM // {currentTrackIndex + 1}</p>
          <h3 className="text-white font-bold truncate text-lg uppercase glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-[#00ffff] text-sm truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-center gap-6">
          <button onClick={playPrev} className="text-zinc-500 hover:text-[#ff00ff] transition-all p-2">
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay} 
            className="w-14 h-14 bg-black border-2 border-[#00ffff] text-[#00ffff] flex items-center justify-center hover:bg-[#00ffff] hover:text-black transition-colors"
          >
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
          </button>
          <button onClick={playNext} className="text-zinc-500 hover:text-[#ff00ff] transition-all p-2">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-4 bg-black p-3 border-2 border-[#ff00ff]">
          <button onClick={() => setIsMuted(!isMuted)} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="flex-1 h-1.5 bg-zinc-800 appearance-none cursor-pointer accent-[#00ffff]"
          />
        </div>
      </div>
    </div>
  );
}
