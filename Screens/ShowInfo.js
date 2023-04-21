import React, { useContext, useEffect, useState } from "react";
import {
  Image, Modal, Pressable, RefreshControl, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppContext, Footer, UserHeader, Api, MyAlert, imageDomain } from "../Components";

import normalize from "react-native-normalize";
import {  RFValue } from "react-native-responsive-fontsize";

const InfoText = (props) => {
  return (
    <Text style={styles.text}> {props.value} {props.unit} </Text>
  );
};


const ShowInfo = (props) => {

  const [bodyData, setBodyData] = useState([]);
  const [image, setImage] = useState();
  const [openImage, setOpenImage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [age, setAge] = useState();
  const [arm, setArm] = useState();
  const [chest, setChest] = useState();
  const [under_chest, setUnder_chest] = useState();
  const [waist, setWaist] = useState();
  const [belly, setBelly] = useState();
  const [butt, setButt] = useState();
  const [thigh, setThigh] = useState();
  const [shin, setShin] = useState();
  const [activeID, setActiveId] = useState();
  const [front_Image, setFront_Image] = useState("");
  const [back_Image, setBack_Image] = useState("");
  const [side_Image, setSide_Image] = useState("");

  const {
    auth_KeyContext,
    idCourseContext,
    bodyInfoUpdateContext,
    chatTimeAlert,
    setChatTimeAlert,
    setBodyInfoUpdateContext,
    setWifiAlert,
    wifiAlert
  } = useContext(AppContext);

  const onRefresh = () => {
    setRefreshing(true)
    try {
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
          setBodyData(json.data);
          setRefreshing(false)
        })
        .catch((error) => {
          setRefreshing(false)
          setWifiAlert()
        });
    } catch (error) {
      console.error(error);
    }

  }

  // اطلاعات بدن شخصی که از قبل اطلاعاتش را وارد کرده دریافت میکند
  useEffect(() => {
    setRefreshing(true)
    try {
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
          setWeight(json.data.weight);
          setHeight(json.data.height);
          setAge(json.data.age);
          setArm(json.data.arm);
          setChest(json.data.chest);
          setUnder_chest(json.data.under_chest);
          setWaist(json.data.waist);
          setBelly(json.data.belly);
          setButt(json.data.butt);
          setThigh(json.data.thigh);
          setShin(json.data.shin);
          json.data.front_path !== "empty" ? setFront_Image(json.data.front_path) : null
          json.data.side_path !== "empty" ? setSide_Image(json.data.side_path) : null
          json.data.back_path !== "empty" ? setBack_Image(json.data.back_path) : null
          setActiveId(json.data.active_id);
          setRefreshing(false);
        })
        .catch((error) => {
          setRefreshing(false)
          setWifiAlert()
        });
    } catch (error) {
      console.error(error);
    }
    setBodyInfoUpdateContext(false)
  }, [bodyInfoUpdateContext]);

  const BodyImage = (props) => {
    return <Pressable style={{ width: "30%", height: "75%", }} onPress={() => {
      setOpenImage(!openImage);
      setImage(props.uri)
    }}>
      <Image style={{ width: "100%", height: "100%", borderRadius:10 }} resizeMode={'cover'} resizeMethod={"resize"}
             source={{ uri: props.uri }} />
    </Pressable>
  }
  const NotExistImage = () => {
    return <Image style={{ width: "30%", height: "75%" }} resizeMode={'stretch'}
           source={require('../assets/images/MahsaOnlin.png')} />
  }

  return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <UserHeader {...props} />
        <View style={styles.imageContainer}>
          {
            back_Image !== "" ? <BodyImage uri={imageDomain + `body_info/${back_Image}`}/> : <NotExistImage/>
          }
          {
            side_Image !== "" ? <BodyImage uri={imageDomain + `body_info/${side_Image}`}/> : <NotExistImage/>
          }
          {
            front_Image !== "" ? <BodyImage uri={imageDomain + `body_info/${front_Image}`}/> : <NotExistImage/>
          }

        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
          <View style={{ flex: 7, alignItems: "center" }}>
            <View style={styles.container}>
              <View style={styles.informationTextContainer}>
                <View style={{ flexDirection: "column" }}>
                  <InfoText value={age}         unit={"سال"} />
                  <InfoText value={height}     unit={"سانتی متر"} />
                  <InfoText value={weight}     unit={"کیلوگرم"} />
                  <InfoText value={arm}         unit={"سانتی متر"} />
                  <InfoText value={chest}       unit={"سانتی متر"} />
                  <InfoText value={under_chest} unit={"سانتی متر"} />
                  <InfoText value={waist}         unit={"سانتی متر"} />
                  <InfoText value={belly}        unit={"ساتی متر"} />
                  <InfoText value={butt}        unit={"سانتی متر"} />
                  <InfoText value={shin}        unit={"سانتی متر"} />
                  <InfoText value={thigh}       unit={"سانتی متر"} />

                </View>
                <View style={{ flexDirection: "column" }}>
                  <InfoText value={"سن"} />
                  <InfoText value={"قد"} />
                  <InfoText value={"وزن"} />
                  <InfoText value={"دور بازو"} />
                  <InfoText value={"دور سینه"} />
                  <InfoText value={"دور زیر سینه"} />
                  <InfoText value={"دور کمر"} />
                  <InfoText value={"دور شکم"} />
                  <InfoText value={"دور باسن"} />
                  <InfoText value={"دور ساق"} />
                  <InfoText value={"دور ران"} />
                </View>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection:'row' }}>
              <TouchableOpacity onPress={() =>  props.navigation.navigate('TicketScreen')}
                                style={[styles.touchableOpacity,{backgroundColor: '#D70078'}]}>
                <Text style={{ color: "#fff", fontFamily: "B Kamran Bold", fontSize: RFValue(22)  }}> آنالیز بدن</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.navigation.navigate('UpdateInformation')}
                                style={styles.touchableOpacity}>
                <Text style={{ color: "#fff", fontFamily: "B Kamran Bold", fontSize: RFValue(22) }}> ویرایش</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Modal visible={openImage} animationType={"fade"} transparent>
          <View style={{ flex: 1 ,justifyContent:'center', alignItems:'center'}}>
            <Pressable onPress={() => setOpenImage(!openImage)}
                       style={{
                         position: "absolute",
                         width: "100%",
                         height: "100%",
                         backgroundColor: "#979797",
                         opacity: 0.9,
                       }} />
            <Image style={{ width: "80%", height: "60%", borderRadius: normalize(20) }} resizeMode={'stretch'} resizeMethod={"resize"}
              source={{uri : image}}/>
          </View>
        </Modal>

        <Footer />
        <MyAlert visible={wifiAlert}
                 message={"اتصال به اینترنت خود را بررسی کنید"}
                 title={"خطای ارتباط با سرور"}
                 type={'wifi'}
                 buttonOnPress={() => setWifiAlert()}/>

        <MyAlert visible={chatTimeAlert}
                 title={"خطای دسترسی"}
                 message={"متاسفانه زمان دسترسی به آنالیز بدن به اتمام رسیده"}
                 type={'warning'}
                 buttonOnPress={() => setChatTimeAlert()}/>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
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
    marginHorizontal:normalize(15),
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
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-around",
    bottom: normalize(22),
  },
  text: {
    fontSize: RFValue(18),
    fontFamily: "B Kamran Bold",
    color: "#D70078",
  },
});

export { ShowInfo };
