import React, {Component} from 'react';
import {
  View,
  Text,
} from 'react-native';
import Style from "./Style";

class Home extends Component {

  render() {
    return (
      <View style={Style.styles.right}>
        <View style={Style.styles.header}>
          <Text style={Style.styles.headerText}>{"React Native TV Demos"}</Text>
        </View>
        <View style={Style.styles.content}>
        </View>
      </View>
    );
  }
}

export default Home;
