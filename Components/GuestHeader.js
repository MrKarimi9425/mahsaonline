import React from "react";
import {
  View,
  StyleSheet } from "react-native";
import normalize from "react-native-normalize";

const GuestHeader = (props) => {
  return (
    <View style={{flex:1,backgroundColor: '#fff'}}>
      <View style={{alignItems: "center" }}>
        <View style={styles.OvalShapeView} />
      </View>
    </View>
  );
};
export { GuestHeader };

const styles = StyleSheet.create({
  OvalShapeView: {
    bottom: normalize(240),
    width: normalize(280),
    height: normalize(280),
    backgroundColor: "#793DFD",
    borderRadius: 200,
    transform: [
      { scaleX: 2 },
    ],
  },
});
