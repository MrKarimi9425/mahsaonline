import React, { useContext, useEffect, useState } from "react";
import {
  Image, Pressable, StatusBar,
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";

const SplashScreen = (props) => {

  const getItem = async () => {
    let auth_key = await AsyncStorage.getItem("auth_Key")
    if(auth_key !== null){
      props.navigation.navigate("Dashboard");
    } else {
      props.navigation.navigate("firstScreen");
    }
  }

  useEffect(() => {
     setTimeout(() => {
      getItem()
     }, 1000);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#783DFD" }}>

      <StatusBar hidden/>

      <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
        <View style={styles.OvalShapeView}>
          <Image style={{ width: normalize(170), height: normalize(120) }} resizeMode={"stretch"}
                 source={require("../assets/images/MahsaOnlin.png")} />
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center",flexDirection:'column'}}>
        <Text style={{color:'#fff',fontSize:RFValue(15)}}>V 2.1.4</Text>
        <Text style={{color:'#fff',fontSize:RFValue(12)}}>TARH-R-H</Text>
        <ActivityIndicator color={"#fff"} size={"large"} />
      </View>

    </View>

  )
    ;
};

const styles = StyleSheet.create({
  OvalShapeView: {
    width: normalize(300),
    height: normalize(300),
    backgroundColor: "#ffffff",
    borderRadius: normalize(200),
    justifyContent: "center",
    alignItems: "center",
    transform: [
      { scaleX: 1 },
    ],
  },
});

export { SplashScreen };
