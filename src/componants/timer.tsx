/*import {  arrayUnion, doc,  updateDoc } from "firebase/firestore";
import { AppState } from "../Context";
import { db } from "../firebase";*/
import "./timer.css";

export type TimerProps = {
  exercises_time: number,
  rest_time: number,
  cycles: number,
  recovery_time: number,
  exercises: string[],
  name: string,
  type: string,
  pyramide?: string[],
  exercises_info?: number[],
  exercise_id: string,
}

enum TYPE_TIMER {
  Exo,
  Rest,
  Recovery,
}

type TypeTimer = {
  timer: number,
  type: TYPE_TIMER,
  name?: string,
  color: any,
}





const Timer = (Prop: TimerProps) => {
  //const { user } = AppState();

  //const
  const FULL_DASH_ARRAY = 283;
  const RESET_DASH_ARRAY = `-57 ${FULL_DASH_ARRAY}`;

  //state
  let timerInterval = 0;
  let is_pause = false;

  let timers: Array<TypeTimer> = [];
  let exercise_time = Prop.exercises_time;
  let rest_time = Prop.rest_time;
  let cycles = Prop.cycles;
  let recovery_time = Prop.recovery_time;
  let exercise = Prop.exercises;




  let _cycle = 0;
  let _set = 0;

  //DOM elements
  let timer = document.querySelector("#base-timer-path-remaining") as HTMLElement;
  let timeLabel = document.getElementById("base-timer-label") as HTMLElement;
  let setslabel = document.getElementById("sets") as HTMLElement;
  let cyclelabel = document.getElementById("cycles") as HTMLElement;
  let exerciceslabel1 = document.getElementById("exercices1") as HTMLElement;
  let exerciceslabel2 = document.getElementById("exercices2") as HTMLElement;
  let exerciceslabel3 = document.getElementById("exercices3") as HTMLElement;

  //All buttons
  let startBtn = document.getElementById("start") as HTMLButtonElement;
  let stopBtn = document.getElementById("stop") as HTMLButtonElement;


  function setDisabled(button: HTMLButtonElement) {
    button.setAttribute("disabled", "disabled");
  }

  function removeDisabled(button: HTMLButtonElement) {
    button.removeAttribute("disabled");
  }

  

  function SetExoLabel(time: TypeTimer) {
    if (time == null) {
      exerciceslabel1.innerHTML = "Ready !";
      exerciceslabel2.innerHTML = "Ready !";
      exerciceslabel3.innerHTML = "Ready !";
      return;
    }

    if (time.type === TYPE_TIMER.Exo) {
      exerciceslabel2.innerHTML = exercise[_set];
      if (_set < exercise.length - 1) {
        exerciceslabel3.innerHTML = " >  Rest";
      }
      else {
        if (_cycle < cycles - 1) {
          exerciceslabel3.innerHTML = " > Recovery";
        }
        else {
          exerciceslabel3.innerHTML = " > Fini !";
        }
      }
      if (_set > 0) {
        exerciceslabel1.innerHTML = "Rest > ";
      }
      else if (_cycle > 0) {
        exerciceslabel1.innerHTML = "Recovery > ";
      }
      else {
        exerciceslabel1.innerHTML = "Ready > ";
      }

    } else if (time.type === TYPE_TIMER.Rest) {
      exerciceslabel1.innerHTML = exercise[_set - 1] + " > ";
      exerciceslabel2.innerHTML = "Rest";
      exerciceslabel3.innerHTML = " > " + exercise[_set];
    } else {
      exerciceslabel1.innerHTML = exercise[exercise.length - 1] + " > ";
      exerciceslabel2.innerHTML = "Recovery";
      exerciceslabel3.innerHTML = " > " + exercise[0];
    }
  }




  function setCircleDasharray(timeLeft: number, timetotal: number) {
    const rawTimeFraction = timeLeft / timetotal;
    const TimeFraction = rawTimeFraction - (1 / timetotal) * (1 - rawTimeFraction);
    const circleDasharray = `${(
      TimeFraction * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    timer?.setAttribute("stroke-dasharray", circleDasharray);
  }

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
      return `${minutes}:0${seconds}`
    }
    return `${minutes}:${seconds}`;
  }


  function timerOn() {

    if (timers.length > 0) {
      const time = timers.pop();
      let i = -1;
      if (time?.name == null || time?.timer == null || timeLabel == null) {
        return;
      }
      SetExoLabel(time);

      i = time.timer;
      timer.style.color = time.color;
      cyclelabel.innerHTML = _cycle.toString() + "/" + cycles.toString();
      setslabel.innerHTML = _set.toString() + "/" + exercise.length.toString();
      if (time.type === TYPE_TIMER.Exo) {
        _set += 1;
        console.log("ici");

      }
      else if (time.type === TYPE_TIMER.Recovery) {
        _cycle += 1;
        _set = 0;
      }
      timerInterval = window.setInterval(() => {
        if (!is_pause) {
          timeLabel.innerHTML = formatTime(i)
          if (i > 0) {
            setCircleDasharray(i, time.timer);
            i--;
          }
          else if (i === 0) {
            window.clearInterval(timerInterval);
            timerOn();
          }
          else {

            window.clearInterval(timerInterval);
          }

        }
      }, 1000);
    }
    else {
      reset();
    }
  }
  // play the tabata (timer)
  function play() {
    for (let cycle = 0; cycle < cycles; cycle++) {
      for (let exo = 0; exo < exercise.length; exo++) {
        // play the exercise

        timers.unshift({ timer: Prop.type === "Serie Exo" ? Prop.exercises_info[exo] : exercise_time, type: TYPE_TIMER.Exo, name: exercise[exo], color: "red" });
        // play the rest
        if (exo < exercise.length - 1) {
          timers.unshift({ timer: rest_time, type: TYPE_TIMER.Rest, name: "Rest", color: "green" });
        }
      }
      // play the recovery
      if (cycle < cycles - 1) {
        timers.unshift({ timer: recovery_time, type: TYPE_TIMER.Recovery, name: "Recovery", color: "blue" });
      }
    }
    setslabel.innerHTML = "0/" + exercise.length.toString();
    cyclelabel.innerHTML = "0/" + cycles.toString();


    timerOn();
  }



  function start() {
    console.log("ee");
    if (!startBtn) {
      //DOM elements
      timer = document.querySelector("#base-timer-path-remaining") as HTMLElement;
      timeLabel = document.getElementById("base-timer-label") as HTMLElement;
      setslabel = document.getElementById("sets") as HTMLElement;
      cyclelabel = document.getElementById("cycles") as HTMLElement;
      exerciceslabel1 = document.getElementById("exercices1") as HTMLElement;
      exerciceslabel2 = document.getElementById("exercices2") as HTMLElement;
      exerciceslabel3 = document.getElementById("exercices3") as HTMLElement;

      //All buttons
      startBtn = document.getElementById("start") as HTMLButtonElement;
      stopBtn = document.getElementById("stop") as HTMLButtonElement;
    }

    setDisabled(startBtn);
    removeDisabled(stopBtn);
    if (!is_pause) {
      play();
    }
    is_pause = false;
  }

  function stopp() {
    setDisabled(stopBtn);
    removeDisabled(startBtn);
    startBtn.innerHTML = "Continue";
    is_pause = true;
  }


  function reset() {
    clearInterval(timerInterval);
    removeDisabled(startBtn);
    setDisabled(stopBtn);
    startBtn.innerHTML = "Start";
    timer.setAttribute("stroke-dasharray", RESET_DASH_ARRAY);
    timeLabel.innerHTML = "0:00";
    is_pause = false;

    timers = [];
    exercise_time = Prop.exercises_time;
    rest_time = Prop.rest_time;
    cycles = Prop.cycles;
    recovery_time = Prop.recovery_time;
    exercise = Prop.exercises;

    _cycle = 0;
    _set = 0;
    cyclelabel.innerHTML = _cycle.toString() + "/" + cycles.toString();
    setslabel.innerHTML = _set.toString() + "/" + exercise.length.toString();

    SetExoLabel(null);
    setCircleDasharray(0, 0);
    timer.style.color = "#2A265F";
  }

  function suivant() {
    window.clearInterval(timerInterval);
    if (_cycle === cycles) {
      reset();
      return;
    }
    timerOn();
  }

  async function finish()  {
    console.log("eee");
   /* if (user)
    {
      const UserDocRef = doc(db, 'Users', user.uid);
      const payload = { exo_log : arrayUnion({date : Date.now() , exo : Prop.exercise_id } ) };          
      try {
        await updateDoc(UserDocRef, payload);
      }
      catch (error)
      {
        console.log(error);
      }
    }
    else {

    }*/
    reset();
    window.location.href = "/chrono";
  };

  return (
    <div >
      <h1 className='h1time'>{Prop.name}</h1>
      <div className="base-chrono" id="app">
        <div className="base-timer">
          <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g className="base-timer__circle">
              <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
              <path id="base-timer-path-remaining" strokeDasharray="283" className="base-timer__path-remaining arc"
                d="
                               M 50, 50
                               m -45, 0
                               a 45,45 0 1,0 90,0
                               a 45,45 0 1,0 -90,0
                               "></path>
            </g>
          </svg>
          <header>
            <div className="session">
              <div className="breakCtrl">
                <p>Sets</p>
                <span className="time" id="sets">0/0</span>

              </div>
              <div className="sessionCtrl">
                <p>Cycles</p>
                <span className="time" id="cycles">0/0</span>
              </div>
            </div>
          </header>
          <span id="base-timer-label" className="base-timer__label">0:00</span>
          <span id="base-timer-label2" className="base-timer__label2">0:00</span>
        </div>

        <div style={{ "display": "flex", "alignItems": "center" }}>
          <h2 className='h2time2' id="exercices1">  Ready !</h2>
          <h2 className='h2time' id="exercices2">Ready !</h2>
          <h2 className='h2time2' id="exercices3">  Ready !</h2>
        </div>

        <div className="buttons">
          <button onClick={e => start()} className="bttn" id="start">
            Start
          </button>
          <button onClick={e => stopp()} className="bttn" id="stop">
            Stop
          </button>
          <button onClick={e => reset()} className="bttn" id="reset">
            Reset
          </button>
          <button className='bttn'
            id='suivant' onClick={e => suivant()}>
            Suivant
          </button>
          <button className='bttn'
             id='finish' onClick={e => finish()}>
            Finish
          </button>
        </div>

      </div>

    </div>
  );
}




export default Timer;