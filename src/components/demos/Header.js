import React, {Component} from 'react';
import {
  View,
  Text,
} from 'react-native';
import Style from "../Style";

class Header extends Component {

  render() {
    return (
      <View style={Style.styles.header}>
        <Text style={Style.styles.headerText}>{this.props.title}</Text>
      </View>
    );
  }
}

export default Header;
