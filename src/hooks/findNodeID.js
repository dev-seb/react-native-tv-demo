import React from 'react';
import {findNodeHandle, Platform} from 'react-native';

/**
 * findNodeHandle() returns a DOM element with react-native-web.
 * This is not convenient to use in some cases as native platforms return a number.
 *
 * We can get usable handle for Web platform using the nativeID prop if set.
 * Using this custom hook we can check the node ID instead of node Handle.
 *
 * @param component
 * @returns {unknown}
 */
const findNodeID = (component) => {
  const handle = findNodeHandle(component);
  if (Platform.OS === 'web') {
    return handle.getAttribute('id');
  } else {
    return handle;
  }
};

export default findNodeID;
