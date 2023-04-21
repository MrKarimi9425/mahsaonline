import React, { useContext, useEffect } from "react";

import { AppContext, Api } from "../Components";
import { View } from "react-native";
import { ShowInfo } from "./ShowInfo";
import { SubmitInformation } from "./SubmitInformation";

const bodyInfo = (props) => {
  const {
    auth_KeyContext,
    setDataExistContext,
    idCourseContext,
    dataExistContext} = useContext(AppContext);

  // چک میکند که آیا اطلاعات بدن از قبل وارد شده است یا خیر
  useEffect(() => {
    try {
      fetch(Api+"physic/body_info", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_key: auth_KeyContext,
          idCourse : idCourseContext
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if(json.data !== null)
            setDataExistContext(true)
          else setDataExistContext(false)
        }).catch((error) => {
          console.log('error',error)
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
   <View>
     {
       dataExistContext ? <ShowInfo {...props}/> : <SubmitInformation {...props}/>
     }
   </View>
  )

  // if (dataExistContext){
  //     return (
  //       <ShowInfoNutrition {...props}/>
  //     );
  // }else {
  //     return (
  //       <SubmitInformation {...props}/>
  //     )
  // }

}


export { bodyInfo };
