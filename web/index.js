import {AppRegistry} from 'react-native';
import './spatialNavigationPolyfill.js';
import App from '../src/App';
import {name as appName} from '../app.json';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('main'),
});
