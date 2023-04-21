import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image, ImageBackground, Pressable,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
  Animated, StatusBar, Modal,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { Formik } from "formik";
import * as yup from "yup";
import { Api, AppContext, GuestHeader, MyAlert } from "../Components";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";

const validationSchema = yup.object().shape({
  firstName: yup.string()
    .required("اسمت رو وارد کن"),
  lastName: yup.string()
    .required("فامیلیت رو وارد کن"),
});

const SignUpScreen = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastname, setLastname] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const { phoneNumberContext,wifiAlert,
    setWifiAlert,
    warningAlert,
    setWarningAlert} = useContext(AppContext);


  const setApi = () => {
    try {
      setIsLoading(true)
      fetch(Api+"register/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: firstName,
          lastname: lastname,
          mobile: phoneNumberContext,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setIsLoading(false)
          if (json.signup === true) {
            props.navigation.navigate("ActiveCodeScreen");
          } else {
            setMessage(json.message)
            setWarningAlert()
          }
        })
        .catch((error) => {
          setIsLoading(false)
         setWifiAlert()
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (

    <Formik initialValues={{ firstName: "", lastName: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                setApi();
                setSubmitting(false);
            }}>
      {
        ({
           handleChange,
           handleBlur,
           handleSubmit,
           values,
           errors,
           touched,
         }) =>
            <View style={{ flex: 1 ,backgroundColor:'#fff'}}>
              <GuestHeader {...props}/>
              <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                <Text style={styles.text}> نام و نام خانوادگیت رو وارد کن</Text>
              </View>
              <View style={{ flex: 4}}>
                <View style={{ alignItems: "center" }}>
                  <TextInput onChangeText={handleChange("firstName")}
                             onBlur={handleBlur("firstName")}
                             value={values.firstName}
                             onTextInput={() => setFirstName(values.firstName)}
                             placeholder={"نام"}
                             style={styles.textInput} />
                  {(errors.firstName && touched.firstName) &&
                  <Text
                    style={{ fontFamily: "B Kamran Bold", fontSize: 25, color: "#ff0000" }}>{errors.firstName}</Text>
                  }
                  <TextInput onChangeText={handleChange("lastName")}
                             onBlur={handleBlur("lastName")}
                             value={values.lastName}
                             onTextInput={() => setLastname(values.lastName)}
                             placeholder={"نام خانوادگی"}
                             style={styles.textInput} />
                  {(errors.lastName && touched.lastName) &&
                  <Text
                    style={{ fontFamily: "B Kamran Bold", fontSize: RFValue(25), color: "#ff0000" }}>{errors.lastName}</Text>
                  }
                  <TouchableOpacity onPress={handleSubmit} style={styles.touchableOpacity}>
                    <Text style={styles.touchableText}>ثبت نام</Text>
                    <Feather style={{ left: normalize(10) }} name={"arrow-right-circle"} size={normalize(30)} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
              <Modal visible={isLoading} animationType={"none"} transparent>
                <View style={{ flex: 1, justifyContent: "flex-end",
                  alignItems: "center", }}>
                  <View style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#e0e0e0",
                    opacity: 0.5,
                  }}/>
                  <Image
                    source={require("../assets/images/loading-97.gif")}
                    style={{ height: normalize(100), width: normalize(100),}}
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
              <MyAlert visible={warningAlert}
                       title={"مشکلی پیش آمده"}
                       message={message}
                       type={'warning'}
                       buttonOnPress={() => setWarningAlert()}/>
            </View>
      }
    </Formik>

  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    borderRadius: normalize(30),
    elevation: 5,
    width: normalize(120),
    height: normalize(40),
    marginTop: normalize(30),
    backgroundColor: "#793DFD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  touchableText: {
    fontSize: RFValue(20),
    fontFamily: "B Kamran Bold",
    color: "#fff",
  },
  textInput: {
    width: "70%",
    height: normalize(50),
    fontSize: RFValue(20),
    margin: normalize(10),
    color:'black',
    borderWidth: 2,
    backgroundColor: '#fff',
    elevation: 15,
    borderColor: "#793DFD",
    fontFamily: "B Kamran Bold",
    textAlign: "center",
    borderRadius: normalize(15),
  },
  text: {
    color: "black",
    margin: RFValue(25),
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(25),
    textAlign: "center",
  }
});

export { SignUpScreen };
