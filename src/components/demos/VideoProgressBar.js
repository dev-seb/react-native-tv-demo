import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TVEventHandler} from 'react-native';
import Style from '../../styles/Style';
import useNodeHandle from '../../hooks/useNodeHandle';
import findNodeID from '../../hooks/findNodeID';
import FocusableHighlight from '../focusable/FocusableHighlight';

const SEEK_STEP = 5; // 5 seconds

const VideoProgressBar = (props) => {
  const {duration, time, seek} = props;
  const [percentage, setPercentage] = useState(0);

  const durationRef = useRef(duration);
  const timeRef = useRef(time);

  const indicatorRef = useRef(null);
  const indicatorHandle = useNodeHandle(indicatorRef);

  useEffect(() => {
    if (time >= 0 && duration > 0) {
      setPercentage(Math.floor((time / duration) * 100));
    }
    durationRef.current = duration;
    timeRef.current = time;
  }, [duration, time]);

  useEffect(() => {
    // Listen to TV events
    const tvEventHandler = new TVEventHandler();
    tvEventHandler.enable(null, tvEventListener);
    // Clean up
    return () => {
      // Remove TV event listener
      if (tvEventHandler) {
        tvEventHandler.disable();
      }
    };
  }, []);

  function tvEventListener(component, event) {
    if (event.tag === findNodeID(indicatorRef.current)) {
      if (event.eventKeyAction === 0) {
        const currentTime = timeRef.current;
        const currentDuration = durationRef.current;
        if (event.eventType === 'left') {
          // Rewind
          if (currentTime > SEEK_STEP) {
            if (seek) {
              seek(currentTime - SEEK_STEP);
            }
          }
        } else if (event.eventType === 'right') {
          // Fast forward
          if (currentTime < currentDuration - SEEK_STEP) {
            if (seek) {
              seek(currentTime + SEEK_STEP);
            }
          }
        }
      }
    }
  }

  return (
    <View style={[props.style, styles.progressBar]}>
      <FocusableHighlight
        ref={indicatorRef}
        nextFocusLeft={indicatorHandle}
        nextFocusRight={indicatorHandle}
        nativeID={'progress_bar_indicator'}
        style={[styles.progressBarIndicator, {left: percentage + '%'}]}
        underlayColor={Style.buttonFocusedColor}
      />
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarStatus, {width: percentage + '%'}]} />
      </View>
    </View>
  );
};

export default VideoProgressBar;

const styles = StyleSheet.create({
  progressBar: {
    zIndex: 5,
    height: Style.px(20),
  },
  progressBarIndicator: {
    zIndex: 4,
    position: 'absolute',
    top: 0,
    marginLeft: Style.px(-10),
    width: Style.px(20),
    height: Style.px(20),
    borderRadius: Style.px(10),
    backgroundColor: '#61dafb',
  },
  progressBarContainer: {
    zIndex: 3,
    position: 'absolute',
    top: Style.px(5),
    left: 0,
    width: '100%',
    height: Style.px(10),
    backgroundColor: 'white',
  },
  progressBarStatus: {
    height: Style.px(10),
    backgroundColor: '#61dafb',
  },
});
