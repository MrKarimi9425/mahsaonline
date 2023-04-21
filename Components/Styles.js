import React from "react";
import {StyleSheet} from "react-native";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";

const Styles = StyleSheet.create({
  modalBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#d5d5d5",
    opacity: 0.9,
  },
  modalContainer: {
    flex:1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalContentContainer: {
    backgroundColor: "#793DFD",
    justifyContent: "center",
    alignItems: "center",
    width: normalize(200),
    // borderWidth:2,
    margin:20,
    // borderColor:'#fff',
    height: normalize(200),
    borderRadius: normalize(200),
  },
  routeButton:{
    backgroundColor: "#793DFD",
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column',
    elevation:8,
    width: normalize(130),
    borderWidth:2,
    borderColor:'#fff',
    height: normalize(130),
    borderRadius: normalize(150),
    margin:10
  },
  touchableText: {
    bottom: normalize(5),
    fontSize: RFValue(25),
    fontFamily: "B Kamran Bold",
    color: "#fff",
  },
  touchableOpacity: {
    borderRadius: normalize(30),
    elevation: 5,
    width: normalize(100),
    height: normalize(40),
    marginTop: normalize(30),
    backgroundColor: "#793DFD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneText: {
    fontSize: 30,
    color: "black",
    fontFamily: "B Kamran Bold",
    marginRight: 15,
  },
  routeModalButton:{
    fontFamily:'B Kamran Bold',
    color: "#793DFD",
    fontSize:35,
  },
  learnTouchableContainer:{
    marginHorizontal:20,
    backgroundColor:'#793DFD',
    borderRadius:20,
    padding:10,
    justifyContent: 'center',
    marginBottom:200,
    maxHeight:500
  },
  learnTitleText:{
    fontSize: 30,
    color:'#000000',
    alignSelf: "center",
    fontFamily: "B Kamran Bold"
  },
  learnTouchableOpacity:{
    backgroundColor:'#fff',
    margin:10,
    justifyContent:'space-around',
    alignItems:'center',
    borderRadius:20,
    flexDirection:'row',
    height:50,
  }
})

export {Styles}
