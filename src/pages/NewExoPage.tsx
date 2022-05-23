import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { Link } from 'react-router-dom';
import VerticalList from '../componants/formExo';

const ChronoForm: React.FunctionComponent<IPage> = props => {
    
    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props])

    return (
        <div>
            <p>construction d'exo !</p>
            <Link to="/">Go to Home</Link>
            <VerticalList />
        </div>
    )
}

export default ChronoForm;