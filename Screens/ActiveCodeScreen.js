import React, { useRef, useState, useEffect, useContext } from "react";
import {
  Image, ImageBackground, Pressable,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
  StatusBar,
  ScrollView,
  Animated, Modal,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as yup from "yup";
import { Api, AppContext } from "../Components";
import { MyAlert } from "../Components";
import { RFValue } from "react-native-responsive-fontsize";
import normalize from "react-native-normalize";


const validationSchema = yup.object().shape({
  activeCode: yup.string()
    .required("  کد فعالسازی رو وارد کن"),
});

const ActiveCodeScreen = (props) => {
  const [activeCode, setActiveCode] = useState("");
  const animatedW = useRef(new Animated.Value(normalize(200,"width"))).current;
  const animatedH = useRef(new Animated.Value(normalize(290,"height"))).current;
  const [isLoading,setIsLoading] = useState(false)
  const [message,setMessage] = useState()

  const { phoneNumberContext,
    wifiAlert,
    setWifiAlert,
    errorAlert,
    setErrorAlert } = useContext(AppContext);

  const storeAuth_Key = async (value) => {
    try {
      await AsyncStorage.setItem("auth_Key", value);
    } catch (error) {
      console.error("error ", error);
    }
  };

  const setApi = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(Api+"register/verification", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: phoneNumberContext,
          code: activeCode,
        }),
      });
      await response.json()
        .then(async (json) => {
          setIsLoading(false)
          if (json.login === true) {
            await storeAuth_Key(json.auth_key);
            props.navigation.navigate("Dashboard");
          } else {
           setMessage(json.message)
            setErrorAlert()
          }
        })
        .catch(() => {
          setIsLoading(false)
          setWifiAlert()
        });
    } catch (error) {
      console.error(error);
    }
  };

  const setReSendCodeApi = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(Api+"register/resend_code", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: phoneNumberContext,
        }),
      });
      await response.json()
        .then((json) => {
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
          setWifiAlert()
        });
    } catch (error) {
      console.error(error);
    }
  };


  return (
     <Formik initialValues={{ activeCode: "" }}
             validationSchema={validationSchema}
             onSubmit={(values, { setSubmitting }) => {
               setTimeout(() => {
                 setApi();
                 setSubmitting(false);
               }, 1000);
             }}>
       {
         ({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
           <ImageBackground style={{ flex: 1, backgroundColor:'#fff' }} source={require("../assets/images/LoginBackground.png")}>
             <StatusBar backgroundColor={"#793DFD"} />
             <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
               <Animated.Image source={require("../assets/images/ActiveCodePhoto.png")}
                               style={{width: animatedW, height: animatedH}}
                               resizeMode={"stretch"}
               />
             </View>
             <ScrollView style={{ flex: 1}}>
               <View style={styles.textContainer}>
                 <Text style={styles.text}> رفیق مهسا آنلاینی</Text>
                 <Text style={[styles.text, { top: 10 }]}> حالا باید کدی که برای این شماره</Text>
                 <Text style={styles.text}> ارسال شده رو اینجا وارد کنی</Text>
                 <Text style={[styles.text]}> {phoneNumberContext} </Text>
               </View>
               <View style={{ alignItems: "center" }}>

                 <TextInput onChangeText={handleChange("activeCode")}
                            onBlur={handleBlur("activeCode")}
                            value={values.activeCode}
                            onPressIn={() => {
                              Animated.sequence([
                                Animated.timing(animatedW, {
                                  toValue: normalize(130),
                                  useNativeDriver: false,
                                }).start(),
                                Animated.timing(animatedH, {
                                  toValue: normalize(190),
                                  useNativeDriver: false,
                                }).start(),
                              ]);
                            }}
                            onEndEditing={() => {
                              Animated.sequence([
                                Animated.timing(animatedW, {
                                  toValue: normalize(200),
                                  useNativeDriver: false,
                                }).start(),
                                Animated.timing(animatedH, {
                                  toValue: normalize(290),
                                  useNativeDriver: false,
                                }).start(),
                              ]);
                            }}
                            onTextInput={() => setActiveCode(values.activeCode)}
                            keyboardType={"decimal-pad"}
                            style={styles.textInput} />

                 <View style={{
                   flexDirection: "column",
                   width: "100%",
                   marginTop:10,
                   alignItems: "center", justifyContent: "space-evenly",
                 }}>
                   <TouchableOpacity onPress={handleSubmit} style={styles.touchableOpacity}>
                     <Text style={styles.touchableText}> ورود</Text>
                     <Feather style={{ left: normalize(10)}} name={"arrow-right-circle"} size={normalize(30)} color="#fff" />
                   </TouchableOpacity>
                  <View style={{
                    flexDirection: "row",
                    width: "100%",
                    marginTop:10,
                    alignItems: "center", justifyContent: "space-evenly",
                  }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("LoginScreen")}>
                      <Text style={{color:'black', fontFamily: "B Kamran Bold", fontSize: RFValue(18,650) }}>شماره تلفنت اشتباهه ؟</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setReSendCodeApi()}>
                      <Text style={{color:'black',fontFamily:'B Kamran Bold', fontSize:RFValue(18,650)}}>پیامکی دریافت نکردی؟</Text>
                    </TouchableOpacity>
                  </View>
                 </View>

               </View>
               <Modal visible={isLoading} animationType={"none"} transparent>
                 <View style={{ flex: 1 ,justifyContent:'flex-end',
                   alignItems:'center' }}>
                   <View style={{
                     position: "absolute",
                     width: "100%",
                     height: "100%",
                     backgroundColor:'#e0e0e0',
                     opacity: 0.5,
                   }} />
                   <Image
                     source={require('../assets/images/loading-97.gif')}
                     style={{ height: normalize(100), width: normalize(100)}}
                     resizeMode="contain"
                     resizeMethod="resize"
                   />
                 </View>
               </Modal>

               <MyAlert visible={wifiAlert}
                        message={"اتصال به اینترنت خود را بررسی کنید"}
                        title={"خطای ارتباط با سرور"}
                        type={'wifi'}
                        buttonOnPress={() => setWifiAlert()}/>
               <MyAlert visible={errorAlert}
                        title={" مشکلی پیش آمده"}
                        message={  message}
                        type={'warning'}
                        buttonOnPress={() => setErrorAlert()}/>
             </ScrollView>
           </ImageBackground>
         )
       }
     </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    alignSelf: "center",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  touchableOpacity: {
    borderRadius: 30,
    elevation: 5,
    width: normalize(100),
    height: normalize(40),
    backgroundColor: "#793DFD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  touchableText: {
    bottom: normalize(5),
    fontSize: RFValue(25),
    fontFamily: "B Kamran Bold",
    color: "#fff",
  },
  textInput: {
    width: "70%",
    height: normalize(50,"height"),
    fontSize: RFValue(20,650),
    borderWidth: 3,
    borderColor: "#793DFD",
    // elevation: 5,
    fontFamily: "B Kamran Bold",
    color:'#000000',
    textAlign: "center",
    borderRadius: 15,
    backgroundColor:'#fff'
  },
  text: {
    color: "black",
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(25,650),
    textAlign: "center",
  },
  phoneText: {
    fontSize: 30,
    color: "black",
    fontFamily: "B Kamran Bold",
    marginRight: 15,
  },

});

export { ActiveCodeScreen };
