import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  FlatList,
  RefreshControl, TouchableOpacity,
} from "react-native";
import { Api, AppContext, Footer, UserHeader, MyAlert, Styles } from "../Components";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import normalize from "react-native-normalize/src/index";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";

const GuideScreen = (props) => {

  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const { activationContext,wifiAlert,
    setWifiAlert,warningAlert,submitContext,
    setWarningAlert } = useContext(AppContext);

const quide = () => {
  try {
    setRefreshing(true)
    fetch(Api+"guide/guide", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('json',json)
        setRefreshing(false)
        if(json.data.length == 0) {
          setWarningAlert();
        }
        else
          setData(json.data)
      })
      .catch(() => {
        setRefreshing(false)
        props.navigation.goBack()
        setWifiAlert()
      });
  } catch (error) {
    console.error(error);
  }
}
  const onRefresh = () => {
  quide()
  }
    useEffect(() => {
quide()
    }, [])
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#793DFD" />
      <UserHeader {...props} />
      {
        data.length !== 0 ?
          <View style={{ flex: 6 , justifyContent:'center',top:30 }}>
            <View style={Styles.learnTouchableContainer}>
              <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={data} renderItem={({item}) => {

                return(
                  <View>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate('AnswersScreen',{id:item.id , type:'guide'})}
                      style={Styles.learnTouchableOpacity}>
                      <FontAwesome style={{width:normalize(30)}} name={'info-circle'} color={'#793DFD'} size={normalize(30)} />
                      <Text style={Styles.learnTitleText}> {item.title}</Text>
                    </TouchableOpacity>

                  </View>
                )
              }}
                keyExtractor={(item, index) => item.id + index }/>

            </View>

          </View>
          :
          <View/>
      }
      <MyAlert visible={wifiAlert}
               message={"اتصال به اینترنت خود را بررسی کنید"}
               title={"خطای ارتباط با سرور"}
               type={'wifi'}
               buttonOnPress={() => setWifiAlert()}/>
      <MyAlert visible={warningAlert}
               title={"راهنما"}
               message={"سوالی تعریف نشده"}
               type={'warning'}
               buttonOnPress={() => {
                 setWarningAlert();
                 props.navigation.goBack()
               }}/>
      {
        activationContext ? (<Footer />) : null
      }
    </View>
  )
}

export { GuideScreen };
