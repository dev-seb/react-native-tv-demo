import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TVEventHandler,
  BackHandler,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Style from '../../styles/Style';
import FocusableHighlight from '../focusable/FocusableHighlight';

const EVENT_LINES = 8;

const EventsDemo = () => {
  const [tvEventStack, setTvEventStack] = useState([]);
  const [componentEventStack, setComponentEventStack] = useState([]);

  useFocusEffect(
    useCallback(() => {
      // Listen to back button
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backEventListener,
      );
      // Enabled TVEventHandler
      const tvEventHandler = new TVEventHandler();
      tvEventHandler.enable(null, tvEventListener);
      // Clean up
      return () => {
        // Remove BackHandler
        backHandler.remove();
        // Disable TVEventHandler
        tvEventHandler.disable();
      };
    }, []),
  );

  function backEventListener(event) {
    // Just add some logs here as navigation will change screen
    console.log('backEventListener received hardwareBackPress event');
    console.log(JSON.stringify(event));
  }

  function tvEventListener(component, event) {
    //console.log('tvEventListener:', event.eventType);
    setTvEventStack((oldTvEventStack) =>
      [...oldTvEventStack, JSON.stringify(event)].slice(EVENT_LINES * -1),
    );
  }

  function componentEventListener(event) {
    if (!event.eventType) {
      return;
    }
    //console.log('componentEventListener:', event.eventType);
    setComponentEventStack((oldComponentEventStack) =>
      [...oldComponentEventStack, JSON.stringify(event)].slice(
        EVENT_LINES * -1,
      ),
    );
  }

  return (
    <View style={Style.styles.right}>
      <View style={Style.styles.header}>
        <Text style={Style.styles.headerText}>{'Events Demo'}</Text>
      </View>
      <View style={Style.styles.content}>
        <View style={styles.buttons}>
          <FocusableHighlight
            nativeID={'events_left_button'}
            onPress={componentEventListener}
            onFocus={componentEventListener}
            onBlur={componentEventListener}
            style={styles.button}
            underlayColor={Style.buttonFocusedColor}>
            <Text style={styles.buttonText}>{'Left Button'}</Text>
          </FocusableHighlight>
          <FocusableHighlight
            nativeID={'events_middle_button'}
            onPress={componentEventListener}
            onFocus={componentEventListener}
            onBlur={componentEventListener}
            style={styles.button}
            hasTVPreferredFocus={true}
            underlayColor={Style.buttonFocusedColor}>
            <Text style={styles.buttonText}>{'Middle Button'}</Text>
          </FocusableHighlight>
          <FocusableHighlight
            nativeID={'events_right_button'}
            onPress={componentEventListener}
            onFocus={componentEventListener}
            onBlur={componentEventListener}
            style={styles.button}
            underlayColor={Style.buttonFocusedColor}>
            <Text style={styles.buttonText}>{'Right Button'}</Text>
          </FocusableHighlight>
        </View>
        <Text style={[styles.eventHeader, styles.tvEventHeader]}>
          TVEventHandler events
        </Text>
        <Text style={styles.eventType} numberOfLines={EventsDemo.EVENT_LINES}>
          {tvEventStack.join('\n')}
        </Text>
        <Text style={styles.eventHeader}>TouchableHighlight events</Text>
        <Text style={styles.eventType} numberOfLines={EventsDemo.EVENT_LINES}>
          {componentEventStack.join('\n')}
        </Text>
      </View>
    </View>
  );
};

export default EventsDemo;

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: Style.px(200),
    height: Style.px(100),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Style.px(30),
  },
  eventHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: Style.px(30),
    color: 'white',
  },
  tvEventHeader: {
    marginTop: Style.px(60),
  },
  eventType: {
    flex: 6,
    fontSize: Style.px(20),
    color: 'white',
  },
});
