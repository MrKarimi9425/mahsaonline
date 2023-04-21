import React, { useEffect, useRef, useState, useContext } from "react";
import {AppContext, BuySubscribe, CourseBought,  } from "../Components";


const SubscribeScreen = (props) => {

  const {activationContext} = useContext(AppContext);

  if (activationContext) {
    return <CourseBought {...props} />;
  } else{
    return <BuySubscribe {...props} />
  }
};
export { SubscribeScreen };
