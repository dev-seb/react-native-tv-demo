import React, {useContext} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {navigate} from '../Navigation';
import {AppContext} from '../AppProvider';
import Style from '../styles/Style';
import reactLogoImageSource from '../assets/react_logo.png';
import FocusableHighlight from './focusable/FocusableHighlight';

const Menu = () => {
  const [appContext, setAppContext] = useContext(AppContext);

  function showMenu() {
    const items = ['Components', 'Events', 'Focus', 'Scroll', 'Input', 'Video'];
    return items.map((item) => {
      const key = 'menu_' + item.toLowerCase();
      const route = item.toLowerCase();
      return (
        <FocusableHighlight
          onPress={() => {
            navigate(route);
          }}
          underlayColor={Style.buttonFocusedColor}
          style={styles.menuItem}
          nativeID={key}
          key={key}>
          <Text style={styles.text}>{item}</Text>
        </FocusableHighlight>
      );
    });
  }

  return appContext.menuVisible ? (
    <View style={styles.left}>
      <Image style={styles.logo} source={reactLogoImageSource} />
      <Text style={styles.title}>{'React Native TV'}</Text>
      <View style={styles.menu}>{showMenu()}</View>
    </View>
  ) : null;
};

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
    resizeMode: 'contain',
  },
  title: {
    fontSize: Style.px(30),
    color: 'white',
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
    height: Style.px(90),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Style.px(40),
  },
});
