import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image, ImageBackground, Pressable,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Animated, StatusBar, FlatList, RefreshControl, ToastAndroid,
} from "react-native";
import moment from "jalali-moment";
import { Api, AppContext, imageDomain } from "../Components";
import { UserHeader } from "../Components";
import { Footer } from "../Components";
import { MyAlert } from "../Components";
import { RFValue } from "react-native-responsive-fontsize";
import normalize from "react-native-normalize";
import WebView from "react-native-webview";


const Factors = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [idFactor, setIdFactor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [payLink, setPayLink] = useState("");



  const {
    auth_KeyContext,
    activationContext,
    warningAlert,
    submitContext,
    setWarningAlert,
    wifiAlert,
    setWifiAlert,
  } = useContext(AppContext);

  const setDeleteApi = (id) => {
    setIsLoading(true);
    fetch(Api + "purchase/delete_factor", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setIsLoading(false);
        setUpdate(!update);
      }).catch(() => {
        setIsLoading(false);
        setWifiAlert();
      });
  };

  const getFactor = () => {
    console.log({
      auth: auth_KeyContext
    })
    setRefreshing(true);
    fetch(Api + "purchase/factor", {
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
        setRefreshing(false);
        if (json.data.length !== 0) {
          setData(json.data);
          setUpdate(false);
        } else setWarningAlert();
      }).catch(() => {
        setRefreshing(false);
        setWifiAlert();
        props.navigation.goBack();
      });
  }

  const onRefresh = () => {
    getFactor();
  };

  useEffect(() => {
    getFactor();
    return () => { }
  }, [update]);


  const setPayApi = (idFactor) => {
    try {
      fetch(Api + "purchase/pay_factor", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_key: auth_KeyContext,
          idFactor: idFactor
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('json', json)
          alert(json.message)
          if (json.error !== true) {
            setPayLink(json.url)
            ToastAndroid.showWithGravity(
              'در حال اتصال به درگاه بانک. لطفا منتظر بمانید...',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM
            )
          } else {
            ToastAndroid.showWithGravity(
              'امکان اتصال به درگاه بانک وجود ندارد',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM
            )
          }
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
          setWifiAlert()
        });
    } catch (error) {
      console.error(error)
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {
        payLink !== '' ?
          <WebView
            source={{ uri: payLink }}
            style={{ flex: 1 }}
            onNavigationStateChange={(navState) => {
              if (navState.url === Api + 'pay_submit') {
                props.navigation.navigate('Dashboard')
                ToastAndroid.show(
                  'فرآیند خرید با موفقیت انجام شد. صفحه را رفرش کنید',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                )
              } else if (navState.url === Api + 'pay_error') {
                props.navigation.navigate('Dashboard')
                ToastAndroid.show(
                  'فرآیند خرید موفقیت آمیز نبود',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                )
              }
            }}
          />
          :
          <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#793DFD" />
            <UserHeader {...props} />
            <View style={{ flex: 6 }}>


              <FlatList
                data={data}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl colors={["#003fff", "#4bff00", "#ff0000", "#b200ff"]}
                  progressBackgroundColor={"white"}
                  refreshing={refreshing}
                  onRefresh={onRefresh} />}
                renderItem={({ item, index }) => {
                  // console.log('item',item)
                  let date = moment.unix(item.date).locale('fa').format("YYYY/MM/DD")
                  const status = item.payConfirm == 0 ? 'در انتظار پرداخت' : 'پرداخت شده';
                  return (
                    <View key={index} style={{ flex: 1 }}>
                      {
                        item.active_course !== null ?
                          <View style={{ alignItems: "center", flexDirection: "column" }}>
                            <View style={styles.courseContainer} >

                              <View style={{ flexDirection: "row", flex: 2 }}>
                                <View
                                  style={{ flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center" }}>
                                  {
                                    item.active_course.course.image != 'empty' ?
                                      <Image
                                        resizeMode={"contain"}
                                        style={{ width: "90%", height: "90%" }}
                                        source={{ uri: `${imageDomain}course/${item.active_course.course.image}` }} /> :
                                      <Image
                                        resizeMode={"contain"}
                                        style={{ width: "90%", height: "90%" }}
                                        source={require('../assets/images/MahsaOnlin.png')} />
                                  }
                                </View>
                                <View
                                  style={{ flexDirection: "column", flex: 2, justifyContent: "center", alignItems: "center" }}>
                                  <View style={{ flexDirection: "column", alignItems: "center" }}>
                                    <View style={{ flexDirection: "column" }}>
                                      <Text style={styles.courseDescription}> شماره فاکتور : {item.active_course.id}</Text>
                                      <Text style={styles.courseDescription}> دوره : {item.active_course.course.title}</Text>
                                      <Text style={styles.courseDescription}> مدت دوره : {item.active_course.course.duration} روز </Text>
                                      <Text style={styles.courseDescription}> مبلغ پرداختی : {item.active_course.course.price} تومان </Text>
                                      <Text style={styles.courseDescription}> وضعیت : {status}</Text>
                                      <Text style={styles.courseDescription}> تاریخ صدور : {date}</Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                              {
                                item.payConfirm == 0 ?
                                  <View style={{ flexDirection: "row", flex: 1 }}>
                                    <View style={{ flexDirection: "column", flex: 1, alignItems: "center" }}>
                                      <TouchableOpacity onPress={() => {
                                        setIdFactor(item.id);
                                        setDeleteModal(!deleteModal);
                                      }} style={[styles.touchableOpacity, { backgroundColor: "#DF0080" }]}>
                                        <Text style={{
                                          color: "#fff",
                                          fontFamily: "B Kamran Bold",
                                          fontSize: RFValue(25),
                                        }}> حذف</Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: "column", flex: 1, alignItems: "center" }}>
                                      <TouchableOpacity onPress={() => {
                                        setIsLoading(true)
                                        setPayApi(item.active_course.idFactor)
                                      }} style={[styles.touchableOpacity, { backgroundColor: "#2DDD37" }]}>
                                        <Text style={{
                                          color: "#fff",
                                          fontFamily: "B Kamran Bold",
                                          fontSize: RFValue(25, 700),
                                        }}> پرداخت</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                  : null
                              }
                            </View>
                          </View> : null
                      }
                    </View>
                  );

                }}
                keyExtractor={(item, index) => item.id + index}
              />
            </View>
            {
              submitContext || activationContext ? <Footer /> : null
            }
            <Modal visible={deleteModal} animationType={"fade"} transparent>
              <View style={{ flex: 1 }}>
                <Pressable onPress={() => setDeleteModal(!deleteModal)}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#4e4e4e",
                    opacity: 0.8,
                  }} />
                <View style={styles.buyModalContainer}>
                  <View style={styles.buyModalContentContainer}>
                    <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                      <Text style={styles.buyModalText}> مطمئنی میخوای این فاکتور رو حذف کنی؟</Text>
                    </View>
                    <View style={{ flexDirection: "row", padding: normalize(25) }}>
                      <TouchableOpacity onPress={() => {
                        setDeleteApi(idFactor)
                        setDeleteModal(!deleteModal)
                        console.log(idFactor)
                      }} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}> اره</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#DF0080" }]}
                        onPress={() => setDeleteModal(!deleteModal)}>
                        <Text style={styles.modalButtonText}> نه</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal visible={isLoading} animationType={"none"} transparent>
              <View style={{
                flex: 1, justifyContent: "center",
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
            <MyAlert visible={warningAlert}
              title={"خطای دسترسی"}
              message={'فاکتوری نداری'}
              type={"warning"}
              buttonOnPress={() => {
                setWarningAlert();
                props.navigation.goBack()
              }} />
            <MyAlert visible={wifiAlert}
              message={"اتصال به اینترنت خود را بررسی کنید"}
              title={"خطای ارتباط با سرور"}
              type={"wifi"}
              buttonOnPress={() => setWifiAlert()} />

          </View>

      }

    </View>
  );
};
const styles = StyleSheet.create(
  {
    courseContainer: {
      borderWidth: 0.7,
      borderColor: "#000000",
      width: "90%",
      backgroundColor: "#fff",
      elevation: 10,
      marginBottom: normalize(15),
      padding: normalize(15),
      borderRadius: normalize(25),
    },
    touchableOpacity: {
      width: "80%",
      elevation: 15,
      marginTop: normalize(20),
      height: normalize(50),
      borderRadius: normalize(10),
      justifyContent: "center",
      alignItems: "center",
    },
    courseDescription: {
      color: "#000000",
      fontFamily: "B Kamran Bold",
      fontSize: RFValue(20),
    },
    priceText: {
      fontFamily: "B Kamran Bold",
      textAlign: "right",
    },
    modalText: {
      fontFamily: "B Kamran Bold",
      fontSize: RFValue(30),
      color: "black",
    },
    modalButtonText: {
      fontFamily: "B Kamran Bold",
      fontSize: RFValue(25),
      color: "#fff",
    },
    modalContentContainer: {
      backgroundColor: "#fff",
      width: "80%",
      elevation: 10,
      padding: normalize(20),
      borderRadius: normalize(30),
      marginTop: normalize(20),
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
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

    buyModalText: {
      fontFamily: "B Kamran Bold",
      fontSize: RFValue(25),
      textAlign: "center",
      color: "black",
    },

    buyModalContentContainer: {
      backgroundColor: "#fff",
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      elevation: 10,
      padding: normalize(20),
      borderRadius: normalize(30),
      marginTop: normalize(20),
    },
    modalBackground: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "#4e4e4e",
      opacity: 0.8,
    },

    buyModalContainer: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
    },
  });
export { Factors };
