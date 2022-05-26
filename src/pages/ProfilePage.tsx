import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AppState } from '../Context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './allPage.css';
import { Button, Spinner, Tab, Tabs } from 'react-bootstrap';
import { Avatar } from '@material-ui/core';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { User, UserConverter } from '../data/UserClass';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June'];

const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: [100, -500, 70, 9, 400, 5],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
    ],
};
const data2 = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};



const ProfilePage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const { user, setAlert } = AppState();
    const [userdata, setUserdata] = useState<User>(null);

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props]);

    useEffect(() => {
        async function getdata() {
            if (user) {
                const ref = doc(db, "Users", user.uid).withConverter(UserConverter);
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    setUserdata(docSnap.data());
                    setAlert({
                        false: true,
                    });
                } else {
                    setAlert({
                        open: true,
                        message: "error to get user data",
                        type: "error",
                    });
                }
            }
        };
        getdata();
    }, [user, setAlert]);

    const ProfilRender = () => {
        if (userdata) {
            return (
                <>
                    <div className='divDashboard'>
                        <div className='div-Profile' >
                            <div className='div-Profile-Avatar'>
                                <Avatar
                                    style={{
                                        height: '10vw',
                                        width: '10vw',
                                        margin: '1vw',
                                        cursor: "pointer",
                                        backgroundColor: "#EEBC1D",
                                        marginBottom: "5vh",
                                    }}
                                    src={user ? user.photoURL : ""}
                                    alt={user ? user.displayName || user.email : ""}
                                />
                                <p>{userdata.firstName} {userdata.lastName}</p>
                            </div>
                            <div className='div-Profile-info'>
                                <div className='div-Profile-info-item'>
                                    <span className='titreitem'>First Name</span>
                                    <span className='valeuritem'> {userdata.firstName} </span>
                                </div>
                                <div className='div-Profile-info-item'>
                                    <span className='titreitem'>Last Name</span>
                                    <span className='valeuritem'> {userdata.lastName} </span>
                                </div>
                                <div className='div-Profile-info-item'>
                                    <span className='titreitem'>Genre</span>
                                    <span className='valeuritem'> {userdata.genre} </span>
                                </div>
                                <div className='div-Profile-info-item'>
                                    <span className='titreitem'>Date inscription</span>
                                    <span className='valeuritem'> {userdata.date_inscription !==null ? userdata.date_inscription.toDate().toDateString() : null} </span>
                                </div>
                                <div className='div-Profile-info-item'>
                                    <span className='titreitem'>Dernier séance faite</span>
                                    <span className='valeuritem'> {userdata.last_exo_date !==null ? userdata.last_exo_date.toDate().toDateString() : null} </span>
                                </div>
                                <div className='div-Profile-info-item'>
                                    <span className='titreitem'>Temps total</span>
                                    <span className='valeuritem'> {userdata.temps_tt} </span>
                                </div>
                                <div className='div-Profile-info-item'>
                                    <span className='titreitem'>Jour conséxutif</span>
                                    <span className='valeuritem'> {userdata.genre} </span>
                                </div>
                            </div>
                        </div>
                        <div className='div-Profile-exo'>
                            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                                <Tab eventKey="home" title="Exercices" style={{
                                    "maxWidth": "90vw",
                                    "paddingLeft": "4vw",
                                    "paddingRight": "4vw"
                                }}>
                                    <Line options={options} data={data} />
                                </Tab>
                                <Tab eventKey="profile" title="Stats" style={{
                                    "maxWidth": "90vw", "paddingLeft": "4vw",
                                    "paddingRight": "4vw"
                                }}>
                                    <Pie data={data2} />
                                </Tab>
                                <Tab eventKey="contact" title="Graphique" style={{
                                    "maxWidth": "90vw", "paddingLeft": "4vw",
                                    "paddingRight": "4vw"
                                }}>
                                    <p>profdfgile</p>
                                    <p>prdfgofile</p>
                                </Tab>
                            </Tabs>
                        </div>

                    </div>
                </>
            )
        }
        else {
            return <div style={{ "textAlign": "center" }}>
                <Spinner animation="border" />
                <h1 className='Titre2' >Log in to create personalized sessions!</h1>
                <Button onClick={() => window.location.href = "/auth/login"}>Log in !</Button>
            </div>
        }
    }


    return (
        ProfilRender()
    );
}

export default withRouter(ProfilePage);