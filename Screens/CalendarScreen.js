import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StatusBar,
  Image,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import { Calendar,CalendarList } from "react-native-calendars-persian";
import { AppContext, Footer, UserHeader, Api, MyAlert } from "../Components";
import moment from "jalali-moment";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";


const CalendarScreen = (props) => {
  // const [multiDate, setMultiDate] = useState();
  const {
    idCourseContext, wifiAlert,
    setWifiAlert,
  } = useContext(AppContext);

  const [showEventModal, setShowEventModal] = useState(false);
  const [event, setEvent] = useState();
  const [eventsDate, setEventsDate] = useState([]);

  const setEventsApi = (date) => {
    try {
      fetch(Api + "calendar_path/calendar", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idCourse: idCourseContext,
          date: date,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          // console.log("json", json);
          setEvent(json.event);
        })
        .catch((error) => {
          setWifiAlert();
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch(Api + "calendar_path/events", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idCourse: idCourseContext,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.error !== true){
          console.log('json',json)
          setEventsDate([json.event]);
        }else setEventsDate([])
        // console.log('json.event',json.event)
      })
      .catch((error) => {
        setWifiAlert();
      });
  }, []);

  let markedDay = {};
  let arr = [];
  let date;
  let multiDate = [];

  useEffect(() => {
    eventsDate.map(item => {
      item.forEach(value => {

        arr.push(value.date)

        let today = new Date();
        let nowDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        if (value.type == "live") {
          markedDay[value.date] = {
            selected: true,
            selectedColor: "yellow",
          };
        } else if (value.type == "massage") {
          markedDay[value.date] = {
            selected: true,
            selectedColor: "blue",
          };
        } else if (value.type == "begin") {
          markedDay[value.date] = {
            selected: true,
            selectedColor: "green",
          };
        } else if (value.type == "end") {
          markedDay[value.date] = {
            selected: true,
            selectedColor: "orange",
          };
        } else if (value.type == "enroll") {
          markedDay[value.date] = {
            selected: true,
            selectedColor: "red",
          };
        }

        const d = value.date.split("-")

        const newDate = d[0] +"/"+ d[1] +"/"+ d[2];
        // console.log({ newDate : newDate , date : new Date()})

        const date = new Date();

        const date2 = date.getFullYear() +"/"+ date.getMonth() + 1 +"/"+ date.getDate();

        const now_Date = moment.unix(date2).locale('fa').format('YYYY/MM/DD');
        const event_Date = moment.unix(newDate).locale('fa').format('YYYY/MM/DD');

        if (event_Date < now_Date){
          markedDay[value.date] = {
            selected: false,
          };
        }



      });
    });

    for (let i=0; i < arr.length; i++){
      date = arr[i]
      const index = arr.indexOf(date);
      arr.splice(index, 1);
      for (let j=0; j < arr.length; j++){
        if (arr[j] === date){
          multiDate.push(date)
        }
      }
    }

    multiDate.forEach(value => {
      markedDay[value] = {
        selected: true,
        selectedColor: "#793DFD",
      };
    })

  },[])


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#793DFD" />
      <UserHeader {...props} />
      <View style={{ flex: 7 }}>
        <View style={{ flex: 2 }}>
          <CalendarList
            current={new Date()}
            hideArrows
            pagingEnabled
            horizontal
            minDate={new Date()}
            onDayPress={(day) => {
              setShowEventModal(!showEventModal);
              eventsDate.map(item => {
                item.forEach(value => {
                  if (value.date == day.dateString) {
                    setEventsApi(value.timestamp);
                  } else {
                    setEvent("رویدادی تعریف نشده");
                  }
                });

              });

            }}
            monthFormat={"yyyy MMM"}
            hideExtraDays={true}
            jalali
            markedDates={markedDay}
            firstDay={6}
            theme={{
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#00adf5",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              monthTextColor: "#793DFD",
              textDayFontFamily: "B Kamran Bold",
              textMonthFontFamily: "B Kamran Bold",
              textDayHeaderFontFamily: "B Kamran Bold",
              textDayFontSize: RFValue(20),
              textMonthFontSize: RFValue(25),
              textDayHeaderFontSize: RFValue(20),
            }}
          />

        </View>
        <View style={{ flex: 1 }}>
          <View style={{
            marginTop: normalize(35),
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Image source={require("../assets/images/MahsaOnlin.png")}
                   style={{ width: normalize(110), height: normalize(60), marginTop: normalize(5) }}
                   resizeMode={"stretch"}
            />
          </View>
        </View>
      </View>
      <Modal visible={showEventModal} animationType={"fade"} transparent>
        <View style={{ flex: 1 }}>
          <Pressable style={styles.modalBackground} />
          <View style={styles.modalContainer}>
            <View style={styles.modalContentContainer}>
              <Text style={styles.eventText}>   {event}   </Text>
              <TouchableOpacity onPress={() => {
                setShowEventModal(!showEventModal);
              }} style={styles.touchableOpacityModal}>
                <Text style={styles.modalButtonText}> باشه</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <MyAlert visible={wifiAlert}
               message={"اتصال به اینترنت خود را بررسی کنید"}
               title={"خطای ارتباط با سرور"}
               type={"wifi"}
               buttonOnPress={() => setWifiAlert()} />
      <Footer />
    </View>
  );
};
export { CalendarScreen };

const styles = StyleSheet.create({

  modalContentContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "30%",
    borderRadius: normalize(30),
  },
  modalButtonText: {
    fontFamily: "B Kamran Bold",
    fontSize: normalize(25),
    color: "#fff",
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
  modalBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#4e4e4e",
    opacity: 0.8,
  },
  eventText: {
    fontSize: RFValue(25),
    color: "black",
    marginBottom: normalize(30),
    fontFamily: "B Kamran Bold",
  },
});
