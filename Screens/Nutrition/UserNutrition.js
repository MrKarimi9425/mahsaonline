import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  StatusBar,
  FlatList,
  RefreshControl,
  ToastAndroid, Linking, ScrollView,
} from "react-native";
import { Api, AppContext } from "../../Components";
import { UserHeader } from "../../Components";
import { Footer } from "../../Components";
import { MyAlert } from "../../Components";
import { RFValue } from "react-native-responsive-fontsize";
import normalize from "react-native-normalize";
import WebView from "react-native-webview";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


const InfoText = (props) => {
  return (
    <Text style={styles.text}> {props.value} {props.unit} </Text>
  );
};

const UserNutrition = (props) => {
  const [refreshing, setRefreshing] = useState(true);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [physicId, setPhysicId] = useState();
  const [payLink, setPayLink] = useState("");

  const {
    auth_KeyContext,
    activationContext,
    warningAlert,
    submitContext,
    ShowBuyModalContext,
    setShowBuyModalContext,
    setWarningAlert,
    update,
    wifiAlert,
    setWifiAlert,
  } = useContext(AppContext);

  const setApi = () => {
    setRefreshing(true);
    fetch(Api + "package/all_packages", {
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
        if (typeof json !== "undefined") {
          setData(json.data);
        } else {
          console.log('response', data)
          setData([])
        }
      })
      .catch((error) => {
        setRefreshing(false);
        setWifiAlert();
      });
  };

  const setPayApi = () => {
    try {
      fetch(Api + "package/pay_package_online", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          physic_id: physicId
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setIsLoading(false)
          console.log('json', json)
          // alert(json.message)
          // if (json.error !== true){
          //   setPayLink(json.url)
          //   ToastAndroid.showWithGravity(
          //     'در حال اتصال به درگاه بانک. لطفا منتظر بمانید...',
          //     ToastAndroid.LONG,
          //     ToastAndroid.BOTTOM
          //   )
          // }else {
          //   ToastAndroid.showWithGravity(
          //     'امکان اتصال به درگاه بانک وجود ندارد',
          //     ToastAndroid.LONG,
          //     ToastAndroid.BOTTOM
          //   )
          // }
        })
        .catch(() => {
          setIsLoading(false)
          setWifiAlert()
        });
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    setApi();
  }, [update]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {
        payLink !== "" ?
          <WebView
            source={{ uri: payLink }}
            style={{ flex: 1 }}
            onNavigationStateChange={(navState) => {
              if (navState.url === Api + "pay_submit") {
                props.navigation.navigate("Dashboard");
                ToastAndroid.show(
                  "فرآیند خرید با موفقیت انجام شد. صفحه را رفرش کنید",
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              } else if (navState.url === Api + "pay_error") {
                props.navigation.navigate("Dashboard");
                ToastAndroid.show(
                  "فرآیند خرید موفقیت آمیز نبود",
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              }
            }}
          />
          :
          <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#793DFD" />
            <View style={{ flex: 1, zIndex: 999999 }}>
              <View style={{ alignItems: "center" }}>
                <View style={styles.OvalShapeView} />
              </View>
              <TouchableOpacity onPress={() => props.navigation.goBack()}
                style={{ position: "absolute", marginTop: 0, marginLeft: 5 }}>
                <MaterialIcons name={"arrow-back"} color={"#fff"} size={normalize(40)} />
              </TouchableOpacity>
            </View>
            <ScrollView
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={setApi} />}
              contentContainerStyle={{ paddingVertical: 100 }}>
              {
                data !== null ?
                  data?.length > 0 ?
                    data.map((item, index) => {
                      let ill = [];
                      let habit = [];
                      if (item.ill) {
                        ill = item.ill.map((value1, index) => {
                          return (
                            <Text key={index} style={{ ...styles.text, fontSize: RFValue(20), color: '#6a6a6a' }}>{value1.content}</Text>
                          )
                        })
                      }
                      if (item.habit) {
                        habit = item.habit.map((value1, index) => {
                          return (
                            <Text key={index} style={{ ...styles.text, fontSize: RFValue(20), color: '#6a6a6a' }}>{value1.content}</Text>
                          )
                        })
                      }
                      // console.log('item',item.register_id)
                      // item.register.forEach(value => {
                      //   console.log('value',value)
                      // })
                      return (
                        <View key={index} style={{ flex: 1 }}>
                          <View style={{
                            alignItems: "center",
                            marginBottom: normalize(30),
                          }}>
                            <View style={styles.courseContainer}>
                              <View style={{ flexDirection: "row", flex: 2 }}>
                                <View style={{
                                  flex: 2,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}>
                                  <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}>
                                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-evenly" }}>
                                      <Text style={styles.courseDescription}> تاریخ تولد: <Text style={styles.answersDescription}>
                                        {item.birthday}
                                      </Text></Text>
                                      <Text style={styles.courseDescription}> قد: <Text style={styles.answersDescription}>
                                        {item.height}
                                      </Text></Text>
                                      <Text style={styles.courseDescription}> وزن: <Text
                                        style={styles.answersDescription}>{item.weight}</Text></Text>
                                    </View>
                                  </View>
                                  <View style={{ ...styles.informationTextContainer }}>

                                    {
                                      item.vitamin_d != null ?
                                        <Text style={{ ...styles.text }}> <InfoText value={" کمبود ویتامین دی : "} /> {item.vitamin_d} </Text> : null
                                    }
                                    {
                                      item.medicine != null ?
                                        <Text style={{ ...styles.text }}> <InfoText value={" دارو های مصرفی : "} /> {item.medicine} </Text> : null
                                    }
                                    <Text style={{ ...styles.text }}> <InfoText value={" استپ وزنی : "} /> {item.stop_weight} </Text>
                                    {
                                      habit != null ?
                                        <View>
                                          <InfoText value={" عادت های خاص : "} />
                                          {
                                            habit
                                          }
                                        </View>
                                        : null
                                    }
                                    {
                                      ill != null ?
                                        <View>
                                          <InfoText value={" بیماری های خاص : "} />
                                          {
                                            ill
                                          }
                                        </View>
                                        : null
                                    }
                                  </View>
                                </View>
                              </View>
                              {
                                item.register_id !== 0 ?
                                  item.register !== null ?
                                    item.register.package_id == 0 ?
                                      <View style={{ flexDirection: "row", flex: 1 }}>
                                        <View style={{ flexDirection: "column", flex: 1, alignItems: "center" }}>
                                          <Text style={{
                                            fontSize: 20,
                                            fontFamily: "B Kamran Bold",
                                            color: "#793DFD",
                                            margin: 15,
                                          }}>برنامه ای برای شما یافت نشد</Text>
                                        </View>
                                      </View>
                                      : item.register.submit == 0 ?
                                        <View style={{ flexDirection: "row", flex: 1 }}>
                                          <View style={{ flexDirection: "column", flex: 1, alignItems: "center" }}>
                                            <TouchableOpacity onPress={() => props.navigation.navigate("ShowInfoNutrition", { physic_id: item.register.physic_id })}
                                              style={[styles.touchableOpacity, { backgroundColor: "#DF0080", margin: 15 }]}>
                                              <Text style={{
                                                color: "#fff",
                                                fontFamily: "B Kamran Bold",
                                                fontSize: RFValue(25),
                                              }}> تایید</Text>
                                            </TouchableOpacity>
                                          </View>
                                        </View>
                                        : item.register.status == 0 ?
                                          item.register.method == "offline" ?
                                            <View style={{ flexDirection: "row", flex: 1 }}>
                                              <View style={{ flexDirection: "column", flex: 1, alignItems: "center" }}>
                                                <Text style={{
                                                  fontSize: RFValue(25),
                                                  fontFamily: "B Kamran Bold",
                                                  color: "#793DFD",
                                                  margin: 15,
                                                }}> رسید درحال بررسی... </Text>
                                              </View>
                                            </View> : <View style={{ flexDirection: "row", flex: 1 }}>
                                              <View style={{ flexDirection: "column", flex: 1, alignItems: "center" }}>
                                                <TouchableOpacity onPress={() => {
                                                  setPhysicId(item.register.physic_id)
                                                  setShowBuyModalContext();
                                                }}
                                                  style={[styles.touchableOpacity, { backgroundColor: "#2DDD37", margin: 15 }]}>
                                                  <Text style={{
                                                    color: "#fff",
                                                    fontFamily: "B Kamran Bold",
                                                    fontSize: RFValue(25),
                                                  }}> پرداخت</Text>
                                                </TouchableOpacity>
                                              </View>
                                            </View>
                                          : <View style={{ flexDirection: "row", flex: 1 }}>
                                            <View style={{ flexDirection: "column", flex: 1, alignItems: "center" }}>
                                              <TouchableOpacity onPress={() => {
                                                if (item.register.package !== null) {
                                                  Linking.openURL(`http://mahsaonlin.com/upload/package/${item.register.package.pdf}`)
                                                } else {
                                                  ToastAndroid.show(
                                                    "فایل برنامه پیدا نشد",
                                                    ToastAndroid.SHORT,
                                                    ToastAndroid.BOTTOM,
                                                  );
                                                }
                                              }} style={[styles.touchableOpacity, { backgroundColor: "#DF0080", margin: 15 }]}>
                                                <Text style={{
                                                  color: "#fff",
                                                  fontFamily: "B Kamran Bold",
                                                  fontSize: RFValue(25),
                                                }}> دانلود برنامه</Text>
                                              </TouchableOpacity>
                                            </View>
                                          </View>
                                    : <View /> :
                                  <View style={{ flexDirection: "row", flex: 1 }}>
                                    <View style={{ flexDirection: "column", flex: 1, alignItems: "center" }}>
                                      <Text style={{
                                        fontSize: RFValue(20),
                                        fontFamily: "B Kamran Bold",
                                        color: "#793DFD",
                                        margin: 15,
                                        textAlign: 'center'
                                      }}>متخصصان مهساآنلاین درحال بررسی هستند لطفا 24 ساعت بعد امتحان کنید</Text>
                                    </View>
                                  </View>
                              }
                            </View>
                          </View>
                        </View>
                      )
                    })
                    : <View style={{ flex: 1, justifyContentL: 'center', alignItems: 'center' }}>
                      <Text style={{ color: 'black', fontSize: RFValue(35), fontFamily: 'B Kamran Bold' }}>برنامه ای نداری</Text>
                    </View>
                  : <View style={{ flex: 1, justifyContentL: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontSize: RFValue(35), fontFamily: 'B Kamran Bold' }}>برنامه ای نداری</Text>
                  </View>

              }
            </ScrollView>
            {
              submitContext || activationContext ? (<Footer />) : null
            }
            <Modal visible={ShowBuyModalContext} animationType={"fade"} transparent>
              <View style={{ flex: 1 }}>
                <Pressable onPress={setShowBuyModalContext}
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
                      <Text style={styles.buyModalText}> نوع پرداخت رو انتخاب کن</Text>
                    </View>
                    <View style={{ flexDirection: "row", padding: normalize(25) }}>
                      <TouchableOpacity style={styles.modalButton} onPress={() => {
                        setShowBuyModalContext();
                        setPayApi();
                      }}>
                        <Text style={styles.modalButtonText}> آنلاین</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#DF0080" }]} onPress={() => {
                        props.navigation.navigate("OfflineBuyNutrition", { physic_id: physicId });
                        setShowBuyModalContext();
                      }}>
                        <Text style={styles.modalButtonText}> آفلاین</Text>
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
                  source={require("../../assets/images/loading-97.gif")}
                  style={{ height: normalize(100), width: normalize(100) }}
                  resizeMode="contain"
                  resizeMethod="resize"
                />
              </View>
            </Modal>
            <MyAlert visible={warningAlert}
              title={"خطای دسترسی"}
              message={"فاکتوری نداری"}
              type={"warning"}
              buttonOnPress={() => {
                setWarningAlert();
                props.navigation.goBack();
              }} />
            <MyAlert visible={wifiAlert}
              message={"اتصال به اینترنت خود را بررسی کنید"}
              title={"خطای ارتباط با سرور"}
              type={"wifi"}
              buttonOnPress={() => setWifiAlert()} />
          </View>
      }
    </View>
  )
}
const styles = StyleSheet.create(
  {
    courseContainer: {
      // borderWidth: 0.7,
      // borderColor: "#000000",
      width: "90%",
      // height: "100%",
      backgroundColor: "#fff",
      // backgroundColor:'red',
      elevation: 5,
      borderRadius: normalize(25),
      padding: 5
    },
    touchableOpacity: {
      width: "60%",
      elevation: 5,
      // height: normalize(50),
      borderRadius: normalize(10),
      justifyContent: "center",
      alignItems: "center",
    },
    courseDescription: {
      color: "#000000",
      marginTop: normalize(10),
      fontFamily: "B Kamran Bold",
      fontSize: RFValue(17),
    },
    answersDescription: {
      color: "#793DFD",
      marginTop: normalize(6),
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
    container: {
      // width: "90%",
      borderRadius: normalize(30),
      borderWidth: 4,
      paddingTop: normalize(25),
      alignItems: "center",
      marginBottom: normalize(30),
      borderColor: "#793DFD",
    },
    informationTextContainer: {
      // flex:1,
      width: '90%',
      margin: normalize(15),
      // justifyContent: "space-around",
      // bottom: normalize(22),
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
    text: {
      fontSize: RFValue(17),
      fontFamily: "B Kamran Bold",
      color: "#000000",
      textAlign: 'right',
    },
    OvalShapeView: {
      bottom: normalize(210),
      width: normalize(280),
      height: normalize(280),
      backgroundColor: "#793DFD",
      borderRadius: 200,
      transform: [
        { scaleX: 2 },
      ],
    },
  });
export { UserNutrition };
