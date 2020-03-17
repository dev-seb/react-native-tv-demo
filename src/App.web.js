import React from 'react';
import {createSwitchNavigator} from "@react-navigation/core";
import {createBrowserApp} from "@react-navigation/web";
import AbstractApp from "./AbstractApp";
import routes from './routes';

/**
 * We have to use @react-navigation/web for web platform
 */
const Navigator = createSwitchNavigator(routes);
const Router = createBrowserApp(Navigator);

class App extends AbstractApp {
  showRouter() {
    return <Router
      ref={ref => this.navigator = ref}
      screenProps={this.getScreenProps()}
    />
  }
}

export default App;