import React, { useContext, useEffect, useState } from "react";
import {
  Image, ImageBackground, Pressable,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
  Modal,
  ToastAndroid,
  StatusBar, FlatList, RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AppContext } from "./AppContext";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { UserHeader } from "./UserHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Api, imageDomain } from "./DomainName";
import { MyAlert } from "./index";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";
import WebView from "react-native-webview";

const BuyCourse = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState();
  const [payLink, setPayLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const {
    setShowBuyModalContext,
    ShowBuyModalContext,
    buyTimeAlert,
    setBuyTimeAlert,
    auth_KeyContext,
    setIdCourseContext,
    idCourseContext,
    wifiAlert, setWifiAlert,
  } = useContext(AppContext);

  const storeIdCourse = async (value) => {
    try {
      await AsyncStorage.setItem("idCourse", value);
    } catch (error) {
      console.error("error ", error);
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

  const onRefresh = () => {
    try {
      setRefreshing(true);
      fetch(Api + "course/course", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setRefreshing(false);
          setData(json.data);
        }).catch(() => {
        setRefreshing(false);
        props.navigation.navigate("Dashboard");
        setWifiAlert();
      });
    } catch (error) {
      console.error(error);
    }
  }

// دوره های تعریف شده را دریافت می کند
  useEffect(() => {
    try {
      setRefreshing(true);
      fetch(Api + "course/course", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setRefreshing(false);
           setData(json.data);
        }).catch(() => {
        setRefreshing(false);
        props.navigation.navigate("Dashboard");
        setWifiAlert();
      });
    } catch (error) {
      console.error(error);
    }
  }, []);


  // زمان دسترسی به خرید دوره را چک میکند
  useEffect(() => {
    try {
      fetch(Api + "config/buy_time", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (!json.buy_time) {
            setMessage(json.message);
            setBuyTimeAlert();
          } else return null;
        }).catch(() => {
        setWifiAlert();
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

// پرداخت آنلاین
    const setCreateFactor = () => {
      try {
        setIsLoading(true)
        fetch(Api + "purchase/create_factor", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            auth_key : auth_KeyContext,
            course_id : idCourseContext,
            type : 'course'
          })
        })
          .then((response) => response.json())
          .then((json) => {
            setPayApi(json.idFactor)
          }).catch(() => {
          setWifiAlert();
        });
      } catch (error) {
        console.error(error);
      }
    }

  const setPayApi = (idFactor) => {
    try {
      fetch(Api+"purchase/pay_factor", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_key : auth_KeyContext,
          idFactor : idFactor
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.error !== true){
            setPayLink(json.url)
            ToastAndroid.showWithGravity(
              'در حال اتصال به درگاه بانک. لطفا منتظر بمانید...',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM
            )
          }else {
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
    }catch (error){
      console.error(error)
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {
        payLink !== '' ?
          <WebView
            source={{uri : payLink}}
            style={{flex: 1}}
            onNavigationStateChange={(navState) => {
              console.log('navState',navState)
              if(navState.url === Api + 'pay_submit'){
                props.navigation.navigate('Dashboard')
                ToastAndroid.show(
                  'فرآیند خرید با موفقیت انجام شد. صفحه را رفرش کنید',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                )
              }else if (navState.url === Api + 'pay_error'){
                props.navigation.navigate('Dashboard')
                ToastAndroid.show(
                  'فرآیند خرید موفقیت آمیز نبود',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                )
              }
            }}
          /> :
          <View style={{flex: 1}}>
            <StatusBar backgroundColor="#793DFD" />
            <UserHeader {...props} />
            <View style={{ flex: 6 }}>
              {
                data != null ?
                  <FlatList
                    data={data}
                    refreshControl={<RefreshControl colors={["#003fff", "#4bff00", "#ff0000", "#b200ff"]}
                                                    progressBackgroundColor={"white"}
                                                    refreshing={refreshing}
                                                    onRefresh={onRefresh} />}
                    renderItem={({ item }) => {
                      let feature = [];

                      if(item.feature){
                        feature = item.feature.map((value, index) => {
                          return(
                            <View style={{ flexDirection: "row" }} key={value.id + index}>
                              <Text style={styles.courseDescription}> {value.feature}</Text>
                              <Ionicons color={"green"} size={normalize(20)} name={"checkmark-sharp"} />
                            </View>
                          )
                        })
                      }

                      return (
                        <View style={{ alignItems: "center", flexDirection: "column", marginBottom: normalize(30) }}>
                          <View style={styles.courseContainer}>
                            <View style={{ flexDirection: "row", flex: 1 }}>
                              <View style={{ flexDirection: "column", flex: 2, alignItems: "center" }}>
                                <Text
                                  style={{ margin: normalize(20),color:'black', fontFamily: "B Kamran Bold", fontSize: RFValue(20) }}> {item.title}</Text>
                                <View style={{marginRight:normalize(20), flexDirection: "column", alignItems: "center" }}>
                                  {feature}
                                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={[styles.priceText, { fontSize: RFValue(18) }]}>تومان</Text>
                                    <Text
                                      style={[styles.priceText, { fontSize: 30, color: "#DF0080" }]}> {item.price} </Text>
                                    <Text style={[styles.priceText, { fontSize: RFValue(18) }]}> قیمت دوره :</Text>
                                  </View>
                                </View>
                              </View>
                              <View style={{ flexDirection: "column", flex: 1, justifyContent: "space-around" }}>
                                <Image
                                  resizeMode={"stretch"}
                                  style={{ width: "90%", height: "60%" }}
                                  source={{ uri: imageDomain + `course/${item.image}` }} />
                                <TouchableOpacity onPress={() => {
                                  setShowBuyModalContext();
                                  console.log()
                                  storeIdCourse(item.id);
                                  getStoreIdCourse();
                                }}
                                                  style={styles.touchableOpacity}>
                                  <Text
                                    style={{ bottom: normalize(5), color: "#fff", fontFamily: "BKamran", fontSize: RFValue(25) }}>خرید</Text>
                                  <FontAwesome5 style={{ left: normalize(10) }} name={"shopping-cart"} size={normalize(25)} color={"#fff"} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    }}
                    keyExtractor={(item, index) => item.id + index}
                  /> : <View style={{flex:1,justifyContent:'flex-start',alignItems:'center'}}>
                    <Text style={{color:'black',fontSize:RFValue(25),fontFamily:'B Kamran Bold'}}> دوره تعریف نشده </Text>
                  </View>
              }
            </View>
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
                      <TouchableOpacity onPress={() => {
                        setCreateFactor()
                        setShowBuyModalContext();
                      }} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}> آنلاین</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#DF0080" }]} onPress={() => {
                        props.navigation.navigate("OfflineBuy", { type: "course" });
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
                  style={{ height: normalize(100), width: normalize(100)}}
                  resizeMode="contain"
                  resizeMethod="resize"
                />
              </View>
            </Modal>

            <MyAlert visible={buyTimeAlert}
                     title={"خطای دسترسی"}
                     message={message}
                     type={"warning"}
                     buttonOnPress={() => {
                       setBuyTimeAlert();
                       props.navigation.navigate("Dashboard");
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
}
const styles = StyleSheet.create({
  courseContainer: {
    borderWidth: 0.7,
    borderColor: "#000000",
    width: "90%",
    backgroundColor: "#fff",
    elevation: 10,
    borderRadius: normalize(25),
  },
  courseDescription: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(16),
    marginRight: normalize(10),
    marginLeft: normalize(10),
    color:'black',
    width: "80%",
  },
  priceText: {
    color:'black',
    fontFamily: "B Kamran Bold",
    textAlign: "right",
  },
  touchableOpacity: {
    borderRadius: normalize(30),
    flexDirection: "row",
    right: normalize(15),
    height: 50,
    width: "90%",
    // margin: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#793DFD",
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: normalize(15),
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
  modalButtonText: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(25),
    color: "#fff",
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
export { BuyCourse };
