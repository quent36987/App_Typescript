import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import Timer from './../componants/timer';
import bd from './../data/days.json';
import "./chrono.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const ChronoPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props])

    // load the timer (this page + '/' + timer)
    function loadChronoPage(index: number) {
        window.location.href = "/chrono/" + (index === 0 ? "" : index.toString());
    }
    function get_exercise_time_total(day: any) {
        var time_exo_tt = day.exercise_time * day.exercise.length * day.cycles;
        time_exo_tt += day.rest_time * (day.exercise.length - 1) * day.cycles;
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
        if (!number || number > bd.days.length) {
            return <div className="scroll">
                 <button className='buttonback' onClick={() => {window.location.href = "/"}}>BACK</button>
                <h1 className='h1time' >Liste des exercices</h1>
                <div className="courselist">
                    {bd.days.map((day, key) =>
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
                <Timer exercise_time={bd.days[number - 1].exercise_time}
                    rest_time={bd.days[number - 1].rest_time}
                    exercise={bd.days[number - 1].exercise}
                    cycles={bd.days[number - 1].cycles}
                    recovery_time={bd.days[number - 1].recovery_time}
                    name={bd.days[number - 1].name}
                    type={bd.days[number - 1].type}
                    exercise_info={bd.days[number - 1].exercise_info}
                    pyramide={bd.days[number - 1].pyramide} />
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