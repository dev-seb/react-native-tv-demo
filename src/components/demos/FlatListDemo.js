import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Platform,
  findNodeHandle,
} from 'react-native';
import Style from '../../styles/Style';
import FocusableHighlight from '../focusable/FocusableHighlight';

const COLS = 5;
const ROWS = 15;

const FlatListDemo = () => {
  const flatListRef = useRef();

  useEffect(() => {
    if (Platform.OS === 'web' && flatListRef.current) {
      let node = findNodeHandle(flatListRef.current);
      if (node) {
        // Set FlatList spatial navigation action as focus to avoid scroll on up
        node.style.setProperty('--spatial-navigation-action', 'focus');
      }
    }
  }, []);

  function onItemFocus(e, item) {
    // Get row
    const row = Math.floor(item.index / COLS);
    // Get styles
    const rowsStyle = StyleSheet.flatten(styles.rows);
    const rowItemStyle = StyleSheet.flatten(styles.rowItem);
    // Get rows width / height
    const rowsHeight = rowsStyle.height;
    // Get item width / height
    const itemHeight = rowItemStyle.height + rowItemStyle.margin * 2;
    // Get vertical offset for current row in rows
    const itemTopOffset = itemHeight * row;
    // Scroll vertically to current row
    const rowsHeightHalf = rowsHeight / 2;
    if (itemTopOffset >= rowsHeightHalf - itemHeight) {
      flatListRef.current.scrollToOffset({
        offset: itemTopOffset,
        animated: true,
      });
    } else {
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
  }

  function renderItem(item) {
    const flatListItem = item.item;
    const key = 'flatlist_item_' + flatListItem.index;
    return (
      <FocusableHighlight
        onPress={() => {}}
        onFocus={(e) => {
          onItemFocus(e, item);
        }}
        underlayColor={Style.buttonFocusedColor}
        style={styles.rowItem}
        nativeID={key}
        key={key}>
        <Text style={styles.text}>{flatListItem.index}</Text>
      </FocusableHighlight>
    );
  }

  function getData() {
    // Load data
    let data = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      data.push({index: i});
    }
    return data;
  }

  // Get row item height
  const rowItemStyle = StyleSheet.flatten(styles.rowItem);
  const rowItemHeight = rowItemStyle.height;

  // Render
  return (
    <View style={Style.styles.content}>
      <FlatList
        ref={flatListRef}
        style={styles.rows}
        nativeID={'flatlist'}
        data={getData()}
        renderItem={renderItem}
        numColumns={COLS}
        keyExtractor={(item) => item.index}
        getItemLayout={(data, index) => {
          return {length: rowItemHeight, offset: rowItemHeight * index, index};
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rows: {
    width: Style.px(1520),
    height: Style.px(780),
  },
  rowItem: {
    width: Style.px(284),
    height: Style.px(240),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Style.px(40),
  },
});

export default FlatListDemo;
