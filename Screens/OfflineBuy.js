import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View, ToastAndroid,
} from "react-native";

import { Api, Footer, MyAlert, UserHeader } from "../Components";
import { AppContext } from "../Components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import normalize from "react-native-normalize";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";


const OfflineBuy = (props) => {
    const [cardNumber, setCardNumber] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState();
    const [errorMessage, setErrorMessage] = useState();


    const {
      showImageModalContext,
      setShowImageModalContext,
      successAlert,
      setSuccessAlert,
      setErrorAlert,
      setIdCourseContext,
      auth_KeyContext,
      wifiAlert,
      setUpdate,
      errorAlert,
      setWifiAlert,
      idCourseContext,
    } = useContext(AppContext);


    useEffect(() => {
      try {
        setIsLoading(true);
        fetch(Api + "config/info", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "card_number",
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            setIsLoading(false);
            setCardNumber(json.data);
          });
      } catch (error) {
        setIsLoading(false);
        setWifiAlert();
      }
    }, []);

    // آیدی دوره خریداری شده را ذخیره می کند
    const getStoreIdCourse = async () => {
      try {
        const value = await AsyncStorage.getItem("idCourse");
        if (value !== null) {
          setIdCourseContext(value);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // عکس انتخاب شده را داخل سرور آپلود می کند
    const setApi = async (fileName) => {
      console.log({
        auth_key: auth_KeyContext,
        course_id: idCourseContext,
        file_name: fileName,
        type: props.route.params.type,
      })
        setIsLoading(true)
       await fetch(Api + "purchase/receipt", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auth_key: auth_KeyContext,
            course_id: idCourseContext,
            file_name: fileName,
            type: props.route.params.type,
          }),
        })
         .then(response => response.json() )
          .then((json) => {
            setIsLoading(false);
            if (json.error !== true) {
              setUpdate()
              setMessage(json.message);
              setSuccessAlert();
            } else {
              setErrorMessage(json.message);
              setErrorAlert();
            }
          })
          .catch((error) => {
            setIsLoading(false);
            setWifiAlert();
          });
    };

    // دریافت رسید از گالری
    const getReceiptFromGallery = () => {
      launchImageLibrary({
        mediaType : "photo"
      }).then(response => {
        response.assets.forEach(async value => {
          // console.log('value',value)
          const image = new FormData();
          image.append("image", {
            uri: value.uri,
            name: value.fileName,
            type: value.type,
          });
          await setUploadApi(image)
        })
      }).catch(() => {
        ToastAndroid.showWithGravity(
          'تصویر انتخاب نشد',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        )
      })
    };


    const setUploadApi = async (image) => {
      setIsLoading(true);
    await fetch(Api + "purchase/upload_receipt", {
        method: "POST",
        body: image,
      })
       .then(response => response.json())
        .then(async json => {
          setIsLoading(false);
          await setApi(json.file_name);
        })
        .catch(() => {
          setIsLoading(false);
          setWifiAlert();
        });
    };

    //دریافت رسید از دوربین
    const getReceiptFromCamera = () => {
      launchCamera({
        mediaType : "photo"
      }).then(response => {
        response.assets.forEach(async value => {
          const image = new FormData();
          image.append("image", {
            uri: value.uri,
            name: value.fileName,
            type: value.type,
          });
          await setUploadApi(image)
        })
      })
    };


    useEffect(() => {
      getStoreIdCourse();
    }, []);

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>

        <UserHeader {...props} />

        <View style={{ flex: 8 }}>
          <View style={{ flex: 0.75, flexDirection: "row" }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Image resizeMode={"stretch"} style={{ width: normalize(150), height: normalize(100) }}
                     source={require("../assets/images/MahsaOnlin.png")} />
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontFamily: "B Kamran Bold", color: "#DF0080", fontSize: RFValue(30) }}> پرداخت آفلاین</Text>
            </View>
          </View>
          <View style={{ flex: 1, marginTop: normalize(20) }}>
            <View style={{ marginHorizontal: normalize(25), marginTop: normalize(20) }}>
              <Text style={{ fontFamily: "B Kamran Bold", fontSize: RFValue(20), color: "black" }}> اگه قصد داری پرداخت
                هزینه
                پکیج رو به صورت آفلاین انجام بدی؛</Text>
              <Text style={{ fontFamily: "B Kamran Bold", fontSize: RFValue(20), color: "black" }}> مبلغ رو به شماره کارتی
                که پایین درج شده واریز کن و در آخر از رسید پرداختی عگس بگیر و آپلودش کن</Text>
            </View>
          </View>
          <View style={{ flex: 2, alignItems: "center" }}>
            <View style={styles.cartContentContainer}>
              <View>
                <Text style={{ fontFamily: "B Kamran Bold", fontSize: normalize(25), color: "black" }}> شماره کارت
                  :</Text>
                <Text
                  style={{ fontFamily: "B Kamran Bold", fontSize: RFPercentage(5), color: "#DF0080" }}>{cardNumber}</Text>
                <View style={{ flexDirection: "row", alignSelf: "center" }}>
                  <Text style={{ fontFamily: "B Kamran Bold", fontSize: normalize(25), color: "#DF0080" }}> مهسا
                    میرزایی</Text>
                  <Text style={{ fontFamily: "B Kamran Bold", fontSize: normalize(25), color: "black" }}>به نام :</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => {
                  setShowImageModalContext()
                }} style={styles.uploadPhotoButton}>
                  <Text style={{ color: "#fff", fontFamily: "B Kamran Bold", fontSize: normalize(25) }}>انتخاب تصویر</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
                <Text style={styles.modalText}> برای انتخاب عکس یکی از گزینه های زیر رو انتخاب کن</Text>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: normalize(25),
                }}>
                  <TouchableOpacity style={styles.modalButton} onPress={() => {
                    setShowImageModalContext();
                    getReceiptFromGallery();
                  }}>
                    <Text style={styles.modalButtonText}> گالری</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#DF0080" }]}
                                    onPress={() => {
                                      setShowImageModalContext();
                                      getReceiptFromCamera();
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
        <MyAlert visible={successAlert}
                 message={message}
                 title={"ثبت اطلاعات"}
                 type={"success"}
                 buttonOnPress={() => {
                   setSuccessAlert();
                   props.navigation.navigate("Dashboard");
                 }} />
        <MyAlert visible={errorAlert}
                 message={errorMessage}
                 title={"ثبت اطلاعات"}
                 type={"error"}
                 buttonOnPress={() => setErrorAlert()} />

      </View>
    );
  }
;
const styles = StyleSheet.create({
  cartContentContainer: {
    width: "85%",
    backgroundColor: "#fff",
    elevation: 10,
    borderWidth: 0.5,
    borderColor: "#000000",
    padding: normalize(20),
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: normalize(20),
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
    fontSize: RFValue(25),
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    padding: normalize(20),
    borderRadius: normalize(30),
    marginBottom: normalize(20),
  },
  modalText: {
    alignSelf:'center',
    textAlign:'center',
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(25),
    color: "black",
  },
  uploadPhotoButton: {
    backgroundColor: "#2DDD37",
    width: "50%",
    marginTop: normalize(20),
    height: normalize(50),
    borderRadius: normalize(10),
    justifyContent: "center",
    alignItems: "center",
  }
});

export { OfflineBuy };
