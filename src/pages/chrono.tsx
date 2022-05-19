import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Timer from './../componants/timer';
import bd from './../data/days.json'  ;
import "./chrono.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
const ChronoPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props])


    function loadChronoPage(index : number) {

        window.location.href = "/chrono/" + (index == 0 ? "" : index.toString());
    }


    
    function ComponentFoo() {
        logging.info(`Loading ${props.name}`);
        let number = props.match.params.number;
        if (!number || number > bd.days.length)
        {
            return <div className="courses-container">
                <h1>Liste des exercices</h1>
                <div>
                    {bd.days.map((day,key) => 
                        <div className="course" onClick={() => loadChronoPage(key+1)}>
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
        else
        {
            return  <div>  
                <button className='buttonback' onClick={() => loadChronoPage(0) }>BACK</button>
                <Timer  Prop_exercise_time={bd.days[number-1].exercise_time} 
                        Prop_rest_time={bd.days[number-1].rest_time} 
                        Prop_exercise={bd.days[number-1].exercise}
                        Prop_cycles={bd.days[number-1].cycles}
                        Prop_recovery_time={bd.days[number-1].recovery_time} 
                        Prop_name={bd.days[number-1].name}/>
             </div>
            ;
        }
      }


    
    return (
         <ComponentFoo/>
    );
}




export default withRouter(ChronoPage);