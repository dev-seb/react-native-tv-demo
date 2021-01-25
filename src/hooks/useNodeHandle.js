import React, {useState, useEffect} from 'react';
import {findNodeHandle} from 'react-native';

/**
 * Custom hook to get native node handle from ref.
 * This is used in order to have nextFocus* working with react-native-web
 *
 * @param ref
 * @returns {unknown}
 */
const useNodeHandle = (ref) => {
  const [nodeHandle, setNodeHandle] = useState(null);

  useEffect(() => {
    if (ref.current) {
      setNodeHandle(findNodeHandle(ref.current));
    }
  }, [ref.current]);

  return nodeHandle;
};

export default useNodeHandle;
