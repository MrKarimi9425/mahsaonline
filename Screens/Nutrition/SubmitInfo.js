import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal, Pressable, RefreshControl, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from "react-native";
import { Formik } from "formik";
import normalize from "react-native-normalize";
import { Provider as PaperProvider, RadioButton } from "react-native-paper";
import { Api, UserHeader, AppContext, Footer, MyAlert } from "../../Components";
import { RFValue } from "react-native-responsive-fontsize";
import { CheckBox } from "react-native-elements";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import * as yup from "yup";


const SubmitInfo = (props) => {

  const {
    setWifiAlert,
    setSuccessAlert,
    successAlert,
    auth_KeyContext,
    wifiAlert,
    update,
    setErrorAlert,
    errorAlert,
  } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [meal, setMeal] = useState(0);
  const [date, setDate] = useState(null);
  const [showDate,setShowDate] = useState(false)
  const [education,setEducation] = useState()
  const [vitamin_d,setVitamin_d] = useState()
  const [fastFood,setFastFood] = useState()
  const [fried,setFried] = useState()
  const [diet,setDiet] = useState()
  const [stop_weight,setStop_weight] = useState()

  const [options, setOptions] = useState({
    habit: [],
    ill: [],
  });
  const [response] = useState({
    habit: [],
    ill: [],
  });


  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // اطلاعات را دریافت میکند و برای سرور ارسال می کند
  const setApi = async (age, height, weight,medicine,disease,vigen,last_diet,motivation) => {
    // console.log({
    //   auth_key: auth_KeyContext,
    //   birthday: date,
    //   height: height,
    //   weight: weight,
    //   meal: meal,
    //   medicine: medicine,
    //   ill: response.ill,
    //   habit: response.habit,
    //   education:education,
    //   disease:disease,
    //   vitamin_d:vitamin_d,
    //   fastfood:fastFood,
    //   fried:fried,
    //   vigen:vigen,
    //   diet:diet,
    //   last_diet:last_diet,
    //   stop_weight:stop_weight,
    //   motivation:motivation
    // })
    setIsLoading(true);
      await fetch(Api + "package/insert_data", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_key: auth_KeyContext,
          birthday: date,
          height: height,
          weight: weight,
          meal: meal,
          medicine: medicine,
          ill: response.ill,
          habit: response.habit,
          education:education,
          disease:disease,
          vitamin_d:vitamin_d,
          fastfood:fastFood,
          fried:fried,
          vigen:vigen,
          diet:diet,
          last_diet:last_diet,
          stop_weight:stop_weight,
          motivation:motivation
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setIsLoading(false);
          if (typeof json.physic_id !== 'undefined') {
            props.navigation.navigate("ShowInfoNutrition", { physic_id: json.physic_id });
          }else {
            Alert.alert(
              null,
              json.message,
            )
          }
        })
        .catch((error) => {
          setIsLoading(false);
          setWifiAlert();
        });
  };

  // اطلاعات checkbox هارا دریافت می کند
  const getOptions = async () => {
    setRefreshing(true);
      await fetch(Api + "package/get_options", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setRefreshing(false);
          setOptions({
            habit: json.habit,
            ill: json.ill,
          });
          if (typeof props.route.params !== 'undefined'){
            response.habit = [];
            response.ill = [];
          }
        })
        .catch((error) => {
          setIsLoading(false);
          setWifiAlert();
        });
  };

  const MyCheckBox = ({ value }) => {
    const [checkBox, setCheckBox] = useState(false);
    return (
      <View>
        <CheckBox
          titleProps={{ color: "black", fontWeight: "bold" }}
          title={value.content}
          iconRight
          right
          checked={checkBox}
          size={30}
          onPressIn={() => setCheckBox(!checkBox)}
          onPress={() => {
            if (checkBox === true && value.type == "ill") {
              response.ill.push(value.content);
            } else if (checkBox === false && value.type == "ill") {
              response.ill.pop();
            }
            if (checkBox === true && value.type == "habit") {
              response.habit.push(value.content);
            } else if (checkBox === false && value.type == "habit") {
              response.habit.pop();
            }
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    getOptions();
    // console.log('props.route.params',props.route)
  }, []);

  const validationSchema = yup.object().shape({
    height:  yup.string().required("قدت رو وارد کن"),
    weight:  yup.string().required("وزنت رو وارد کن"),
  });
  return (
    <Formik initialValues={{
      age:"",
      height: "",
      weight: "",
      last_diet:"",
      medicine: "",
      vigen:"",
      disease:"",
      motivation:""
    }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                // console.log("response", response);
                setApi(values.age, values.height, values.weight,values.medicine,values.disease,values.vigen,values.last_diet,values.motivation);
                setSubmitting(false);
              }, 1000);
            }}>
      {
        ({
           handleChange,
           handleBlur,
           handleSubmit,
          errors,
          touched,
           values,
         }) =>
          <PaperProvider>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <UserHeader {...props} />
              <View style={{ flex: 7 }}>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                  getOptions();
                }} />}
                            contentContainerStyle={{ paddingBottom: 100 }}>
                  <View style={styles.container}>
                    <View style={styles.textInputContainerOne}>
                      <Text style={styles.textInputText}> تاریخ تولد</Text>
                      <TouchableOpacity onPress={() => {
                        setShowDate(true);
                      }} style={[styles.textInput, { textAlign: "center", paddingRight: 0,alignItems:'center',justifyContent:'center' }]}>
                        <Text style={{color:'black', fontFamily:'B Kamran Bold',fontSize:25}}>{date != null ? date : 'تاریخ تولد'}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}> چقدر تحصیلات داری؟</Text>
                      <RadioButton.Group onValueChange={newValue => setEducation(newValue)} value={education}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>دبستان</Text>
                          <RadioButton value={'دبستان'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>دبیرستان</Text>
                          <RadioButton value={'دبیرستان'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>دیپلم</Text>
                          <RadioButton value={'دیپلم'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>فوق دیپلم</Text>
                          <RadioButton value={'فوق دیپلم'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>لیسانس</Text>
                          <RadioButton value={'لیسانس'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>فوق لیسانس</Text>
                          <RadioButton value={'فوق لیسانس'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>دکتری</Text>
                          <RadioButton value={'دکتری'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>دانشجو</Text>
                          <RadioButton value={'دانشجو'} />
                        </View>
                      </RadioButton.Group>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <View style={styles.textInputContainerOne}>
                        <Text style={styles.textInputText}> وزن</Text>
                        <TextInput
                          onChangeText={handleChange("weight")}
                          keyboardType={"decimal-pad"}
                          onBlur={handleBlur("weight")}
                          value={values.weight}
                          placeholder={"وزن"} style={[styles.textInput, { textAlign: "center", paddingRight: 0 }]} />
                      </View>
                      <View style={styles.textInputContainerOne}>
                        <Text style={styles.textInputText}> قد</Text>
                        <TextInput
                          onChangeText={handleChange("height")}
                          onBlur={handleBlur("height")}
                          keyboardType={"decimal-pad"}
                          value={values.height}
                          placeholder={"قد"} style={[styles.textInput, { textAlign: "center", paddingRight: 0 }]} />
                      </View>
                      <View style={styles.textInputContainerOne}>
                        <Text style={styles.textInputText}> سن</Text>
                        <TextInput
                          onChangeText={handleChange("age")}
                          keyboardType={"decimal-pad"}
                          onBlur={handleBlur("age")}
                          value={values.age}
                          placeholder={"سن"} style={[styles.textInput, { textAlign: "center", paddingRight: 0 }]} />
                      </View>
                    </View>

                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}> آیا کمبود ویتامین دی داری؟</Text>
                      <RadioButton.Group onValueChange={newValue => setVitamin_d(newValue)} value={vitamin_d}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>بله</Text>
                          <RadioButton value={'بله'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>خیر</Text>
                          <RadioButton value={'خیر'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>نمیدونم</Text>
                          <RadioButton value={'نمیدونم'} />
                        </View>
                      </RadioButton.Group>
                    </View>
                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}> چه دارو هایی مصرف می‌کنی‌ ؟</Text>
                      <TextInput style={[styles.input, {
                        height: 100,
                        paddingVertical: 10,
                        textAlignVertical: "top",
                      }]}
                                 onChangeText={handleChange("medicine")}
                                 onBlur={handleBlur("medicine")}
                                 value={values.medicine}
                                 multiline={true}
                                 placeholder={"چه دارو هایی مصرف می‌کنی‌ ؟"}
                                 textAlign={"right"}
                      />
                    </View>

                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}> کدام وعده‌ها را بیرون میل می‌کنید؟</Text>
                      <RadioButton.Group onValueChange={newValue => setFastFood(newValue)} value={fastFood}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>صبحانه</Text>
                          <RadioButton value={'صبحانه'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>ناهار</Text>
                          <RadioButton value={'ناهار'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>شام</Text>
                          <RadioButton value={'شام'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>میان وعده</Text>
                          <RadioButton value={'میان وعده'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}> معمولا بیرون غذا نمی‌خورم</Text>
                          <RadioButton value={'معمولا بیرون غذا نمی‌خورم'} />
                        </View>
                      </RadioButton.Group>
                    </View>
                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}> کدام وعده‌های اصلی را بیشتر میل کنید؟</Text>
                      <RadioButton.Group onValueChange={newValue => setMeal(newValue)} value={meal}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>صبح</Text>
                          <RadioButton value={1} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>عصر</Text>
                          <RadioButton value={2} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>شب</Text>
                          <RadioButton value={3} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>هر سه وعده را از نظر مقداری یکسان می‌خورم</Text>
                          <RadioButton value={4} />
                        </View>
                      </RadioButton.Group>
                    </View>
                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}>چند بار در هفته غذای سرخ شده می‌خوری؟</Text>
                      <RadioButton.Group onValueChange={newValue => setFried(newValue)} value={fried}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>هرروز</Text>
                          <RadioButton value={'هرروز'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>یک روز در میان</Text>
                          <RadioButton value={'یک روز در میان'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>دوروز در هفته</Text>
                          <RadioButton value={'دوروز در هفته'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>خیلی کم</Text>
                          <RadioButton value={'خیلی کم'} />
                        </View>
                      </RadioButton.Group>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <View style={styles.textInputContainerOne}>
                        <Text style={styles.textInputText}> آیا گیاه خوار هستی؟</Text>
                        <TextInput
                          onChangeText={handleChange("vigen")}
                          onBlur={handleBlur("vigen")}
                          value={values.vigen}
                          placeholder={"در مورد رژیمت توضیح بده"} style={[styles.textInput, { textAlign: "right", paddingHorizontal:5 }]} />
                      </View>
                    </View>
                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}> آیا تا بحال رژیم داشته‌اید؟</Text>
                      <RadioButton.Group onValueChange={newValue => setDiet(newValue)} value={diet}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>بله</Text>
                          <RadioButton value={'بله'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>خیر</Text>
                          <RadioButton value={'خیر'} />
                        </View>
                      </RadioButton.Group>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <View style={styles.textInputContainerOne}>
                        <Text style={styles.textInputText}> چه مدت از آخرین رژیمی که گرفتی می‌گذرد؟</Text>
                        <TextInput
                          onChangeText={handleChange("last_diet")}
                          onBlur={handleBlur("last_diet")}
                          value={values.last_diet}
                          placeholder={"مثلا یک سال"} style={[styles.textInput, { textAlign: "right", paddingHorizontal:5 }]} />
                      </View>
                    </View>
                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}> آیا استپ وزنی کردی؟</Text>
                      <RadioButton.Group onValueChange={newValue => setStop_weight(newValue)} value={stop_weight}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>بله</Text>
                          <RadioButton value={'بله'} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                          <Text style={{ color: "#000" }}>خیر</Text>
                          <RadioButton value={'خیر'} />
                        </View>
                      </RadioButton.Group>
                    </View>
                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}> کدوم یکی از عادت های زیر رو داری‌ ؟</Text>
                      {
                        options.habit.map(value => {
                          return (
                            <View key={value.id}>
                              <MyCheckBox value={value} />
                            </View>
                          );
                        })
                      }
                    </View>
                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}> با کدوم بیماری دست و پنجه نرم می‌کنی‌ ؟</Text>
                      {
                        options.ill.map(value => {
                          return (
                            <View key={value.id}>
                              <MyCheckBox value={value} />
                            </View>
                          );
                        })
                      }
                      <TextInput style={[styles.input, {
                        height: 100,
                        paddingVertical: 10,
                        textAlignVertical: "top",
                      }]}
                                 onChangeText={handleChange("disease")}
                                 onBlur={handleBlur("disease")}
                                 value={values.disease}
                                 multiline={true}
                                 placeholder={"اگه توضیحات بیشتری نیاز داری تو این قسمت برامون بنویس"}
                                 textAlign={"right"}
                      />
                    </View>
                    <View style={{ marginTop: 25 }}>
                      <Text style={styles.textInputText}> انگیزه‌ات برای تغییر چیه؟</Text>
                      <TextInput style={[styles.input, {
                        height: 120,
                        paddingVertical: 10,
                        textAlignVertical: "top",
                      }]}
                                 onChangeText={handleChange("motivation")}
                                 onBlur={handleBlur("motivation")}
                                 value={values.motivation}
                                 multiline={true}
                                 textAlign={"right"}
                      />
                    </View>
                  </View>
                  {(errors.weight && touched.weight) &&
                  <Text
                    style={{ fontFamily: "B Kamran Bold",textAlign:'center', fontSize: RFValue(25), color: "#ff0000" }}>{errors.weight}</Text>
                  }
                  {(errors.height && touched.height) &&
                  <Text
                    style={{ fontFamily: "B Kamran Bold",textAlign:'center', fontSize: RFValue(25), color: "#ff0000" }}>{errors.height}</Text>
                  }
                  <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(25) }}>
                    <TouchableOpacity onPress={handleSubmit} style={styles.touchableOpacity}>
                      <Text style={{
                        bottom: normalize(5),
                        fontSize: RFValue(25),
                        fontFamily: "B Kamran Bold",
                        color: "#fff",
                      }}>ثبت</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
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
                    style={{ height: normalize(100), width: normalize(100) }}
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
              <MyAlert visible={successAlert}
                       message={message}
                       title={"ثبت اطلاعات"}
                       type={"success"}
                       buttonOnPress={() => {
                         setSuccessAlert();
                         props.navigation.navigate("ShowInfo");
                       }} />
              <MyAlert visible={errorAlert}
                       message={errorMessage}
                       title={"ثبت اطلاعات"}
                       type={"error"}
                       buttonOnPress={() => setErrorAlert()} />
            </View>
            <Modal visible={showDate} transparent animationType={"none"}>
              <Pressable onPress={() => setShowDate(false)} style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "#979797",
                opacity: 0.7,
              }} />
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <DatePicker
                  isGregorian={false}
                  options={{
                    defaultFont: 'B Kamran Bold',
                    headerFont: 'B Kamran Bold',
                  }}
                  onSelectedChange={(d) => {
                    let dte = d.split(' ');
                    let date = dte[0];
                    console.log('newDate',date)
                      setDate(date)
                  }}
                  mode={'calendar'}
                  selected={getFormatedDate(new Date(), 'jYYYY/jMM/jDD')}
                />
              </View>

            </Modal>
          </PaperProvider>

      }
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: normalize(20),
    borderWidth: 1,
    // backgroundColor: "#ffffff",
    marginTop: normalize(20),
    padding: normalize(15),
    elevation: 10,
    justifyContent: "center",
    borderColor: "#793DFD",
  },
  imageUpload: {
    backgroundColor: "#fff",
    elevation: 5,
    padding: normalize(8),
    width: "32%",
    borderWidth: 1,
    borderColor: "#793DFD",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  touchableOpacity: {
    width: normalize(120),
    height: normalize(40),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#793DFD",
    borderRadius: normalize(50),
  },
  imageUploadText: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(12),
    color: "black",
  },
  informationTextContainer: {
    width: "100%",
    backgroundColor: "#17d5a1",
    paddingRight: normalize(25),
    paddingLeft: normalize(25),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#f1f3f6",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  textInput: {
    width: "90%",
    height: normalize(45),
    backgroundColor: "#fff",
    borderRadius: normalize(5),
    borderWidth: 1,
    color: "black",
    borderColor: "#793DFD",
    elevation: 5,
    fontSize: RFValue(13),
    textAlign: "right",
    paddingRight: normalize(15),
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#FAB81C",
    width: "50%",
    height: normalize(40),
    borderRadius: 30,
  },
  modalButtonText: {
    fontFamily: "B Kamran Bold",
    fontSize: RFValue(20),
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    width: "95%",
    padding: normalize(20),
    borderRadius: 30,
    marginBottom: 20,
  },
  modalText: {
    fontFamily: "B Kamran Bold",
    textAlign: "center",
    fontSize: RFValue(22),
    color: "black",
  },
  textInputText: {
    color: "#000000",
    alignSelf: "flex-end",
    marginRight: normalize(10),
    fontSize: RFValue(20),
    fontFamily: "B Kamran Bold",
  },
  textInputContainerOne: {
    flex: 1,
    alignItems: "center",
    marginBottom: normalize(10),
  },
});

export { SubmitInfo };
