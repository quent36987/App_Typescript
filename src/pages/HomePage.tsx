import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import './allPage.css';


const HomePage: React.FunctionComponent<IPage> = props => {
    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props.name])

    return (
        <div className='HomePage'>
            <h1 className='Titre' >Bienvenue !</h1>

                <div className="HomePage-content">
                        <span className="HomePage-content-quote-left">"</span>
                        <span className="HomePage-content-text">
                        Le sport va chercher la peur pour la dominer, la fatigue pour en triompher, la difficulté pour la vaincre.
                        </span>
                        <span className="HomePage-content-quote-right">"</span>
                </div>
            
        </div>
    )
}

export default HomePage;
