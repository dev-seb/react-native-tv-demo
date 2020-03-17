import React, {Component} from 'react';
import {
  TouchableHighlight,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import Style from "./Style";

class Menu extends Component {

  constructor(props) {
    super(props);
    this.showItem = this.showItem.bind(this);
  }

  showItem(item) {
    this.props.navigate(item);
  }

  showMenu() {
    let items = ["Events", "Focus", "Scroll", "Input", "Video"];
    return items.map((item) => {
      let key = 'menu_' + item;
      return (
        <TouchableHighlight
          onPress={() => {this.showItem(item.toLowerCase())}}
          underlayColor={Style.buttonFocusedColor}
          style={styles.menuItem}
          key={key}>
          <Text style={styles.text}>{item}</Text>
        </TouchableHighlight>
      );
    });
  }

  render() {
    return (
      <View style={styles.left}>
        <Image style={styles.logo} source={require('../assets/react_logo.png')} />
        <Text style={styles.title}>{"React Native TV"}</Text>
        <View style={styles.menu}>
          {this.showMenu()}
        </View>
      </View>
    );
  }
}

export default Menu;

const styles = StyleSheet.create({
  left: {
    backgroundColor: Style.backgroundColor,
    width: Style.px(400),
    height: Style.px(1080),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: Style.px(150),
    height: Style.px(100),
    margin: Style.px(100),
    marginBottom: Style.px(20),
    resizeMode: 'contain'
  },
  title: {
    fontSize: Style.px(30),
    color: 'white'
  },
  menu: {
    width: Style.px(400),
    height: Style.px(800),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    width: Style.px(300),
    height: Style.px(100),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Style.px(40),
  },
});