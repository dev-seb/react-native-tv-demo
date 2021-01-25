import React, {forwardRef} from 'react';
import {StyleSheet} from 'react-native';
import Video from './Video';

const VideoContainer = forwardRef((props, ref) => {
  const {
    source,
    paused,
    onReadyForDisplay,
    onLoadStart,
    onLoad,
    onPlaybackRateChange,
    onProgress,
    onSeek,
    onEnd,
    onError,
  } = props;

  return (
    <Video
      ref={ref}
      source={source}
      paused={paused}
      onReadyForDisplay={onReadyForDisplay}
      onLoadStart={onLoadStart}
      onLoad={onLoad}
      onPlaybackRateChange={onPlaybackRateChange}
      onProgress={onProgress}
      onSeek={onSeek}
      onEnd={onEnd}
      onError={onError}
      style={styles.video}
    />
  );
});

export default VideoContainer;

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
});
