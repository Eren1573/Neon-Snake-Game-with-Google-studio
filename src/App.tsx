import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-neon-magenta/30 flex flex-col overflow-x-hidden relative">
      <div className="bg-cyber-grid" />
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neon-magenta/10 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Header */}
      <header className="p-6 border-b border-neon-cyan/20 flex flex-col md:flex-row items-center justify-between gap-6 bg-black/40 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border border-neon-cyan glow-cyan flex items-center justify-center bg-black/50">
            <div className="w-5 h-5 bg-neon-cyan rounded-sm animate-pulse shadow-[0_0_15px_#00f3ff]" />
          </div>
          <h1 className="text-4xl font-display font-black tracking-widest text-white uppercase text-glow-cyan">
            NEON<span className="text-neon-cyan">SNAKE</span>
          </h1>
        </div>
        
        <div className="flex gap-8 bg-black/50 px-8 py-3 rounded-2xl border border-neon-magenta/30 backdrop-blur-md glow-magenta">
          <div className="flex flex-col items-center">
            <span className="text-xs text-neon-magenta uppercase tracking-widest font-bold mb-1">SCORE</span>
            <span className="text-3xl font-display font-bold text-neon-cyan text-glow-cyan leading-none">{score}</span>
          </div>
          <div className="w-px bg-neon-magenta/30" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-neon-magenta uppercase tracking-widest font-bold mb-1">HIGH SCORE</span>
            <span className="text-3xl font-display font-bold text-white text-glow-magenta leading-none">{highScore}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col xl:flex-row items-center justify-center p-6 gap-8 z-10">
        {/* Game Area */}
        <div className="flex-1 w-full max-w-3xl flex justify-center">
          <SnakeGame onScoreChange={handleScoreChange} highScore={highScore} />
        </div>

        {/* Sidebar / Music Player */}
        <div className="w-full xl:w-[400px] flex flex-col gap-8 shrink-0">
          <div className="bg-black/40 backdrop-blur-xl border border-neon-cyan/30 p-8 rounded-3xl glow-cyan relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan" />
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-3 text-neon-cyan text-glow-cyan uppercase tracking-widest">
              AUDIO_SYSTEM
            </h2>
            <MusicPlayer />
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-neon-magenta/30 p-8 rounded-3xl glow-magenta text-sm text-gray-300">
            <h3 className="text-white font-display font-bold mb-4 uppercase tracking-widest text-lg text-glow-magenta">SYSTEM_RULES</h3>
            <ul className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-neon-magenta shadow-[0_0_10px_#ff00ff] mt-2 shrink-0" />
                <span className="leading-relaxed">Collect energy cores (magenta) to expand your length and score.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_10px_#00f3ff] mt-2 shrink-0" />
                <span className="leading-relaxed">Avoid grid boundaries and self-intersection to prevent system crash.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
