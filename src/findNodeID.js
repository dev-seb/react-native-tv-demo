import {
  Platform,
  findNodeHandle
} from 'react-native';

/**
 * Provides a method to get handle ID from ref
 *
 * This is used to add support for nextFocus* as native props
 * and reproduce Android TV expected behaviour
 *
 * @param ref
 * @returns {*}
 */
const findNodeID = (ref) => {
  const node = findNodeHandle(ref);
  if(Platform.OS === 'web') {
    return node.id;
  }
  else {
    return node;
  }
};

export default findNodeID;