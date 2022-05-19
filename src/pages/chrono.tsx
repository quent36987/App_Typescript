import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import "./index.css";
import Timer from './../componants/timer';
import bd from './../data/days.json'  ;

const ChronoPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props])


    function ComponentFoo() {
        logging.info(`Loading ${props.name}`);
        let number = props.match.params.number;
        if (number > bd.days.length)
        {
            return <h1>Error</h1>
        }
        else
        {
            return  <Timer oexercise_time={number} 
            orest_time={5} ocycles={1} orecovery_time={5} 
            oexercise={["exo1", "exo2"]} />;
        }
      }


    
    return (
        <div>
             <Timer oexercise_time={10} 
            orest_time={5} ocycles={1} orecovery_time={5} 
            oexercise={["exo1", "exo2"]} />
        </div>
    );
}




export default withRouter(ChronoPage);