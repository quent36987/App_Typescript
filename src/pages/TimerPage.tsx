import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import './allPage.css';
import { Button, ProgressBar } from 'react-bootstrap';
import bipsrc from '../assets/bip.ogg';
import { useWakeLock } from 'react-screen-wake-lock';
import { formatTime } from '../Utils/utils';


const TimerPage: React.FunctionComponent<IPage> = props => {

    const [_time, setTime] = useState(0);
    const [_timming, setTimming] = useState(0);
    const [_is_pause, setIsPause] = useState(false);
    const [bip, setBip] = useState(false);
    const { request } = useWakeLock(); 

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
        console.log(Timebuttons)
    }, [props.name])


    useEffect(() => {
        let interval = null;
        if (_time === 1 && ! _is_pause) {
            setBip(true);
        }
        if (!_is_pause && _time > 0) {
            interval = setInterval(() => {
                setTime(time => time - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [_is_pause,_time]);

    const Timebuttons = [
    { time: 20, label: "20s" },
    { time: 30, label: "30s" },
    { time: 40, label: "40s" },
    { time: 50, label: "50s" },
    { time: 60, label: "1m" },
    { time: 75, label: "1m15" },
    { time: 90, label: "1m30" },
    { time: 120, label: "2m" },
    { time: 150, label: "2m30" },
    { time: 180, label: "3m" },
    { time: 300, label: "5m" },
    ];

    return (
        <div className="chrono-page">
            <div className="timer" >
                <h1 className='Titre2' style={{ "textAlign": "center", "marginBottom": "1vh", "marginTop": "2vh" }} >Timer</h1>
                <div>
                    <span id="base-timer-label" className="base-timer__label">{formatTime(_time)}</span>
                </div>
                <ProgressBar style={{ "marginBottom": "1vh","marginLeft":"5vw","marginRight":"5vw" }} animated striped variant='success'
                    now={(_time / _timming) * 100} />
                <div style={{ "display": "flex", "flexWrap": "wrap","alignContent":"stretch","justifyContent":"center" }}>
                    {Timebuttons.map((button, index) => {
                        return (
                            <Button key={index} style={{ "margin": "1vh" }} 
                            variant="outline-secondary" 
                            onClick={() => {setTime(button.time);setTimming(button.time);request(); }}>{button.label}</Button>
                        )
                    })}
                </div>
                <div style={{ "display": "flex", "flexWrap": "wrap","alignContent":"stretch","justifyContent":"center" }}>
                    <input type="time" id="time" name="time" style={{ "margin": "1vh" }} 
                        onChange={(e) => {
                        var tab = e.target.value.split(":").map(Number)
                        setTime(tab[0] * 60 + tab[1]);
                        setTimming(tab[0] * 60 + tab[1]);
                        setIsPause(true)}} 
                    />
                    <Button variant="outline" onClick={() => {setTime(_timming);setIsPause(true);request();}}>🔃</Button>
                </div>
                <div style={{ "display": "flex", "flexWrap": "wrap","alignContent":"stretch","justifyContent":"center" }}>
                    <Button style={{ "margin": "1vh" }} 
                        variant={_is_pause ? "outline-success" : "outline-danger" } 
                        onClick={() => setIsPause(!_is_pause)}>{_is_pause ? "Start" : "Stop"}
                    </Button>
                </div>
                {bip ? <audio src={bipsrc} autoPlay onEnded={() => setBip(false)} /> : null}
            </div>
        </div>
    )
}

export default TimerPage;
