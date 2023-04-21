import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StatusBar,
  Image, Text,
  TouchableOpacity,
  FlatList,
  StyleSheet, RefreshControl,
} from "react-native";
import { Api, AppContext, Footer, MyAlert, Styles, UserHeader } from "../Components";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import normalize from "react-native-normalize";


const MahsaOnlineLearns = (props) => {
  const [data,setData] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const { activationContext,wifiAlert,
    setWifiAlert,warningAlert,submitContext,
    setWarningAlert} = useContext(AppContext);



  const onRefresh = () => {
    setRefreshing(true)
      fetch(Api+"guide/learn", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      })
        .then((response) => response.json())
        .then((json) => {
          setRefreshing(false)
          if(json.learn.length !== 0){
            setData(json.learn)
          }else setWarningAlert()
        })
        .catch(() => {
          setRefreshing(false)
          setWifiAlert()
        });
  }

 useEffect(() => {
    try {
      setRefreshing(true)
      fetch(Api+"guide/learn", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      })
        .then((response) => response.json())
        .then((json) => {
          setRefreshing(false)
          if(json.learn.length !== 0){
            setData(json.learn)
          }else setWarningAlert()
        })
        .catch(() => {
          setRefreshing(false)
          setWifiAlert()
        });
    } catch (error) {
      console.error(error);
    }
  },[])

  return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#793DFD" />
        <UserHeader {...props} />
        {
          data.length !== 0 ?
            <View style={{ flex: 6 , justifyContent:'center',top:30}}>
              <View style={Styles.learnTouchableContainer}>
                <FlatList
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                  data={data} renderItem={({item}) => {
                  return(
                    <View>
                      <TouchableOpacity
                        onPress={() => props.navigation.navigate('AnswersScreen',{id:item.id , type:'learn'})}
                        style={Styles.learnTouchableOpacity}>
                        <FontAwesome style={{width:normalize(50)}} name={'cubes'} color={'#793DFD'} size={normalize(30)} />
                        <Text style={Styles.learnTitleText}> {item.title}</Text>
                      </TouchableOpacity>

                    </View>
                  )
                }}
                  keyExtractor={(item, index) => item.id + index }
                />

              </View>

            </View>
            : <View/>
        }
        <MyAlert visible={wifiAlert}
                 message={"اتصال به اینترنت خود را بررسی کنید"}
                 title={"خطای ارتباط با سرور"}
                 type={'wifi'}
                 buttonOnPress={() => setWifiAlert()}/>
        <MyAlert visible={warningAlert}
                 title={"آموزش مهسا آنلاین"}
                 message={"آموزشی وجود ندارد"}
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
export { MahsaOnlineLearns };
