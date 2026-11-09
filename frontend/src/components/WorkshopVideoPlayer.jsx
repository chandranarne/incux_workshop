import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

export default function WorkshopVideoPlayer() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Clear any legacy localStorage keys that previously caused 'rewatch' to show on load
  useEffect(() => {
    try {
      localStorage.removeItem('incuxai_video_watched');
    } catch (e) {}
  }, []);

  // Autoplay muted on mount
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
          console.warn('Autoplay prevented or deferred:', err);
          setIsPlaying(false);
        });
    }

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

  const handleEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  const handleRewatch = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setHasEnded(false);
    video.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {});
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (hasEnded) {
      handleRewatch(e);
      return;
    }

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
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
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    const p = (video.currentTime / video.duration) * 100;
    setProgress(isNaN(p) ? 0 : p);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    video.currentTime = clickPos * video.duration;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-black/10 dark:border-[#262626] shadow-2xl group transition-all duration-300 hover:border-[#FACC15]/40"
    >
      {/* Video Element */}
      <div 
        onClick={togglePlay}
        className="relative aspect-video w-full bg-black cursor-pointer"
        title={isPlaying ? 'Click to pause video' : 'Click to play video'}
      >
        <video
          ref={videoRef}
          src="https://mpcxwgcjqyyfwtzdohfi.supabase.co/storage/v1/object/public/videos/video.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-cover"
        >
          <source src="https://mpcxwgcjqyyfwtzdohfi.supabase.co/storage/v1/object/public/videos/video.mp4" type="video/mp4" />
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Ambient Top Shadow */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/75 via-black/25 to-transparent pointer-events-none transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 sm:top-5 inset-x-3 sm:inset-x-5 flex items-center justify-between pointer-events-none z-20">
          {/* Live Workshop Reel Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white tracking-wider shadow-lg pointer-events-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FACC15] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FACC15]" />
            </span>
            <span className="font-bold text-[#FACC15]">CAMPUS WORKSHOPS</span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-white/80 hidden sm:inline">Engineering Immersions</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white transition-colors cursor-pointer shadow-lg"
              title={isMuted ? 'Muted. Click to enable sound.' : 'Sound active. Click to mute.'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span className="text-white/90 font-medium hidden sm:inline">Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span className="text-[#FACC15] font-medium hidden sm:inline">Sound</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center Hover / Paused Action Button */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
            !isPlaying ? 'opacity-100 bg-black/35' : showControls ? 'opacity-90 bg-transparent' : 'opacity-0'
          }`}
        >
          {hasEnded ? (
            <button
              type="button"
              onClick={handleRewatch}
              className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-bold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Watch Again</span>
            </button>
          ) : !isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer group/play"
              aria-label="Play Video"
            >
              <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1 fill-current group-hover/play:scale-105 transition-transform" />
            </button>
          )}
        </div>

        {/* Bottom Ambient Gradient for Controls */}
        <div
          className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 sm:opacity-0'
          }`}
        />

        {/* Bottom Interactive Controls Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
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

              {/* Time Counter */}
              <span className="text-white/70 text-[11px] tracking-wide">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
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
