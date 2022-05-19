const FULL_DASH_ARRAY = 283;
const RESET_DASH_ARRAY = `-57 ${FULL_DASH_ARRAY}`;

//All buttons
let startBtn = document.getElementById("start");
let stopBtn = document.querySelector(".stop");
let resetBtn = document.querySelector(".reset");

//DOM elements
let timer = document.querySelector("#base-timer-path-remaining");
let timeLabel = document.getElementById("base-timer-label");

//Time related vars
const TIME_LIMIT = 15; //in seconds
let timePassed = 0;
//let timeLeft = TIME_LIMIT;
let timerInterval = null;
let pa = false;

console.log('Hello World');

const compteur = document.getElementById('start') as HTMLButtonElement;
const pause = document.getElementById('pause') as HTMLButtonElement;
const nombre_max = document.getElementById('nombre_max') as HTMLInputElement;


function setDisabled(button) {
    button.setAttribute("disabled", "disabled");
  }
  
  function removeDisabled(button) {
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
   
    constructor(exercise_time : number, rest_time : number, cycles : number, recovery_time : number, exercise : string[])
    {
        this.exercise_time = exercise_time;
        this.rest_time = rest_time;
        this.cycles = cycles;
        this.exercise = exercise;
        this.recovery_time = recovery_time;
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
      console.log("setCircleDashArray: ", circleDasharray);
      timer.setAttribute("stroke-dasharray", circleDasharray);
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) {
            return `${minutes}:0${seconds}`
        }
        return `${minutes}:${seconds}`;
    }


    timerOn()
    {
        if (this.timers.length > 0)
        {
            const timer = this.timers.pop();
            console.log('runing : ' + timer?.timer.toString())
            let i = timer?.timer;
            timerInterval = window.setInterval(() => { 
                console.log(timerInterval);
                if(!pa)
                {
                    if (i != null && i > 0)
                    {
                        this.setCircleDasharray(i,timer.timer);
                        timeLabel.innerHTML = this.formatTime(i);
                        i--;
                    }
                    else
                    {
                        timeLabel.innerHTML = this.formatTime(i);
                        window.clearInterval(timerInterval);
                        this.timerOn();
                    }
                }
            }, 1000);
        }
        else
        {
            console.log('finish');
            console.log("datre" + new Date().getMinutes().toString());
           console.log("datre" + new Date().getSeconds().toString());
        }
    }

    // play the tabata (timer)
    play()
    {
        for (let cycle = 0; cycle < this.cycles; cycle++) {
            for (let exo = 0; exo < this.exercise.length; exo++) {
                // play the exercise
                console.log(this.exercise[exo]);
                this.timers.unshift({timer : this.exercise_time, type : TYPE_TIMER.Exo, name : this.exercise[exo]});
                
                // play the rest
                if (exo < this.exercise.length - 1)
                { 
                    console.log("rest");
                    this.timers.unshift({timer : this.rest_time, type : TYPE_TIMER.Rest});
                }
            }

            // play the recovery
            if (cycle < this.cycles - 1)
            {
                console.log("recovery");
                this.timers.unshift({timer : this.recovery_time, type : TYPE_TIMER.Recovery});
            }
        }
        console.log("tt" + this.get_exercise_time_total().toString());
        console.log("datre" + new Date().getMinutes().toString());
        console.log("datre" + new Date().getSeconds().toString());
        this.timerOn();
    }
}

function start() {
    setDisabled(startBtn);
    removeDisabled(stopBtn);
    if (!pa)
    {
        new Trainning(5 , 3, 2, 10, ["exo1", "exo2", "exo3"]).play();
    }
    pa = false;
}

function stopp() {
    setDisabled(stopBtn);
    removeDisabled(startBtn);
    startBtn.innerHTML = "Continue";
    pa = true;
}


function reset() {
    clearInterval(timerInterval);
    removeDisabled(startBtn);
    setDisabled(stopBtn);
    startBtn.innerHTML = "Start";
    timer.setAttribute("stroke-dasharray", RESET_DASH_ARRAY);
    timeLabel.innerHTML = "0:00";
    pa = false;
  }

window.addEventListener("load", () => {
    timeLabel.innerHTML =  "0:00";
    setDisabled(stopBtn);
  });

//
