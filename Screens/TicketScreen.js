import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image, Modal, RefreshControl, ScrollView,
  StyleSheet,
  Dimensions,
  Text, TextInput,
  TouchableOpacity,
  View, Pressable, ToastAndroid,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AppContext, UserHeader, Api, MyAlert, imageDomain } from "../Components";
import moment from "jalali-moment";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";
import VideoPlayer from "react-native-video-player";


const windowWidth = Dimensions.get('window').width;

const TicketScreen = (props) => {

  const [refreshing, setRefreshing] = useState(false);
  const [ticket, setTicket] = useState();
  const [idTicket, setIdTicket] = useState();
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatTime, setChatTime] = useState();

  const {
    auth_KeyContext,
    wifiAlert,
    setWifiAlert
  } = useContext(AppContext);

  const onRefresh = () => {
    setTicketApi();
    setTicketTime();
  }
  const setTicketTime = () => {
    fetch(Api + "config/chat_time", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('json', json)
        if (typeof json.chat_time != 'undefined') {
          setChatTime(json.chat_time)
        } else {
          ToastAndroid.showWithGravity(
            'مشکلی پیش آمده',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          )
        }
      })
      .catch((error) => {
        setWifiAlert()
      });
  }


  //همه تیکت های موجود را دریافت میکند
  const setTicketApi = () => {
    try {
      setRefreshing(true)
      fetch(Api + "ticket/ticket", {
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
          setTicket(json.chat);
          setIdTicket(json.idTicket);
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
      fetch(Api + "ticket/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_key: auth_KeyContext,
          idTicket: idTicket,
          text: text,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.error == false) {
            setUpdate(!update)
          } else {
            ToastAndroid.showWithGravity(
              'پیام ارسال نشد',
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
    setTicketTime();
  }, [update]);

  const validationSchema = yup.object().shape({
    text: yup.string().required(),
  });

  const list = useRef(null);

  const press = () => {
    list.current.scrollToEnd({ animated: true });
  };
  const header = () => {
    return <Pressable onPress={() => press()} title="Go to end" />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <UserHeader {...props} />
      <View style={{ flex: 8 }}>
        <FlatList ref={list}
          ListHeaderComponent={header} refreshControl={<RefreshControl colors={["#003fff", "#4bff00", "#ff0000", "#b200ff"]}
            progressBackgroundColor={"white"}
            refreshing={refreshing}
            onRefresh={onRefresh} />}
          data={ticket} renderItem={({ item }) => {
            let color = item.idReceive == 1 ? "#93f36b" : "#f5f5f5";
            let align = item.idReceive == 1 ? "flex-end" : "flex-start";


            const file = item.file.split('.')
            const fileName = file[file.length - 1]

            return (
              <View style={{ flex: 1, alignSelf: align }}>
                {
                  align === "flex-start" ?
                    <Text style={{
                      color: 'black',
                      textAlign: "left",
                      fontSize: normalize(20),
                      paddingLeft: normalize(20),
                      fontFamily: "B Kamran Bold",
                    }}> مهساآنلاین</Text>
                    : null
                }
                <Text style={[styles.text, { backgroundColor: color }]}>{item.text}</Text>
                <Text style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: normalize(20),
                  paddingLeft: normalize(20),
                  fontFamily: "B Kamran Bold"
                }}>{moment.unix(item.date).locale("fa").format("YYYY/MM/DD")}</Text>
                {
                  item.file !== 'empty' && fileName === 'mp4' ?
                    <VideoPlayer
                      style={{
                        marginTop: normalize(20), width: windowWidth,
                        borderRadius: normalize(20)
                      }}
                      video={{ uri: imageDomain + `chat/${item.file}` }}
                      videoWidth={1600}
                      videoHeight={900}
                      pauseOnPress={true}
                      thumbnail={require('../assets/images/MahsaOnlin.png')}
                      customStyles={{ thumbnail: { backgroundColor: "#fff" } }}
                      endThumbnail={require('../assets/images/MahsaOnlin.png')}
                    />
                    :
                    item.file !== 'empty' && fileName === 'mp3' ?
                      <View style={{ width: '80%' }}>
                        <VideoPlayer
                          style={{
                            marginTop: normalize(20),
                            borderRadius: normalize(20)
                          }}
                          video={{ uri: imageDomain + `chat/${item.file}` }}
                          videoWidth={1600}
                          videoHeight={900}
                          pauseOnPress={true}
                          thumbnail={require('../assets/images/MahsaOnlin.png')}
                          customStyles={{ thumbnail: { backgroundColor: "#fff" } }}
                          endThumbnail={require('../assets/images/MahsaOnlin.png')}
                        />
                      </View>
                      : <View />

                }
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
                  chatTime == true ?
                    <View style={{
                      flexDirection: "row",
                      alignItems: "center",
                      alignSelf: "center",
                      marginTop: 15,
                    }}>
                      <TextInput style={styles.textInput}
                        onChangeText={handleChange("text")}
                        numberOfLines={4}
                        multiline
                        scrollEnabled
                        onBlur={handleBlur("text")}
                        placeholder={" اینجا تایپ کن ..."}
                        value={values.text}
                      />
                      <TouchableOpacity onPress={handleSubmit} style={{ marginLeft: normalize(5) }}>
                        <MaterialIcons name={"send"} size={normalize(40)} color={"#793DFD"} />
                      </TouchableOpacity>
                    </View> : null
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
          buttonOnPress={() => setWifiAlert()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    width: "80%",
    height: normalize(50),
    fontSize: normalize(20),
    borderWidth: 3,
    paddingHorizontal: normalize(15),
    borderColor: "#793DFD",
    backgroundColor: "#fff",
    elevation: 15,
    color: "#000000",
    fontFamily: "B Kamran Bold",
    borderRadius: normalize(15),
  },
  text: {
    margin: normalize(15),
    borderRadius: normalize(15),
    padding: normalize(15),
    color: "black",
    maxWidth: normalize(250),
    fontSize: RFValue(23),
    elevation: 7,
    fontFamily: "B Kamran Bold",
  },
});

export { TicketScreen };
