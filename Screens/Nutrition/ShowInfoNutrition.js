import React, { useContext, useEffect, useState } from "react";
import {
  Image, Modal, RefreshControl, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppContext, Footer, UserHeader, Api, MyAlert } from "../../Components";

import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";

const InfoText = (props) => {
  return (
    <Text style={styles.text}> {props.value} {props.unit} </Text>
  );
};


const ShowInfoNutrition = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [response,setResponse] = useState([])
  const [refreshing, setRefreshing] = useState(false);


  const {
    chatTimeAlert,
    setChatTimeAlert,
    setWifiAlert,
    setUpdate,
    wifiAlert,
  } = useContext(AppContext);

  const setSubmitApi = () => {
    setIsLoading(true)
    fetch(Api + "package/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        physic_id: props.route.params.physic_id,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setIsLoading(false)
        if(json.physic_id){
          setUpdate();
          props.navigation.navigate('UserNutrition');
        }else {
          alert(json.message)
        }
      })
      .catch((error) => {
        setRefreshing(false);
        setWifiAlert();
      });
  }

  const setDeleteApi = () => {
    setIsLoading(true)
    fetch(Api + "package/delete_data", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        physic_id: props.route.params.physic_id,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setIsLoading(false)
      if(json.error == false){
        props.navigation.navigate('SubmitInfo',{update:false});
      }else {
        alert(json.message)
      }
      })
      .catch((error) => {
        setRefreshing(false);
        setWifiAlert();
      });
  }

  const setApi = () => {
    setRefreshing(true);
    fetch(Api + "package/view_data", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        physic_id: props.route.params.physic_id,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setResponse([json])
        setRefreshing(false)
      })
      .catch((error) => {
        setRefreshing(false);
        setWifiAlert();
      });
  }
  const onRefresh = () => {
    setApi();
  };


  useEffect(() => {
    setApi();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <UserHeader {...props} />
      <ScrollView contentContainerStyle={{paddingVertical:100}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {
          response !== null ?
            response?.length > 0 &&
            response.map((value, index) => {
              // let meal = '';
              // if (value.meal == 1){
              //   meal = 'صبح';
              // }else if (value.meal == 2){
              //   meal = 'ظهر';
              // }else if (value.meal == 4){
              //   meal = 'شب';
              // }else if (value.meal == 3){
              //   meal = 'هر سه وعده را یکسان';
              // }
              let ill = [];
              let habit = [];
              if (value.ill){
                ill = value.ill.map((value1,index) => {
                  return(
                    <Text key={index} style={{ ...styles.text,fontSize:RFValue(20) }}>{value1.content}</Text>
                  )
                })
              }
              if (value.habit){
                habit = value.habit.map((value1,index) => {
                  return(
                    <Text key={index} style={{ ...styles.text,fontSize:RFValue(20) }}>{value1.content}</Text>
                  )
                })
              }
              return(
                <View key={index} style={{ flex: 7, alignItems: "center" }}>
                  <View style={[styles.container, { width: "80%" }]}>
                    <View style={[styles.informationTextContainer, { width: "60%" }]}>
                      <View style={{ flexDirection: "column" }}>
                        <InfoText value={value.birthday} />
                        <InfoText value={value.height} unit={"سانتی متر"} />
                        <InfoText value={value.weight} unit={"کیلوگرم"} />

                      </View>
                      <View style={{ flexDirection: "column" }}>
                        <InfoText value={"تاریخ تولد"} />
                        <InfoText value={"قد"} />
                        <InfoText value={"وزن"} />
                      </View>
                    </View>
                  </View>
                  <View style={styles.container}>
                    <View style={{ ...styles.informationTextContainer,justifyContent:'flex-end' }}>
                      <View style={{ flexDirection: "column"}}>
                       <View style={{ flexDirection: "row", justifyContent:'space-between' }}>
                         <Text style={{ ...styles.text,fontSize:RFValue(20) }}>{value.vitamin_d}</Text>
                         <InfoText value={" کمبود ویتامین دی : "} />
                       </View>
                        <View style={{ flexDirection: "row", justifyContent:'space-between' }}>
                          <Text style={{ ...styles.text,fontSize:RFValue(20) }}>{value.stop_weight}</Text>
                          <InfoText value={" استپ وزنی : "} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent:'space-between' }}>
                          <Text style={{ ...styles.text,fontSize:RFValue(20) }}>{value.medicine}</Text>
                          <InfoText value={" دارو های مصرفی : "} />
                        </View>
                        <InfoText value={" عادت های خاص : "} />
                        {
                          habit
                        }
                        <InfoText value={" بیماری های خاص : "} />
                        {
                          ill
                        }
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => setDeleteApi()}
                                      style={[styles.touchableOpacity, { backgroundColor: "#D70078" }]}>
                      <Text style={{ color: "#fff", fontFamily: "B Kamran Bold", fontSize: RFValue(22) }}> ویرایش</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSubmitApi()}
                                      style={styles.touchableOpacity}>
                      <Text style={{ color: "#fff", fontFamily: "B Kamran Bold", fontSize: RFValue(22) }}> ادامه</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })
            :<View/>
        }
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
            source={require("../../assets/images/loading-97.gif")}
            style={{ height: normalize(100), width: normalize(100)}}
            resizeMode="contain"
            resizeMethod="resize"
          />
        </View>
      </Modal>

      <Footer />
      <MyAlert visible={wifiAlert}
               message={"اتصال به اینترنت خود را بررسی کنید"}
               title={"خطای ارتباط با سرور"}
               type={"wifi"}
               buttonOnPress={() => setWifiAlert()} />

      <MyAlert visible={chatTimeAlert}
               title={"خطای دسترسی"}
               message={"متاسفانه زمان دسترسی به آنالیز بدن به اتمام رسیده"}
               type={"warning"}
               buttonOnPress={() => setChatTimeAlert()} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: "90%",
    borderRadius: normalize(30),
    borderWidth: 4,
    paddingTop: normalize(25),
    alignItems: "center",
    marginBottom: normalize(30),
    borderColor: "#793DFD",
  },
  touchableOpacity: {
    width: normalize(120),
    height: normalize(40),
    bottom: normalize(20),
    marginHorizontal: normalize(15),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#793DFD",
    borderRadius: normalize(50),
  },
  imageContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  informationTextContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    bottom: normalize(22),
  },
  text: {
    fontSize: RFValue(17),
    fontFamily: "B Kamran Bold",
    color: "#D70078",
  },
});

export { ShowInfoNutrition };
