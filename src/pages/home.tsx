import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { Link } from 'react-router-dom';


const HomePage: React.FunctionComponent<IPage> = props => {
    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props.name])

    return (
        <div>
            <p>This is the HOME page!</p>
            <Link to="/chrono">Go to Chrono </Link>
            <div>
            <Link to="/chronoform"> Creation Exo</Link>
            </div>
        </div>
    )
}

export default HomePage;