import React, {useState, useRef} from 'react';

/**
 * Custom hook to handle state with ref.
 * This is convenient to use with DOM callbacks (setTimeout, setInterval)
 */
const useStateRef = (initialState) => {
  const [_state, _setState] = useState(initialState);
  const stateRef = useRef(_state);

  const setState = (newState) => {
    stateRef.current = newState;
    _setState(newState);
  };

  const getState = () => {
    return stateRef.current;
  };

  return [stateRef, getState, setState];
};

export default useStateRef;
