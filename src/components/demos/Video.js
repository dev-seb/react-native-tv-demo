import React, {Component} from 'react';

/**
 * react-native-video component for react-native-web
 */
class Video extends Component {

  constructor(props) {
    super(props);
    // Init refs
    this.video = null;
    this.readyForDisplay = false;
    // Bind functions
    this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
    this.onLoadStart = this.onLoadStart.bind(this);
    this.onWaiting = this.onWaiting.bind(this);
    this.onLoadedData = this.onLoadedData.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onRateChange = this.onRateChange.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onSeeked = this.onSeeked.bind(this);
    this.onEnded = this.onEnded.bind(this);
    this.onError = this.onError.bind(this);
  }

  // react-native-video API

  rate(rate) {
    if(this.video) {
      if(rate === 0) {
        this.video.pause();
      }
      else {
        this.video.play();
        // TODO: handle rate < 1
      }
    }
  }

  seek(time) {
    if(this.video) {
      if(time >= 0 && time < this.video.duration) {
        this.video.currentTime = time;
      }
    }
  }

  presentFullscrenPlayer() {
    if(this.video) {
      if (this.video.requestFullscreen) {
        this.video.requestFullscreen();
      }
      // Deprecated
      else if (this.video.enterFullscreen) {
        this.video.enterFullscreen();
      }
    }
  }

  dismissFullscreenPlayer() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  volume(volume) {
    if(volume >= 0 && volume <= 1) {
      this.video.volume = volume;
    }
  }


  // react-native-video callback proxy

  /**
   * onLoadedMetadata => onLoad
   */
  onLoadedMetadata() {
    if(this.props.onLoad && this.video) {
      this.props.onLoad({
        currentPosition: 0,
        duration: this.video.duration,
        // TODO: naturalSize, audioTracks, textTracks
      })
    }
  }

  /**
   * onLoadStart => onLoadStart
   */
  onLoadStart() {
    if(this.props.onLoadStart && this.video) {
      this.props.onLoadStart({
        isNetwork: true,
        type: '',
        uri: this.props.source.uri
      })
    }
  }


  /**
   * onWaiting => onLoadStart
   */
  onWaiting() {
    if(this.props.onLoadStart && this.video) {
      this.props.onLoadStart({
        isNetwork: true,
        type: '',
        uri: this.props.source.uri
      })
    }
  }

  /**
   * onLoadedData => onReadyForDisplay
   */
  onLoadedData() {
    if(
      this.props.onReadyForDisplay
      && this.video
      && !this.readyForDisplay
    ) {
      this.readyForDisplay = true;
      this.props.onReadyForDisplay();
    }
  }

  /**
   * onPlay => onPlaybackRateChange
   */
  onPlay() {
    if(this.props.onPlaybackRateChange) {
      this.props.onPlaybackRateChange({playbackRate: 1});
    }
  }

  /**
   * onPause => onPlaybackRateChange
   */
  onPause() {
    if(this.props.onPlaybackRateChange) {
      this.props.onPlaybackRateChange({playbackRate: 0});
    }
  }

  /**
   * onRateChange => onPlaybackRateChange
   */
  onRateChange(rate) {
    if(this.props.onPlaybackRateChange) {
      this.props.onPlaybackRateChange({playbackRate: rate});
    }
  }

  /**
   * onTimeUpdate => onProgress
   */
  onTimeUpdate() {
    if(this.props.onProgress && this.video) {
      this.props.onProgress({
        currentTime: this.video.currentTime,
        // TODO: playbableDuration, seekableDuration
      })
    }
  }

  /**
   * onSeeked => onSeek
   */
  onSeeked() {
    if(this.props.onSeek && this.video) {
      this.props.onSeek({
        currentTime: this.video.currentTime,
        seekTime: this.video.currentTime,
      })
    }
  }

  /**
   * onEnded => onEnd
   */
  onEnded() {
    if(this.props.onEnd) {
      this.props.onEnd();
    }
  }

  /**
   * onError => onError
   */
  onError() {
    let error = {};
    // TODO: return same errors as react-native-video
    if(this.props.onError) {
      this.props.onError(error);
    }
  }

  // Listeners

  componentDidMount() {
    this.bindListeners();
  }

  componentWillUnmount() {
    this.unbindListeners();
  }

  componentDidUpdate(prevProps) {
    if(this.props.paused === false
      //&& prevProps.paused === true
    ) {
      if(this.video.paused) {
        this.video.play();
      }
    }
    else if(this.props.paused === true
      //&& prevProps.paused === false
    ) {
      if(!this.video.paused) {
        this.video.pause();
      }
    }
  }

  bindListeners() {
    if(this.video) {
      // Bind all listeners
      this.video.addEventListener('loadedmetadata', this.onLoadedMetadata);
      this.video.addEventListener('loadstart', this.onLoadStart);
      this.video.addEventListener('waiting', this.onWaiting);
      this.video.addEventListener('canplaythrough', this.onLoadedData);
      this.video.addEventListener('play', this.onPlay);
      this.video.addEventListener('pause', this.onPause);
      this.video.addEventListener('ratechange', this.onRateChange);
      this.video.addEventListener('seeked', this.onSeeked);
      this.video.addEventListener('timeupdate', this.onTimeUpdate);
      this.video.addEventListener('ended', this.onEnded);
      this.video.addEventListener('error', this.onError);
    }
  }

  unbindListeners() {
    if(this.video) {
      // Unbind all listeners
      this.video.removeEventListener('loadedmetadata', this.onLoadedMetadata);
      this.video.removeEventListener('loadstart', this.onLoadStart);
      this.video.removeEventListener('waiting', this.onWaiting);
      this.video.removeEventListener('canplaythrough', this.onLoadedData());
      this.video.removeEventListener('play', this.onPlay);
      this.video.removeEventListener('pause', this.onPause);
      this.video.removeEventListener('ratechange', this.onRateChange);
      this.video.removeEventListener('seeked', this.onSeeked);
      this.video.removeEventListener('timeupdate', this.onTimeUpdate);
      this.video.removeEventListener('ended', this.onEnd);
      this.video.removeEventListener('error', this.onError);
    }
  }

  render() {
    // Options params
    let controls = this.props.controls ? {'controls' : 'controls'} : {};
    let muted = this.props.controls ? {'muted' : 'muted'} : {};
    let repeat = this.props.repeat ? {'repeat' : 'repeat'} : {};
    // Build <video> element
    return (
      <video
        ref={ref => this.video = ref}
        src={this.props.source.uri || this.props.source}
        poster={this.props.poster}
        style={{width: '100%', height: '100%'}}
        {...controls}
        {...muted}
        {...repeat}
        />
    );
  }
}

export default Video;
