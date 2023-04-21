import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ActiveCodeScreen,
  firstScreen,
  LoginScreen,
  SignUpScreen,
  Dashboard,
  bodyInfo,
  OfflineBuy,
  ReportScreen,
  Courses,
  Factors, AnswersScreen,
  CalendarScreen, RouteScreen,
  LearnScreen,
  UpdateInformation,
  ComparisonScreen,
  Questions,
  GuideScreen,
  MahsaOnlineLearns,
  SplashScreen,
  TicketScreen,
  SubscribeScreen, ShowInfo, SubmitInformation,
} from "../Screens";

import { AppContext } from "./AppContext";
import {
  OfflineBuyNutrition,
  ShowInfoNutrition,
  SubmitInfo,
  TicketNutrition,
  UserNutrition,
  IdealWeight,
  FirstScreen
} from "../Screens/Nutrition"

const Stack = createNativeStackNavigator();
const App = () => {

  const [dataExist, setDataExist] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [auth_Key, setAuth_Key] = useState(null);
  const [idCourse, setIdCourse] = useState();
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [activation, setActivation] = useState();
  const [submit,setSubmit] = useState();
  const [activeId, setActiveId] = useState();
  const [bodyInfoUpdate, setBodyInfoUpdate] = useState(false);
  const [error,setError] = useState(false)
  const [warning,setWarning] = useState(false)
  const [wifi,setWifi] = useState(false)
  const [success,setSuccess] = useState(false)
  const [reportAlert,setReportAlert] = useState(false)
  const [buyTimeAlert,setBuyTimeAlert] = useState(false)
  const [chatTimeAlert,setChatTimeAlert] = useState(false)
  const [subAlert,setSubAlert] = useState(false)
  const [courseAlert,setCourseAlert] = useState(false)
  const [update,setUpdate] = useState(false)


  const data = {
    setPhoneNumberContext: (value) => {
      setPhoneNumber(value);
    },
    phoneNumberContext: phoneNumber,

    setShowBuyModalContext: () => {
      setShowBuyModal(!showBuyModal);
    },
    ShowBuyModalContext: showBuyModal,

    setShowImageModalContext: () => {
      setShowImageModal(!showImageModal);
    },
    showImageModalContext: showImageModal,

    setShowInstagramModalContext: () => {
      setShowInstagramModal(!showInstagramModal);
    },
    showInstagramModalContext: showInstagramModal,

    setAuth_KeyContext: (value) => {
      setAuth_Key(value);
    },
    auth_KeyContext: auth_Key,

    setActivationContext: (value) => {
      setActivation(value);
    },
    activationContext: activation,

    setSubmitContext: (value) => {
      setSubmit(value);
    },
    submitContext: submit,

    setDataExistContext: (value) => {
      setDataExist(value);
    },
    dataExistContext: dataExist,

    setIdCourseContext: (value) => {
      setIdCourse(value);
    },
    idCourseContext: idCourse,

    setActiveIdContext: (value) => {
      setActiveId(value);
    },
    activeIdContext: activeId,

    setBodyInfoUpdateContext: (value) => {
      setBodyInfoUpdate(value);
    },
    bodyInfoUpdateContext: bodyInfoUpdate,

    setErrorAlert: () => {
      setError(!error);
    },
    errorAlert: error,

    setWarningAlert: () => {
      setWarning(!warning);
    },
    warningAlert: warning,

    setSuccessAlert: () => {
      setSuccess(!success);
    },
    successAlert: success,

    setWifiAlert: () => {
      setWifi(!wifi);
    },
    wifiAlert: wifi,

    setReportAlert: () => {
      setReportAlert(!reportAlert);
    },
    reportAlert: reportAlert,

    setBuyTimeAlert: () => {
      setBuyTimeAlert(!buyTimeAlert);
    },
    buyTimeAlert: buyTimeAlert,

    setChatTimeAlert: () => {
      setChatTimeAlert(!chatTimeAlert);
    },
    chatTimeAlert: chatTimeAlert,

    setSubAlert: () => {
      setSubAlert(!subAlert);
    },
    subAlert: subAlert,

    setCourseAlert: () => {
      setCourseAlert(!courseAlert);
    },
    courseAlert: courseAlert,

    setUpdate: () => {
      setUpdate(!update);
    },
    update: update,
  };


  return (
    <NavigationContainer>
      <AppContext.Provider value={data}>
        <Stack.Navigator initialRouteName={"SplashScreen"} screenOptions={{ headerShown: false }}>
          <Stack.Screen name={"firstScreen"} component={firstScreen} />
          <Stack.Screen name={"Dashboard"} component={Dashboard} />
          <Stack.Screen name={"LoginScreen"} component={LoginScreen} />
          <Stack.Screen name={"SignUpScreen"} component={SignUpScreen} />
          <Stack.Screen name={"ActiveCodeScreen"} component={ActiveCodeScreen} />
          <Stack.Screen name={"ShowInfo"} component={ShowInfo} />
          <Stack.Screen name={"SubmitInformation"} component={SubmitInformation} />
          <Stack.Screen name={"OfflineBuy"} component={OfflineBuy} />
          <Stack.Screen name={"Courses"} component={Courses} />
          <Stack.Screen name={"ReportScreen"} component={ReportScreen} />
          <Stack.Screen name={"Factors"} component={Factors} />
          <Stack.Screen name={"CalendarScreen"} component={CalendarScreen} />
          <Stack.Screen name={"LearnScreen"} component={LearnScreen} />
          <Stack.Screen name={"UpdateInformation"} component={UpdateInformation} />
          <Stack.Screen name={"ComparisonScreen"} component={ComparisonScreen} />
          <Stack.Screen name={"Questions"} component={Questions} />
          <Stack.Screen name={"GuideScreen"} component={GuideScreen} />
          <Stack.Screen name={"SplashScreen"} component={SplashScreen} />
          <Stack.Screen name={"MahsaOnlineLearns"} component={MahsaOnlineLearns} />
          <Stack.Screen name={"AnswersScreen"} component={AnswersScreen} />
          <Stack.Screen name={"RouteScreen"} component={RouteScreen} />
          <Stack.Screen name={"TicketScreen"} component={TicketScreen} />
          <Stack.Screen name={"SubscribeScreen"} component={SubscribeScreen} />
          <Stack.Screen name={"SubmitInfo"} component={SubmitInfo} />
          <Stack.Screen name={"ShowInfoNutrition"} component={ShowInfoNutrition} />
          <Stack.Screen name={"UserNutrition"} component={UserNutrition} />
          <Stack.Screen name={"OfflineBuyNutrition"} component={OfflineBuyNutrition} />
          <Stack.Screen name={"TicketNutrition"} component={TicketNutrition} />
          <Stack.Screen name={"FirstScreen"} component={FirstScreen} />
          <Stack.Screen name={"IdealWeight"} component={IdealWeight} />
        </Stack.Navigator>
      </AppContext.Provider>
    </NavigationContainer>
  );
};

export default App;
