import {Platform, PixelRatio, StyleSheet} from 'react-native';

// Get pixel ratio
let pixelRatio = PixelRatio.get();
if (Platform.OS === 'web') {
  pixelRatio = 1;
}

// Screen height
let height = 1080;

const Style = {
  backgroundColor: '#282c34',
  modalBackgroundColor: '#444c58',
  buttonUnfocusedColor: '#61dafb',
  buttonFocusedColor: '#fff',
  buttonPressedColor: '#ccc',
  px: (size) => {
    return Math.round((size * (height / 1080)) / pixelRatio);
  },
};

Style.styles = StyleSheet.create({
  right: {
    backgroundColor: Style.backgroundColor,
    width: Style.px(1520),
    height: Style.px(1080),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: Style.px(1520),
    height: Style.px(300),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: Style.px(30),
    color: 'white',
  },
  content: {
    width: Style.px(1520),
    height: Style.px(780),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Style;
