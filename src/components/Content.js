import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Style from '../styles/Style';
import {AppContext} from '../AppProvider';
import Home from './Home';
import ComponentsDemo from './demos/ComponentsDemo';
import EventsDemo from './demos/EventsDemo';
import FocusDemo from './demos/FocusDemo';
import ScrollDemo from './demos/ScrollDemo';
import InputDemo from './demos/InputDemo';
import VideoDemo from './demos/VideoDemo';

const Stack = createStackNavigator();

const Content = () => {
  const [appContext, setAppContext] = useContext(AppContext);

  return (
    <View
      style={[
        styles.navigator,
        !appContext.menuVisible && styles.navigatorFullscreen,
      ]}>
      <Stack.Navigator
        initialRouteName="home"
        detachInactiveScreens={true}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animationEnabled: false,
          unmountInactiveScreen: true,
          detachPreviousScreen: true,
        }}>
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="components" component={ComponentsDemo} />
        <Stack.Screen name="events" component={EventsDemo} />
        <Stack.Screen name="focus" component={FocusDemo} />
        <Stack.Screen name="scroll" component={ScrollDemo} />
        <Stack.Screen name="input" component={InputDemo} />
        <Stack.Screen name="video" component={VideoDemo} />
      </Stack.Navigator>
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
  app: {
    width: Style.px(1920),
    height: Style.px(1080),
    flex: 1,
    flexDirection: 'row',
  },
  navigator: {
    width: Style.px(1520),
    height: Style.px(1080),
  },
  navigatorFullscreen: {
    width: Style.px(1920),
  },
});
