import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';

export default function WorkshopVideoPlayer({ onOpenRegistration }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  // Never default to watched across browser sessions - always start fresh with play
  const [hasWatchedFullVideo, setHasWatchedFullVideo] = useState(false);

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
    setHasWatchedFullVideo(true);
  };

  const handleRewatch = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {});
  };

  // Redirect to registration page when clicking on the video or registration action
  const handleVideoClick = (e) => {
    // If user clicked the play icon or explicit play trigger, toggle play
    // Otherwise open registration page as requested by user
    if (onOpenRegistration) {
      onOpenRegistration('register');
      document.querySelector('#upcoming-workshops')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      togglePlay();
    }
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
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
    e.stopPropagation();
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
      {/* Video Element: Clicking video redirects to registration page */}
      <div 
        onClick={handleVideoClick}
        className="relative aspect-video w-full bg-black cursor-pointer"
        title="Click video to register for upcoming workshops"
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

        {/* Top Floating Badges & Direct Registration CTA */}
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
            {/* Direct Registration Pill on Video */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenRegistration) onOpenRegistration('register');
                document.querySelector('#upcoming-workshops')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] text-xs font-mono font-bold tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#0A0A0A]" />
              <span>Register Free</span>
            </button>

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

        {/* Center Hover / Paused Action Card */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            !isPlaying ? 'opacity-100 bg-black/45' : showControls ? 'opacity-90 bg-transparent' : 'opacity-0'
          }`}
        >
          {!isPlaying && (
            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenRegistration) onOpenRegistration('register');
                  document.querySelector('#upcoming-workshops')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Register for Workshop</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="px-4 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Video</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Ambient Gradient for Controls */}
        <div
          className={`absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none transition-opacity duration-300 ${
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
              {/* Prompt to register */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenRegistration) onOpenRegistration('register');
                  document.querySelector('#upcoming-workshops')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-[#FACC15] hover:text-[#FEF08A] text-[11px] font-bold cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Click to Register</span>
              </button>

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
