import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { Link } from 'react-router-dom';

const ChronoForm: React.FunctionComponent<IPage> = props => {
    
    useEffect(() => {
        logging.info(`Loading ${props.name}`);
        console.log(props);
    }, [props.name])

    return (
        <div>
            <p>construction d'exo !</p>
            <Link to="/">Go to Home</Link>
        </div>
    )
}

export default ChronoForm;