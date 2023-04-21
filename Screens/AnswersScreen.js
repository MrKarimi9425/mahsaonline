import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl, Alert, BackHandler,
} from "react-native";
import { AppContext, Footer, UserHeader, Api, MyAlert, imageDomain } from "../Components";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";
import VideoPlayer from "react-native-video-player";


const AnswersScreen = (props) => {

  const [data, setData] = useState([]);
  const { activationContext,wifiAlert,
    warningAlert,
    setWarningAlert,
    setWifiAlert } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);

  const setItemsApi = (id, type) => {
    setRefreshing(true);
    fetch(Api + "guide/items", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        type: type,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setRefreshing(false)
        if (typeof json.data !== 'undefined' &&json.data.length !== 0) {
          setData(json.data);
        }
        else {setWarningAlert()
        }

      })
      .catch(() => {
     setWifiAlert()
      });
  };

  useEffect(() => {
    setItemsApi(props.route.params.id, props.route.params.type);
  }, []);

  const onRefresh = () => {
    setItemsApi(props.route.params.id, props.route.params.type);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#793DFD" />
      <UserHeader {...props} />
      <View style={{ flex: 7 }}>
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 100 }} data={data} renderItem={({ item }) => {
          let image = [];
          let video = []
          let voice = [];
          if(item.image){
            image = item.image.map((value, index) => {
              return(
                <View key={index}>
                  <Image resizeMode={"stretch"} style={styles.image}
                         source={{ uri: imageDomain + `gallery/${value.image}` }} />
                </View>
              )
            })
          }

          if(item.video){
            video = item.video.map((value, index) => {
              return(
                <View key={index}>
                  <VideoPlayer
                    style={{ marginTop: normalize(20), borderRadius: normalize(20) }}
                    video={{ uri: imageDomain + `gallery/${value.image}` }}
                    videoWidth={1600}
                    videoHeight={900}
                    pauseOnPress={true}
                    resizeMode={'contain'}
                    thumbnail={require('../assets/images/MahsaOnlin.png')}
                    customStyles={{ thumbnail: { backgroundColor: "#fff" } }}
                    endThumbnail={require('../assets/images/MahsaOnlin.png')}
                  />
                </View>
              )
            })
          }
          if(item.voice){
            voice = item.voice.map((value, index) => {
              return(
                <View key={index}>
                  <VideoPlayer
                    style={{ marginTop: normalize(20),
                      borderRadius: normalize(20) }}
                    video={{ uri: imageDomain + `gallery/${value.image}` }}
                    videoWidth={1600}
                    videoHeight={900}
                    disableControlsAutoHide={true}
                    pauseOnPress={true}
                    thumbnail={require('../assets/images/MahsaOnlin.png')}
                    customStyles={{ thumbnail: { backgroundColor: "#fff" } }}
                    endThumbnail={require('../assets/images/MahsaOnlin.png')}
                  />
                </View>
              )
            })
          }
          return (
            <View style={{ padding: normalize(20) }}>
              <Text style={styles.title}> {item.title}</Text>
              <Text style={styles.text}>{item.text}</Text>
              {
                image
              }
              {
                video
              }
              {
                voice
              }
            </View>
          );
        }}
          keyExtractor={(item, index) => item.id + index} />
      </View>
      {
        activationContext ? (<Footer />) : null
      }
      <MyAlert visible={wifiAlert}
               message={"اتصال به اینترنت خود را بررسی کنید"}
               title={"خطای ارتباط با سرور"}
               type={'wifi'}
               buttonOnPress={() => {
                 setWifiAlert()
               }}/>
      <MyAlert visible={warningAlert}
               title={"سوالات متداول"}
               message={"جوابی تعریف نشده"}
               type={'warning'}
               buttonOnPress={() => {
                props.navigation.goBack();
                 setWarningAlert();
               }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: RFValue(25),
    marginBottom: normalize(20),
    color: "#793DFD",
    alignSelf: "center",
    fontFamily: "B Kamran Bold",
  },
  text: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(20),
    color: "black",
    textAlign:'right',
    lineHeight:35,
  },
  image: {
    marginTop: normalize(20),
    height: normalize(250),
    width: "100%",
    alignSelf: "center",
    borderRadius: normalize(20),
  },
  title: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(35),
    marginBottom: normalize(10),
    color: "#793DFD",
  },
});

export { AnswersScreen };
