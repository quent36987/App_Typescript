import "./timer.css";

export type TimerProps = {
    exercise_time : number,
    rest_time : number,
    cycles : number,
    recovery_time : number,
    exercise : string[],
    name : string,
  }

  enum TYPE_TIMER {
    Exo,
    Rest,
    Recovery,
}

  type TypeTimer = {
    timer : number,
    type : TYPE_TIMER,
    name? : string,
}



const Timer = ( Prop : TimerProps) => {
    //const
    const FULL_DASH_ARRAY = 283;
    const RESET_DASH_ARRAY = `-57 ${FULL_DASH_ARRAY}`;

    //state
    let timerInterval = 0;
    let is_pause = false;

     let  timers : Array<TypeTimer> = [];
     let  exercise_time  = Prop.exercise_time;
     let  rest_time = Prop.rest_time;
     let   cycles  = Prop.cycles;
     let  recovery_time =Prop.recovery_time;
     let  exercise = Prop.exercise;

     let   _cycle  = 0;
     let   _set  = 0;

    //DOM elements
    let timer = document.querySelector("#base-timer-path-remaining")as HTMLElement;
    let timeLabel = document.getElementById("base-timer-label") as HTMLElement;
    let setslabel = document.getElementById("sets") as HTMLElement;
    let cyclelabel = document.getElementById("cycles") as HTMLElement;
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

    
        function  setCircleDasharray(timeLeft : number, timetotal : number) {
            const rawTimeFraction = timeLeft / timetotal;
            const TimeFraction = rawTimeFraction - (1 / timetotal) * (1 - rawTimeFraction);
            const circleDasharray = `${(
            TimeFraction * FULL_DASH_ARRAY
          ).toFixed(0)} 283`;
          timer?.setAttribute("stroke-dasharray", circleDasharray);
        }
    
        function  formatTime(time : number) {
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;
            if (seconds < 10) {
                return `${minutes}:0${seconds}`
            }
            return `${minutes}:${seconds}`;
        }

    
       function timerOn()
        {
            console.log("timerOn");
            if (timers.length > 0)
            {
                const timer = timers.pop();
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
                            setCircleDasharray(i,timer.timer);
                            timeLabel.innerHTML = formatTime(i);
                            i--;
                        }
                        else if(timer  && i !== -1)
                        {
                            
                            timeLabel.innerHTML = formatTime(i);
                            if(timer.type === TYPE_TIMER.Exo)
                            {   
                                _set+=1;
                               cyclelabel.innerHTML =  _cycle.toString()+"/" + cycles.toString();
                               setslabel.innerHTML = _set.toString() + "/" + exercise.length.toString();  
                            }
                            else if(timer.type === TYPE_TIMER.Recovery)
                            {
                                _cycle +=1;
                                _set=1;
                                cyclelabel.innerHTML =  _cycle.toString()+"/" + cycles.toString();
                                setslabel.innerHTML = _set.toString() + "/" + exercise.length.toString();
                            }
                            window.clearInterval(timerInterval);
                            timerOn();
                        }
                    }
                }, 1000);
            }
        }
        // play the tabata (timer)
        function   play()
        {
            for (let cycle = 0; cycle < cycles; cycle++) {
                for (let exo = 0; exo < exercise.length; exo++) {
                    // play the exercise
                    timers.unshift({timer : exercise_time, type : TYPE_TIMER.Exo, name : exercise[exo]});
                    // play the rest
                    if (exo < exercise.length - 1)
                    { 
                        timers.unshift({timer : rest_time, type : TYPE_TIMER.Rest, name : "Rest"});
                    }
                }
                // play the recovery
                if (cycle < cycles - 1)
                {
                    timers.unshift({timer : recovery_time, type : TYPE_TIMER.Recovery, name : "Recovery"});
                }
            }
            setslabel.innerHTML = "0/" + exercise.length.toString();
            cyclelabel.innerHTML = "0/" + cycles.toString();
            timerOn();
        }
    


    function start() { 
        if (!startBtn)
        {
            //DOM elements
     timer = document.querySelector("#base-timer-path-remaining")as HTMLElement;
     timeLabel = document.getElementById("base-timer-label") as HTMLElement;
     setslabel = document.getElementById("sets") as HTMLElement;
     cyclelabel = document.getElementById("cycles") as HTMLElement;
     exerciceslabel = document.getElementById("exercices") as HTMLElement;

    //All buttons
     startBtn = document.getElementById("start")as HTMLButtonElement;
     stopBtn = document.getElementById("stop") as HTMLButtonElement;
        }

        setDisabled(startBtn);
        removeDisabled(stopBtn);
        if (!is_pause)
        {
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
       exercise_time  = Prop.exercise_time;
       rest_time = Prop.rest_time;
        cycles  = Prop.cycles;
       recovery_time =Prop.recovery_time;
       exercise = Prop.exercise;

        _cycle  = 0;
        _set  = 0;
        cyclelabel.innerHTML =  _cycle.toString()+"/" + cycles.toString();
        setslabel.innerHTML = _set.toString() + "/" + exercise.length.toString();

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
        <span className="time" id="cycles">0/0</span>
      </div>
    </div>
  </header>    
                  <span id="base-timer-label" className="base-timer__label">0:00</span>
                  <span id="base-timer-label2" className="base-timer__label2">0:00</span>
                </div>
              
                <h2 className='h2time' id="exercices">Ready !</h2>
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