import React, {useState, useEffect} from 'react';
import findNodeID from './findNodeID';

/**
 * @param ref
 * @returns {unknown}
 */
const useNodeID = (ref) => {
  const [nodeID, setNodeID] = useState(null);

  useEffect(() => {
    if (ref.current) {
      setNodeID(findNodeID(ref.current));
    }
  }, [ref.current]);

  return nodeID;
};

export default useNodeID;
