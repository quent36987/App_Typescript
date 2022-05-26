/*import {  arrayUnion, doc,  updateDoc } from "firebase/firestore";
import { AppState } from "../Context";
import { db } from "../firebase";*/
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { AppState } from "../Context";
import { Item } from "../data/Item_type";
import { db } from "../firebase";
import { Exo } from "../pages/ChronoListPage";

import "./timer.css";



const TimerRender = (param: Exo) => {
  const [time_lasfdbel, setTimefdsf] = useState(0);
  const { user } = AppState();
  //const
  const FULL_DASH_ARRAY = 283;
  const RESET_DASH_ARRAY = `-57 ${FULL_DASH_ARRAY}`;

  //state
  let timerInterval = 0;
  let is_pause = false;

  let _cycle = 0;
  let _set = 0;

  function setDisabled(button: HTMLButtonElement) {
    button.setAttribute("disabled", "disabled");
  }

  function removeDisabled(button: HTMLButtonElement) {
    button.removeAttribute("disabled");
  }

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
      return `${minutes}:0${seconds}`
    }
    return `${minutes}:${seconds}`;
  }

  return <div className="timer">
      <span>{param.titre}</span>
      <span>{formatTime(45)}</span>
    </div>

}




export default TimerRender;