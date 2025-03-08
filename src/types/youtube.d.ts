
interface YT {
  Player: {
    new (
      elementId: string | HTMLElement,
      options: {
        events?: {
          onReady?: (event: YT.PlayerEvent) => void;
          onStateChange?: (event: YT.OnStateChangeEvent) => void;
          onError?: (event: YT.OnErrorEvent) => void;
        };
        videoId?: string;
        playerVars?: {
          autoplay?: 0 | 1;
          controls?: 0 | 1;
          enablejsapi?: 0 | 1;
          fs?: 0 | 1;
          modestbranding?: 0 | 1;
          playsinline?: 0 | 1;
          rel?: 0 | 1;
          showinfo?: 0 | 1;
        };
      }
    ): YT.Player;
  };
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

declare namespace YT {
  interface Player {
    loadVideoById(videoId: string, startSeconds?: number): void;
    cueVideoById(videoId: string, startSeconds?: number): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    clearVideo(): void;
    getVideoLoadedFraction(): number;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl(): string;
    getVolume(): number;
    setVolume(volume: number): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setSize(width: number, height: number): void;
    getPlaybackRate(): number;
    setPlaybackRate(suggestedRate: number): void;
    getAvailablePlaybackRates(): number[];
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getPlayerState(): number;
    getPlaybackQuality(): string;
    setPlaybackQuality(suggestedQuality: string): void;
    getAvailableQualityLevels(): string[];
    destroy(): void;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent {
    target: Player;
    data: number;
  }
  
  interface OnErrorEvent {
    target: Player;
    data: number;
  }
}

interface Window {
  YT: YT;
  onYouTubeIframeAPIReady: () => void;
}
