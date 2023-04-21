import React, { useContext, useEffect, useState } from "react";
import {
  Alert, BackHandler,
  Image, Pressable, StatusBar,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { RFValue } from "react-native-responsive-fontsize";
import normalize from "react-native-normalize/src/index";

const firstScreen = (props) => {

  useEffect(() => {
    props.navigation.addListener('beforeRemove',e => {
      e.preventDefault();
      BackHandler.exitApp()
    })
  }, [props.navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#783DFD"} />
      <Image resizeMode={"stretch"} style={{ width: "120%", height: "65%" }}
             source={require("../assets/images/FirstScreenPhoto.png")} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.text, { top: 10 }]}> برو بریم که قراره بترکونیم</Text>
        <Text style={styles.text}>دختر مهسا آنلاینی</Text>
      </View>
      <View style={{ flex: 1, width: "100%", flexDirection: "row-reverse" }}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("LoginScreen")}
          style={styles.touchableOpacity}>
          <Text style={{ bottom: normalize(5), fontSize: RFValue(25), fontFamily: "B Kamran Bold", color: "#000000" }}> بعدی</Text>
          <Feather style={{ left: normalize(10) }} name={"arrow-right-circle"} size={normalize(30)} color="black" />
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#793DFD",
    justifyContent: "space-evenly",
  },
  touchableOpacity: {
    borderRadius: normalize(30),
    elevation: 5,
    width: normalize(100),
    height: normalize(40),
    margin: normalize(20),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(35),
    textAlign: "center",
    color: "#fff",
  },

});

export { firstScreen };
