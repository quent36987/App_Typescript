import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { db } from "../firebase";
import "./chrono.css";
import "./allPage.css";
import { doc, getDoc, Timestamp, arrayUnion, updateDoc } from 'firebase/firestore';
import { AppState } from '../Context';
import { Exo, ExoConverter } from '../data/ExoClass';
import { Button, Modal, OverlayTrigger, Popover, ProgressBar, Spinner } from 'react-bootstrap';
import { User, UserConverter } from '../data/UserClass';
import SearchImage from '../componants/SearchImage';
import bipsrc from '../assets/bip.ogg';
import { useWakeLock } from 'react-screen-wake-lock';

const dataButton = [
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
        style: "btn btn-outline-info",
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

    const [_is_pause, setIsPause] = useState(false);
    const [_is_start, setIsStart] = useState(false);

    const [startButton, setStartButton] = useState(0);
    const [_progressbarcolor, setProgressbarColor] = useState("danger");
    const [_inter, setIntern] = useState(0);

    const [show, setShow] = useState(false);
    const [bip, setBip] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { user, setAlert } = AppState();
    const { isSupported, released, request, release } = useWakeLock(); 

    useEffect(() => {
        async function getdata() {
            if (props.match.params.exoId) {
                console.log("id" + props.match.params.exoId);
                const ref = doc(db, "exercises", props.match.params.exoId).withConverter(ExoConverter);
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    setExo(docSnap.data());
                } else {
                    if (user) {
                        const docRef = doc(db, "Users", user.uid).withConverter<User>(UserConverter);
                        try {
                            const docc = await getDoc(docRef);
                            if (docc.exists() && docc.data().exo.length > parseInt(props.match.params.exoId)) {
                                var val = docc.data().exo[parseInt(props.match.params.exoId)];
                                setExo(new Exo(val.cycles, val.date, val.description, val.exercises,
                                    val.recovery_time, val.rest_time, val.time_total,
                                    val.titre, val.type, val.useruid, props.match.params.exoId));
                            }
                        } catch (e) {
                            console.log("Error getting cached document:", e);
                            setAlert({
                                open: true,
                                message: "Error getting cached document",
                                type: "error",
                            });

                        }
                        setAlert({
                            open: false,
                            message: "exercises doesnt exist ?!",
                            type: "success",
                        });
                    }
                    else {
                        setAlert({
                            open: true,
                            message: "exercises doesnt exist ?!",
                            type: "error",
                        });
                    }
                }
            }
        };
        getdata();
    }, [props, user, setAlert]);

    useEffect(() => {
        if (_time === 1 && _is_start) {
            setBip(true);
        }
        if (_time === 0 && _is_start) {
            window.clearInterval(_inter);
            setSet(c => c + 1);
            console.log(_set);
            setCumulatedTime(_cumulatedTimebefore);
            if (_set < exo.exercises.length) {
                // set the label
                setTime(exo.exercises[_set].time);
                setTimming(exo.exercises[_set].time);
                setCumulatedTimeBefore(c => c + exo.exercises[_set].time);
                setProgressbarColor(exo.exercises[_set].type === 0 ? "danger" : "success");

                if (exo.exercises[_set].time_inf) {
                    setTime(-1);
                    return;
                }
            }
            else {
                if (_cycle + 1 === exo.cycles) {
                    setIsStart(false);
                    window.clearInterval(_inter);
                    setTime(-2);
                    handleShow();
                    return;
                }
                setSet(0);
                setProgressbarColor("");
                setTime(exo.recovery_time);
                setTimming(exo.recovery_time);
                setCumulatedTimeBefore(c => c + exo.recovery_time);
                setCycle(c => c + 1);
            }
            //console.log("lancement du timer");
            setIntern(window.setInterval(tic, 1000));
        }
    }, [_time, _is_start, _inter, _cycle, _set, _timming, _cumulatedTime, _cumulatedTimebefore, exo]);




    function tic() {
        setIsPause(pause => {
            if (pause) {
                return pause;
            } else {
                setTime(time => {
                    if (time === 0) {
                        setIntern(c => { console.log(c); window.clearInterval(c); return c });
                        return 0;
                    }
                    setCumulatedTime(c => c + 1);
                    return time - 1;
                });
                return pause;
            }
        });
    }

    function play() {
        switch (startButton) {
            case 0:
                request();
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
    function suivant() {
        setTime(0);
        setIsPause(false);
        setStartButton(1);
    }

    function formatTime(time: number) {
        if (time === -1) {
            return "♾";
        }
        if (time === -2) {
            return "Finished !"
        }
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) {
            return `${minutes}:0${seconds}`
        }
        return `${minutes}:${seconds}`;
    }
    async function saveChange() {
        console.log("eee");
        if (user) {
            const UserDocRef = doc(db, 'Users', user.uid);
            const payload = { exo_log: arrayUnion({ id: props.match.params.exoId, time: exo.time_total, date: Timestamp.now() }) };
            try {
                await updateDoc(UserDocRef, payload);
            }
            catch (error) {
                console.log(error);
            }
        }
        else {

        }
        handleClose();
    };




    const Render = () => {
        if (exo) {
            return (<>
                <div className="chrono-page">
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Session finished !</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Woohoo, do you want to record this session? This will allow you to follow your training</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={saveChange}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <div className="timer" >
                        <h1 className='Titre2' style={{ "textAlign": "center", "marginBottom": "1vh", "marginTop": "2vh" }} >{exo.titre}</h1>
                        <div className="session" style={{ "display": "flex", "justifyContent": "center", "paddingBottom": "1vh" }}>
                            <div className="breakCtrl">
                                <p style={{ "position": "relative", "top": "30%" }}>Sets</p>
                                <span style={{ "paddingTop": "0px" }} className="time" id="sets">{_set}/{exo.exercises.length}</span>
                            </div>
                            <div className="sessionCtrl">
                                <p style={{ "position": "relative", "top": "30%" }}>Cycles</p>
                                <span style={{ "paddingTop": "0px" }} className="time" id="sets">{_cycle}/{exo.cycles}</span>
                            </div>
                        </div>
                        <div>
                            <span id="base-timer-label" className="base-timer__label">{formatTime(_time)}</span>
                            <span id="base-timer-label2" className="base-timer__label2">{formatTime(_cumulatedTime)}</span>
                        </div>
                        <ProgressBar style={{ "marginBottom": "1vh" }} animated striped variant={_progressbarcolor}
                            now={(_time / _timming) * 100} />
                        <ProgressBar style={{ "marginBottom": "1vh" }} animated striped variant="info"
                            now={(_cumulatedTime / exo.time_total) * 100} />

                        <div className='contenaireit'>
                            <div className='it2'>{_set > 0 && _set <= exo.exercises.length ? exo.exercises[_set - 1].name : "Recovery"}</div>
                            <div className='it3'>{_set >= 0 && _set < exo.exercises.length ? exo.exercises[_set].name : "Recovery"}</div>
                        </div>

                        <div>
                            <Button variant={dataButton[startButton].style} style={{ "margin": "1vw" }} onClick={play} >
                                {dataButton[startButton].name}</Button>
                            <Button variant='btn btn-outline-primary' style={{ "margin": "1vw" }}
                                onClick={suivant}
                                disabled={startButton === 0}>Next</Button>

                        </div>
                        <div style={{ "marginTop": "1vh" }}>

                            <OverlayTrigger
                                trigger="focus"
                                key={'top'}
                                placement={'top'}
                                overlay={
                                    <Popover id={`popover-positioned-top`} style={{ "width": "50vw", "height": "20vh" }}>
                                        <Popover.Header as="h3">{_set > 0 && _set <= exo.exercises.length ? exo.exercises[_set - 1].name : "Recovery"} :</Popover.Header>
                                        <Popover.Body >
                                            <SearchImage image_name={_set > 0 && _set <= exo.exercises.length ? exo.exercises[_set - 1].name : "Recovery"} />
                                        </Popover.Body>
                                    </Popover>
                                }
                            >
                                <Button variant='btn btn-outline-light'
                                    onClick={(event) => { setIsPause(true); setStartButton(2); }}>❓</Button>
                            </OverlayTrigger>
                        </div>
                    </div>
                    {bip ? <audio src={bipsrc} autoPlay onEnded={() => setBip(false)}/> : null}
                </div>
            </>
            );
        }
        else {
            return (
                <div>
                    <Spinner animation="border" />
                </div>
            );
        }
    }
    return (
        Render()

    );
}

export default withRouter(ChronoPage);