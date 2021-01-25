import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SectionList,
  Text,
  Platform,
  findNodeHandle,
} from 'react-native';
import Style from '../../styles/Style';
import FocusableHighlight from '../focusable/FocusableHighlight';

const SECTIONS = 15;
const SECTIONS_ROWS = 1;
const ITEMS = 15;

const SectionListDemo = () => {
  const sectionListRef = useRef(null);
  const rowRefs = useRef([]);

  function onItemFocus(e, section, row, item) {
    if (!rowRefs.current) {
      return;
    }
    if (section >= 0 && section < rowRefs.current.length) {
      // Check refs
      const rowRef = rowRefs.current[section];
      if (!rowRef || !sectionListRef) {
        return;
      }
      // Get styles
      const rowsStyle = StyleSheet.flatten(styles.rows);
      const rowItemStyle = StyleSheet.flatten(styles.rowItem);
      const sectionHeader = StyleSheet.flatten(styles.sectionHeader);
      // Get rows width / height
      const rowsWidth = rowsStyle.width;
      const rowsHeight = rowsStyle.height;
      // Get item width / height
      const itemWidth = rowItemStyle.width + rowItemStyle.margin * 2;
      const itemHeight =
        rowItemStyle.height +
        rowItemStyle.margin * 2 +
        sectionHeader.fontSize +
        sectionHeader.marginTop;
      // Get horizontal offset for current item in current row
      const itemLeftOffset = itemWidth * item;
      // Get vertical offset for current row in rows
      const itemTopOffset = itemHeight * section;
      // Center item horizontally in row
      const rowsWidthHalf = rowsWidth / 2;
      if (itemLeftOffset >= rowsWidthHalf) {
        const x = itemLeftOffset - rowsWidthHalf + itemWidth / 2;
        rowRef.scrollTo({x: x, animated: true});
      } else {
        rowRef.scrollTo({x: 0, animated: true});
      }
      // Scroll vertically to current row
      const rowsHeightHalf = rowsHeight / 2;
      if (itemTopOffset >= rowsHeightHalf - itemHeight) {
        sectionListRef.current.scrollToLocation({
          sectionIndex: section,
          itemIndex: 0,
          animated: true,
        });
      } else {
        sectionListRef.current.scrollToLocation({
          sectionIndex: 0,
          itemIndex: 0,
          animated: true,
        });
      }
    }
  }

  function showItems(section, row) {
    const items = Array.from(Array(ITEMS).keys());
    return items.map((item) => {
      const key = 'sectionlist_item_' + section + '.' + row + '.' + item;
      return (
        <FocusableHighlight
          onPress={() => {}}
          onFocus={(e) => {
            onItemFocus(e, section, row, item);
          }}
          underlayColor={Style.buttonFocusedColor}
          style={styles.rowItem}
          nativeID={key}
          key={key}>
          <Text style={styles.text}>{section + '.' + item}</Text>
        </FocusableHighlight>
      );
    });
  }

  function showRow(sectionItem) {
    const item = sectionItem.item;
    const key = 'sectionlist_row_' + item.section + '.' + item.row;
    return (
      <ScrollView
        ref={(ref) => {
          rowRefs.current[item.section] = ref;
          if (Platform.OS === 'web') {
            let node = findNodeHandle(ref);
            if (node) {
              // Set ScrollView spatial navigation action as focus to avoid scroll on up
              node.style.setProperty('--spatial-navigation-action', 'focus');
            }
          }
        }}
        style={styles.row}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        nativeID={key}
        key={key}>
        {showItems(item.section, item.row)}
      </ScrollView>
    );
  }

  function renderSectionHeader(sectionHeader) {
    const section = sectionHeader.section;
    return <Text style={styles.sectionHeader}>{section.title}</Text>;
  }

  function getSections() {
    // Load data
    let sections = [];
    for (let i = 0; i < SECTIONS; i++) {
      let rows = [];
      for (let j = 0; j < SECTIONS_ROWS; j++) {
        rows.push({section: i, row: j});
      }
      sections.push({
        title: 'Section ' + i,
        data: rows,
      });
    }
    return sections;
  }

  // Render
  return (
    <View style={Style.styles.content}>
      <SectionList
        ref={sectionListRef}
        style={styles.rows}
        nativeID={'sectionlist'}
        sections={getSections()}
        renderItem={showRow}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(row) => row.row}
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
  row: {
    width: '100%',
    height: Style.px(200),
  },
  rowItem: {
    width: Style.px(300),
    height: Style.px(200),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    marginTop: Style.px(5),
    marginLeft: Style.px(10),
    color: 'white',
    fontSize: Style.px(40),
  },
  text: {
    fontSize: Style.px(40),
  },
});

export default SectionListDemo;
