import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { AppContext } from "./AppContext";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";

const MyAlert = ({ type, title, message, visible, buttonOnPress }) => {

  const {
    warningAlert, successAlert, subAlert,
    errorAlert, wifiAlert, buyTimeAlert,
    reportAlert, chatTimeAlert, courseAlert } = useContext(AppContext)

  let image = type === 'warning' ? require('../assets/images/Warning.png') :
    type === 'success' ? require('../assets/images/Success.png') :
      type === 'error' ? require('../assets/images/Error.png') :
        type === 'wifi' ? require('../assets/images/Wifi.png') : null

  let buttonColor = type === 'warning' ? '#FFD200' :
    type === 'success' ? '#13FF56' :
      type === 'error' ? '#FF8A8B' :
        type === 'wifi' ? '#55F89B' : null

  let modalVisible = visible === warningAlert ? warningAlert :
    visible === errorAlert ? errorAlert :
      visible === buyTimeAlert ? buyTimeAlert :
        visible === wifiAlert ? wifiAlert :
          visible === subAlert ? subAlert :
            visible === courseAlert ? courseAlert :
              visible === chatTimeAlert ? chatTimeAlert :
                visible === reportAlert ? reportAlert :
                  visible === successAlert ? successAlert : null
  return (
    <Modal visible={modalVisible} animationType={"fade"} transparent>
      <View style={{ flex: 1 }}>
        <Pressable style={styles.background} />
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={{ flex: 1 }}>
              <Image source={image} style={{ width: 120, height: 120 }} resizeMode={'stretch'} />
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.bodyText}>{message}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={buttonOnPress}
                style={[styles.touchable, { backgroundColor: buttonColor }]}>
                <Text style={styles.touchableText}> باشه</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#4e4e4e",
    opacity: 0.8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  contentContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: normalize(25),
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    height: "50%",
    borderRadius: normalize(30),
  },
  title: {
    fontSize: RFValue(25),
    color: "black",
    fontFamily: "B Kamran Bold",
  },
  touchable: {
    borderRadius: normalize(30),
    elevation: 5,
    width: normalize(110),
    marginTop: normalize(20),
    height: normalize(40),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyText: {
    fontSize: RFValue(18),
    color: "black",
    fontFamily: "B Kamran Bold"
  },
  touchableText: {
    fontSize: RFValue(25),
    textAlign: "center",
    fontFamily: "B Kamran Bold",
    color: "#ffffff",
  }
})

export { MyAlert }
