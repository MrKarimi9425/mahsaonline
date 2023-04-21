import React, { useContext, useEffect, useState } from "react";
import { Api, AppContext, Footer, MyAlert, UserHeader } from "../Components";
import { ScrollView, StatusBar, Text, View, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryZoomContainer } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import normalize from "react-native-normalize";

const InfoText = (props) => {
  return (
    <Text style={styles.text}>{props.value} {props.unit}</Text>
  );
};


const ReportScreen = (props) => {

  const {
    auth_KeyContext,
    idCourseContext,
    wifiAlert,
    submitContext,
    setWifiAlert,
  } = useContext(AppContext);

  const [bodyData, setBodyData] = useState([]);
  const [chart, setChart] = useState({
    waistButt: [],
    dateBelly: [],
    dateWeight: []

  });

  const [refreshing, setRefreshing] = useState(false);

  // اطلاعات بدن شخصی که از قبل اطلاعاتش را وارد کرده دریافت میکند
  const setShowInfoApi = () => {
    try {
      setRefreshing(true)
      fetch(Api+"physic/body_info", {
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
          setRefreshing(false)
          setBodyData(json.data);
        })
        .catch((error) => {
          setRefreshing(false)
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

//اطلاعات نموار را دریافت میکند
  const setChartsApi = () => {
    console.log(auth_KeyContext)
    try {
      setRefreshing(true)
      fetch(Api+"report/chart", {
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
          console.log('json',json)
          setRefreshing(false)
          setChart({
            dateBelly: json.date_belly,
            waistButt: json.waist_butt,
            dateWeight: json.date_weight
          })
        })
        .catch((error) => {
          setRefreshing(false)
          setWifiAlert()
        });
    } catch (error) {
      console.error(error);
    }
  };


 const onRefresh = useEffect(() => {
    setShowInfoApi();
    setChartsApi();
  }, []);

  return (

    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#793DFD" />
      <UserHeader {...props} />
      <View style={{ flex: 7 }}>
        <ScrollView contentContainerStyle={{paddingBottom:normalize(120)}}
                    refreshControl={<RefreshControl colors={["#003fff", "#4bff00", "#ff0000", "#b200ff"]}
                                                    progressBackgroundColor={"white"}
                                                    refreshing={refreshing}
                                                    onRefresh={onRefresh} />}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: RFValue(25),
              alignSelf: "center",  color:'#000000',
              fontFamily: "B Kamran Bold" }}>تاریخ به دور شکم</Text>
            <VictoryChart height={normalize(400)}>
              <VictoryLine
                style={{
                  data: { stroke: "#793DFD" },
                }}
                interpolation={"basis"}
                data={chart.dateBelly}
                animate={{
                  duration: 2000,
                  onLoad: { duration: 1000 },
                }}
              />
            </VictoryChart>
            <Text style={{ fontSize: RFValue(25),
              alignSelf: "center", color:'#000000',
              fontFamily: "B Kamran Bold",marginTop:normalize(20) }}>دور کمر به دور باسن</Text>
            <VictoryChart    height={normalize(400)}>
              <VictoryLine
                style={{
                  data: { stroke: "#793DFD" },
                }}
                interpolation={"basis"}
                data={chart.waistButt}
                animate={{
                  duration: 2000,
                  onLoad: { duration: 1000 },

                }}
              />
            </VictoryChart>
            <Text style={{ fontSize: RFValue(25),
              alignSelf: "center", color:'#000000',
              fontFamily: "B Kamran Bold",marginTop:normalize(20) }}>تاریخ به وزن</Text>
            <VictoryChart    height={normalize(400)}>
              <VictoryLine
                style={{
                  data: { stroke: "#793DFD" },
                }}
                interpolation={"basis"}
                data={chart.dateWeight}
                animate={{
                  duration: 2000,
                  onLoad: { duration: 1000 },

                }}
              />
            </VictoryChart>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.container}>
              <View style={styles.informationTextContainer}>
                <View style={{ flexDirection: "column" }}>
                  <InfoText value={bodyData.age}          unit={" سال"} />
                  <InfoText value={bodyData.height}      unit={" سانتی متر"} />
                  <InfoText value={bodyData.weight}      unit={" کیلوگرم"} />
                  <InfoText value={bodyData.arm}         unit={" سانتی متر"} />
                  <InfoText value={bodyData.chest}       unit={" سانتی متر"} />
                  <InfoText value={bodyData.under_chest} unit={" سانتی متر"} />


                </View>
                <View style={{ flexDirection: "column" }}>
                  <InfoText value={" سن :"} />
                  <InfoText value={" قد :"} />
                  <InfoText value={" وزن :"} />
                  <InfoText value={" دور بازو :"} />
                  <InfoText value={" دور سینه :"} />
                  <InfoText value={" دور زیر سینه :"} />

                </View>
              </View>
            </View>
            <View style={styles.container}>
              <View style={styles.informationTextContainer}>
                <View style={{ flexDirection: "column" }}>
                  <InfoText value={bodyData.waist}  unit={" سانتی متر"} />
                  <InfoText value={bodyData.belly}  unit={" سانتی متر"} />
                  <InfoText value={bodyData.butt}   unit={" سانتی متر"} />
                  <InfoText value={bodyData.shin}   unit={" سانتی متر"} />
                  <InfoText value={bodyData.thigh}  unit={" سانتی متر"} />


                </View>
                <View style={{ flexDirection: "column" }}>
                  <InfoText value={" دور کمر :"} />
                  <InfoText value={" دور شکم :"} />
                  <InfoText value={" دور باسن :"} />
                  <InfoText value={" دور ساق :"} />
                  <InfoText value={" دور ران :"} />
                </View>
              </View>
            </View>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity onPress={() => props.navigation.navigate("ComparisonScreen")} style={styles.touchableOpacity}>
              <Text style={{ bottom: normalize(5),
                fontSize: RFValue(25),
                fontFamily: "B Kamran Bold",
                color: "#fff" }}> مقایسه</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <MyAlert visible={wifiAlert}
               message={"اتصال به اینترنت خود را بررسی کنید"}
               title={"خطای ارتباط با سرور"}
               type={'wifi'}
               buttonOnPress={() => setWifiAlert()}/>
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: RFValue(14),
    fontFamily: "B Kamran Bold",
    color: "#D70078",
  },
  container: {
    flex: 1,
    margin: normalize(5),
    marginTop: normalize(40),
    borderRadius: normalize(30),
    borderWidth: 2,
    paddingHorizontal:normalize(15),
    paddingTop: normalize(25),
    alignItems: "center",
    marginBottom: normalize(30),
    borderColor: "#793DFD",
  },
  touchableOpacity:{
    borderRadius: normalize(30),
    elevation: 5,
    width: normalize(100),
    height: normalize(40),
    backgroundColor: "#793DFD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  informationTextContainer: {
    width: "100%",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 10,
  },
});
export { ReportScreen };

