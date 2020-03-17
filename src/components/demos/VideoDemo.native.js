import React from 'react';
import {
  StyleSheet
} from 'react-native';
import Video from 'react-native-video';
import AbstractVideoDemo from "./AbstractVideoDemo";

class VideoDemo extends AbstractVideoDemo {

  showVideo(source) {
    return (
      <Video
        ref={ref => this.player = ref}
        source={AbstractVideoDemo.SOURCE}
        paused={this.state.paused}
        onReadyForDisplay={this.onReadyForDisplay}
        onLoadStart={this.onLoadStart}
        onLoad={this.onLoad}
        onPlaybackRateChange={this.onPlaybackRateChange}
        onProgress={this.onProgress}
        onEnd={this.onEnd}
        onError={this.onError}
        disableFocus={true}
        resizeMode={'contain'}
        style={styles.video}
      />
    );
  }

}

export default VideoDemo;

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  }
});