import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './Navigation';
import AppProvider from './AppProvider';
import Style from './styles/Style';
import Menu from './components/Menu';
import Content from './components/Content';

// Enable screens
import {enableScreens} from 'react-native-screens';
enableScreens();

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer ref={navigationRef}>
        <View style={styles.app}>
          <Menu />
          <Content />
        </View>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  app: {
    width: Style.px(1920),
    height: Style.px(1080),
    flex: 1,
    flexDirection: 'row',
  },
});
