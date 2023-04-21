import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar, Modal, Alert,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import { Formik } from "formik";
import * as yup from "yup";
import { Api, AppContext, GuestHeader, MyAlert } from "../Components";
import normalize from "react-native-normalize/src/index";
import { RFValue } from "react-native-responsive-fontsize";
import { Styles } from "../Components";


const validationSchema = yup.object().shape({
  phoneNumber: yup.string().matches("^(\\+98?)?{?(0?9[0-9]{9,9}}?)$", "شماره تلفنتو اشتباه وارد کردی")
    .required("شماره تلفنت رو وارد کن"),
});

const LoginScreen = (props) => {
  const { phoneNumberContext, setPhoneNumberContext,wifiAlert,
    setWifiAlert } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const setApi = () => {
    setIsLoading(true);
    setTimeout(() => {
      fetch(Api+"register/get_mobile", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: phoneNumberContext,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('json',json)
          setIsLoading(false);
          if (json.auth_key == null) {
            props.navigation.navigate("SignUpScreen");
          } else {
            props.navigation.navigate("ActiveCodeScreen");
          }
        })
        .catch((error) => {
          setIsLoading(false);
      setWifiAlert()
        });
    }, 2000);
  };
  return (
      <Formik initialValues={{ phoneNumber: "" }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                  setApi();
                // alert(JSON.stringify(values,null,2))
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
           }) => (
            <View style={styles.container}>
              <GuestHeader {...props} />
              <StatusBar hidden={false} backgroundColor={"#793DFD"} />
              <View style={{ flex: 3, justifyContent: "center", alignItems: "center" }}>
                <View style={styles.textContainer}>
                  <Text style={styles.text}> رفیق مهسا آنلاینی</Text>
                  <Text style={[styles.text, { top: 10 }]}> حالا باید شماره تلفنت رو وارد کنی</Text>
                  <Text style={styles.text}> تا یه پیامک برات ارسال بشه</Text>
                </View>
              </View>
              <View style={{ flex: 4 }}>
                <View style={{ alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", margin: 5 }}>
                    <Text style={styles.phoneText}> شماره تلفنت رو وارد کن</Text>
                    <Fontisto style={{width:normalize(40),height:normalize(45),paddingVertical:normalize(5)}} name={"phone"} size={normalize(35)} color={"black"} />
                  </View>
                  <TextInput onChangeText={handleChange("phoneNumber")}
                             onTextInput={() => setPhoneNumberContext(values.phoneNumber)}
                             onBlur={handleBlur("phoneNumber")}
                             value={values.phoneNumber}
                             keyboardType={"decimal-pad"}
                             style={styles.textInput} />
                  {(errors.phoneNumber && touched.phoneNumber) &&
                  <Text
                    style={{ fontFamily: "B Kamran Bold", fontSize: RFValue(25), color: "#ff0000" }}>{errors.phoneNumber}</Text>
                  }
                  <TouchableOpacity onPress={handleSubmit} style={Styles.touchableOpacity}>
                    <Text style={Styles.touchableText}> بعدی</Text>
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
                    style={{ height: normalize(100), width: normalize(100) }}
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
            </View>
          )}
      </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textContainer: {
    alignSelf: "center",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },

  textInput: {
    width: "70%",
    height: normalize(50),
    fontSize: RFValue(20),
    borderWidth: normalize(5),
    borderColor: "#793DFD",
    backgroundColor: "#fff",
    elevation: 15,
    color:'black',
    fontFamily: "B Kamran Bold",
    textAlign: "center",
    borderRadius: normalize(15),
  },
  text: {
    color: "black",
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(25),
    textAlign: "center",
  },
  phoneText: {
    fontSize: RFValue(20),
    color: "black",
    fontFamily: "B Kamran Bold",
    marginRight: normalize(15),
  },

});

export { LoginScreen };
