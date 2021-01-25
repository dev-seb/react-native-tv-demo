import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import reactLogoImageSource from '../../assets/react_logo.png';
import useStateRef from '../../hooks/useStateRef';
import Style from '../../styles/Style';
import FocusableHighlight from '../focusable/FocusableHighlight';
import FocusableOpacity from '../focusable/FocusableOpacity';
import FocusableButton from '../focusable/FocusableButton';
import FocusableSwitch from '../focusable/FocusableSwitch';

const ComponentsDemo = () => {
  const inputTextRef = useRef(null);
  const showModalButtonRef = useRef(null);
  const hideModalButtonRef = useRef(null);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [modalVisibleRef, isModalVisible, setModalVisible] = useStateRef(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Prevent react navigation to handle back button is modal is visible
      return navigation.addListener('beforeRemove', (e) => {
        if (isModalVisible()) {
          e.preventDefault();
        }
      });
    }
  }, []);

  return (
    <View style={Style.styles.right}>
      <View style={Style.styles.header}>
        <Text style={Style.styles.headerText}>{'Core Components Demo'}</Text>
      </View>
      <View style={Style.styles.content}>
        <ScrollView style={styles.scrollview}>
          <View style={styles.component}>
            <Text style={styles.text}>TouchableHighlight</Text>
            <View style={styles.container}>
              <View style={[styles.container, styles.horizontal]}>
                <FocusableHighlight
                  nativeID={'component_touchable_highlight'}
                  onPress={() => {}}
                  style={styles.button}
                  underlayColor={Style.buttonUnfocusedColor}
                  styleFocused={{backgroundColor: Style.buttonFocusedColor}}
                  stylePressed={{backgroundColor: Style.buttonPressedColor}}>
                  <Text style={styles.buttonText}>TouchableHighlight</Text>
                </FocusableHighlight>
              </View>
            </View>
          </View>
          <View style={styles.component}>
            <Text style={styles.text}>TouchableOpacity</Text>
            <View style={styles.container}>
              <View style={[styles.container, styles.horizontal]}>
                <FocusableOpacity
                  nativeID={'component_touchable_opacity'}
                  onPress={() => {}}
                  style={styles.button}
                  underlayColor={Style.buttonUnfocusedColor}
                  styleFocused={{backgroundColor: Style.buttonFocusedColor}}
                  stylePressed={{backgroundColor: Style.buttonPressedColor}}>
                  <Text style={styles.buttonText}>TouchableOpacity</Text>
                </FocusableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.component}>
            <Text style={styles.text}>Button</Text>
            <View style={styles.container}>
              <View style={[styles.container, styles.horizontal]}>
                <FocusableButton
                  nativeID={'component_button'}
                  onPress={() => {}}
                  title={'Button'}
                  color={Style.buttonUnfocusedColor}
                  colorFocused={Style.buttonFocusedColor}
                  colorPressed={Style.buttonPressedColor}
                />
              </View>
            </View>
          </View>
          <View style={styles.component}>
            <Text style={styles.text}>Switch</Text>
            <View style={styles.container}>
              <View style={[styles.container, styles.horizontal]}>
                <FocusableSwitch
                  nativeID={'component_switch'}
                  color={Style.buttonUnfocusedColor}
                  colorFocused={Style.buttonFocusedColor}
                  colorPressed={Style.buttonPressedColor}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
            </View>
          </View>
          <View style={styles.component}>
            <Text style={styles.text}>Modal</Text>
            <View style={styles.container}>
              <View style={[styles.container, styles.horizontal]}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisibleRef.current}
                  onShow={() => {
                    console.log('Modal.onShow()');
                    // No way to focus the hide button on AndroidTv
                  }}
                  onDismiss={() => {
                    console.log('Modal.onDismiss()');
                    // Required for web
                    if (Platform.OS === 'web') {
                      // Force focus on previous button
                      if (showModalButtonRef) {
                        showModalButtonRef.current.focus();
                      }
                    }
                  }}
                  onRequestClose={() => {
                    console.log('Modal.onRequestClose()');
                    setModalVisible(false);
                  }}
                  style={styles.modal}>
                  <View style={styles.modalCenteredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Modal Text</Text>
                      <FocusableHighlight
                        ref={hideModalButtonRef}
                        nativeID={'component_hide_modal_button'}
                        focusable={modalVisibleRef.current}
                        hasTVPreferredFocus={modalVisibleRef.current}
                        onPress={() => {
                          setModalVisible(false);
                        }}
                        style={styles.modalOpenButton}
                        underlayColor={Style.buttonUnfocusedColor}
                        styleFocused={{
                          backgroundColor: Style.buttonFocusedColor,
                        }}
                        stylePressed={{
                          backgroundColor: Style.buttonPressedColor,
                        }}>
                        <Text style={styles.buttonText}>Hide Modal</Text>
                      </FocusableHighlight>
                    </View>
                  </View>
                </Modal>
                <FocusableHighlight
                  ref={showModalButtonRef}
                  nativeID={'component_show_modal_button'}
                  onPress={() => {
                    setModalVisible(true);
                  }}
                  style={styles.modalOpenButton}
                  underlayColor={Style.buttonUnfocusedColor}
                  styleFocused={{backgroundColor: Style.buttonFocusedColor}}
                  stylePressed={{backgroundColor: Style.buttonPressedColor}}>
                  <Text style={styles.buttonText}>Show Modal</Text>
                </FocusableHighlight>
              </View>
            </View>
          </View>
          <View style={styles.component}>
            <Text style={styles.text}>TextInput</Text>
            <View style={styles.container}>
              <View style={[styles.container, styles.horizontal]}>
                <TextInput
                  ref={inputTextRef}
                  nativeID={'component_text_input'}
                  placeholder={'TextInput'}
                  placeholderTextColor={'gray'}
                  clearButtonMode={'always'}
                  autoCorrect={false}
                  autoFocus={false}
                  style={styles.textInput}
                />
                {Platform.OS === 'android' && (
                  <FocusableHighlight
                    onPress={() => {}}
                    onFocus={() => {
                      if (inputTextRef.current) {
                        inputTextRef.current.focus();
                      }
                    }}
                    style={styles.dummyButton}>
                    <Text />
                  </FocusableHighlight>
                )}
              </View>
            </View>
          </View>
          <View style={styles.component}>
            <Text style={styles.text}>ActivityIndicator</Text>
            <View style={styles.container}>
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator
                  size="large"
                  color={Style.buttonUnfocusedColor}
                />
              </View>
            </View>
          </View>
          <View style={styles.component}>
            <Text style={styles.text}>Image</Text>
            <View style={styles.container}>
              <View style={[styles.container, styles.horizontal]}>
                <Image style={styles.image} source={reactLogoImageSource} />
              </View>
            </View>
          </View>
          <View style={styles.component}>
            <Text style={styles.text}>Image Background</Text>
            <View style={styles.container}>
              <View style={[styles.container, styles.horizontal]}>
                <ImageBackground
                  source={reactLogoImageSource}
                  style={styles.imageBackground}>
                  <Text style={styles.imageBackgroundText}>Text</Text>
                </ImageBackground>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ComponentsDemo;

const styles = StyleSheet.create({
  scrollview: {
    width: Style.px(1520),
    height: Style.px(780),
  },
  component: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: Style.px(200),
    fontSize: Style.px(20),
    color: 'white',
  },
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Style.px(10),
  },
  button: {
    width: Style.px(300),
    height: Style.px(50),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Style.px(20),
  },
  modal: {},
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: Style.px(500),
    height: Style.px(300),
    margin: 20,
    backgroundColor: Style.modalBackgroundColor,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOpenButton: {
    backgroundColor: Style.buttonUnfocusedColor,
    borderRadius: Style.px(20),
    padding: Style.px(10),
    elevation: Style.px(2),
  },
  modalText: {
    height: Style.px(130),
    fontSize: Style.px(30),
    color: 'white',
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: 'white',
    width: Style.px(300),
    height: Style.px(50),
    padding: Style.px(10),
    fontSize: Style.px(20),
    justifyContent: 'center',
  },
  dummyButton: {
    position: 'absolute',
    width: Style.px(20),
    height: Style.px(20),
    backgroundColor: 'transparent',
  },
  image: {
    width: Style.px(50),
    height: Style.px(50),
    resizeMode: 'contain',
  },
  imageBackground: {
    margin: Style.px(30),
    width: Style.px(80),
    height: Style.px(40),
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  imageBackgroundText: {
    width: Style.px(80),
    fontSize: Style.px(20),
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000a0',
  },
});
