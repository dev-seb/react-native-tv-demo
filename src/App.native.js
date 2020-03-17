import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AbstractApp from "./AbstractApp";
import routes from './routes';

/**
 * We have to use react-navigation and react-navigation-stack for native platforms
 */
const Navigator = createStackNavigator(routes, {
  initialRouteName: 'home',
  headerMode: 'none',
  animationEnabled: false,
  gestureEnabled: false
});
const Router = createAppContainer(Navigator);

class App extends AbstractApp {
  showRouter() {
    return <Router
      ref={ref => this.navigator = ref}
      screenProps={this.getScreenProps()}
    />
  }
}

export default App;