import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,LogBox,
  Text,
  View, FlatList,ScrollView,
  RefreshControl, Dimensions, Animated,
} from "react-native";
import { Footer, UserHeader, AppContext, Api, MyAlert, imageDomain } from "../Components";
import { RFValue } from "react-native-responsive-fontsize";
import normalize from "react-native-normalize";
import Ionicons from "react-native-vector-icons/Ionicons";

const windowWidth = Dimensions.get("window").width;

const { width } = Dimensions.get("window");
const itemWidth = (width / 3) * 2;
const padding = (width - itemWidth) / 2;
const offset = itemWidth;

const offset2 = itemWidth;

const offset3 = itemWidth;

const InfoText = (props) => {
  return (
    <Text style={styles.text}> {props.value} {props.unit}</Text>
  );
};

const ComparisonScreen = (props) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollK = useRef(new Animated.Value(0)).current;

  const [bodyData, setBodyData] = useState();
  const [backImages, setBackImages] = useState([]);
  const [frontImages, setFrontImages] = useState([]);
  const [sideImages, setSideImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {
    auth_KeyContext, wifiAlert,
    setWifiAlert,
  } = useContext(AppContext);

  // اطلاعات بدن شخصی که از قبل اطلاعاتش را وارد کرده دریافت میکند
  const onRefresh = () => {
      setRefreshing(true);
      fetch(Api + "report/all_data", {
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
          console.log("json", json);
          setBodyData(json.data);
          setFrontImages(json.front);
          setBackImages(json.back);
          setSideImages(json.side);
        })
        .catch((error) => {
          setRefreshing(false);
          setWifiAlert();
        });
  };
  useEffect(() => {
    try {
      setRefreshing(true);
      fetch(Api + "report/all_data", {
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
          setBodyData(json.data);
          setFrontImages(json.front);
          setBackImages(json.back);
          setSideImages(json.side);
        })
        .catch((error) => {
          setRefreshing(false);
          setWifiAlert();
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [])


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <UserHeader {...props} />
      <View style={{ flexDirection: "column", flex: 7 }}>

          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <View>
              <Text style={styles.imagesText}>عکس از جلو</Text>
              <View style={styles.imageContainer}>

                <FlatList horizontal
                          pagingEnabled
                          decelerationRate="fast"
                          contentContainerStyle={styles.scrollView}
                          showsHorizontalScrollIndicator={false}
                          snapToInterval={offset}
                          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                            useNativeDriver: false,
                          })} data={frontImages} renderItem={({ item, index }) => {
                  // console.log('item',item.image)
                  const scale = scrollX.interpolate({
                    inputRange: [-offset + index * offset, index * offset, offset + index * offset],
                    outputRange: [0.75, 1, 0.75],
                  });
                  return (
                    <View key={index} style={styles.imageContainer}>
                      {
                        item.image != "empty" ?  <Animated.Image source={{ uri: imageDomain + `body_info/${item.image}` }}
                                                                 style={[styles.item, { transform: [{ scale }] }]}
                                                                 resizeMode={"stretch"} resizeMethod={"resize"} /> :
                          <Image style={styles.item} resizeMode={'stretch'}
                                 source={require('../assets/images/MahsaOnlin.png')} />
                      }
                    </View>
                  );
                }}
                          keyExtractor={(item, index) => item.key + index} />

              </View>

              <View style={{ marginTop: 20 }}>
                <Text style={styles.imagesText}>عکس از پهلو</Text>
                <View style={styles.imageContainer}>
                  <FlatList horizontal
                            pagingEnabled
                            decelerationRate="fast"
                            contentContainerStyle={styles.scrollView}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={offset}
                            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollY } } }], {
                              useNativeDriver: false,
                            })} data={sideImages} renderItem={({ item, index }) => {
                    const scale = scrollY.interpolate({
                      inputRange: [-offset2 + index * offset2, index * offset2, offset2 + index * offset2],
                      outputRange: [0.75, 1, 0.75],
                    });
                    return (
                      <View key={index} style={styles.imageContainer}>
                        {
                          item.image != "empty" ?  <Animated.Image source={{ uri: imageDomain + `body_info/${item.image}` }} style={[styles.item, { transform: [{ scale }] }]}
                                                                   resizeMode={"cover"} /> : <Image style={styles.item} resizeMode={"stretch"} resizeMethod={"resize"}
                                                                                                    source={require('../assets/images/MahsaOnlin.png')} />
                        }
                      </View>
                    );
                  }}
                            keyExtractor={(item, index) => item.key + index}/>

                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.imagesText}>عکس از پشت</Text>
                <View style={styles.imageContainer}>
                  <FlatList horizontal
                            pagingEnabled
                            decelerationRate="fast"
                            contentContainerStyle={styles.scrollView}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={offset3}
                            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollK } } }], {
                              useNativeDriver: false,
                            })} data={backImages} renderItem={({ item, index }) => {
                    const scale = scrollK.interpolate({
                      inputRange: [-offset3 + index * offset3, index * offset3, offset3 + index * offset3],
                      outputRange: [0.75, 1, 0.75],
                    });
                    return (
                      <View key={index} style={styles.imageContainer}>
                        {
                          item.image != "empty" ?  <Animated.Image  source={{ uri: imageDomain + `body_info/${item.image}` }} style={[styles.item, { transform: [{ scale }] }]}
                                                                    resizeMode={"cover"} /> : <Image style={styles.item} resizeMode={"stretch"} resizeMethod={"resize"}
                                                                                                     source={require('../assets/images/MahsaOnlin.png')} />
                        }
                      </View>
                    );
                  }}
                            keyExtractor={(item, index) => item.key + index}/>

                </View>
              </View>
            </View>
            <View style={{marginTop: 30}}>
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }} data={bodyData} renderItem={({ item }) => {
                  // console.log('bodyData',bodyData)
                // let feature = [];
                //
                // if(item.feature){
                //   feature = item.feature.map((value, index) => {
                //     return(
                //       <View style={{ flexDirection: "row" }} key={value.id + index}>
                //         <Text style={styles.courseDescription}> {value.feature}</Text>
                //         <Ionicons color={"green"} size={normalize(20)} name={"checkmark-sharp"} />
                //       </View>
                //     )
                //   })
                // }
                return (
                  <View style={{flexDirection: "row" }}>
                    <View style={styles.container}>
                      <View style={styles.informationTextContainer}>
                        <View style={{ flexDirection: "column" }}>
                          <InfoText value={item.age} unit={" سال"} />
                          <InfoText value={item.height} unit={" سانتی متر"} />
                          <InfoText value={item.weight} unit={" کیلوگرم"} />
                          <InfoText value={item.arm} unit={" سانتی متر"} />
                          <InfoText value={item.chest} unit={" سانتی متر"} />
                          <InfoText value={item.under_chest} unit={" سانتی متر"} />


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
                          <InfoText value={item.waist} unit={" سانتی متر"} />
                          <InfoText value={item.belly} unit={" سانتی متر"} />
                          <InfoText value={item.butt} unit={" سانتی متر"} />
                          <InfoText value={item.shin} unit={" سانتی متر"} />
                          <InfoText value={item.thigh} unit={" سانتی متر"} />

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
                )
              }}
                keyExtractor={(item, index) => item.key + index} />
            </View>

          </ScrollView>
      </View>
      <MyAlert visible={wifiAlert}
               message={"اتصال به اینترنت خود را بررسی کنید"}
               title={"خطای ارتباط با سرور"}
               type={"wifi"}
               buttonOnPress={() => setWifiAlert()} />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    margin: normalize(5),
    marginTop: normalize(40),
    borderRadius: normalize(30),
    borderWidth: 2,
    paddingHorizontal: normalize(10),
    paddingTop: normalize(25),
    alignItems: "center",
    marginBottom: normalize(30),
    borderColor: "#793DFD",
  },
  scrollView: {
    paddingHorizontal: padding,
    alignItems: 'center',
  },
  item: {
    height: itemWidth + 50,
    width: itemWidth,
    borderRadius: 10,
  },
  informationTextContainer: {
    width: "100%",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: normalize(10),
  },
  // imageContainer: {
  //   flex: 2,
  //   flexDirection: "row",
  //   justifyContent: "space-evenly",
  //   alignItems: "center",
  // },
  imagesText: {
    color: "#000000",
    fontSize: RFValue(25),
    alignSelf: "center",
    fontFamily: "B Kamran Bold",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: RFValue(14),
    fontFamily: "B Kamran Bold",
    color: "#D70078",
  },
});

export { ComparisonScreen };
