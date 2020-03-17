import React, {Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {NavigationActions} from '@react-navigation/core';
import Style from "./components/Style";
import Menu from "./components/Menu";

/* abstract */ class AbstractApp extends Component {

  constructor(props) {
    super(props);
    // bind functions
    this.setMenuVisible = this.setMenuVisible.bind(this);
    // Init State
    this.state = {
      isMenuVisible: true
    }
  }

  /* abstract */ showRouter() {
    throw new Error("showRouter() is abstract");
  }

  navigate(routeName) {
    if (this.navigator) {
      this.navigator.dispatch(
        NavigationActions.navigate({
          routeName: routeName
        })
      );
    }
  }

  setMenuVisible(isMenuVisible) {
    console.log("set menu visible: " + isMenuVisible);
    this.setState({
      isMenuVisible: isMenuVisible
    })
  }

  getScreenProps() {
    return {
      setMenuVisible: this.setMenuVisible,
    }
  }

  render() {
    return (
      <View style={styles.app}>
        {this.state.isMenuVisible &&
        <Menu navigate={this.navigate.bind(this)}/>
        }
        {this.showRouter()}
      </View>
    );
  }

}

export default AbstractApp;

const styles = StyleSheet.create({
  app: {
    width: Style.px(1920),
    height: Style.px(1080),
    flex: 1,
    flexDirection: 'row',
  },
});