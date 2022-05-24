import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import {  RouteComponentProps, withRouter } from 'react-router-dom';
import Timer from '../componants/timer';
import {db} from "../firebase";
import "./chrono.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { onSnapshot, collection, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { AppState } from '../Context';


    
const ChronoPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
    const [list, setList] = useState([]);
    const [list_user, setListUser] = useState([]);
    
    const { user } = AppState();
    
    useEffect(() => {
        logging.info(`Loading ${props.name}`);
        const collectionRef = collection(db, "exercices");
       const q = query(collectionRef, orderBy("name", "desc"));
        onSnapshot(q, (snapshot) => {
            setList(snapshot.docs.map((doc) => ({ ...doc.data() , id: doc.id })));
        });
    }, [props])


    
    useEffect(() => {
       async function etst() {
        if (user) {
            const docRef = doc(db, "Users", user.uid);
            try {
                const docc = await getDoc(docRef);
                setListUser(docc.data().exo_log);
                console.log("data");
            } catch (e) {

                console.log("Error getting cached document:", e);
            }
        }
    };
    etst();
}, [props]);



    // load the timer (this page + '/' + timer)
    function loadChronoPage(index: number) {
        window.location.href = "/chrono/" + (index === 0 ? "" : index.toString());
    }
    function get_exercise_time_total(day: any) {
        var time_exo_tt = day.exercises_time * day.exercises.length * day.cycles;
        time_exo_tt += day.rest_time * (day.exercises.length - 1) * day.cycles;
        time_exo_tt += day.recovery_time * (day.cycles - 1);
        return time_exo_tt;
    }
    function formatTime(time: number) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) {
            return `${minutes}:0${seconds}`
        }
        return `${minutes}:${seconds}`;
    }

    // return list with all exo or a timer of one exo
    function PageRender() {

        let number = props.match.params.number;
        if (!number || number > list.length) {
            return <div className="scroll">
                 <button className='buttonback' onClick={() => {window.location.href = "/"}}>BACK</button>
                <h1 className='h1time' >Liste des exercices</h1>
                <div className="courselist">
                    {list.map((day, key) =>
                        <div className="course" onClick={() => loadChronoPage(key + 1)} key={key}>
                            <div className="course-preview">
                                <h2 className='h22'>{day.name}</h2>
                                <h6 className='h6'>{day.type}</h6>
                            </div>

                            <div className="course-info">
                                <div className="progress-container">
                                    <FontAwesomeIcon icon={faClock} />
                                    <span className="progress-text">
                                        {formatTime(get_exercise_time_total(day))}
                                    </span>
                                </div>
                                <h6>Description</h6>
                                {list_user.find(e => e.exo === day.id) !== undefined ?
                                 <h6 className='h6'>Vous avez déjà effectué cet exercice</h6> :
                                 <h6 className='h6'>Vous n'avez pas encore effectué cet exercice</h6>}
                                <h2 className='desc'>{day.description}</h2>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        }
        else {
            return <div>
                <button className='buttonback' onClick={() => loadChronoPage(0)}>BACK</button>
                <Timer exercises_time={list[number - 1].exercises_time}
                    rest_time={list[number - 1].rest_time}
                    exercises={list[number - 1].exercises}
                    cycles={list[number - 1].cycles}
                    recovery_time={list[number - 1].recovery_time}
                    name={list[number - 1].name}
                    type={list[number - 1].type}
                    exercises_info={list[number - 1].exercises_info}
                    pyramide={list[number - 1].pyramide} 
                    exercise_id={list[number -1].id}/>
            </div>
        }

}

    return (
        <div>
            <PageRender />
        </div>
    );
}

export default withRouter(ChronoPage);