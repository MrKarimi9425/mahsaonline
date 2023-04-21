import React, { useContext, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  RefreshControl,
} from "react-native";
import { Api, AppContext, Footer, imageDomain, UserHeader } from "./index";
import { MyAlert } from "./index";
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";

const CourseBought = (props) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [title, setTitle] = React.useState();

  const {
    idCourseContext, activationContext,
    setWifiAlert, wifiAlert,
  } = useContext(AppContext);

  const onRefresh = () => {
    try {
      setRefreshing(true);
      fetch(Api + "course/motive", {
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
          setRefreshing(false);
          setData(json.data);
          setTitle(json.title);
        });

    } catch (error) {
      setRefreshing(false);
      setWifiAlert();
    }
  };

  useEffect(() => {
    try {
      setRefreshing(true);
      fetch(Api + "course/motive", {
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
          setRefreshing(false);
          if (typeof json !== "undefined") {
            setData(json.data);
            setTitle(json.title);
          }
        });

    } catch (error) {
      setRefreshing(false);
      setWifiAlert();
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#793DFD" />
      <UserHeader {...props} />
      <View style={{ flex: 8 }}>
        <Text style={styles.titleText}> {title}</Text>
        {
          !data ?
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "black", fontSize: RFValue(35), fontFamily: "B Kamran Bold" }}> اطلاعاتی تعریف نشده </Text>
            </View> :
            <FlatList refreshControl={<RefreshControl refreshing={refreshing}
                                                      onRefresh={onRefresh} />}
                      contentContainerStyle={{ paddingBottom: normalize(100) }}
                      data={data} renderItem={({ item }) => {
                        console.log('item',item)
              return (
                <View style={{ padding: normalize(20), justifyContent: "center", alignItems: "center" }}>
                  <Text style={styles.text}> {item.text}</Text>
                  {
                    item.file !== null ?
                      <Image resizeMode={"stretch"} style={styles.image}
                             source={{ uri: imageDomain + `motive/${item.file}` }} />
                      : <View />
                  }
                </View>
              );
            }}
                      keyExtractor={(item, index) => item.id + index}
            />
        }
      </View>
      {
        activationContext ? (<Footer />) : null
      }
      <MyAlert visible={wifiAlert}
               message={"اتصال به اینترنت خود را بررسی کنید"}
               title={"خطای ارتباط با سرور"}
               type={"wifi"}
               buttonOnPress={() => setWifiAlert()} />
    </View>

  );
};
const styles = StyleSheet.create({
  videosContainer: {
    marginBottom: normalize(10),
    backgroundColor: "#fff",
    elevation: 20,
    borderRadius: normalize(25),
    alignItems: "center",
    width: "90%",
  },
  videosContentContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
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
  },
  videosContent: {
    width: "40%",
    height: normalize(80),
    margin: normalize(5),
  },
  image: {
    width: "90%",
    height: normalize(200),
  },
});
export { CourseBought };
