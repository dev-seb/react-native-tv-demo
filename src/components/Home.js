import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Style from '../styles/Style';

const Home = () => {
  return (
    <View style={Style.styles.right}>
      <View style={Style.styles.header}>
        <Text style={Style.styles.headerText}>{'React Native TV Demos'}</Text>
      </View>
      <View style={Style.styles.content} />
    </View>
  );
};

export default Home;
