import React, { useEffect, useRef, useState, useContext } from "react";
import { Api, AppContext, BuyCourse, CourseBought, MyAlert } from "../Components";

const Courses = (props) => {

  const { activationContext } = useContext(AppContext);

  if (activationContext) {
    return <CourseBought {...props} />;
  } else {
    return <BuyCourse {...props} />;
  }
};
export { Courses };
