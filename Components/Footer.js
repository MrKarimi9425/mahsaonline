import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Linking } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Api } from "./DomainName";
import { AppContext } from "./AppContext";
import { MyAlert } from "./MyAlert";
import normalize from "react-native-normalize";

const Footer = () => {
  const [instagram,setInstagram] = useState("")

  const {wifiAlert,setWifiAlert} = useContext(AppContext)

  useEffect(() => {
    fetch(Api + "config/links", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setInstagram(json.insta_1)
      }).catch(() => {
      setWifiAlert()
    });
  }, []);



  const openUrl = (url) => {
    Linking.openURL(url);
  }

    return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => openUrl(instagram)}>
            <FontAwesome name={"instagram"} size={normalize(45)} color={"#000000"} />
        </TouchableOpacity>
      </View>
      <MyAlert visible={wifiAlert}
               message={"اتصال به اینترنت خود را بررسی کنید"}
               title={"خطای ارتباط با سرور"}
               type={'wifi'}
               buttonOnPress={() => setWifiAlert()}/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: normalize(40),
    backgroundColor: "#793DFD",
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    width: "100%",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  content: {
    width: normalize(60),
    height: normalize(60),
    bottom: normalize(35),
    borderRadius: normalize(60),
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
});
export { Footer };
