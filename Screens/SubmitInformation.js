import React, { useContext, useState } from "react";
import {
  Image,
  Modal, Pressable, ScrollView,
  StyleSheet,
  Text, TextInput, ToastAndroid, TouchableOpacity,
  View,
} from "react-native";
import { Formik } from "formik";
import normalize from "react-native-normalize";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Api, UserHeader, AppContext, Footer, imageDomain } from "../Components";
import { MyAlert } from "../Components";
import { RFValue } from "react-native-responsive-fontsize";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const SubmitInformation = (props) => {

  const {
    showImageModalContext,
    setShowImageModalContext,
    auth_KeyContext,
    idCourseContext,
    setDataExistContext,
    activeIdContext,
    setWifiAlert,
    setSuccessAlert,
    successAlert,
    wifiAlert,
    setErrorAlert,
    errorAlert
  } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [position, set_position] = useState(null);
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [age, setAge] = useState();
  const [arm, setArm] = useState();
  const [chest, setChest] = useState();
  const [under_chest, setUnder_chest] = useState();
  const [waist, setWaist] = useState();
  const [belly, setBelly] = useState();
  const [butt, setButt] = useState();
  const [thigh, setThigh] = useState();
  const [shin, setShin] = useState();

  const [front_Image, setFront_Image] = useState("");
  const [back_Image, setBack_Image] = useState("");
  const [side_Image, setSide_Image] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // گرفتن عکس از گالری
  const uploadImage = (image) => {
    setIsLoading(true);
    fetch(Api + "physic/upload_body", {
      method: "POST",
      body: image,
    })
      .then((response) => response.json())
      .then(json => {
        setIsLoading(false);
        console.log('json',json)
        json.file_name && json.type === "front" ? setFront_Image(json.file_name) :
          json.file_name && json.type === "back" ? setBack_Image(json.file_name) :
            json.file_name && json.type === "side" ? setSide_Image(json.file_name) :
              ToastAndroid.showWithGravity(
                'دوباره امتحان کنید',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              )
      })
      .catch((error) => {
        setIsLoading(false);
        setWifiAlert();
      });
  }

  // دریافت رسید از گالری
  const getImageFromGalleryFront = async () => {
    launchImageLibrary({
      mediaType : "photo"
    }).then(response => {
      response.assets.forEach(async value => {
        // console.log('value',value)
        const front_image = new FormData();

        front_image.append("front_image", {
          uri: value.uri,
          name: value.fileName,
          type: value.type,
        });
        await uploadImage(front_image)
      })
    })
  };
  const getImageFromGallerySide = async () => {
    launchImageLibrary({
      mediaType : "photo"
    }).then(response => {
      response.assets.forEach(async value => {
        // console.log('value',value)
        const side_image = new FormData();


        // const uriPart = response.path.split("/");
        // const fileExtension = uriPart[uriPart.length - 1];

        side_image.append("side_image", {
          uri: value.uri,
          name: value.fileName,
          type: value.type,
        });
        // console.log('front_image',front_image.getParts())
        await uploadImage(side_image)
      })
    })
  };
  const getImageFromGalleryBack = async () => {
    launchImageLibrary({
      mediaType : "photo"
    }).then(response => {
      response.assets.forEach(async value => {
        // console.log('value',value)
        const back_image = new FormData();


        // const uriPart = response.path.split("/");
        // const fileExtension = uriPart[uriPart.length - 1];

        back_image.append("back_image", {
          uri: value.uri,
          name: value.fileName,
          type: value.type,
        });
        // console.log('front_image',front_image.getParts())
        await uploadImage(back_image)
      })
    })
  };


  // دریافت رسید از دوربین
  const getImageFromCameraFront = () => {
    launchCamera({
      mediaType : "photo"
    }).then(response => {
      response.assets.forEach(async value => {
        // console.log('value',value)
        const front_image = new FormData();


        // const uriPart = response.path.split("/");
        // const fileExtension = uriPart[uriPart.length - 1];

        front_image.append("front_image", {
          uri: value.uri,
          name: value.fileName,
          type: value.type,
        });
        // console.log('front_image',front_image.getParts())
        await uploadImage(front_image)
      })
    })
  };
  const getImageFromCameraBack = () => {
    launchCamera({
      mediaType : "photo"
    }).then(response => {
      response.assets.forEach(async value => {
        // console.log('value',value)
        const back_image = new FormData();


        // const uriPart = response.path.split("/");
        // const fileExtension = uriPart[uriPart.length - 1];

        back_image.append("back_image", {
          uri: value.uri,
          name: value.fileName,
          type: value.type,
        });
        // console.log('front_image',front_image.getParts())
        await uploadImage(back_image)
      })
    })
  };
  const getImageFromCameraSide = () => {
    launchCamera({
      mediaType : "photo"
    }).then(response => {
      response.assets.forEach(async value => {
        // console.log('value',value)
        const side_image = new FormData();


        // const uriPart = response.path.split("/");
        // const fileExtension = uriPart[uriPart.length - 1];

        side_image.append("side_image", {
          uri: value.uri,
          name: value.fileName,
          type: value.type,
        });
        // console.log('front_image',front_image.getParts())
        await uploadImage(side_image)
      })
    })
  };

  // اطلاعات را دریافت میکند و برای سرور ارسال می کند
  const setApi = async () => {
    setIsLoading(true);
    try {
      await fetch(Api + "physic/add_physic", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weight: weight,
          height: height,
          age: age,
          arm: arm,
          chest: chest,
          under_chest: under_chest,
          waist: waist,
          belly: belly,
          butt: butt,
          thigh: thigh,
          shin: shin,
          side_image: side_Image,
          back_image: back_Image,
          front_image: front_Image,
          auth_key: auth_KeyContext,
          idCourse: idCourseContext,
          active_id : activeIdContext
        }),
      })
      .then((response) => response.json())
        .then((json) => {
          setIsLoading(false);
          if (json.error !== true) {
            setMessage(json.message)
            setSuccessAlert()
            setDataExistContext(true);
          } else {
           setErrorMessage(json.message)
            setErrorAlert()
          }
        })
        .catch((error) => {
          setIsLoading(false);
         setWifiAlert()
        });
    } catch (error) {
      console.error(error);
    }
  };


  return (
      <Formik initialValues={{
        weight: "",
        height: "",
        age: "",
        arm: "",
        chest: "",
        under_chest: "",
        waist: "",
        belly: "",
        butt: "",
        thigh: "",
        shin: "",
      }}
              onSubmit={(values, { setSubmitting }) => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  setApi();
                  setSubmitting(false);
                }, 1000);
              }}>
        {
          ({
             handleChange,
             handleBlur,
             handleSubmit,
             values
           }) =>

            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <UserHeader {...props} />
              <View style={{ flex: 7 }}>
               <ScrollView
                 contentContainerStyle={{ paddingBottom: 100 }}>
                 <View style={styles.container}>
                   <View style={styles.textInputContainer}>
                     <View style={{ flexDirection: "column", flex: 1 }}>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> وزن</Text>
                         <TextInput
                           onTextInput={() => setWeight(values.weight)}
                           onChangeText={handleChange("weight")}
                           onBlur={handleBlur("weight")}
                           keyboardType={'decimal-pad'}
                           value={values.weight}
                           placeholder={"وزن"} style={styles.textInput} />
                       </View>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> دور زیر سینه</Text>
                         <TextInput
                           onTextInput={() => setUnder_chest(values.under_chest)}
                           onChangeText={handleChange("under_chest")}
                           keyboardType={'decimal-pad'}
                           onBlur={handleBlur("under_chest")}
                           value={values.under_chest}
                           placeholder={"دور زیر سینه"} style={styles.textInput} />
                       </View>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> دور باسن</Text>
                         <TextInput
                           onTextInput={() => setButt(values.butt)}
                           onChangeText={handleChange("butt")}
                           keyboardType={'decimal-pad'}
                           onBlur={handleBlur("butt")}
                           value={values.butt}
                           placeholder={"دور باسن"} style={styles.textInput} />

                       </View>
                     </View>
                     <View style={{ flexDirection: "column", flex: 1 }}>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> قد</Text>
                         <TextInput
                           onTextInput={() => setHeight(values.height)}
                           onChangeText={handleChange("height")}
                           keyboardType={'decimal-pad'}
                           onBlur={handleBlur("height")}
                           value={values.height}
                           placeholder={"قد"} style={styles.textInput} />
                       </View>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> دور سینه</Text>
                         <TextInput
                           onTextInput={() => setChest(values.chest)}
                           onChangeText={handleChange("chest")}
                           keyboardType={'decimal-pad'}
                           onBlur={handleBlur("chest")}
                           value={values.chest}
                           placeholder={"دور سینه"} style={styles.textInput} />

                       </View>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> دور شکم</Text>
                         <TextInput
                           onTextInput={() => setBelly(values.belly)}
                           keyboardType={'decimal-pad'}
                           onChangeText={handleChange("belly")}
                           onBlur={handleBlur("belly")}
                           value={values.belly}
                           placeholder={"دور شکم"} style={styles.textInput} />
                       </View>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> دور ساق</Text>
                         <TextInput
                           onTextInput={() => setShin(values.shin)}
                           keyboardType={'decimal-pad'}
                           onChangeText={handleChange("shin")}
                           onBlur={handleBlur("shin")}
                           value={values.shin}
                           placeholder={"دور ساق"} style={styles.textInput} />
                       </View>
                     </View>
                     <View style={{ flexDirection: "column", flex: 1 }}>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> سن</Text>
                         <TextInput
                           onTextInput={() => setAge(values.age)}
                           keyboardType={'decimal-pad'}
                           onChangeText={handleChange("age")}
                           onBlur={handleBlur("age")}
                           value={values.age}
                           placeholder={"سن"} style={styles.textInput} />

                       </View>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> دور بازو</Text>
                         <TextInput
                           onTextInput={() => setArm(values.arm)}
                           onChangeText={handleChange("arm")}
                           keyboardType={'decimal-pad'}
                           onBlur={handleBlur("arm")}
                           value={values.arm}
                           placeholder={"دور بازو"} style={styles.textInput} />

                       </View>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> دور کمر</Text>
                         <TextInput
                           onTextInput={() => setWaist(values.waist)}
                           onChangeText={handleChange("waist")}
                           onBlur={handleBlur("waist")}
                           keyboardType={'decimal-pad'}
                           value={values.waist}
                           placeholder={"دور کمر"} style={styles.textInput} />
                       </View>
                       <View style={styles.textInputContainerOne}>
                         <Text style={styles.textInputText}> دور ران</Text>
                         <TextInput
                           onTextInput={() => setThigh(values.thigh)}
                           onChangeText={handleChange("thigh")}
                           onBlur={handleBlur("thigh")}
                           keyboardType={'decimal-pad'}
                           value={values.thigh}
                           placeholder={"دور ران"} style={styles.textInput} />
                       </View>
                     </View>
                   </View>
                   <View
                     style={{
                       flexDirection: "row",
                       alignItems: "center",
                       justifyContent: "space-evenly",
                       marginTop: normalize(20),
                     }}>
                     <TouchableOpacity onPress={() => {
                       setShowImageModalContext();
                       set_position(1);
                     }} style={styles.imageUpload}>
                       {
                         back_Image !== "" ?
                           <Image resizeMode={"cover"} resizeMethod={"resize"} style={{ width:normalize(70),height:normalize(70),borderRadius:normalize(15) }}
                                  source={{ uri: imageDomain + `body_info/${back_Image}` }} />
                           : <MaterialIcons name={"add-photo-alternate"} size={normalize(70)} />
                       }
                       <Text style={styles.imageUploadText}> عکس از پشت</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => {
                       setShowImageModalContext();
                       set_position(2);
                     }} style={styles.imageUpload}>
                       {
                         side_Image !== "" ?
                           <Image resizeMode={"cover"} resizeMethod={"resize"} style={{ width:normalize(70),height:normalize(70),borderRadius:normalize(15)}}
                                  source={{ uri: imageDomain + `body_info/${side_Image}` }} />
                           : <MaterialIcons name={"add-photo-alternate"} size={normalize(70)} />
                       }
                       <Text style={styles.imageUploadText}> عکس از نیم رخ</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => {
                       setShowImageModalContext();
                       set_position(3);
                     }} style={styles.imageUpload}>
                       {
                         front_Image !== "" ?
                           <Image resizeMode={"cover"} resizeMethod={"resize"} style={{ width:normalize(70),height:normalize(70),borderRadius:normalize(15) }}
                                  source={{ uri: imageDomain + `body_info/${front_Image}` }} />
                           : <MaterialIcons name={"add-photo-alternate"} size={normalize(70)} />
                       }
                       <Text style={styles.imageUploadText}> عکس از جلو</Text>
                     </TouchableOpacity>
                   </View>
                 </View>
                 <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(25) }}>
                   <TouchableOpacity onPress={handleSubmit} style={styles.touchableOpacity}>
                     <Text style={{  bottom: normalize(5),
                       fontSize: RFValue(25),
                       fontFamily: "B Kamran Bold",
                       color: "#fff", }}>ثبت</Text>
                   </TouchableOpacity>
                 </View>
               </ScrollView>
              </View>


              <Modal visible={showImageModalContext} animationType={"slide"} transparent>
                <View style={{ flex: 1 }}>
                  <Pressable onPress={setShowImageModalContext}
                             style={{
                               position: "absolute",
                               width: "100%",
                               height: "100%",
                               backgroundColor: "#979797",
                               opacity: 0.9,
                             }} />
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContentContainer}>
                      <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                        <Text style={styles.modalText}> برای انتخاب عکس یکی از گزینه های زیر رو انتخاب کن</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: normalize(25) }}>
                        <TouchableOpacity style={styles.modalButton} onPress={() => {
                          setShowImageModalContext();
                          position === 1 ? getImageFromGalleryBack() :
                            position === 2 ? getImageFromGallerySide() :
                              position === 3 ? getImageFromGalleryFront() : null;
                        }}>
                          <Text style={styles.modalButtonText}> گالری</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#DF0080" }]}
                                          onPress={() => {
                                            setShowImageModalContext();
                                            position === 1 ? getImageFromCameraBack() :
                                              position === 2 ? getImageFromCameraSide() :
                                                position === 3 ? getImageFromCameraFront() : null;
                                          }}>
                          <Text style={styles.modalButtonText}> دوربین</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>

              <Modal visible={isLoading} animationType={"none"} transparent>
                <View style={{
                  flex: 1, justifyContent: "flex-end",
                  alignItems: "center",
                }}>
                  <View style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#e0e0e0",
                    opacity: 0.5,
                  }} />
                  <Image
                    source={require("../assets/images/loading-97.gif")}
                    style={{ height: normalize(100), width: normalize(100)}}
                    resizeMode="contain"
                    resizeMethod="resize"
                  />
                </View>
              </Modal>

              <Footer />
              <MyAlert visible={wifiAlert}
                       message={"اتصال به اینترنت خود را بررسی کنید"}
                       title={"خطای ارتباط با سرور"}
                       type={'wifi'}
                       buttonOnPress={() => setWifiAlert()}/>
              <MyAlert visible={successAlert}
                       message={message}
                       title={"ثبت اطلاعات"}
                       type={'success'}
                       buttonOnPress={() => {
                         setSuccessAlert();
                         props.navigation.navigate('ShowInfo')
                       }}/>
              <MyAlert visible={errorAlert}
                       message={errorMessage}
                       title={"ثبت اطلاعات"}
                       type={'error'}
                       buttonOnPress={() => setErrorAlert()}/>
            </View>
        }
      </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: normalize(20),
    borderWidth: 1,
    // backgroundColor: "#ffffff",
    padding:  normalize(15),
    elevation: 10,
    marginTop:normalize(20),
    justifyContent: "center",
    borderColor: "#793DFD",
  },
  imageUpload: {
    backgroundColor: "#fff",
    elevation: 5,
    width:'32%',
    padding: normalize(8),
    borderWidth: 1,
    borderColor: "#793DFD",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: normalize(15),
  },
  imageUploadText: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(15),
    color: "black",
  },
  informationTextContainer: {
    width: "100%",
    backgroundColor: "#17d5a1",
    paddingRight: normalize(15),
    paddingLeft: normalize(25),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: RFValue(20),
    marginBottom: normalize(8),
    fontFamily: "B Kamran Bold",
    color: "#D70078",
  },
  textInput: {
    width: "80%",
    height: normalize(35),
    backgroundColor: "#fff",
    borderRadius: normalize(5),
    borderWidth: 1,
    color:'black',
    borderColor: "#793DFD",
    elevation: 5,
    fontSize: RFValue(10),
    textAlign: "center",
  },
  textInputText: {
    color: "#000000",
    alignSelf: "flex-end",
    marginRight: normalize(10),
    fontSize: RFValue(20),
    fontFamily: "B Kamran Bold",
  },
  textInputContainerOne: {
    alignItems: "center",
    marginBottom: normalize(10),
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: normalize(10),
    backgroundColor: "#FAB81C",
    width: "50%",
    height: normalize(40),
    borderRadius: normalize(30),
  },
  modalButtonText: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(20),
    color: "#fff",
  },
  touchableOpacity: {
    width: normalize(120),
    height: normalize(40),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#793DFD",
    borderRadius: normalize(50),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    width: "95%",
    padding: normalize(20),
    borderRadius: normalize(30),
    marginBottom: normalize(20),
  },
  modalText: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(22),
    color: "black",
  },
});

export { SubmitInformation };
