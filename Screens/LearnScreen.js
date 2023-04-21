import React, { useState,useContext } from "react";
import { View, StatusBar,StyleSheet, Image, Text, TouchableOpacity, FlatList } from "react-native";
import { AppContext, Footer, MyAlert, UserHeader } from "../Components";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";

const LearnScreen = (props) => {

  const { activationContext,warningAlert,
    setWarningAlert} = useContext(AppContext);


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#793DFD" />
      <UserHeader {...props} />
      <View style={{ flex: 5 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => props.navigation.navigate('GuideScreen')} style={styles.touchableOpacity}>
            <Text style={styles.touchableText}> راهنمای اپلیکیشن</Text>
            <FontAwesome style={{width: normalize(45)}} name={'info-circle'} color={'#793DFD'} size={normalize(45)} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate('Questions')} style={styles.touchableOpacity}>
            <Text style={styles.touchableText}> سوالات متداول</Text>
            <FontAwesome style={{width: normalize(45)}} name={'question-circle'} color={'#793DFD'} size={normalize(45)} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            if (activationContext !== true) {
             setWarningAlert()
            } else {
              props.navigation.navigate("MahsaOnlineLearns");
            }
          }} style={styles.touchableOpacity}>
            <Text style={styles.touchableText}> آموزش های مهسا آنلاین</Text>
            <FontAwesome style={{width: normalize(50), paddingTop: normalize(5)}} name={'cubes'} color={'#793DFD'} size={normalize(40)} />
          </TouchableOpacity>
        </View>

      </View>
      <MyAlert visible={warningAlert}
               title={"خطای دسترسی"}
               message={"متاسفانه دوره فعالی نداری"}
               type={'warning'}
               buttonOnPress={() => setWarningAlert()}/>
      {
        activationContext ? (<Footer />) : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal:normalize(20),
    backgroundColor:'#793DFD',
    borderRadius:normalize(20),
    padding:normalize(10),
    alignItems:'center'
  },
  touchableOpacity:{
    width:'90%',
    flexDirection:'row',
    height:normalize(100),
    borderRadius: normalize(30),
    alignItems: 'center',
    justifyContent:'space-evenly',
    margin:normalize(20),
    backgroundColor:'#fff'
  },
  text:{
    fontSize: RFValue(25),
    marginBottom:normalize(20),
    alignSelf: "center",
    fontFamily: "B Kamran Bold"
  },
  touchableText:{
    fontSize:RFValue(25),
    color:'black',
    fontFamily:'B Kamran Bold'
  }
})

export { LearnScreen };
