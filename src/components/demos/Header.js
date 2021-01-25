import React from 'react';
import {View, Text} from 'react-native';
import Style from '../../styles/Style';

const Header = ({title}) => {
  return (
    <View style={Style.styles.header}>
      <Text style={Style.styles.headerText}>{title}</Text>
    </View>
  );
};

export default Header;
