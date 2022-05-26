import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { db } from "../firebase";
import "./chrono.css";
import "./allPage.css";
import { onSnapshot, collection, query, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { AppState } from '../Context';
import { Exo, ExoConverter } from './ChronoListPage';
import { Button, ProgressBar } from 'react-bootstrap';

const dataButton =[
    {
        id: "0",
        name: "Start",
        style: "btn btn-outline-success",
    },
    {
        id: "1",
        name: "Stop",
        style: "btn btn-outline-danger",
    },
    {
        id: "2",
        name: "Continue",
        style : "btn btn-outline-info",
    }

]


const ChronoPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const [exo, setExo] = useState<Exo>(null);
    const [_cycle, setCycle] = useState(0);
    const [_set, setSet] = useState(0);
    const [_time, setTime] = useState(0);
    const [_timming, setTimming] = useState(0);

    const [_cumulatedTime, setCumulatedTime] = useState(0);
    const [_cumulatedTimebefore, setCumulatedTimeBefore] = useState(0);

    const [_exolabel, setExolabel] = useState("");

    const [_is_pause, setIsPause] = useState(false);
    const [_is_start, setIsStart] = useState(false);
    const [_is_end, setIsEnd] = useState(false);

    const [startButton, setStartButton] = useState(0);
    const [_progressbarcolor, setProgressbarColor] = useState("danger");
    const [_inter, setIntern] = useState(0);
    const [change, setChange] = useState(false);

    const { user, setAlert } = AppState();

    useEffect(() => {
        async function getdata() {
            if (user && props.match.params.exoId) {
                console.log("id" + props.match.params.exoId);
                const ref = doc(db, "exercises", props.match.params.exoId).withConverter(ExoConverter);
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    setExo(docSnap.data());
                } else {
                    setAlert({
                        open: true,
                        message: "exercises doesnt exist ?!",
                        type: "error",
                    });
                }
            }
        };
        getdata();
    }, [user]);

    useEffect(() => {
        {
            if (_time === 0 && _is_start) {
                window.clearInterval(_inter);
                setSet(c => c + 1); 
                console.log(_set);
                setCumulatedTime(_cumulatedTimebefore);
                if (_set < exo.exercises.length) {
                    // set the label
                    setExolabel(exo.exercises[_set].name);
                    setTime(exo.exercises[_set].time);
                    setTimming(exo.exercises[_set].time);
                    setCumulatedTimeBefore(c => c + exo.exercises[_set].time);
                    setProgressbarColor(exo.exercises[_set].type === 0 ? "danger" : "success");

                    if (exo.exercises[_set].time_inf) {
                        setTime(-1);
                        return;
                    }
                }
                else{
                    setSet(0);
                    setExolabel("Recovery");
                    setProgressbarColor("");
                    setCycle(cycle => cycle + 1);
                    setTime(exo.recovery_time);
                    setTimming(exo.recovery_time);
                    setCumulatedTimeBefore(c => c + exo.recovery_time);
                }
               
                if (_cycle === exo.cycles)
                {
                    setIsStart(false);
                    return;
                }
                else{
                    setIntern(window.setInterval(tic, 1000));
                } 
            }
        }
    }, [_time, _is_start]);




    function tic() {
        setIsPause(pause => {
            if (pause) {
                return pause;
            } else {
                setTime(time => {
                    if (time === 0)
                    {
                        setIntern(c =>  { console.log(c);window.clearInterval(c); return c});
                        return 0;
                    }
                    setCumulatedTime(c => c + 1);
                    return time - 1;
                });
                return pause;
            }
        });
    }
   

    function play()
    {
        switch (startButton) {
            case 0:
                setIsStart(true);
                setStartButton(1);
                break;
            case 1:
                setIsPause(true);
                setStartButton(2);
                break;
            case 2:
                setIsPause(false);
                setStartButton(1);
                break;
            default:
                break;
        }
    }
    function suivant()
    {
        setTime(0);
        setIsPause(false);
        setStartButton(1);
    }

    function formatTime(time: number) {
        if (time === -1)
        {
            return "♾";
        }
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) {
            return `${minutes}:0${seconds}`
        }
        return `${minutes}:${seconds}`;
    }


    const Render = () => {
        if (exo) {
            return (
                <div className="chrono-page">
                    <div className="timer" >
                        <h1 className='Titre2' style={{ "textAlign": "center", "marginBottom": "1vh", "marginTop": "2vh" }} >{exo.titre}</h1>
                        <div className="session" style={{"display":"flex","justifyContent":"center","paddingBottom":"1vh"}}>
                            <div className="breakCtrl">
                                <p style={{"position":"relative","top":"30%"}}>Sets</p>
                                <span style={{"paddingTop":"0px"}} className="time" id="sets">{_set}/{exo.exercises.length}</span>
                            </div>
                            <div className="sessionCtrl">
                            <p style={{"position":"relative","top":"30%"}}>Cycles</p>
                                <span style={{"paddingTop":"0px"}} className="time" id="sets">{_cycle}/{exo.cycles}</span>
                            </div>
                        </div>
                        <div>
                        <span id="base-timer-label" className="base-timer__label">{formatTime(_time)}</span>
                        <span id="base-timer-label2" className="base-timer__label2">{formatTime(_cumulatedTime)}</span>
                        </div>
                            <ProgressBar style={{"marginBottom":"1vh"}} animated striped variant={_progressbarcolor} 
                            now={(_time /  _timming)*100} />
                            <ProgressBar style={{"marginBottom":"1vh"}} animated striped variant="info" 
                            now={(_cumulatedTime / exo.time_total)*100} />

                        <div className='contenaireit'>
                            <div className='it2'>{_set > 0 && _set <= exo.exercises.length ? exo.exercises[_set-1].name : "Recovery"}</div>
                            <div className='it3'>{_set >= 0 && _set < exo.exercises.length ? exo.exercises[_set].name : "Recovery"}</div>
                        </div>

                        <div>
                            <Button variant={dataButton[startButton].style} style={{"margin":"1vw"}} onClick={play} >
                                {dataButton[startButton].name}</Button>
                            <Button variant='btn btn-outline-primary' style={{"margin":"1vw"}} onClick={suivant} >Suivant</Button>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    <h1>Loading</h1>
                </div>
            );
        }
    }
    return (
        Render()

    );
}

export default withRouter(ChronoPage);