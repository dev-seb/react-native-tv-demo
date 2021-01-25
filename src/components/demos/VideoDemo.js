import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  TVEventHandler,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import useStateRef from '../../hooks/useStateRef';
import Style from '../../styles/Style';
import sampleVideoSource from '../../assets/sample.mov';
import {AppContext} from '../../AppProvider';
import VideoContainer from './VideoContainer';
import FocusableHighlight from '../focusable/FocusableHighlight';
import VideoProgressBar from './VideoProgressBar';

const EVENT_LINES = 18;
const EVENT_LINES_FULLSCREEN = 30;

const VideoDemo = () => {
  let hideOverlayTimer = null;

  const navigation = useNavigation();

  // Init Refs
  const playerRef = useRef(null);
  const playPauseButtonRef = useRef(null);

  // Context
  const [appContext, setAppContext] = useContext(AppContext);

  // State
  const [source, setSource] = useState(sampleVideoSource);
  const [videoEventStack, setVideoEventStack] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // State Refs
  const [pausedRef, isPaused, setPaused] = useStateRef(true);
  const [overlayRef, isOverlayVisible, setIsOverlayVisible] = useStateRef(true);
  const [fullscreenRef, isFullscreen, setIsFullscreen] = useStateRef(false);

  useFocusEffect(
    useCallback(() => {
      // Listen to back button
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backHandlerListener,
      );
      // Listen to TV events
      const tvEventHandler = new TVEventHandler();
      tvEventHandler.enable(null, tvEventListener);
      // Clean up
      return () => {
        // Pause playback
        if (!isPaused()) {
          setPaused(true);
        }
        // Clean timeout
        if (hideOverlayTimer) {
          clearTimeout(hideOverlayTimer);
        }
        // Remove backHandler
        backHandler.remove();
        // Remove TV event listener
        if (tvEventHandler) {
          tvEventHandler.disable();
        }
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      // Prevent react navigation to handle back button is player is fullscreen
      return navigation.addListener('beforeRemove', (e) => {
        if (isFullscreen()) {
          e.preventDefault();
        }
      });
    }, []),
  );

  useEffect(() => {
    // Toggle menu
    setAppContext({menuVisible: !isFullscreen()});
  }, [fullscreenRef.current]);

  function toggleFullscreen() {
    pushVideoEventStack(isFullscreen() ? 'exitFullscreen' : 'enterFullscreen');
    // Toggle fullscreen
    setIsFullscreen(!isFullscreen());
  }

  function setOverlayVisible() {
    console.log('setOverlayVisible', isOverlayVisible());
    if (isOverlayVisible() === false) {
      setIsOverlayVisible(true);
      if (playPauseButtonRef) {
        playPauseButtonRef.current.focus();
      }
    }
    setOverlayHiddenAfterDelay();
  }

  function setOverlayHidden() {
    if (isOverlayVisible() === true && !isPaused()) {
      setIsOverlayVisible(false);
    }
  }

  function setOverlayHiddenAfterDelay() {
    console.log('setOverlayHiddenAfterDelay');
    if (hideOverlayTimer) {
      clearTimeout(hideOverlayTimer);
    }
    hideOverlayTimer = setTimeout(setOverlayHidden, 4000);
  }

  function backHandlerListener() {
    console.log('backHandleListener => got back button event');
    if (isFullscreen()) {
      toggleFullscreen();
    }
    return true;
  }

  function tvEventListener(component, event) {
    //console.log('VideoDemo.tvEventListener()', event);
    if (event.eventKeyAction === 0) {
      // Show overlay
      setOverlayVisible();
      // Toggle play / pause
      if (event.eventType === 'playPause') {
        setPaused(!isPaused());
      }
    }
  }

  // Video Events

  function pushVideoEventStack(event, params) {
    let eventStr = event + '(' + (params ? JSON.stringify(params) : '') + ')';
    console.log('Video event: ' + eventStr);
    const eventLines = isFullscreen() ? EVENT_LINES_FULLSCREEN : EVENT_LINES;
    setVideoEventStack((oldVideoEventStack) =>
      [...oldVideoEventStack, eventStr].slice(eventLines * -1),
    );
  }

  function onReadyForDisplay() {
    setIsReady(true);
    pushVideoEventStack('onReadyForDisplay');
  }

  function onLoad(data) {
    setIsLoading(false);
    setVideoDuration(data.duration);
    pushVideoEventStack('onLoad', data);
  }

  function onLoadStart(data) {
    setIsLoading(true);
    pushVideoEventStack('onLoadStart', data);
  }

  function onPlaybackRateChange(data) {
    setIsPlaying(data.playbackRate > 0);
    pushVideoEventStack('onPlaybackRateChange', data);
  }

  function onProgress(data) {
    setVideoTime(data.currentTime);
    pushVideoEventStack('onProgress', data);
  }

  function onEnd() {
    setVideoTime(0);
    setPaused(true);
    setIsPlaying(false);
    pushVideoEventStack('onEnd');
    setOverlayVisible();
  }

  function onError(error) {
    pushVideoEventStack('onError', error);
  }

  function formatTime(time) {
    let seconds = parseInt(time, 10);
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - hours * 3600) / 60);
    seconds = seconds - hours * 3600 - minutes * 60;
    let timeFormat = '';
    if (hours > 0) {
      if (hours < 10) {
        hours = '0' + hours;
      }
      timeFormat += hours + ':';
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    // Fix NaN
    if (isNaN(minutes)) {
      minutes = '-';
    }
    if (isNaN(seconds)) {
      seconds = '-';
    }
    timeFormat += minutes + ':' + seconds;
    return timeFormat;
  }

  return (
    <View style={[Style.styles.right, isFullscreen() && styles.fullscreen]}>
      {!isFullscreen() && (
        <View style={Style.styles.header}>
          <Text style={Style.styles.headerText}>{'Video Demo'}</Text>
        </View>
      )}
      <View style={[Style.styles.content, isFullscreen() && styles.fullscreen]}>
        <View
          style={
            isFullscreen()
              ? styles.videoContainerFullscreen
              : styles.videoContainer
          }>
          <VideoContainer
            ref={playerRef}
            source={source}
            paused={isPaused()}
            onReadyForDisplay={onReadyForDisplay}
            onLoadStart={onLoadStart}
            onLoad={onLoad}
            onPlaybackRateChange={onPlaybackRateChange}
            onProgress={onProgress}
            onEnd={onEnd}
            onError={onError}
          />
          <View
            style={
              isOverlayVisible()
                ? styles.videoOverlayVisible
                : styles.videoOverlayHidden
            }>
            <View style={styles.videoOverlayBackground} />
            <View style={styles.videoEvents}>
              <Text style={styles.videoEventsText}>
                {'Video Events:\n' + videoEventStack.join('\n')}
              </Text>
            </View>
            <VideoProgressBar
              duration={videoDuration}
              time={videoTime}
              style={styles.progressBar}
              seek={(seconds) => {
                playerRef.current.seek(seconds);
              }}
            />
            <View style={styles.videoControls}>
              <FocusableHighlight
                nativeID={'play_pause_button'}
                ref={playPauseButtonRef}
                onPress={(e) => {
                  if (e.eventKeyAction === 0 && e.eventType === 'select') {
                    setPaused(!isPaused());
                  }
                }}
                style={styles.videoControl}
                hasTVPreferredFocus={true}
                underlayColor={Style.buttonFocusedColor}>
                <Text style={styles.videoControlText}>
                  {isPaused() ? 'Play' : 'Pause'}
                </Text>
              </FocusableHighlight>
              <FocusableHighlight
                nativeID={'fullscreen_button'}
                onPress={(e) => {
                  if (e.eventKeyAction === 0 && e.eventType === 'select') {
                    toggleFullscreen();
                  }
                }}
                style={styles.videoControl}
                underlayColor={Style.buttonFocusedColor}>
                <Text style={styles.videoControlText}>
                  {isFullscreen() ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                </Text>
              </FocusableHighlight>
              <View style={styles.videoTime}>
                <Text style={styles.videoTimeText}>
                  {formatTime(videoTime) + ' / ' + formatTime(videoDuration)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default VideoDemo;

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
    height: '80%',
    padding: Style.px(20),
  },
  videoEventsText: {
    fontSize: Style.px(20),
    color: 'white',
  },
  progressBar: {
    position: 'absolute',
    bottom: Style.px(135),
    width: '96%',
    marginLeft: '2%',
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
