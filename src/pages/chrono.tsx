import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
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

    // return list with all exo or a timer of one exo
    function PageRender() {
        let number = props.match.params.number;
        if (!number || number > bd.days.length) {
            return <div className="courses-container">
                    <h1>Liste des exercices</h1>
                    <div>
                    {bd.days.map((day, key) =>
                        <div className="course" onClick={() => loadChronoPage(key + 1)}>
                            <div className="course-preview">
                                <h2 className='h22'>{day.name}</h2>
                            </div>

                            <div className="course-info">
                                <div className="progress-container">
                                    <FontAwesomeIcon icon={faClock} />
                                    <span className="progress-text">
                                        15:45
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
                                name={bd.days[number - 1].name} />
                   </div>
        }
    }

    return (
        <PageRender />
    );
}

export default withRouter(ChronoPage);