import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal, RefreshControl, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from "react-native";
import { Formik } from "formik";
import normalize from "react-native-normalize";
import { Api, UserHeader, AppContext, Footer, MyAlert } from "../../Components";
import { RFValue } from "react-native-responsive-fontsize";

const IdealWeight = (props) => {
  const [idealWeight,setIdealWeight] = useState()
  const [overweight,setOverweight] = useState()
  const [time,setTime] = useState()

  useEffect(() => {
    let weight = props.route.params.weight;
    let height = props.route.params.height / 100;
    let ideal = Math.round(21.5 *  (Math.pow(height,2)));
    setIdealWeight(ideal)
    setOverweight(weight - ideal)
    console.log('overweight',overweight)
    if (overweight <= 3)
      setTime(1)
    else if (overweight > 3 && overweight <= 6)
      setTime(2)
    else if (overweight > 6 && overweight <= 10)
      setTime(3)
    else if (overweight > 10 && overweight <= 14)
      setTime(4)
    else if (overweight > 14 && overweight <= 17)
      setTime(5)
    else if (overweight > 17 && overweight <= 20)
      setTime(6)
    else if (overweight > 20 && overweight <= 24)
      setTime(7)
    else if (overweight > 24 && overweight <= 29)
      setTime(8)
    else if (overweight > 29 && overweight <= 34)
      setTime(9)
    else if (overweight > 34 && overweight <= 39)
      setTime(10)
    else if (overweight > 39 && overweight <= 44)
      setTime(11)
    else if (overweight > 44 && overweight <= 49)
      setTime(12)
    else if (overweight > 49 && overweight <= 54)
      setTime(13)
    else if (overweight > 54 && overweight <= 59)
      setTime(14)
    else if (overweight > 59 && overweight <= 64)
      setTime(15)
    else if (overweight > 64 && overweight <= 70)
      setTime(16)
    else setTime(16)
  },[overweight])
  return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <UserHeader {...props} />
              <View style={{ flex: 7 }}>
          <ScrollView contentContainerStyle={{paddingBottom:100}}>
            <Text style={{ ...styles.textInputText,textAlign:'center' }}> نتیجه تست اختصاصی شما در مهسا آنلاین</Text>
            <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
              <View style={styles.infoContainer}>
                <Text style={{ ...styles.text,fontSize:23,letterSpacing:-3}}> وزن ایده عال</Text>
                <Text style={styles.text}>{idealWeight}  <Text style={{ ...styles.text,fontSize:25 }}>کیلوگرم</Text></Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={{ ...styles.text,fontSize:23,letterSpacing:-3}}> اضافه وزن</Text>
                <Text style={styles.text}>{overweight}  <Text style={{ ...styles.text,fontSize:25 }}>کیلوگرم</Text></Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={{ ...styles.text,fontSize:23,letterSpacing:-3}}>زمان تقریبی برای رسیدن به وزن ایده عال</Text>
                <Text style={styles.text}>{time}  <Text style={{ ...styles.text,fontSize:30 }}>ماه</Text></Text>
              </View>
              {/*<View></View>*/}
            </View>

            <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(25) }}>
              <View>
                <Text style={{ ...styles.textInputText,textAlign:'center',color:'red',letterSpacing:-3 }}> برنامه غذایی فوف‌العاده توسط تیم متخصص مهساآنلاین</Text>
              </View>

              <TouchableOpacity onPress={() => props.navigation.navigate('SubmitInfo')} style={styles.touchableOpacity}>
                <Text style={{
                  bottom: normalize(5),
                  fontSize: RFValue(25),
                  fontFamily: "B Kamran Bold",
                  color: "#fff",
                }}> دریافت رژیم </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
              </View>
              <Footer />
            </View>

  );
}
const styles = StyleSheet.create({
  touchableOpacity: {
    padding:5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#793DFD",
    borderRadius: normalize(50),
  },
  textInputText: {
    color: "#000000",
    alignSelf: "flex-end",
    marginRight: normalize(10),
    fontSize: RFValue(20),
    fontFamily: "B Kamran Bold",
  },
  infoContainer:{
    width:'70%',backgroundColor:'#793DFD',height:normalize(150),margin:normalize(5),
    justifyContent: 'center',alignItems: 'center',borderRadius: 20
  },
  text:{
    fontSize:35,fontFamily:'B Kamran Bold',color:'#fff'
  }
});

export { IdealWeight };
