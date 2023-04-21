import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image, Modal, RefreshControl, ScrollView,
  StyleSheet,
  Dimensions,
  Text, TextInput,
  TouchableOpacity,
  View, Pressable, ToastAndroid, Linking,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AppContext, UserHeader, Api, MyAlert, imageDomain } from "../../Components";
import moment from "jalali-moment";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";
import VideoPlayer from "react-native-video-player";


const windowWidth = Dimensions.get('window').width;

const TicketNutrition = (props) => {

  const [refreshing, setRefreshing] = useState(false);
  const [ticket, setTicket] = useState();
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState({
    lastDate: 0,
    nowDate: 0
  });

  const {
    auth_KeyContext,
    wifiAlert,
    setWifiAlert
  } = useContext(AppContext);


  const onRefresh = () => {
    setTicketApi()
  }

  //همه تیکت های موجود را دریافت میکند
  const setTicketApi = () => {
    try {
      setRefreshing(true)
      fetch(Api + "ticket/package_ticket", {
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
          setRefreshing(false)
          setIsLoading(false)
          if (typeof json.chat != 'undefined') {
            setTicket(json.chat);
          } else {
            ToastAndroid.showWithGravity(
              'مشکلی پیش آمده',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            )
          }
        })
        .catch((error) => {
          setRefreshing(false)
          setIsLoading(false)
          setWifiAlert()
        });
    } catch (error) {
      console.error(error);
    }
  };


  //ارسال تیکت جدید
  const setChatApi = (text) => {
    try {
      setIsLoading(true)
      fetch(Api + "ticket/package_chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_key: auth_KeyContext,
          text: text,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.error == false) {
            setUpdate(!update)
          } else {
            ToastAndroid.showWithGravity(
              'مشکلی پیش آمده',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            )
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

  useEffect(() => {
    setTicketApi();
    lastPackageApi();
  }, [update]);

  const validationSchema = yup.object().shape({
    text: yup.string().required(),
  });


  // اجازه ارسال پیام به مشاور را چک میکند
  const lastPackageApi = () => {
    fetch(Api + "package/last_package", {
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
        let today = new Date();
        if (typeof json.date != 'undefined') {
          setDate({
            nowDate: today.getTime() / 1000 | 0,
            lastDate: parseInt(json.date) + 1900800
          })
        } else {
          ToastAndroid.showWithGravity(
            'مشکلی پیش آمده',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          )
        }

      })
      .catch(() => {
        setWifiAlert();
      });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <UserHeader {...props} />
      <View style={{ flex: 8 }}>
        <FlatList refreshControl={<RefreshControl colors={["#003fff", "#4bff00", "#ff0000", "#b200ff"]}
          refreshing={refreshing}
          onRefresh={onRefresh} />}
          data={ticket} renderItem={({ item }) => {
            let color = item.idReceive == 1 ? "#93f36b" : "#f5f5f5";
            let align = item.idReceive == 1 ? "flex-end" : "flex-start";
            let date = item.idReceive == 1 ? "right" : "left";

            const file = item.file.split('.')
            const fileName = file[file.length - 1]

            return (
              <View style={{ flex: 1, alignSelf: align }}>
                {
                  align === "flex-start" ?
                    <Text style={{
                      color: 'black',
                      textAlign: "left",
                      fontSize: normalize(16),
                      paddingLeft: normalize(20),
                      fontFamily: "B Kamran Bold",
                    }}> مهساآنلاین</Text>
                    : null
                }
                <View style={{ ...styles.textContainer, backgroundColor: color }}>
                  <Text style={styles.text}>{item.text}</Text>
                  {
                    item.file !== 'empty' &&
                      fileName == 'jpg' ?
                      <Image source={{ uri: imageDomain + `chat/${item.file}` }} resizeMode={'contain'} style={{ width: Dimensions.get('window').width / 2, height: 250 }} />
                      : fileName == 'pdf' ?
                        <TouchableOpacity onPress={() => {
                          Linking.openURL(imageDomain + `chat/${item.file}`)
                        }} style={[styles.touchableOpacity, { backgroundColor: "#DF0080", margin: 15 }]}>
                          <Text style={{
                            color: "#fff",
                            fontFamily: "B Kamran Bold",
                            fontSize: RFValue(25),
                          }}> دانلود فایل</Text>
                        </TouchableOpacity>
                        : fileName == 'mp4' || fileName == 'mp3' ?
                          <View style={{ width: '100%' }}>
                            <VideoPlayer
                              style={{
                                width: Dimensions.get('window').width / 1.2
                              }}
                              video={{ uri: imageDomain + `chat/${item.file}` }}
                              videoWidth={1600}
                              videoHeight={900}
                              pauseOnPress={true}
                              thumbnail={require('../../assets/images/MahsaOnlin.png')}
                              customStyles={{ thumbnail: { backgroundColor: "#fff" } }}
                              endThumbnail={require('../../assets/images/MahsaOnlin.png')}
                            />
                          </View>
                          : null
                  }
                </View>
                <Text style={{
                  color: 'black',
                  textAlign: date,
                  marginHorizontal:5,
                  fontSize: normalize(10),
                  fontFamily: "B Kamran Bold"
                }}>{moment.unix(item.date).locale("fa").format("YYYY/MM/DD")}</Text>


                {/* {
                  item.file !== 'empty' &&
                    fileName == 'mp4' || fileName == 'mp3' ?
                    <View style={{ width: '80%' }}>
                      <VideoPlayer
                        style={{
                          marginTop: normalize(20),
                          borderRadius: normalize(20),
                          width:Dimensions.get('window').width
                        }}
                        video={{ uri: imageDomain + `chat/${item.file}` }}
                        videoWidth={1600}
                        videoHeight={900}
                        pauseOnPress={true}
                        thumbnail={require('../../assets/images/MahsaOnlin.png')}
                        customStyles={{ thumbnail: { backgroundColor: "#fff" } }}
                        endThumbnail={require('../../assets/images/MahsaOnlin.png')}
                      />
                    </View>
                    : null
                    
                } */}
              </View>
            );
          }}
          keyExtractor={(item, index) => item.id + index} />
        <Formik initialValues={{ text: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setChatApi(values.text);
            values.text = "";
            setSubmitting(false);
          }}>
          {
            ({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
            }) =>
              <View>
                {
                  date.lastDate > date.nowDate ?
                    <View style={{
                      // width: '100%',
                      flexDirection: "row",
                      alignItems: "center",
                      // alignSelf: "center",
                      // marginTop: 15,
                    }}>
                      <TextInput style={styles.textInput}
                        onChangeText={handleChange("text")}
                        numberOfLines={10}
                        multiline
                        scrollEnabled
                        onBlur={handleBlur("text")}
                        placeholder={" اینجا تایپ کن ..."}
                        value={values.text}
                      />
                      <TouchableOpacity onPress={handleSubmit} style={styles.touchableOpacity}>
                        <MaterialIcons name={"send"} size={normalize(25)} color={"#fff"} />
                      </TouchableOpacity>
                    </View>
                    : null
                }
              </View>
          }

        </Formik>
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
              source={require("../../assets/images/loading-97.gif")}
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
          buttonOnPress={() => setWifiAlert()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    // width: "90%",
    height: normalize(50),
    fontSize: normalize(20),
    margin:5,
    paddingHorizontal: normalize(15),
    backgroundColor: "#fff",
    elevation: 5,
    color: "#000000",
    fontFamily: "B Kamran Bold",
    borderRadius: normalize(20),
  },
  text: {
    color: "black",
    fontSize: RFValue(16),
    fontFamily: "B Kamran Bold",
  },
  textContainer: {
    margin: normalize(10),
    borderRadius: normalize(15),
    padding: normalize(5),
    maxWidth: '70%',
    elevation: 2
  },
  touchableOpacity: {
    width: normalize(50),
    height: normalize(50),
    elevation: 5,
    margin: 5,
    paddingHorizontal: 5,
    // height: normalize(50),
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#793DFD'
  },
});

export { TicketNutrition };
