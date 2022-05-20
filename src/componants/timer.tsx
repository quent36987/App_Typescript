import React, { useState } from 'react';
import "./timer.css";

export type TimerProps = {
    exercise_time : number,
    rest_time : number,
    cycles : number,
    recovery_time : number,
    exercise : string[],
    name : string,
  }

function Timer  ( Prop : TimerProps)  {
    const [cycle, setCycle] = useState("0/0");

    //const
    const FULL_DASH_ARRAY = 283;
    const RESET_DASH_ARRAY = `-57 ${FULL_DASH_ARRAY}`;

    //state
    let timerInterval = 0;
    let is_pause = false;

    //DOM elements
    let timer = document.querySelector("#base-timer-path-remaining")as HTMLElement;
    let timeLabel = document.getElementById("base-timer-label") as HTMLElement;
    let setslabel = document.getElementById("sets") as HTMLElement;
    let exerciceslabel = document.getElementById("exercices") as HTMLElement;

    //All buttons
    let startBtn = document.getElementById("start")as HTMLButtonElement;
    let stopBtn = document.getElementById("stop") as HTMLButtonElement;


    function setDisabled(button : HTMLButtonElement) {
        button.setAttribute("disabled", "disabled");
    }
      
    function removeDisabled(button: HTMLButtonElement) {
        button.removeAttribute("disabled");
    }

    enum TYPE_TIMER {
        Exo,
        Rest,
        Recovery,
    }

    
    type Timer = {
        timer : number,
        type : TYPE_TIMER,
        name? : string,
    }
    
    class Trainning
    {
    
        timers : Array<Timer> = [];
        exercise_time : number = 0;
        rest_time : number = 0;
        cycles : number = 1;
        recovery_time : number = 0;
        exercise : string[] = [];

        _cycle : number = 0;
        _set : number = 0;
       
        constructor(val : TimerProps)
        {
            this.exercise_time = val.exercise_time;
            this.rest_time = val.rest_time;
            this.cycles = val.cycles;
            this.exercise = val.exercise;
            this.recovery_time = val.recovery_time;
            //setCycle(this._cycle.toString()+"/" + this.cycles.toString());
        }
    
        //get the time total in seconds
        get_exercise_time_total()
        {
            var time_exo_tt = this.exercise_time * this.exercise.length * this.cycles;
            time_exo_tt += this.rest_time * (this.exercise.length - 1) * this.cycles;
            time_exo_tt += this.recovery_time * (this.cycles-1);
            return time_exo_tt;
        }
    
        setCircleDasharray(timeLeft : number, timetotal : number) {
            const rawTimeFraction = timeLeft / timetotal;
            const TimeFraction = rawTimeFraction - (1 / timetotal) * (1 - rawTimeFraction);
            const circleDasharray = `${(
            TimeFraction * FULL_DASH_ARRAY
          ).toFixed(0)} 283`;
          timer?.setAttribute("stroke-dasharray", circleDasharray);
        }
    
        formatTime(time : number) {
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;
            if (seconds < 10) {
                return `${minutes}:0${seconds}`
            }
            return `${minutes}:${seconds}`;
        }
    
        timerOn()
        {
            console.log("timerOn");
            if (this.timers.length > 0)
            {
                const timer = this.timers.pop();
                let i = -1;
                if(timer?.name && timeLabel){
                    exerciceslabel.innerHTML = timer.name;
                    i = timer.timer;
                }
                else{
                    exerciceslabel.innerHTML = "";
                }
        
                timerInterval = window.setInterval(() => { 
                    if(!is_pause)
                    {
                        
                        console.log("pause :" +  is_pause);
                        if (timer?.timer  && i !== -1 && i > 0)
                        {
                            this.setCircleDasharray(i,timer.timer);
                            timeLabel.innerHTML = this.formatTime(i);
                            i--;
                        }
                        else if(timer  && i !== -1)
                        {
                            
                            timeLabel.innerHTML = this.formatTime(i);
                            if(timer.type === TYPE_TIMER.Exo)
                            {   
                                this._set+=1;
                                setCycle(this._cycle.toString()+"/" + this.cycles.toString());
                               setslabel.innerHTML = this._set.toString() + "/" + this.exercise.length.toString();  
                            }
                            else if(timer.type === TYPE_TIMER.Recovery)
                            {
                                this._cycle +=1;
                                this._set=1;
                                setCycle(this._cycle.toString()+"/" + this.cycles.toString());
                                setslabel.innerHTML = this._set.toString() + "/" + this.exercise.length.toString();
                            }
                            window.clearInterval(timerInterval);
                            this.timerOn();
                        }
                    }
                }, 1000);
            }
        }
        // play the tabata (timer)
        play()
        {
            for (let cycle = 0; cycle < this.cycles; cycle++) {
                for (let exo = 0; exo < this.exercise.length; exo++) {
                    // play the exercise
                    this.timers.unshift({timer : this.exercise_time, type : TYPE_TIMER.Exo, name : this.exercise[exo]});
                    // play the rest
                    if (exo < this.exercise.length - 1)
                    { 
                        this.timers.unshift({timer : this.rest_time, type : TYPE_TIMER.Rest, name : "Rest"});
                    }
                }
                // play the recovery
                if (cycle < this.cycles - 1)
                {
                    this.timers.unshift({timer : this.recovery_time, type : TYPE_TIMER.Recovery, name : "Recovery"});
                }
            }
            
            setslabel.innerHTML = "0/" + this.exercise.length.toString();
            this.timerOn();
           
        }
    }


    function start() { 
        if (!startBtn)
        {
           //DOM elements
            timer = document.querySelector("#base-timer-path-remaining")as HTMLElement;
            timeLabel = document.getElementById("base-timer-label") as HTMLElement;
            //All buttons
            startBtn = document.getElementById("start")as HTMLButtonElement;
            stopBtn = document.getElementById("stop") as HTMLButtonElement; 
            setslabel = document.getElementById("sets") as HTMLElement;
            exerciceslabel = document.getElementById("exercices") as HTMLElement;
        }

        setDisabled(startBtn);
        removeDisabled(stopBtn);
        if (!is_pause)
        {
            new Trainning(Prop).play();
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
      }

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
        <span className="time" id="cycles">{cycle}</span>
      </div>
    </div>
  </header>    
                  <span id="base-timer-label" className="base-timer__label">0:00</span>
                  <span id="base-timer-label2" className="base-timer__label2">0:00</span>
                </div>
              
                <h2 className='h2time' id="exercices">Exercise 1</h2>
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
              </div>
              </div>
        </div>
    );
}




export default Timer;