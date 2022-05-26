import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { db } from "../firebase";
import "./chrono.css";
import "./allPage.css";
import { onSnapshot, collection, query, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { AppState } from '../Context';
import { Exo, ExoConverter } from './ChronoListPage';
import { Button, ProgressBar } from 'react-bootstrap';

const ChronoPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const [exo, setExo] = useState<Exo>(null);
    const [_cycle, setCycle] = useState(0);
    const [_set, setSet] = useState(0);
    const [_time, setTime] = useState(0);
    const [_cumulatedTime, setCumulatedTime] = useState(0);

    const [_is_pause, setIsPause] = useState(false);
    const [_is_start, setIsStart] = useState(false);
    const [_is_end, setIsEnd] = useState(false);

    const [_inter, setIntern] = useState(0);
    const [change, setChange] = useState(false);

    const { user , setAlert} = AppState();

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
                    type: "error",});
                } 
            }
        };
        getdata();
    }, [user]);


    function tic()
    {
        setTime(time => time + 1);
    }
    function timerOn()
    {
        setIntern(window.setInterval(tic, 1000));
    }
    

    function formatTime(time: number) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) {
            return `${minutes}:0${seconds}`
        }
        return `${minutes}:${seconds}`;
    }


    const Render = () =>
    {
        if (exo)
        {
            return ( 
                <div className="timer">
                <div>
                    <span>{exo.titre}</span>
                </div>
                <div>
                    <ProgressBar animated striped variant="info" now={_time} />
                </div>
                <span>{formatTime(_time)}</span>
                <div>
                    <Button onClick={timerOn} >Start !</Button>
                    <Button onClick={() => console.log(_time)} >Suivant</Button>
                </div>
                </div>
            );
        }
        else
        {
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