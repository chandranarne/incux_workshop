import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Sparkles } from 'lucide-react';

export default function WorkshopVideoPlayer() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // Guarantee muted autoplay without music on mount across all browsers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    setIsMuted(true);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          // Autoplay fallback if browser requires user gesture
          console.warn('Autoplay prevented or deferred:', err);
          setIsPlaying(false);
        });
    }

    // Auto resume playing if scrolled back into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && video.paused && !video.ended) {
            video.play().catch(() => {});
            setIsPlaying(true);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-black/10 dark:border-[#262626] shadow-2xl group transition-all duration-300 hover:border-[#FACC15]/40"
    >
      {/* Video Element: Playing automatically without music (muted) */}
      <div className="relative aspect-video w-full bg-black">
        <video
          ref={videoRef}
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Ambient Top Shadow / Gradient for Badge Readability */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 sm:top-5 inset-x-3 sm:inset-x-5 flex items-center justify-between pointer-events-none">
          {/* Live Workshop Reel Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white tracking-wider shadow-lg pointer-events-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FACC15] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FACC15]" />
            </span>
            <span className="font-bold text-[#FACC15]">IMMERSIVE FOOTAGE</span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-white/80 hidden sm:inline">Campus Sprint &amp; Hackathon</span>
          </div>

          {/* Sound Status Pill / Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white transition-colors cursor-pointer shadow-lg"
            title={isMuted ? 'Currently muted (Playing without music). Click to enable audio.' : 'Audio enabled. Click to mute.'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#FACC15]" />
                <span className="text-white/90 font-medium">Without Music (Muted)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#FACC15]" />
                <span className="text-[#FACC15] font-medium">Sound Active</span>
              </>
            )}
          </button>
        </div>

        {/* Center Play/Pause Overlay Indicator on Hover or when Paused */}
        <div
          onClick={togglePlay}
          className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
            !isPlaying ? 'opacity-100 bg-black/40' : showControls ? 'opacity-90 bg-transparent' : 'opacity-0'
          }`}
        >
          {!isPlaying && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FACC15] text-[#0A0A0A] flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current" />
            </div>
          )}
        </div>

        {/* Bottom Ambient Gradient for Controls */}
        <div
          className={`absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 sm:opacity-0'
          }`}
        />

        {/* Bottom Interactive Controls Bar */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 sm:p-5 flex flex-col gap-2.5 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none sm:opacity-0'
          }`}
        >
          {/* Progress Timeline Track */}
          <div
            onClick={handleSeek}
            className="w-full h-1.5 hover:h-2.5 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer relative transition-all overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-[#FACC15] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between text-white text-xs font-mono">
            <div className="flex items-center gap-3">
              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
              </button>

              {/* Mute / Unmute Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#FACC15]" /> : <Volume2 className="w-4 h-4 text-[#FACC15]" />}
                <span className="hidden sm:inline text-[11px]">{isMuted ? 'Muted' : 'Sound'}</span>
              </button>

              {/* Time Counter */}
              <span className="text-white/70 text-[11px] tracking-wide">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1.5 text-white/60 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                IncuxAI Workshop Experience
              </span>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

