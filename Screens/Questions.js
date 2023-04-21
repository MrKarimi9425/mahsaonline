import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet, RefreshControl,
} from "react-native";
import { Api, AppContext, Footer, MyAlert, Styles, UserHeader } from "../Components";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import normalize from "react-native-normalize";
import { RFValue } from "react-native-responsive-fontsize";


const Questions = (props) => {
  const [data, setData] = useState([])

  const { activationContext, wifiAlert,
    setWifiAlert, warningAlert, submitContext,
    setWarningAlert } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);


  const question = () => {
    try {
      setRefreshing(true)
      fetch(Api + "guide/faq", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      })
        .then((response) => response.json())
        .then((json) => {
          setRefreshing(false)
          if (json.faq.length !== 0)
            setData(json.faq)
          else setWarningAlert()
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
    question()
  }


  useEffect(() => {
    question()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#793DFD" />
      <UserHeader {...props} />
      {
        data.length !== 0 ?
          <View style={{ flex: 6, justifyContent: 'center', top: 30 }}>
            <View style={Styles.learnTouchableContainer}>
              <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={data} renderItem={({ item }) => {
                  return (
                    <View>
                      <TouchableOpacity
                        onPress={() => props.navigation.navigate('AnswersScreen', { id: item.id, type: 'faq' })}
                        style={Styles.learnTouchableOpacity}>
                        <FontAwesome style={{ width: normalize(30) }} name={'question-circle'} color={'#793DFD'} size={normalize(30)} />
                        <Text style={Styles.learnTitleText}> {item.title}</Text>
                      </TouchableOpacity>

                    </View>
                  )
                }}
                keyExtractor={(item, index) => item.id + index} />

            </View>

          </View>
          :
          <View />
      }
      <MyAlert visible={wifiAlert}
        message={"اتصال به اینترنت خود را بررسی کنید"}
        title={"خطای ارتباط با سرور"}
        type={'wifi'}
        buttonOnPress={() => setWifiAlert()} />
      <MyAlert visible={warningAlert}
        title={"سوالات متداول"}
        message={"سوالی تعریف نشده"}
        type={'warning'}
        buttonOnPress={() => {
          setWarningAlert();
          props.navigation.goBack()
        }} />
      {
        activationContext ? (<Footer />) : null
      }
    </View>

  )
}

export { Questions };
