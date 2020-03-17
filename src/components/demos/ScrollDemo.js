import React, {Component} from 'react';
import {
  Platform,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  findNodeHandle
} from 'react-native';
import Style from "../Style";

class ScrollDemo extends Component {

  constructor(props) {
    super(props);
    // Bind functions
    this.onItemFocus = this.onItemFocus.bind(this);
    // Init refs
    this.rowsRef = React.createRef();
    this.rowRefs = [];
  }

  componentDidMount() {
    if(Platform.OS === "web") {
      // Set row spatial navigation action as focus to avoid scroll on up
      for (let i = 0; i < this.rowRefs.length; i++) {
        const rowRef = this.rowRefs[i];
        if (rowRef) {
          let node = findNodeHandle(rowRef);
          if (node) {
            node.style.setProperty('--spatial-navigation-action', 'focus');
          }
        }
      }
    }
  }

  onItemFocus(e, row, item) {
    if(row > 0 && row < this.rowRefs.length) {
      // Check refs
      const rowRef = this.rowRefs[row];
      if (!rowRef || !this.rowsRef) {
        return;
      }
      // Get styles
      const rowsStyle = StyleSheet.flatten(styles.rows);
      const rowItemStyle = StyleSheet.flatten(styles.rowItem);
      // Get rows width / height
      const rowsWidth = rowsStyle.width;
      const rowsHeight = rowsStyle.height;
      // Get item width / height
      const itemWidth = rowItemStyle.width + rowItemStyle.margin * 2;
      const itemHeight = rowItemStyle.height + rowItemStyle.margin * 2;
      // Get horizontal offset for current item in current row
      const itemLeftOffset = itemWidth * (item - 1);
      // Get vertical offset for current row in rows
      const itemTopOffset = itemHeight * (row - 1);
      // Center item horizontally in row
      const rowsWidthHalf = rowsWidth / 2;
      if (itemLeftOffset >= rowsWidthHalf) {
        const x = itemLeftOffset - rowsWidthHalf + itemWidth / 2;
        rowRef.scrollTo({x: x, animated: true});
      }
      else {
        rowRef.scrollTo({x: 0, animated: true});
      }
      // Scroll vertically to current row
      const rowsHeightHalf = rowsHeight / 2;
      if (itemTopOffset >= rowsHeightHalf - itemHeight) {
        const y = itemTopOffset;
        this.rowsRef.scrollTo({y: y, animated: true});
      }
      else {
        this.rowsRef.scrollTo({y: 0, animated: true});
      }
    }
  }

  showItems(row) {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    return items.map((item) => {
      const key = 'item_' + row + '.' + item;
      return (
        <TouchableHighlight
          onPress={()=>{}}
          onFocus={(e)=>{this.onItemFocus(e, row, item)}}
          underlayColor={Style.buttonFocusedColor}
          style={styles.rowItem}
          nativeID={key}
          key={key}>
          <Text style={styles.text}>{row + '.' + item}</Text>
        </TouchableHighlight>
      );
    });
  }

  showRow(row) {
    return (
      <ScrollView
        ref={ref => this.rowRefs[row] = ref}
        style={styles.row}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        nativeID={'row_' + row}
        key={'row_' + row}>
        {this.showItems(row)}
      </ScrollView>
    )
  }

  showRows() {
    const rows = [1, 2, 3, 4, 5];
    return rows.map((row) => {
      return this.showRow(row);
    });
  }

  render() {
    return (
      <View style={Style.styles.right}>
        <View style={Style.styles.header}>
          <Text style={Style.styles.headerText}>{"Scroll Demo"}</Text>
        </View>
        <View style={Style.styles.content}>
        <ScrollView
          ref={ref => this.rowsRef = ref}
          style={styles.rows}
          nativeID={"rows"}
          showsVerticalScrollIndicator={false}>
          {this.showRows()}
        </ScrollView>
        </View>
      </View>
    );
  }
}

export default ScrollDemo;

const styles = StyleSheet.create({
  rows: {
    width: Style.px(1520),
    height: Style.px(780),
  },
  row: {
    width: '100%',
    height: Style.px(260),
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
  }
});