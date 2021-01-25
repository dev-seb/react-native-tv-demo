import React, {useState, forwardRef} from 'react';
import {Switch} from 'react-native';

const FocusableSwitch = forwardRef((props, ref) => {
  const [focused, setFocused] = useState(false);

  let color = props.color;
  if (focused && props.colorFocused) {
    color = props.colorFocused;
  }

  return (
    <Switch
      {...props}
      ref={ref}
      onKeyDown={(event) => {
        console.log(event.key);
        if (event.key && event.key === 'Enter') {
          if (props.onValueChange) {
            props.onValueChange();
          }
        }
      }}
      onFocus={(event) => {
        console.log('focus: ' + props.nativeID);
        setFocused(true);
        if (props.onFocus) {
          props.onFocus(event);
        }
      }}
      onBlur={(event) => {
        setFocused(false);
        if (props.onBlur) {
          props.onBlur(event);
        }
      }}
      trackColor={{true: color, false: color}}
      thumbColor={color}
    />
  );
});

export default FocusableSwitch;
