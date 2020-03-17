import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TVEventHandler,
} from 'react-native';
import Style from "../Style";

class EventsDemo extends Component {

  static EVENT_LINES = 8;

  constructor(props) {
    super(props);
    // Init
    this.tvEventHandler = null;
    // Init state
    this.state = {
      handlerStatus: 'disabled',
      tvEventStack: [],
      componentEventStack: [],
    };
  }

  tvEventListener(component, event) {
    console.log("tvEventListener:", event.eventType);
    // Get event stack
    let tvEventStack = this.state.tvEventStack;
    if(tvEventStack.length >= EventsDemo.EVENT_LINES) {
      tvEventStack.shift();
    }
    tvEventStack.push(JSON.stringify(event));
    this.setState({
      tvEventStack: tvEventStack
    });
  }

  componentEventListener(event) {
    if(!event.eventType) {
      return;
    }
    console.log("componentEventListener:", event.eventType);
    // Get event stack
    let componentEventStack = this.state.componentEventStack;
    if(componentEventStack.length >= EventsDemo.EVENT_LINES) {
      componentEventStack.shift();
    }
    componentEventStack.push(JSON.stringify(event));
    this.setState({
      componentEventStack: componentEventStack
    });
  }

  componentDidMount() {
    this.setState({
      handlerStatus: 'enabled'
    });
    this.tvEventHandler = new TVEventHandler();
    this.tvEventHandler.enable(
      this, this.tvEventListener.bind(this)
    );
  }

  componentWillUnmount() {
    if (this.tvEventHandler) {
      this.tvEventHandler.disable();
      delete this.tvEventHandler;
    }
    this.setState({
      handlerStatus: 'disabled',
      tvEventStack: [],
      componentEventStack: [],
    });
  }

  render() {
    return (
      <View style={Style.styles.right}>
        <View style={Style.styles.header}>
          <Text style={Style.styles.headerText}>{"Events Demo"}</Text>
        </View>
        <View style={Style.styles.content}>
          <View style={styles.buttons}>
            <TouchableHighlight
              onPress={this.componentEventListener.bind(this)}
              onFocus={this.componentEventListener.bind(this)}
              onBlur={this.componentEventListener.bind(this)}
              nativeID={'left_button'}
              style={styles.button}
              underlayColor={Style.buttonFocusedColor}>
              <Text style={styles.buttonText}>{"Left Button"}</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.componentEventListener.bind(this)}
              onFocus={this.componentEventListener.bind(this)}
              onBlur={this.componentEventListener.bind(this)}
              nativeID={'middle_button'}
              style={styles.button}
              hasTVPreferredFocus={true}
              underlayColor={Style.buttonFocusedColor}>
              <Text style={styles.buttonText}>{"Middle Button"}</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.componentEventListener.bind(this)}
              onFocus={this.componentEventListener.bind(this)}
              onBlur={this.componentEventListener.bind(this)}
              nativeID={'right_button'}
              style={styles.button}
              underlayColor={Style.buttonFocusedColor}>
              <Text style={styles.buttonText}>{"Right Button"}</Text>
            </TouchableHighlight>
          </View>
          <Text style={[styles.eventHeader, styles.tvEventHeader]}>TVEventHandler events</Text>
          <Text style={styles.eventType} numberOfLines={EventsDemo.EVENT_LINES}>
            {this.state.tvEventStack.join("\n")}
          </Text>
          <Text style={styles.eventHeader}>TouchableHighlight events</Text>
          <Text style={styles.eventType} numberOfLines={EventsDemo.EVENT_LINES}>
            {this.state.componentEventStack.join("\n")}
          </Text>
        </View>
      </View>
    );
  }
}

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
