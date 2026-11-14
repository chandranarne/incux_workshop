import React from 'react';

/**
 * Catches render-time crashes so a single broken component can never turn the
 * whole site into a black screen. Shows a small, on-brand recovery panel and a
 * reload action instead.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[IncuxAI] Render error:', error, info?.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFCFA] dark:bg-[#0A0A0A] px-4">
        <div className="w-full max-w-md rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#121212] p-6 sm:p-8 text-center shadow-xl">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#D97706] dark:text-[#FACC15]">
            IncuxAI
          </p>
          <h1 className="mt-3 font-headline font-black text-xl sm:text-2xl text-[#0A0A0A] dark:text-[#F5F5F5]">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-[#374151] dark:text-[#D4D4D4] leading-relaxed">
            This section failed to render. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#0A0A0A] hover:bg-[#1F1F1F] text-[#FACC15] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] dark:text-[#0A0A0A] font-headline font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
