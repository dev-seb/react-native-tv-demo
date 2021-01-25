import React, {useState, forwardRef} from 'react';
import {Button} from 'react-native';

const FocusableButton = forwardRef((props, ref) => {
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  let color = props.color;
  if (focused && props.colorFocused) {
    color = props.colorFocused;
  } else if (pressed && props.colorPressed) {
    color = props.colorPressed;
  }

  return (
    <Button
      {...props}
      ref={ref}
      onPress={(event) => {
        if (event.eventKeyAction !== undefined) {
          setPressed(parseInt(event.eventKeyAction) === 0);
          if (props.onPress) {
            props.onPress(event);
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
      color={color}
    />
  );
});

export default FocusableButton;
