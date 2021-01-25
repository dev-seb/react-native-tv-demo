import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import shaka from 'shaka-player';

const FORMAT_HTML5 = 'HTML5';
const FORMAT_HLS = 'HLS';
const FORMAT_DASH = 'DASH';

/**
 * react-native-video components for react-native-web
 */
const Video = forwardRef((props, ref) => {
  const {
    source,
    poster,
    paused,
    autoplay,
    controls,
    muted,
    repeat,
    inline,
    volume,
    rate,
    onLoad,
    onLoadStart,
    onReadyForDisplay,
    onPlaybackRateChange,
    onProgress,
    onSeek,
    onEnd,
    onError,
    onExitFullscreen,
  } = props;

  // State
  const [format, setFormat] = useState(FORMAT_HTML5);
  const [shakaPlayer, setShakaPlayer] = useState(null);

  // Video ref
  const video = useRef(null);

  useEffect(() => {
    //console.log('Video.useEffect([])');
    // Bind listeners
    bindListeners();
    return () => {
      // Destroy shaka palyer
      if (shakaPlayer) {
        shakaPlayer.destroy();
      }
      // Unbind listeners
      unbindListeners();
    };
  }, []);

  useEffect(() => {
    if (source) {
      // Get file extension from source
      const extension = source.split(/[#?]/)[0].split('.').pop().trim();
      // Get format
      let format = FORMAT_HTML5;
      if (extension === 'm3u8') {
        format = FORMAT_HLS;
      } else if (extension === 'mpd') {
        format = FORMAT_DASH;
        setShakaPlayer(new shaka.Player(video.current));
      }
      setFormat(format);
    }
  }, [source]);

  useEffect(() => {
    //console.log('Video.useEffect([shakaPlayer, source])');
    if (shakaPlayer && source) {
      shakaPlayer.load(source);
    }
  }, [shakaPlayer, source]);

  useEffect(() => {
    //console.log("Video.useEffect([paused])", paused);
    // Toggle play / pause from parent
    if (paused === false) {
      play();
    } else if (paused === true) {
      pause();
    }
  }, [paused]);

  useEffect(() => {
    console.log('rate: ', rate);
    if (rate) {
      if (rate === 0) {
        pause();
      } else {
        play();
        // TODO: handle rate < 1
      }
    }
  }, [rate]);

  useEffect(() => {
    if (volume >= 0 && volume <= 1) {
      video.current.volume = volume;
    }
  }, [volume]);

  // Private methods

  function play() {
    //console.log('Video.play()');
    if (video.current.paused) {
      if (video.current.currentTime > 0 || !autoplay) {
        // Handle old exception
        let playPromise = null;
        try {
          playPromise = video.current.play();
        } catch (error) {
          onError(error);
        }
        // Handle promise
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // playback started
            })
            .catch((error) => {
              onError(error);
            });
        }
      }
    }
  }

  function pause() {
    //console.log('Video.pause()');
    if (!video.current.paused) {
      video.current.pause();
    }
  }

  // react-native-video API (public methods)

  useImperativeHandle(ref, () => ({
    /**
     * react-native-video seek() method requires seconds
     *
     * @param seconds
     */
    seek: (seconds) => {
      //console.log('Video.seek(' + seconds + ')');
      if (seconds) {
        if (seconds >= 0 && seconds < video.current.duration) {
          video.current.currentTime = seconds;
        }
      }
    },

    presentFullscrenPlayer: () => {
      //console.log('Video.presentFullscreenPlayer()');
      if (video) {
        if (video.current.requestFullscreen) {
          video.current.requestFullscreen();
        }
        // Deprecated
        else if (video.current.enterFullscreen) {
          video.current.enterFullscreen();
        } else if (video.current.webkitEnterFullscreen) {
          video.current.webkitEnterFullscreen();
        }
      }
    },

    dismissFullscreenPlayer: () => {
      //console.log('Video.dismissFullscreenPlayer()');
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    },
  }));

  // react-native-video callback proxy

  /**
   * loadedmetadata => onLoad
   */
  function onVideoLoadedMetadata() {
    //console.log('Video.onVideoLoadedMetadata()');
    if (onLoad && video) {
      onLoad({
        currentPosition: 0,
        duration: video.current.duration,
        // TODO: naturalSize, audioTracks, textTracks
      });
    }
  }

  /**
   * loadstart => onLoadStart
   */
  function onVideoLoadStart() {
    if (source) {
      //console.log('Video.onVideoLoadStart()');
      if (onLoadStart && video) {
        onLoadStart({
          isNetwork: true,
          type: '',
          uri: source.uri,
        });
      }
    }
  }

  /**
   * waiting => onLoadStart
   */
  function onVideoWaiting() {
    //console.log('Video.onVideoWaiting()');
    if (onLoadStart && video) {
      onLoadStart({
        isNetwork: true,
        type: '',
        uri: source.uri,
      });
    }
  }

  /**
   * canplaythrough => onReadyForDisplay
   */
  function onVideoCanPlayThrough() {
    //console.log('Video.onVideoCanPlayThrough()');
    if (video) {
      if (onReadyForDisplay) {
        onReadyForDisplay();
      }
    }
  }

  /**
   * play => onPlaybackRateChange
   */
  function onVideoPlay() {
    //console.log('Video.onVideoPlay()');
    if (onPlaybackRateChange) {
      onPlaybackRateChange({playbackRate: 1});
    }
  }

  /**
   * pause => onPlaybackRateChange
   */
  function onVideoPause() {
    //console.log('Video.onVideoPause()');
    if (onPlaybackRateChange) {
      onPlaybackRateChange({playbackRate: 0});
    }
  }

  /**
   * ratechange => onPlaybackRateChange
   */
  function onVideoRateChange() {
    //console.log('Video.onVideoRateChange()');
    if (onPlaybackRateChange && video) {
      onPlaybackRateChange({
        playbackRate: video.current.playbackRate,
      });
    }
  }

  /**
   * timeupdate => onProgress
   */
  function onVideoTimeUpdate() {
    //console.log('Video.onVideoTimeUpdate()');
    if (onProgress && video) {
      onProgress({
        seekableDuration: video.current.duration,
        playbableDuration: video.current.duration,
        currentTime: video.current.currentTime,
      });
    }
  }

  /**
   * seeked => onSeek
   */
  function onVideoSeeked() {
    //console.log('Video.onVideoSeeked()');
    if (onSeek && video) {
      onSeek({
        currentTime: video.current.currentTime,
        seekTime: video.current.currentTime,
      });
    }
  }

  /**
   * ended => onEnd
   */
  function onVideoEnded() {
    //console.log('Video.onVideoEnded()');
    if (onEnd) {
      onEnd();
    }
  }

  /**
   * error => onError
   */
  function onVideoError() {
    if (source) {
      //console.log('Video.onVideoError()');
      let error = {};
      // TODO: return same errors as react-native-video
      if (onError) {
        onError(error);
      }
    }
  }

  /**
   * Get exit fullscreen event for webkit
   */
  function onVideoEndFullscreen() {
    //console.log('Video.onVideoEndFullscreen()');
    if (onExitFullscreen) {
      onExitFullscreen();
    }
  }

  /**
   * get exit fullscreen event for firefox
   */
  function onVideoFullscreenChange(e) {
    //console.log('Video.onVideoEndFullscreen()');
    if (document.fullscreenElement) {
      // enter fullscreen
    } else if (onExitFullscreen) {
      onExitFullscreen();
    }
  }

  // Listeners

  function bindListeners() {
    //console.log('Video.bindListeners()');
    if (video && video.current) {
      // Unsupported native listeners
      video.current.addEventListener(
        'webkitendfullscreen',
        onVideoEndFullscreen,
      );
    }
    // Listeners on document
    document.addEventListener('fullscreenchange', onVideoFullscreenChange);
  }

  function unbindListeners() {
    //console.log('Video.unbindListeners()');
    if (video && video.current) {
      // Unsupported native listeners
      video.current.removeEventListener(
        'webkitendfullscreen',
        onVideoEndFullscreen,
      );
      // Listeners on document
      document.removeEventListener('fullscreenchange', onVideoFullscreenChange);
    }
  }

  // Optional params
  let controlsProp = controls ? {controls: 'controls'} : {};
  let autoPlayProp = autoplay ? {autoplay: 'autoplay'} : {};
  let mutedProp = muted ? {muted: 'muted'} : {};
  let repeatProp = repeat ? {loop: 'loop'} : {};
  let playsInlineProp = inline ? {playsInline: 'playsInline'} : {};

  // Build <video> element
  return (
    <video
      className="video"
      ref={video}
      src={source.uri || source}
      poster={poster}
      {...controlsProp}
      {...autoPlayProp}
      {...mutedProp}
      {...repeatProp}
      {...playsInlineProp}
      onLoadedMetadata={onVideoLoadedMetadata}
      onLoadStart={onVideoLoadStart}
      onWaiting={onVideoWaiting}
      onCanPlayThrough={onVideoCanPlayThrough}
      onPlay={onVideoPlay}
      onPause={onVideoPause}
      onRateChange={onVideoRateChange}
      onSeeked={onVideoSeeked}
      onTimeUpdate={onVideoTimeUpdate}
      onEnded={onVideoEnded}
      onError={onVideoError}
      style={{width: '100%', height: '100%'}}
    />
  );
});

export default Video;
