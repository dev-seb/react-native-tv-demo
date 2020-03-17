import {AppRegistry} from 'react-native';
import './spatialNavigationPolyfill.js';
import {name as appName} from '../app.json';
import App from "../src/App";

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('main'),
});
