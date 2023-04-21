import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import normalize from "react-native-normalize";

const UserHeader = (props) => {
  return (
    <View style={{flex:1, zIndex:999999}}>
      <View style={{alignItems: "center" }}>
        <View style={styles.OvalShapeView} />
      </View>
      <TouchableOpacity onPress={() => props.navigation.goBack()}
                        style={{ position: "absolute", marginTop: 0, marginLeft: 5 }}>
        <MaterialIcons name={"arrow-back"} color={"#fff"} size={normalize(40)} />
      </TouchableOpacity>
    </View>
  );
};
export { UserHeader };

const styles = StyleSheet.create({
  OvalShapeView: {
    bottom: normalize(210),
    width: normalize(280),
    height: normalize(280),
    backgroundColor: "#793DFD",
    borderRadius: 200,
    transform: [
      { scaleX: 2 },
    ],
  },
});
