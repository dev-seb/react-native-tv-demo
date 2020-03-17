import React, {Component} from 'react';
import {
  Platform,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  BackHandler,
  TVEventHandler
} from 'react-native';
import Style from "../Style";

/* abstract */ class AbstractVideoDemo extends Component {

  static SOURCE = require('../../assets/sample.mov');

  static EVENT_LINES = 20;

  constructor(props) {
    super(props);
    // Bind functions
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.setOverlayVisible = this.setOverlayVisible.bind(this);
    this.setOverlayHidden = this.setOverlayHidden.bind(this);
    this.onReadyForDisplay= this.onReadyForDisplay.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onLoadStart = this.onLoadStart.bind(this);
    this.onPlaybackRateChange = this.onPlaybackRateChange.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onError = this.onError.bind(this);
    // Init
    this.backHandler = null;
    this.tvEventHandler = null;
    // Init Refs
    this.player = React.createRef();
    this.playPauseButtonRef = React.createRef();
    // Init State
    this.state = {
      source: AbstractVideoDemo.SOURCE,
      videoEventStack: [],
      videoDuration: 0,
      videoTime: 0,
      paused: true,
      isReady: false,
      isLoading: false,
      isPlaying: false,
      isFullscreen: false,
      isOverlayVisible: true,
    };
  }

  /* abstract */ showVideo() {
    throw new Error("showVideo() is abstract");
  }

  componentDidMount() {
    // Listen to back button
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress', this.backHandlerListener.bind(this)
    );
    // Liten to TV events
    this.tvEventHandler = new TVEventHandler();
    this.tvEventHandler.enable(
      this, this.tvEventListener.bind(this)
    );
  }

  componentWillUnmount() {
    // Remove Back Button listener
    this.backHandler.remove();
    // Remove TV event listener
    if (this.tvEventHandler) {
      this.tvEventHandler.disable();
      delete this.tvEventHandler;
    }
  }

  toggleFullscreen() {
    // Toggle left menu visibility
    if(this.props.screenProps && this.props.screenProps.setMenuVisible) {
      this.props.screenProps.setMenuVisible(this.state.isFullscreen === true);
    }
    // Toggle fullscreen
    this.setState({
      isFullscreen: !this.state.isFullscreen
    });
  }

  setOverlayVisible() {
    if(this.state.isOverlayVisible === false) {
      this.setState({
        isOverlayVisible: true
      });
      if(this.playPauseButtonRef) {
        if(Platform.OS === 'web') {
          // Use setter for web
          this.playPauseButtonRef.setTVPreferredFocus(true);
        }
        else {
          // Use native props for AndroidTV
          this.playPauseButtonRef.setNativeProps(
            {hasTVPreferredFocus: true}
          );
        }
      }
    }
    this.setOverlayHiddenAfterDelay();
  }

  setOverlayHidden() {
    if(this.state.isOverlayVisible === true
      && !this.state.paused) {
      this.setState({
        isOverlayVisible: false
      });
    }
  }

  setOverlayHiddenAfterDelay() {
    if(this.hideOverlayTimer) {
      clearTimeout(this.hideOverlayTimer);
    }
    this.hideOverlayTimer = setTimeout(
      this.setOverlayHidden.bind(this),
      4000
    );
  }

  backHandlerListener = () => {
    console.log("backHandleListener => got back button event");
    if(this.state.isFullscreen) {
      this.toggleFullscreen();
    }
    else {
      if(Platform.OS === 'web') {
        window.history.back();
      }
      else {
        this.props.navigation.goBack();
      }
    }
    return true;
  };

  tvEventListener(component, event) {
    if (event.eventKeyAction === 0) {
      // Show overlay
      this.setOverlayVisible();
      // Toggle play / pause
      if (event.eventType === 'playPause') {
        if (this.player) {
          this.setState({
            paused: !this.state.paused
          });
        }
      }
    }
  }

  // Video Events

  pushVideoEventStack(event, params) {
    let videoEventStack = this.state.videoEventStack;
    if(videoEventStack.length >= AbstractVideoDemo.EVENT_LINES) {
      videoEventStack.shift();
    }
    let eventStr = event + "(" + (params ? JSON.stringify(params) : "") + ")";
    console.log("Video event: " + eventStr);
    videoEventStack.push(eventStr);
    return videoEventStack;
  }

  onReadyForDisplay() {
    this.setState({
      isReady: true,
      videoEventStack: this.pushVideoEventStack("onReadyForDisplay")
    });
  }

  onLoad(data) {
    this.setState({
      isLoading: false,
      videoDuration: data.duration,
      videoEventStack: this.pushVideoEventStack("onLoad", data)
    });
  }

  onLoadStart(data) {
    this.setState({
      isLoading: true,
      videoEventStack: this.pushVideoEventStack("onLoadStart", data)
    });
  }

  onPlaybackRateChange(data) {
    this.setState({
      isPlaying: (data.playbackRate > 0),
      videoEventStack: this.pushVideoEventStack("onPlaybackRateChange", data)
    });
  }

  onProgress(data) {
    this.setState({
      videoTime: data.currentTime,
      videoEventStack: this.pushVideoEventStack("onProgress", data)
    });
  }

  onEnd() {
    this.setState({
      videoTime: 0,
      paused: true,
      isPlaying: false,
      videoEventStack: this.pushVideoEventStack("onEnd")
    });
    this.setOverlayVisible();
  }

  onError(error) {
    this.setState({
      videoEventStack: this.pushVideoEventStack("onError", error)
    });
  }

  static formatTime(time) {
    let seconds = parseInt(time, 10);
    let hours   = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);
    let timeFormat = '';
    if(hours > 0) {
      if (hours   < 10) {hours   = "0"+hours;}
      timeFormat += hours+':';
    }
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    // Fix NaN
    if(isNaN(minutes)) {
      minutes = "-";
    }
    if(isNaN(seconds)) {
      seconds = "-";
    }
    timeFormat += minutes+':'+seconds;
    return timeFormat;
  }

  render() {
    return (
      <View style={[Style.styles.right, this.state.isFullscreen && styles.fullscreen]}>
        {!this.state.isFullscreen &&
        <View style={Style.styles.header}>
          <Text style={Style.styles.headerText}>{"Video Demo"}</Text>
        </View>
        }
        <View style={[Style.styles.content, this.state.isFullscreen && styles.fullscreen]}>
          <View style={this.state.isFullscreen ? styles.videoContainerFullscreen : styles.videoContainer}>
            {this.showVideo(this.state.source)}
            <View style={this.state.isOverlayVisible ? styles.videoOverlayVisible : styles.videoOverlayHidden}>
              <View style={styles.videoOverlayBackground} />
              <View style={styles.videoEvents}>
                <Text style={styles.videoEventsText}>
                  {"Video Events:\n" + this.state.videoEventStack.join("\n")}
                </Text>
              </View>
              <View style={styles.videoControls}>
                <TouchableHighlight
                  ref={ref => this.playPauseButtonRef = ref}
                  onPress={(e) => {
                    if (e.eventKeyAction === 0 && e.eventType === 'select') {
                      if (this.player) {
                        this.setState({
                          paused: !this.state.paused,
                        });
                      }
                    }
                  }}
                  style={styles.videoControl}
                  hasTVPreferredFocus={true}
                  underlayColor={Style.buttonFocusedColor}>
                  <Text style={styles.videoControlText}>{this.state.paused ? "Play" : "Pause"}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={(e) => {
                    if (e.eventKeyAction === 0 && e.eventType === 'select') {
                      this.toggleFullscreen();
                    }
                  }}
                  style={styles.videoControl}
                  underlayColor={Style.buttonFocusedColor}>
                  <Text style={styles.videoControlText}>
                    {this.state.isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  </Text>
                </TouchableHighlight>
                <View style={styles.videoTime}>
                  <Text style={styles.videoTimeText}>
                    {AbstractVideoDemo.formatTime(this.state.videoTime) + " / " + AbstractVideoDemo.formatTime(this.state.videoDuration)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default AbstractVideoDemo;

const styles = StyleSheet.create({
  fullscreen: {
    width: Style.px(1920),
    height: Style.px(1080),
  },
  videoContainer: {
    width: Style.px(1280),
    height: Style.px(720),
  },
  videoContainerFullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Style.px(1920),
    height: Style.px(1080),
  },
  videoOverlayVisible: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoOverlayHidden: {
    opacity: 0.0,
  },
  videoOverlayBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.5,
  },
  videoEvents: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: Style.px(20)
  },
  videoEventsText: {
    fontSize: Style.px(20),
    color: 'white',
  },
  videoControls: {
    position: 'absolute',
    width: '100%',
    height: Style.px(140),
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  videoControl: {
    width: Style.px(300),
    height: Style.px(100),
    margin: Style.px(20),
    backgroundColor: Style.buttonUnfocusedColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoControlText: {
    fontSize: Style.px(30),
  },
  videoTime: {
    flex: 1,
    //width: Style.px(200),
    height: Style.px(100),
    margin: Style.px(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTimeText: {
    fontSize: Style.px(20),
    color: 'white',
  },
});