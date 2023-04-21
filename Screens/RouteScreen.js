import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  RefreshControl, ScrollView, TouchableOpacity, ToastAndroid, ImageBackground, Modal, Pressable, Animated, Alert,
} from "react-native";
import { Api, AppContext, Footer, UserHeader } from "../Components";
import { Styles } from "../Components";
import normalize from "react-native-normalize";
import moment from "jalali-moment";
import { RFValue } from "react-native-responsive-fontsize";
import { Slider } from "@miblanchard/react-native-slider";

const RouteScreen = (props) => {
  const [remain, setRemain] = useState([]);
  const [passed, setPassed] = useState([]);
  const [questionModal, setQuestionModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [faq, setFaq] = useState(false);
  const [update, setUpdate] = useState(false);
  let [date, setDate] = useState(null);
  const [data, setData] = useState([]);
  const [question, setQuestion] = useState();
  const [processId, setProcessId] = useState();
  const [answer, setAnswer] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [value, setValue] = useState(0);
  const [train, setTrain] = useState();
  const [food, setFood] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const {
    idCourseContext,
    activationContext,
    setWifiAlert,
    auth_KeyContext,
    activeIdContext,
  } = useContext(AppContext);

  const slider = () => {
    if (remain != null) {
      let sum = remain.length + passed.length;
      val = 100 / sum;
      let result = passed.length * val;
      setValue(result);
    }
  };

  let val;

  useEffect(() => {
    slider();
  }, [update]);

  const setApi = () => {
    setRefreshing(true);
    fetch(Api + "calendar_path/route", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_key: auth_KeyContext,
        idCourse: idCourseContext,
        active_id: activeIdContext,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setRefreshing(false);
        console.log('json', json)
        if (json.error != true) {
          setRemain(json.remain);
          setPassed(json.passed);
        } else {
          ToastAndroid.showWithGravity(
            json.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
        setUpdate(!update);
      })
      .catch(() => {
        setRefreshing(false);
        setWifiAlert();
      });
  };

  useEffect(() => {
    setApi();
  }, []);

  const onRefresh = () => {
    setApi();
  };

  // const setRouteAnswerApi = () => {
  //   setIsLoading(true)
  //   try {
  //     fetch(Api + "calendar_path/route_answer", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         process_id: processId,
  //         answer: answer,
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((json) => {
  //         setIsLoading(false)
  //         if (json.error !== false) {
  //           ToastAndroid.show(
  //             "جوابت با موفقیت ثبت شد",
  //             ToastAndroid.SHORT,
  //             ToastAndroid.BOTTOM,
  //           );
  //           setQuestionModal(!questionModal);
  //           setFaq(!faq);
  //         }
  //         setUpdate(!update);
  //       })
  //       .catch(() => {
  //         setIsLoading(false)
  //         setWifiAlert();
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  const setRouteQuestionApi = (date, type) => {
    setIsLoading(true)
    console.log({
      auth_key: auth_KeyContext,
      idCourse: idCourseContext,
      active_id: activeIdContext,
      date: date,
      type: type,
    })
    try {
      fetch(Api + "calendar_path/route_question", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_key: auth_KeyContext,
          idCourse: idCourseContext,
          active_id: activeIdContext,
          date: date,
          type: type,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('jfkfkdjjjjf', json)
          setIsLoading(false)
          console.log('json', json)
          if (json.question == null) {
            ToastAndroid.show(
              "سوالی تعریف نشده",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            setQuestionModal(false);
          } else {
            setQuestion(json.question);
            setData(json.answers);
            setProcessId(json.process_id);
          }
        })
        .catch(() => {
          setIsLoading(false)
          setWifiAlert();
        });
    } catch (error) {
      console.error(error);
    }
  };

  const hasQuestion = (date) => {
    setIsLoading(true)
    try {
      fetch(Api + "calendar_path/has_question", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date,
          idCourse: idCourseContext,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setIsLoading(false)
          if (json.error !== true) {
            setTrain(json.train);
            setFood(json.food);
            if (!json.food == false || !json.train == false) {
              setFaq(!faq);
            } else {
              ToastAndroid.show(
                "سوالی تعریف نشده",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            }
          }
        })
        .catch(() => {
          setIsLoading(false)
          setWifiAlert();
        });
    } catch (error) {
      console.error(error);
    }
  };

  const ModalButton = ({ type, url, text }) => (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={() => {
        setQuestionModal(!questionModal);
        setRouteQuestionApi(date, type);
      }} style={Styles.modalContentContainer}>
        <Image source={url} resizeMode={"stretch"}
          style={{ width: normalize(190), height: normalize(190), borderRadius: normalize(190) }} />
      </TouchableOpacity>
      <Text style={Styles.routeModalButton}>{text}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <UserHeader {...props} />
      <View style={{ flex: 8 }}>
        {
          remain != null ?
            <View style={styles.contentView}>
              <Slider
                value={value}
                maximumValue={100}
                minimumValue={0}
                disabled={true}
                thumbStyle={{ backgroundColor: "#793DFD" }}
              />
            </View> : null
        }
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {
            passed != null ?
              passed.map((value1, index) => {
                return (
                  <View key={index} style={{ alignItems: "center", flexDirection: "column" }}>
                    <Pressable style={[Styles.routeButton, { backgroundColor: "#b6b6b6" }]}>
                      <Text style={{
                        color: "#ffffff",
                        height: 40,
                        fontSize: 25,
                        fontFamily: "B Kamran Bold",
                      }}> {value1.day} </Text>
                      <Text style={{
                        color: "#fff",
                        height: 40,
                        fontSize: 25,
                        fontFamily: "B Kamran Bold",
                      }}> {moment.unix(value1.date).locale("fa").format("YYYY/MM/DD")} </Text>
                    </Pressable>
                  </View>
                );
              })
              : null
          }

          {
            remain !== null ?
              remain.map((value1, index) => {
                // let today = new Date();
                // let nowDate = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
                // let eventDateFA = moment.unix(value1.date).locale("en").format("YYYY/M/D");

                const enabled = value1.current ? true : false;
                const backgroundColor = value1.current ? "#793DFD" : "#ffffff";
                const textColor = value1.current ? "#ffffff" : "#793DFD";

                return (
                  <View key={index} style={{ alignItems: "center" }}>
                    <Pressable onPress={() => {
                      setDate(value1.date);
                      if (enabled === false) {
                        ToastAndroid.show(
                          "به این روز نرسیدی",
                          ToastAndroid.SHORT,
                          ToastAndroid.BOTTOM,
                        );
                      } else {
                        hasQuestion(value1.date)
                      }
                    }} style={[Styles.routeButton, {
                      backgroundColor: backgroundColor,
                      borderWidth: 1,
                      borderColor: textColor,
                    }]}>
                      <Text style={{
                        color: textColor,
                        height: normalize(40),
                        fontSize: RFValue(25),
                        fontFamily: "B Kamran Bold",
                      }}> {value1.day} </Text>
                      <Text style={{
                        color: textColor,
                        height: normalize(40),
                        fontSize: RFValue(25),
                        fontFamily: "B Kamran Bold",
                      }}> {moment.unix(value1.date).locale("fa").format("YYYY/MM/DD")} </Text>
                    </Pressable>
                    {
                      value1.day === "جمعه" && value1.current === true ? <View
                        style={[Styles.routeButton, {
                          backgroundColor: "#D70078", width: "80%", height: normalize(100),
                        }]}>
                        <Text style={{ color: textColor, fontSize: RFValue(25), fontFamily: "B Kamran Bold" }}>بریم برای هفته بعدی</Text>
                      </View> : null
                    }
                  </View>
                );
              })
              : <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "black", fontSize: RFValue(35), fontFamily: "B Kamran Bold" }}> رویدادی تعریف نشده </Text>
              </View>
          }
        </ScrollView>
      </View>
      <Modal visible={faq} animationType={"slide"} transparent>
        <View style={{ flex: 1 }}>
          <Pressable onPress={() => {
            setFaq(!faq);
            setUpdate(!update);
          }} style={Styles.modalBackground} />
          <View style={Styles.modalContainer}>
            {
              train !== false &&
              <View>
                <ModalButton url={require("../assets/images/e045c485-0333-49fc-997a-d3e297cea4ec.jpg")} type={"train"}
                  text={" تمرین"} />
              </View>
            }
            {
              food !== false &&
              <View>
                <ModalButton url={require("../assets/images/82140608-fe90-4497-9718-9113cc092c17.jpg")}
                  text={" تغذیه"}
                  type={"food"} />
              </View>
            }
          </View>
        </View>
      </Modal>

      <Modal visible={questionModal} animationType={"fade"}>
        <View style={{ flex: 1 }}>
          <Pressable onPress={() => setFaq(!questionModal)} style={Styles.modalBackground} />
          <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
            <View style={styles.modalContentContainer}>

              <Text
                style={{ color: "#793DFD", fontSize: 25, fontFamily: "B Kamran Bold", margin: 30 }}>{question}</Text>

              <FlatList data={data} renderItem={({ item }) => {
                const color = selectedId == item.id ? "white" : "black";
                const backgroundColor = selectedId == item.id ? "#146f00" : "#ffffff";
                return (
                  <View>
                    <TouchableOpacity style={{
                      borderRadius: 25,
                      alignItems: "center",
                      width: normalize(200),
                      backgroundColor: backgroundColor,
                    }} onPress={() => {
                      setSelectedId(item.id);
                      setAnswer(item.answer);
                    }}>
                      <Text style={{ fontSize: 25, fontFamily: "B Kamran Bold", color: color }}> {item.answer} </Text>
                    </TouchableOpacity>
                  </View>
                );
              }} keyExtractor={(item, index) => item.id + index} />

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => setQuestionModal(!questionModal)}
                  style={[Styles.touchableOpacity, { margin: 50 }]}>
                  <Text style={Styles.touchableText}> بازگشت</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  ToastAndroid.show(
                    "جوابت با موفقیت ثبت شد",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  );
                  setQuestionModal(!questionModal);
                  setFaq(!faq);
                  setUpdate(!update);
                }}
                  style={[Styles.touchableOpacity, { margin: 50 }]}>
                  <Text style={Styles.touchableText}> ثبت</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {
        activationContext ? (<Footer />) : null
      }


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
    </View>

  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: "#793DFD",
    borderRadius: 20,
    width: "90%",
    height: "85%",
    padding: 10,
    alignItems: "center",
  },
  item: {
    height: 80,
    backgroundColor: "indigo",
    marginVertical: 2,
  },
  animationContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "90%",
    height: "40%",
    bottom: 20,
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#FAB81C",
    width: "50%",
    height: 40,
    borderRadius: 30,
  },

  buyModalText: {
    fontFamily: "B Kamran Bold",
    fontSize: 30,
    textAlign: "center",
    color: "black",
  },
  modalButtonText: {
    fontFamily: "B Kamran Bold",
    fontSize: 25,
    color: "#fff",
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    height: "50%",
    borderRadius: normalize(30),
  },
  answerButton: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginVertical: 10,
    marginHorizontal: 16,
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
  contentView: {
    padding: normalize(20),
    width: "100%",
    justifyContent: "center",
    alignItems: "stretch",
  },
});
export { RouteScreen };
