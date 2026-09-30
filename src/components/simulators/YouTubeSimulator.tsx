import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  ThumbsUp, 
  Share2, 
  Bell, 
  Mic, 
  User, 
  Check, 
  Volume2,
  Tv
} from 'lucide-react';
import { AutomationStep } from '../../types';

interface YouTubeSimulatorProps {
  currentStep: AutomationStep | null;
  stepProgress: number;
}

export const YouTubeSimulator: React.FC<YouTubeSimulatorProps> = ({ currentStep, stepProgress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [playSeconds, setPlaySeconds] = useState(14);

  // Sync with automation steps
  useEffect(() => {
    if (!currentStep) return;

    if (currentStep.actionType === 'TYPE' && currentStep.targetSelector === '#search-query-box') {
      const targetQuery = currentStep.paramValue || 'Top Tech Trends 2026';
      let i = 0;
      setSearchQuery('');
      const interval = setInterval(() => {
        if (i < targetQuery.length) {
          setSearchQuery(targetQuery.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }

    if (currentStep.targetSelector === '#video-thumbnail-1') {
      setVideoStarted(true);
      setIsPlaying(true);
    }

    if (currentStep.targetSelector === '#btn-like-video') {
      setIsLiked(true);
    }
  }, [currentStep]);

  // Video seconds timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlaySeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0f0f0f] text-slate-100 rounded-xl overflow-hidden border border-red-950 font-sans select-none text-xs">
      {/* Top YouTube Header */}
      <div className="bg-[#0f0f0f] px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-7 h-5 bg-red-600 rounded-md flex items-center justify-center text-white">
            <Play className="w-3 h-3 fill-current ml-0.5" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white font-sans">
            YouTube <sup className="text-[9px] text-slate-500 font-normal">IN</sup>
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md flex items-center">
          <div
            id="search-query-box"
            className={`flex-1 bg-[#121212] border rounded-l-full px-3.5 py-1.5 text-xs text-white flex items-center justify-between ${
              currentStep?.targetSelector === '#search-query-box'
                ? 'border-red-500 ring-2 ring-red-500/50'
                : 'border-slate-700'
            }`}
          >
            <span className={searchQuery ? 'text-white' : 'text-slate-500'}>
              {searchQuery || 'Search...'}
            </span>
            {currentStep?.actionType === 'TYPE' && (
              <span className="w-1.5 h-3.5 bg-red-500 animate-pulse ml-0.5 inline-block" />
            )}
          </div>
          <button
            id="btn-search-submit"
            className={`px-4 py-1.5 border border-l-0 rounded-r-full transition-colors flex items-center justify-center ${
              currentStep?.targetSelector === '#btn-search-submit'
                ? 'bg-red-600 text-white ring-2 ring-red-400'
                : 'bg-[#222222] border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <Bell className="w-4 h-4 cursor-pointer hover:text-white" />
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-[10px]">
            P
          </div>
        </div>
      </div>

      {/* Main Body: Video Player or Feed */}
      <div className="flex-1 p-3 overflow-y-auto bg-[#0f0f0f] space-y-3">
        {videoStarted ? (
          // Active Video Player View
          <div className="space-y-3">
            {/* Simulated Video Player Screen */}
            <div className="relative aspect-video w-full max-h-[220px] bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              
              {/* Playing Animation Visual */}
              <div className="text-center z-10 space-y-2">
                <div className="flex items-center justify-center gap-1">
                  {[40, 70, 30, 90, 50, 80, 60].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${isPlaying ? h : 15}px` }}
                      className="w-1 bg-red-500 rounded-full transition-all duration-300"
                    />
                  ))}
                </div>
                <div className="text-xs font-bold text-white tracking-wide">
                  {isPlaying ? 'NOW PLAYING (AUTOMATED)' : 'PAUSED'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  0:{playSeconds < 10 ? `0${playSeconds}` : playSeconds} / 4:18 • HD 1080p
                </div>
              </div>

              {/* Player Bottom Control Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/95 to-transparent flex items-center justify-between text-white text-xs z-10">
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-red-400">
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] text-slate-300">0:{playSeconds}</span>
                </div>
                <span className="text-[9px] bg-red-600 px-1.5 py-0.2 rounded font-bold">LIVE</span>
              </div>
            </div>

            {/* Video Title and Metadata */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-white">
                {searchQuery ? `${searchQuery} - Official Release & Stream` : 'Top Breakthrough AI Systems (2026 Edition)'}
              </h3>
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                    T
                  </div>
                  <div>
                    <div className="font-bold text-white">TechVision Media</div>
                    <div className="text-[10px] text-slate-400">1.82M subscribers</div>
                  </div>
                  <button className="ml-2 px-3 py-1 bg-white text-black font-semibold rounded-full text-[11px] hover:bg-slate-200">
                    Subscribe
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-like-video"
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isLiked || currentStep?.targetSelector === '#btn-like-video'
                        ? 'bg-red-600 text-white ring-2 ring-red-400 shadow-lg'
                        : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{isLiked ? 'Liked (142K)' : 'Like'}</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 bg-[#272727] text-white rounded-full text-xs hover:bg-[#3f3f3f]">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Search Results Feed
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {searchQuery ? `Results for "${searchQuery}"` : 'Top Recommended For You'}
            </div>

            {/* Video Result 1 */}
            <div
              id="video-thumbnail-1"
              className={`p-2 rounded-xl flex gap-3 cursor-pointer transition-all border ${
                currentStep?.targetSelector === '#video-thumbnail-1'
                  ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/50 shadow-lg'
                  : 'border-slate-800 bg-[#141414] hover:bg-[#1a1a1a]'
              }`}
            >
              <div className="w-36 h-20 bg-slate-800 rounded-lg relative overflow-hidden shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-900/60 to-slate-900" />
                <Play className="w-6 h-6 text-white drop-shadow z-10" />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 rounded font-mono">
                  12:45
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-white text-xs line-clamp-2">
                  {searchQuery || 'High Speed Automation Tools You Must Know'}
                </h4>
                <p className="text-[10px] text-slate-400">TechPulse • 420K views • 2 days ago</p>
                <p className="text-[10px] text-slate-500 line-clamp-1">
                  Full step-by-step breakdown of automated web agents and RPA scripts.
                </p>
              </div>
            </div>

            {/* Video Result 2 */}
            <div className="p-2 rounded-xl flex gap-3 border border-slate-800 bg-[#141414] opacity-70">
              <div className="w-36 h-20 bg-slate-800 rounded-lg relative overflow-hidden shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-900" />
                <Play className="w-5 h-5 text-slate-400 z-10" />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 rounded font-mono">
                  08:12
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-white text-xs line-clamp-2">
                  Complete Hands-Free Autonomous Work Systems
                </h4>
                <p className="text-[10px] text-slate-400">NextGen AI • 1.2M views • 1 week ago</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeSimulator;
