import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image, ImageBackground, Pressable,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View, Modal, ScrollView, RefreshControl, ToastAndroid,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Api, AppContext, Footer, imageDomain, MyAlert, UserHeader } from "../Components";

import { Formik } from "formik";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";


const UpdateInformation = (props) => {

    const [refreshing, setRefreshing] = useState(false);

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
    const [activeID, setActiveId] = useState();
    const [id, setId] = useState();
    const [message, setMessage] = useState();

    const [front_Image, setFront_Image] = useState("");
    const [back_Image, setBack_Image] = useState("");
    const [side_Image, setSide_Image] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
      showImageModalContext,
      setShowImageModalContext,
      auth_KeyContext,
      errorAlert,
      setErrorAlert,
      wifiAlert,
      setWifiAlert,
      idCourseContext,
      setBodyInfoUpdateContext,
    } = useContext(AppContext);
    const [position, set_position] = useState(null);


    // اطلاعات از قبل وارد  شده را ویرایش می کند
    const setEditApi = () => {
      setIsLoading(true);
      fetch(Api + "physic/edit_physic", {
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
          id: id,
          active_id: activeID,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setIsLoading(false);
          if (json.error === false) {
            setBodyInfoUpdateContext(true);
            props.navigation.navigate("ShowInfo");
          } else {
            setMessage(json.message);
            setErrorAlert();
          }
        })
        .catch((error) => {
          setRefreshing(false);
          setWifiAlert();
        });
    };

    const BodyInfo = () => {
      // setBackground(!background)
      setRefreshing(true);
      fetch(Api + "physic/body_info", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_key: auth_KeyContext,
          idCourse: idCourseContext,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('json',json)
          setWeight(json.data.weight);
          setHeight(json.data.height);
          setAge(json.data.age);
          setArm(json.data.arm);
          setChest(json.data.chest);
          setUnder_chest(json.data.under_chest);
          setWaist(json.data.waist);
          setBelly(json.data.belly);
          setButt(json.data.butt);
          setThigh(json.data.thigh);
          setId(json.data.id);
          setShin(json.data.shin);
          json.data.front_path !== "empty" ? setFront_Image(json.data.front_path) : null
          json.data.side_path !== "empty" ? setSide_Image(json.data.side_path) : null
          json.data.back_path !== "empty" ? setBack_Image(json.data.back_path) : null
          setActiveId(json.data.active_id);
          setRefreshing(false);
          // setBackground(!background)
        })
        .catch((error) => {
          setRefreshing(false);
          setWifiAlert();
        });
    };

    // اطلاعات بدن شخصی که از قبل اطلاعاتش را وارد کرده دریافت میکند
    useEffect(() => {
      BodyInfo();
    }, []);

    const onRefresh = () => {
      BodyInfo();
    };

    const uploadImage = async (image) => {
      setIsLoading(true);
    const response = await fetch(Api + "physic/upload_body", {
        method: "POST",
        body: image,
      })
      const json = response.json()
        .then(json => {
          json.file_name && json.type === "front" ? setFront_Image(json.file_name) :
          json.file_name && json.type === "back" ? setBack_Image(json.file_name) :
          json.file_name && json.type === "side" ? setSide_Image(json.file_name) :
            ToastAndroid.showWithGravity(
            'دوباره امتحان کن',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          )
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setWifiAlert();
          // console.log(error)
        });
    }

    // دریافت رسید از گالری
    const getImageFromGalleryFront = () => {
      launchImageLibrary({
          mediaType : "photo"
        }).then(response => {
          // console.log('response',response)

        if (response){
          response.assets.forEach(async value => {
            // console.log('value',value)
            const front_image = new FormData();

            front_image.append("front_image", {
              uri: value.uri,
              name: value.fileName,
              type: value.type,
            });
            // console.log('front_image',front_image.getParts())
            await uploadImage(front_image)
          })
        }else {
          ToastAndroid.show(
            'مشکلی پیش اومده بعدا امتحان کن',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          )
        }
      }).catch((error) => {
       console.log(error)
      })
    };
    const getImageFromGallerySide = () => {
      launchImageLibrary({
        mediaType : "photo"
      }).then(response => {
        if (response){
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
        }else {
          ToastAndroid.show(
            'مشکلی پیش اومده بعدا امتحان کن',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          )
        }
      }).catch((error) => {
        console.log(error)
      })
    };
    const getImageFromGalleryBack = () => {
      launchImageLibrary({
        mediaType : "photo"
      }).then(response => {
        if (response){
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
            if (response.didCancel){
              ToastAndroid.show(
                'عکسی انتخاب نکردی',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              )
            }
            // console.log('front_image',front_image.getParts())
            await uploadImage(back_image)
          })
        }else {
          ToastAndroid.show(
            'مشکلی پیش اومده بعدا امتحان کن',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          )
        }

      }).catch((error) => {
        console.log(error)
        // setIsLoading(false)
        // ToastAndroid.show(
        //   'دوباره امتحان کن',
        //   ToastAndroid.SHORT,
        //   ToastAndroid.BOTTOM
        // )
      })
    };


    // دریافت رسید از دوربین
    const getImageFromCameraFront = () => {
      launchCamera({
        mediaType : "photo"
      }).then(response => {
        // console.log('rescameraponse',response)
       if (response){
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
       }else {
         ToastAndroid.show(
           'مشکلی پیش اومده بعدا امتحان کن',
           ToastAndroid.SHORT,
           ToastAndroid.BOTTOM
         )
       }
      }).catch(() => {
        setIsLoading(false)
        ToastAndroid.show(
          'دوباره امتحان کن',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        )
      })
    };
    const getImageFromCameraBack = () => {
      launchCamera({
        mediaType : "photo"
      }).then(response => {
        if (response){
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
        }else {
          ToastAndroid.show(
            'مشکلی پیش اومده بعدا امتحان کن',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          )
        }
      }).catch(() => {
        setIsLoading(false)
        ToastAndroid.show(
          'دوباره امتحان کن',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        )
      })
    };
    const getImageFromCameraSide = () => {
      launchCamera({
        mediaType : "photo"
      }).then(response => {
        if (response){
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
        }else {
          ToastAndroid.show(
            'مشکلی پیش اومده بعدا امتحان کن',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          )
        }
      }).catch(() => {
        setIsLoading(false)
        ToastAndroid.show(
          'دوباره امتحان کن',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        )
      })
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
                setBodyInfoUpdateContext(true);
                setEditApi();
                setSubmitting(false);
              }}>
        {
          ({
             handleChange,
             handleBlur,
             handleSubmit,
             values,
           }) =>

            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <UserHeader {...props} />
              <View style={{ flex: 7 }}>
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 100 }}
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                  <View style={styles.container}>
                    <View style={styles.textInputContainer}>
                      <View style={{ flexDirection: "column", flex: 1 }}>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> وزن</Text>
                          <TextInput
                            onTextInput={() => setWeight(values.weight)}
                            onChangeText={handleChange("weight")}
                            keyboardType={"decimal-pad"}
                            onBlur={handleBlur("weight")}
                            // value={bodyData.weight}
                            defaultValue={weight}
                            placeholder={"وزن"} style={styles.textInput} />
                        </View>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> دور زیر سینه</Text>
                          <TextInput
                            defaultValue={under_chest}
                            onTextInput={() => setUnder_chest(values.under_chest)}
                            onChangeText={handleChange("under_chest")}
                            keyboardType={"decimal-pad"}
                            onBlur={handleBlur("under_chest")}
                            // value={bodyData.under_chest}
                            placeholder={"دور زیر سینه"} style={styles.textInput} />
                        </View>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> دور باسن</Text>
                          <TextInput
                            defaultValue={butt}
                            onTextInput={() => setButt(values.butt)}
                            onChangeText={handleChange("butt")}
                            keyboardType={"decimal-pad"}
                            onBlur={handleBlur("butt")}
                            // value={values.butt}
                            placeholder={"دور باسن"} style={styles.textInput} />

                        </View>
                      </View>
                      <View style={{ flexDirection: "column", flex: 1 }}>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> قد</Text>
                          <TextInput
                            defaultValue={height}
                            keyboardType={"decimal-pad"}
                            onTextInput={() => setHeight(values.height)}
                            onChangeText={handleChange("height")}
                            onBlur={handleBlur("height")}
                            // value={values.height}
                            placeholder={"قد"} style={styles.textInput} />
                        </View>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> دور سینه</Text>
                          <TextInput
                            defaultValue={chest}
                            onTextInput={() => setChest(values.chest)}
                            onChangeText={handleChange("chest")}
                            keyboardType={"decimal-pad"}
                            onBlur={handleBlur("chest")}
                            // value={values.chest}
                            placeholder={"دور سینه"} style={styles.textInput} />

                        </View>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> دور شکم</Text>
                          <TextInput
                            defaultValue={belly}
                            onTextInput={() => setBelly(values.belly)}
                            onChangeText={handleChange("belly")}
                            keyboardType={"decimal-pad"}
                            onBlur={handleBlur("belly")}
                            // value={values.belly}
                            placeholder={"دور شکم"} style={styles.textInput} />
                        </View>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> دور ساق</Text>
                          <TextInput
                            defaultValue={shin}
                            onTextInput={() => setShin(values.shin)}
                            keyboardType={"decimal-pad"}
                            onChangeText={handleChange("shin")}
                            onBlur={handleBlur("shin")}
                            // value={values.shin}
                            placeholder={"دور ساق"} style={styles.textInput} />
                        </View>
                      </View>
                      <View style={{ flexDirection: "column", flex: 1 }}>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> سن</Text>
                          <TextInput
                            defaultValue={age}
                            onTextInput={() => setAge(values.age)}
                            keyboardType={"decimal-pad"}
                            onChangeText={handleChange("age")}
                            onBlur={handleBlur("age")}
                            // value={values.age}
                            placeholder={"سن"} style={styles.textInput} />

                        </View>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> دور بازو</Text>
                          <TextInput
                            onTextInput={() => setArm(values.arm)}
                            keyboardType={"decimal-pad"}
                            defaultValue={arm}
                            onChangeText={handleChange("arm")}
                            onBlur={handleBlur("arm")}
                            // value={values.arm}
                            placeholder={"دور بازو"} style={styles.textInput} />

                        </View>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> دور کمر</Text>
                          <TextInput
                            onTextInput={() => setWaist(values.waist)}
                            defaultValue={waist}
                            onChangeText={handleChange("waist")}
                            onBlur={handleBlur("waist")}
                            keyboardType={"decimal-pad"}
                            // value={values.waist}
                            placeholder={"دور کمر"} style={styles.textInput} />
                        </View>
                        <View style={styles.textInputContainerOne}>
                          <Text style={styles.textInputText}> دور ران</Text>
                          <TextInput
                            onTextInput={() => setThigh(values.thigh)}
                            keyboardType={"decimal-pad"}
                            defaultValue={thigh}
                            onChangeText={handleChange("thigh")}
                            onBlur={handleBlur("thigh")}
                            // value={values.thigh}
                            placeholder={"دور ران"} style={styles.textInput} />
                        </View>
                      </View>
                    </View>
                    <View style={{
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
                            <Image resizeMode={'cover'} resizeMethod={"resize"} style={{ width: normalize(70), height: normalize(70), borderRadius: normalize(15) }}
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
                            <Image resizeMode={'cover'} resizeMethod={"resize"} style={{ width: normalize(70), height: normalize(70), borderRadius: normalize(15) }}
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
                            <Image resizeMode={'cover'} resizeMethod={"resize"} style={{ width: normalize(70), height: normalize(70), borderRadius: normalize(15) }}
                                   source={{ uri: imageDomain + `body_info/${front_Image}` }} />
                            : <MaterialIcons name={"add-photo-alternate"} size={normalize(70)} />
                        }
                        <Text style={styles.imageUploadText}> عکس از جلو</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(25) }}>
                    <TouchableOpacity onPress={handleSubmit} style={styles.touchableOpacity}>
                      <Text style={{
                        bottom: normalize(5),
                        fontSize: RFValue(25),
                        fontFamily: "B Kamran Bold",
                        color: "#fff",
                      }}>ثبت</Text>
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
                      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 25 }}>
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
                                                position === 3 ? getImageFromCameraFront() : null;                                          }}>
                          <Text style={styles.modalButtonText}> دوربین</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
              {/*<Modal visible={background} animationType={"slide"} transparent>*/}
              {/*  <View style={{ flex: 1 }}>*/}
              {/*    <View style={{*/}
              {/*      backgroundColor: "#ff0000",*/}
              {/*      opacity: 0.9,*/}
              {/*    }} />*/}
              {/*  </View>*/}
              {/*</Modal>*/}
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
                    style={{ height: normalize(100), width: normalize(100) }}
                    resizeMode="contain"
                    resizeMethod="resize"
                  />
                </View>
              </Modal>
              <MyAlert visible={wifiAlert}
                       message={"اتصال به اینترنت خود را بررسی کنید"}
                       title={"خطای ارتباط با سرور"}
                       type={"wifi"}
                       buttonOnPress={() => setWifiAlert()} />
              <MyAlert visible={errorAlert}
                       message={message}
                       title={"ثبت اطلاعات"}
                       type={"error"}
                       buttonOnPress={() => setErrorAlert()} />

              <Footer />

            </View>
        }
      </Formik>
    );
  }
;

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
  imageUpload: {
    backgroundColor: "#fff",
    elevation: 5,
    padding: normalize(8),
    width: "32%",
    borderWidth: 1,
    borderColor: "#793DFD",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  touchableOpacity: {
    width: normalize(120),
    height: normalize(40),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#793DFD",
    borderRadius: normalize(50),
  },
  imageUploadText: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(12),
    color: "black",
  },
  informationTextContainer: {
    width: "100%",
    backgroundColor: "#17d5a1",
    paddingRight: normalize(25),
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

  textInput: {
    width: "80%",
    height: normalize(35),
    backgroundColor: "#fff",
    borderRadius: normalize(5),
    borderWidth: 1,
    color: "black",
    borderColor: "#793DFD",
    elevation: 5,
    fontSize: RFValue(10),
    textAlign: "center",
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#FAB81C",
    width: "50%",
    height: normalize(40),
    borderRadius: 30,
  },
  modalButtonText: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(20),
    color: "#fff",
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
    borderRadius: 30,
    marginBottom: 20,
  },
  modalText: {
    fontFamily: "B Kamran Bold",
    textAlign: "center",
    fontSize: RFValue(22),
    color: "black",
  },
  textInputText: {
    color: "#000000",
    alignSelf: "flex-end",
    marginRight: 10,
    fontSize: RFValue(20),
    fontFamily: "B Kamran Bold",
  },
  textInputContainerOne: {
    alignItems: "center",
    marginBottom: normalize(10),
  },
});

export { UpdateInformation }
