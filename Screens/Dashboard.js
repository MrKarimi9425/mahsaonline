import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  Modal, Pressable, StatusBar,
  StyleSheet,
  Animated,
  Text, TextInput, TouchableOpacity,
  View,
  RefreshControl, Dimensions, ToastAndroid, Linking,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Api, AppContext, Footer, GuestHeader } from "../Components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import Feather from "react-native-vector-icons/Feather";
import { MyAlert } from "../Components";
import normalize from "react-native-normalize/src/index";
import { RFValue } from "react-native-responsive-fontsize";
import * as Animatable from "react-native-animatable";
import Swiper from 'react-native-swiper'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


const Dashboard = (props) => {
  const [instagram, setInstagram] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [body, setBody] = useState();
  const [activationSub, setActivationSub] = useState();
  const [activationCourse, setActivationCourse] = useState();
  const [exitModal, setExitModal] = useState(false);
  const [considerTime, setConsiderTime] = useState();
  const [died, setDiet] = useState();


  const calendarRef = useRef();
  const buttonRef = useRef();


  const {
    showInstagramModalContext,
    activationContext,
    setSubmitContext,
    dataExistContext,
    submitContext,
    setShowInstagramModalContext,
    setAuth_KeyContext,
    setActivationContext,
    auth_KeyContext,
    setSubAlert,
    wifiAlert,
    warningAlert,
    subAlert,
    setActiveIdContext,
    setWifiAlert,
    setReportAlert,
    reportAlert,
    courseAlert,
    setCourseAlert,
    update,
    idCourseContext,
    setWarningAlert,
    setIdCourseContext,
  } = useContext(AppContext);


  const getStoreAuth_Key = async () => {
    try {
      const value = await AsyncStorage.getItem("auth_Key");
      if (value !== null) {
        setAuth_KeyContext(value);
      }
    } catch (error) {
      console.error(error);
    }
  };


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

  //  هنگام اجرای کامپوننت auth_key را از async storage دریافت می شود
  useEffect(() => {
    getStoreAuth_Key();
    getStoreIdCourse();
  }, []);

  // اینستاگرام کاربر را دریافت می کند
  const setInstagramApi = async () => {
    setIsLoading(true);
    await fetch(Api + "course/instagram", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instagram: instagram,
        auth_key: auth_KeyContext,
        idCourse: idCourseContext,
      }),
    }).then(response => response.json())
      .then((json) => {
        setIsLoading(false);
        if (json.error !== true)
          setShowInstagramModalContext();
      })
      .catch((error) => {
        setIsLoading(false);
        setWifiAlert();
      });
  };


  // اینستاگرام کاربر را چک می کند
  const setCheckInstaApi = () => {
    fetch(Api + "course/check_insta", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_key: auth_KeyContext,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        json.insta !== true ? setShowInstagramModalContext() : null;
      })
      .catch(() => {
        setWifiAlert();
      });
  };

  const onRefresh = () => {
    setActivation();
  };

  const setActivation = () => {
    setRefreshing(true);
    fetch(Api + "course/activation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_key: auth_KeyContext,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        setRefreshing(false);
        setDiet(json.diet)
        if (json.submit === true) {
          setCheckInstaApi();
          setSubmitContext(json.submit);
        } else {
          setSubmitContext(false)
        }
        if (json.active === true) {
          setActivationContext(true);
          setActiveIdContext(json.active_id);
          setIdCourseContext(json.idCourse);
          setActivationSub(json.subscribe);
          setActivationCourse(json.course);
          setBody(json.body);
        } else {
          setActivationContext(json.active);
        }
      })
      .catch((error) => {
        setRefreshing(false);
        setWifiAlert();
      });
  };
  // هنگام اجرای کامپوننت چک میکند که آیا کاربر دوره فعال دارد یا خیر
  useEffect(() => {
    setActivation();
    lastPackage();
  }, [activationContext, auth_KeyContext]);

  useEffect(() => {
    setActivation();
    lastPackage();
  }, [dataExistContext]);

  useEffect(() => {
    setActivation();
    lastPackage();
  }, [update]);


  // برای کلیک کردن دکمه بازگشت موبایل
  useEffect(() => {
    props.navigation.addListener("beforeRemove", e => {
      e.preventDefault();
      setExitModal(!exitModal);
    });
  }, [props.navigation]);

  // زمان ارتباط با مشاور را چک میکند
  const lastPackage = async () => {
    await fetch(Api + "package/last_package", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_key: auth_KeyContext,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setConsiderTime(json.date)
      })
      .catch(() => {
        setWifiAlert();
      });
  }


  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={false} backgroundColor={"#793DFD"} />
      <GuestHeader {...props} />
      <TouchableOpacity onPress={() => Linking.openURL('https://no-et.com/')} style={{ position: 'absolute', right: 20 }}>
        <Text style={{ color: '#fff', fontSize: RFValue(8), fontFamily: "B Kamran Bold" }}>TARH-R-H</Text>
      </TouchableOpacity>
      <View style={{ flex: 8, backgroundColor: "#fff" }}>
        <ScrollView
          scrollEnabled={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Swiper loop={false} showsPagination={true} height={normalize(550)}
            dot={<View
              style={{
                backgroundColor: 'rgba(0,0,0,.2)',
                width: normalize(7),
                height: normalize(7),
                borderRadius: normalize(7),
                marginLeft: normalize(5),
                marginRight: normalize(5),
              }}
            />
            }
            activeDot={
              <View
                style={{
                  backgroundColor: '#000',
                  width: normalize(10),
                  height: normalize(10),
                  borderRadius: normalize(10),
                  marginLeft: normalize(5),
                  marginRight: normalize(5),
                }}
              />}
          >
            <View style={styles.container}>
              <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={() => {
                  if (activationSub === true) {
                    setSubAlert();
                  } else {
                    props.navigation.navigate("Courses");
                  }
                }}
                  style={styles.touchableOpacity}>
                  <MaterialIcons name={"fitness-center"} size={normalize(45)} color={"#fff"} />
                </TouchableOpacity>
                <Text style={styles.touchableText}> دوره ها</Text>
              </View>
              <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={() => {
                  if (activationContext !== true) {
                    setWarningAlert();
                  } else {
                    console.log("body", body);
                    if (body !== true) {
                      setReportAlert();
                    } else {
                      props.navigation.navigate("ReportScreen");
                    }
                  }
                }}
                  style={styles.touchableOpacity}>
                  <FontAwesome name={"line-chart"} size={normalize(35)} color={"#fff"} />
                </TouchableOpacity>
                <Text style={styles.touchableText}> نمودار تغییرات</Text>
              </View>
              <View style={styles.touchableContainer}>
                <Pressable onPress={() => {

                  if (activationContext !== true) {
                    setWarningAlert();
                  } else {
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
                        if (json.data !== null) {
                          props.navigation.navigate("ShowInfo");
                        } else {
                          props.navigation.navigate("SubmitInformation");
                        }
                      }).catch((error) => {
                        console.log("error", error);
                      });
                  }
                }}
                  style={styles.touchableOpacity}>
                  <Ionicons name={"body"} size={normalize(45)} color={"#fff"} />
                </Pressable>
                <Text style={styles.touchableText}> تحلیل بدن</Text>
              </View>
              <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={() => {
                  if (activationContext !== true) {
                    setWarningAlert();
                  } else {
                    props.navigation.navigate("RouteScreen");
                  }
                }} style={[styles.touchableOpacity]}>
                  <MaterialCommunityIcons name={"highway"} size={normalize(45)} color={"#fff"} />
                </TouchableOpacity>
                <Text style={styles.touchableText}> مسیرنامه</Text>
              </View>
              <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={() => {
                  if (activationContext !== true) {
                    setWarningAlert();
                  } else {
                    props.navigation.navigate("CalendarScreen");
                  }
                }} style={styles.touchableOpacity}>
                  <FontAwesome5 style={{ width: normalize(45), left: normalize(5) }} name={"calendar-check"}
                    size={normalize(45)} color={"#fff"} />
                </TouchableOpacity>
                <Text style={styles.touchableText}> تقویم مهساآنلاین</Text>
              </View>
              <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={() => {
                  props.navigation.navigate("LearnScreen");
                }} style={styles.touchableOpacity}>
                  <FontAwesome5 style={{ width: normalize(40), left: normalize(5) }} name={"question"}
                    size={normalize(45)} color={"#fff"} />
                </TouchableOpacity>
                <Text style={styles.touchableText}> آموزشی</Text>
              </View>
              <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={() => {
                  props.navigation.navigate("Factors");
                }} style={styles.touchableOpacity}>
                  <Image source={require("../assets/images/FactorIcon.png")}
                    style={{ width: normalize(40), height: normalize(40), tintColor: "#fff" }} />
                </TouchableOpacity>
                <Text style={styles.touchableText}> فاکتور ها</Text>
              </View>
              <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={() => {
                  if (activationCourse === true) {
                    setCourseAlert();
                  } else {
                    props.navigation.navigate("SubscribeScreen");
                  }
                }} style={styles.touchableOpacity}>
                  <Image resizeMode={"stretch"} source={require("../assets/images/VipIon.png")}
                    style={{ width: normalize(40), height: normalize(45), tintColor: "#fff" }} />
                </TouchableOpacity>
                <Text style={styles.touchableText}> اشتراک</Text>
              </View>
            </View>
            <View style={styles.container}>
              <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={() => {

                  props.navigation.navigate("UserNutrition");

                }}
                  style={styles.touchableOpacity}>
                  <Image source={require("../assets/images/end-of-day-batch-128.png")}
                    style={{ width: normalize(50), height: normalize(50), tintColor: "#fff" }} />
                </TouchableOpacity>
                <Text style={styles.touchableText}> برنامه های من</Text>
              </View>
              <View style={styles.touchableContainer}>

                <TouchableOpacity onPress={() => {
                  console.log(died)
                  if (died) {
                    props.navigation.navigate("FirstScreen");
                  } else {
                    props.navigation.navigate("UserNutrition");
                    ToastAndroid.showWithGravity(
                      'در این ماه یک برنامه رژیم دریافت کردید',
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM
                    )
                  }
                }}
                  style={styles.touchableOpacity}>
                  <Image source={require("../assets/images/556959-200.png")}
                    style={{ width: normalize(50), height: normalize(50) }} />
                </TouchableOpacity>
                <Text style={styles.touchableText}> دریافت برنامه</Text>
              </View>
              <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={() => {
                  if (!considerTime == 0) {
                    props.navigation.navigate("TicketNutrition");
                  } else {
                    ToastAndroid.showWithGravity(
                      'هنوز برنامه غذایی دریافت نکردی',
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM
                    )
                  }
                }}
                  style={styles.touchableOpacity}>
                  <Image source={require("../assets/images/consultation.png")}
                    style={{ width: normalize(55), height: normalize(55) }} />
                </TouchableOpacity>
                <Text style={styles.touchableText}> ارتباط با مشاور</Text>
              </View>
              <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={() => {
                  setIsLoading(true)
                  const removeAuth_Key = async () => {
                    try {
                      AsyncStorage.removeItem("auth_Key").then(() => {
                        setIsLoading(false)
                        BackHandler.exitApp();
                      });
                    } catch (error) {
                      console.error("error ", error);
                    }
                  };
                  removeAuth_Key();
                }}
                  style={styles.touchableOpacity}>
                  <Image resizeMode="contain" source={require("../assets/images/download-icon-bx+log+out+circle-1325051891950912111_512.png")}
                    style={{ width: normalize(55), height: normalize(55) }} />
                </TouchableOpacity>
                <Text numberOfLines={1} style={styles.touchableText}> خروج از حساب کاربری</Text>
              </View>
            </View>
          </Swiper>


          <Formik initialValues={{ instagram: "" }}
            onSubmit={(values, { setSubmitting }) => {
              setInstagramApi();
              setSubmitting(false);
            }}>
            {
              ({
                values,
                handleSubmit,
                handleBlur,
                handleChange,
              }) =>
                <Modal visible={showInstagramModalContext} animationType={"fade"} transparent>
                  <View style={{ flex: 1 }}>
                    <Pressable style={styles.modalBackground} />
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContentContainer}>
                        <Text style={styles.phoneText}> اینستاگرام خودت رو وارد کن</Text>
                        <TextInput style={styles.textInput}
                          onChangeText={handleChange("instagram")}
                          onBlur={handleBlur("instagram")}
                          onTextInput={() => setInstagram(values.instagram)}
                          placeholder={" پبج اینستاگرام"} />
                        <TouchableOpacity onPress={handleSubmit} style={styles.touchableOpacityModal}>
                          <Text style={[styles.touchableText, { color: "#fff" }]}> ثبت</Text>
                          <Feather style={{ left: 15 }} name={"arrow-right-circle"} size={35} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
            }
          </Formik>

        </ScrollView>
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
              style={{ height: normalize(100), width: normalize(100), marginTop: 500 }}
              resizeMode="contain"
              resizeMethod="resize"
            />
          </View>
        </Modal>
        <Modal visible={exitModal} animationType={"fade"} transparent>
          <View style={{ flex: 1 }}>
            <Pressable style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "#4e4e4e",
              opacity: 0.8,
            }} />
            <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}>
              <View style={{
                backgroundColor: "#fff",
                paddingHorizontal: normalize(25),
                justifyContent: "center",
                alignItems: "center",
                width: "60%",
                height: "40%",
                borderRadius: normalize(30),
              }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Ionicons name={"exit-outline"} color={"black"} size={80} />
                </View>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{
                    fontSize: RFValue(25),
                    color: "black",
                    fontFamily: "B Kamran Bold",
                  }}> خروج</Text>
                  <Text style={{
                    fontSize: RFValue(18),
                    color: "black",
                    fontFamily: "B Kamran Bold",
                  }}> مطمئنی میخوای خارج شی ؟</Text>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => BackHandler.exitApp()}
                    style={{
                      borderRadius: normalize(30),
                      elevation: 5,
                      width: "50%",
                      margin: 5,
                      height: normalize(40),
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#DF0080",
                      justifyContent: "center",
                    }}>
                    <Text style={styles.touchableText}> اره</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setExitModal(!exitModal)}
                    style={{
                      borderRadius: normalize(30),
                      elevation: 5,
                      width: "50%",
                      margin: 5,
                      height: normalize(40),
                      flexDirection: "row",
                      backgroundColor: "#FAB81C",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <Text style={styles.touchableText}> نه</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <MyAlert visible={wifiAlert}
          message={"اتصال به اینترنت خود را بررسی کنید"}
          title={"خطای ارتباط با سرور"}
          type={"wifi"}
          buttonOnPress={() => setWifiAlert()} />
        <MyAlert visible={warningAlert}
          title={"خطای دسترسی"}
          message={"متاسفانه دوره فعالی نداری"}
          type={"warning"}
          buttonOnPress={() => setWarningAlert()} />

        <MyAlert visible={subAlert}
          title={"خطای دسترسی"}
          message={"اشتراک فعال داری"}
          type={"warning"}
          buttonOnPress={() => setSubAlert()} />

        <MyAlert visible={courseAlert}
          title={"خطای دسترسی"}
          message={"دوره فعال داری"}
          type={"warning"}
          buttonOnPress={() => setCourseAlert()} />

        <MyAlert visible={reportAlert}
          title={"خطای دسترسی"}
          message={"اطلاعات بدنت رو وارد نکردی"}
          type={"warning"}
          buttonOnPress={() => setReportAlert()} />
      </View>
      {/* <Modal visible={isLoading} animationType={"none"} transparent>
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
      </Modal> */}
      {
        submitContext || activationContext ? (<Footer />) : null
      }
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // bottom: normalize(50),
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    // marginTop: normalize(30),
    justifyContent: "center",
    alignItems: "center",
  },
  phoneText: {
    fontSize: RFValue(25),
    color: "black",
    marginBottom: normalize(30),
    fontFamily: "B Kamran Bold",
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "85%",
    borderRadius: normalize(30),
  },
  textInput: {
    width: "70%",
    height: normalize(50),
    fontSize: RFValue(20),
    borderWidth: 3,
    borderColor: "#793DFD",
    backgroundColor: "#fff",
    elevation: 15,
    color: "black",
    fontFamily: "B Kamran Bold",
    textAlign: "center",
    borderRadius: normalize(15),
  },
  touchableOpacityModal: {
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableContainer: {
    // backgroundColor:'#ff0000',
    flexDirection: "column",
    width: "45%",
    marginBottom: normalize(12),
    justifyContent: "center",
    alignItems: "center",
  },
  touchableOpacity: {
    width: normalize(80),
    justifyContent: "center",
    alignItems: "center",
    height: normalize(80),
    backgroundColor: "#793DFD",
    borderRadius: normalize(100),
  },
  modalBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#4e4e4e",
    opacity: 0.8,
  },
  touchableText: {
    fontSize: RFValue(18),
    textAlign: "center",
    fontFamily: "B Kamran Bold",
    color: "#000000",
  },
  indicatorContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
  },
  indicator: {
    height: 10,
    width: 10,
    marginBottom: 100,
    borderRadius: 5,
    backgroundColor: '#00000044',
    marginHorizontal: 5,
  },
  activeIndicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    width,
    flex: 1
  }
});

export { Dashboard };
