import React, {useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Style from '../../styles/Style';
import useNodeHandle from '../../hooks/useNodeHandle';
import FocusableHighlight from '../focusable/FocusableHighlight';

const FocusDemo = () => {
  // Refs
  const topLeftRef = useRef(null);
  const bottomLeftRef = useRef(null);
  const middleLeftRef = useRef(null);

  // Native handles for nextFocus*
  const topLeftHandle = useNodeHandle(topLeftRef);
  const bottomLeftHandle = useNodeHandle(bottomLeftRef);
  const middleLeftHandle = useNodeHandle(middleLeftRef);

  return (
    <View style={Style.styles.right}>
      <View style={Style.styles.header}>
        <Text style={Style.styles.headerText}>{'Focus Demo'}</Text>
      </View>
      <View style={Style.styles.content}>
        <View style={styles.buttons}>
          <FocusableHighlight
            ref={topLeftRef}
            nativeID={'top_left_button'}
            nextFocusDown={bottomLeftHandle}
            onPress={() => {}}
            style={styles.button}
            underlayColor={Style.buttonFocusedColor}>
            <View>
              <Text style={styles.buttonText}>{'Top Left'}</Text>
              <Text style={styles.buttonProps}>
                {'nextFocusDown={Bottom Left}'}
              </Text>
            </View>
          </FocusableHighlight>
          <FocusableHighlight
            nativeID={'top_middle_button'}
            onPress={() => {}}
            style={styles.button}
            styleFocused={styles.buttonFocused}
            underlayColor={Style.buttonFocusedColor}>
            <View>
              <Text style={styles.buttonText}>{'Top Middle'}</Text>
              <Text style={styles.buttonProps}>{'onFocus: change style'}</Text>
            </View>
          </FocusableHighlight>
          <FocusableHighlight
            nativeID={'top_right_button'}
            onPress={() => {}}
            style={styles.button}
            stylePressed={styles.buttonPressed}
            underlayColor={Style.buttonFocusedColor}>
            <View>
              <Text style={styles.buttonText}>{'Top Right'}</Text>
              <Text style={styles.buttonProps}>{'onPress: change style'}</Text>
            </View>
          </FocusableHighlight>
        </View>
        <View style={styles.buttons}>
          <FocusableHighlight
            ref={middleLeftRef}
            nativeID={'middle_left_button'}
            nextFocusLeft={middleLeftHandle}
            onPress={() => {}}
            style={styles.button}
            underlayColor={Style.buttonFocusedColor}>
            <View>
              <Text style={styles.buttonText}>{'Middle Left'}</Text>
              <Text style={styles.buttonProps}>
                {'nextFocusLeft is disabled'}
              </Text>
            </View>
          </FocusableHighlight>
          <FocusableHighlight
            nativeID={'middle_middle_button'}
            onPress={() => {}}
            style={styles.button}
            hasTVPreferredFocus={true}
            underlayColor={Style.buttonFocusedColor}>
            <View>
              <Text style={styles.buttonText}>{'Middle Middle'}</Text>
              <Text style={styles.buttonProps}>
                {'hasTVPreferredFocus={true}'}
              </Text>
            </View>
          </FocusableHighlight>
          <FocusableHighlight
            nativeID={'middle_right_button'}
            onPress={() => {}}
            style={styles.button}
            activeOpacity={0.5}
            underlayColor={Style.buttonFocusedColor}>
            <View>
              <Text style={styles.buttonText}>{'Middle Right'}</Text>
              <Text style={styles.buttonProps}>{'activeOpacity={0.5}'}</Text>
            </View>
          </FocusableHighlight>
        </View>
        <View style={styles.buttons}>
          <FocusableHighlight
            ref={bottomLeftRef}
            nativeID={'bottom_left_button'}
            nextFocusUp={topLeftHandle}
            onPress={() => {}}
            style={styles.button}
            underlayColor={Style.buttonFocusedColor}>
            <View>
              <Text style={styles.buttonText}>{'Bottom Left'}</Text>
              <Text style={styles.buttonProps}>{'nextFocusUp={Top Left}'}</Text>
            </View>
          </FocusableHighlight>
          <FocusableHighlight
            nativeID={'bottom_middle_button'}
            disabled={true}
            focusable={false}
            onPress={() => {}}
            style={styles.button}
            underlayColor={Style.buttonFocusedColor}>
            <View>
              <Text style={styles.buttonText}>{'Bottom Middle'}</Text>
              <Text style={styles.buttonProps}>{'disabled={true}'}</Text>
            </View>
          </FocusableHighlight>
          <FocusableHighlight
            nativeID={'bottom_right_button'}
            onPress={() => {}}
            style={styles.button}
            tvParallaxProperties={{enabled: true}}
            underlayColor={Style.buttonFocusedColor}>
            <View>
              <Text style={styles.buttonText}>{'Bottom Right'}</Text>
              <Text style={styles.buttonProps}>
                {'tvParallaxProperties={{enabled: true}}'}
              </Text>
            </View>
          </FocusableHighlight>
        </View>
      </View>
    </View>
  );
};

export default FocusDemo;

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: Style.px(400),
    height: Style.px(200),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFocused: {
    borderWidth: Style.px(10),
    borderColor: '#eb4034',
  },
  buttonPressed: {
    borderWidth: Style.px(10),
    borderColor: '#34eb5f',
  },
  buttonText: {
    fontSize: Style.px(30),
  },
  buttonProps: {
    fontSize: Style.px(15),
  },
});
