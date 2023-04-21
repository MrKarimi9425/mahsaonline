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
import { Provider as PaperProvider, RadioButton } from "react-native-paper";
import { Api, UserHeader, AppContext, Footer, MyAlert } from "../../Components";
import { RFValue } from "react-native-responsive-fontsize";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  height: yup.string().required("قد نمیتواند خالی باشد"),
  weight: yup.string().required("وزن نمیتواند خالی باشد"),
  age: yup.string().required("سن نمیتواند خالی باشد")
});

const FirstScreen = (props) => {
  const [sex, setSex] = useState(null);
  return (
    <Formik initialValues={{
      height: "",
      weight: "",
      age:""
    }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log({  height:values.height,
                  weight:values.weight});
                props.navigation.navigate('IdealWeight',{
                  height:values.height,
                    weight:values.weight
                  })
                setSubmitting(false);
            }}>
      {
        ({
           handleChange,
           handleBlur,
           handleSubmit,
          errors,
          touched,
           values,
         }) =>
          <PaperProvider>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <UserHeader {...props} />
              <View style={{ flex: 4 }}>
                  <Text style={{ ...styles.textInputText,textAlign:'center' }}> می‌خوای ببینی تا رسیدن به وزن ایده آل چقدر فاصله داری؟ </Text>
                  <RadioButton.Group onValueChange={newValue => setSex(newValue)} value={sex}>
               <View style={{flexDirection:"row",justifyContent:'space-evenly'}}>
                 <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                   <Text style={{ color: "#000" }}>مرد</Text>
                   <RadioButton value={1} />
                 </View>
                 <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                   <Text style={{ color: "#000" }}>زن</Text>
                   <RadioButton value={2} />
                 </View>
               </View>
                  </RadioButton.Group>
                <View style={styles.container}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.textInputContainerOne}>
                      <Text style={styles.textInputText}> وزن</Text>
                      <TextInput
                        onChangeText={handleChange("weight")}
                        keyboardType={"decimal-pad"}
                        onBlur={handleBlur("weight")}
                        value={values.weight}
                        placeholder={"وزن"} style={[styles.textInput, { textAlign: "center", paddingRight: 0 }]} />
                    </View>
                    <View style={styles.textInputContainerOne}>
                      <Text style={styles.textInputText}> قد</Text>
                      <TextInput
                        onChangeText={handleChange("height")}
                        onBlur={handleBlur("height")}
                        keyboardType={"decimal-pad"}
                        value={values.height}
                        placeholder={"قد"} style={[styles.textInput, { textAlign: "center", paddingRight: 0 }]} />
                    </View>
                    <View style={styles.textInputContainerOne}>
                      <Text style={styles.textInputText}> سن</Text>
                      <TextInput
                        onChangeText={handleChange("age")}
                        keyboardType={"decimal-pad"}
                        onBlur={handleBlur("age")}
                        value={values.age}
                        placeholder={"سن"} style={[styles.textInput, { textAlign: "center", paddingRight: 0 }]} />
                    </View>
                  </View>
                </View>
                <View style={{alignItems:'center'}}>
                  {(errors.height && touched.height) &&
                  <Text
                    style={styles.errorText}>{errors.height}</Text>
                  }
                  {(errors.weight && touched.weight) &&
                  <Text
                    style={styles.errorText}>{errors.weight}</Text>
                  }
                  {(errors.age && touched.age) &&
                  <Text
                    style={styles.errorText}>{errors.age}</Text>
                  }
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(25) }}>
                  <TouchableOpacity onPress={handleSubmit} style={styles.touchableOpacity}>
                    <Text style={{
                      bottom: normalize(5),
                      fontSize: RFValue(25),
                      fontFamily: "B Kamran Bold",
                      color: "#fff",
                    }}> نمایش وضعیت بدنی </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Footer />

            </View>
          </PaperProvider>
      }
    </Formik>
  );
}
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: normalize(20),
    borderWidth: 1,
    // backgroundColor: "#ffffff",
    marginTop: normalize(20),
    padding: normalize(15),
    elevation: 10,
    justifyContent: "center",
    borderColor: "#793DFD",
  },
  touchableOpacity: {
    padding:5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#793DFD",
    borderRadius: normalize(50),
  },

  textInputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  textInput: {
    width: "90%",
    height: normalize(45),
    backgroundColor: "#fff",
    borderRadius: normalize(5),
    borderWidth: 1,
    color: "black",
    borderColor: "#793DFD",
    elevation: 5,
    fontSize: RFValue(13),
    textAlign: "right",
    paddingRight: normalize(15),
  },
  textInputText: {
    color: "#000000",
    alignSelf: "flex-end",
    marginRight: normalize(10),
    fontSize: RFValue(20),
    fontFamily: "B Kamran Bold",
  },
  textInputContainerOne: {
    flex: 1,
    alignItems: "center",
    marginBottom: normalize(10),
  },
  errorText:{
    fontFamily: "B Kamran Bold", fontSize: RFValue(20), color: "#ff0000"
  }
});

export { FirstScreen };
