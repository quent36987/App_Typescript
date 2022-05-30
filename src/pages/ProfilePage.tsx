import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AppState } from '../Context';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './allPage.css';
import { Button, Pagination, Spinner, Tab, Table, Tabs } from 'react-bootstrap';


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
import { Line } from 'react-chartjs-2';
import { User, UserConverter } from '../data/UserClass';
import { formatTime } from '../Utils/utils';


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const choix = ['week', 'Month', 'Year'];

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

// recup les données et crée tab [jour 1->31 ; minute tt]
// possibilité de choisir => mois,années
// pading annee => anne -5 
// pading mois => tout les mois
// usestate : choix_padding

const label = ['January', 'February', 'March', 'April', 'May', 'June'];
const data = {
    label,
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

    const [choix_pick, setChoix_pick] = useState(0);
    const [day_pick, setDayPick] = useState(new Date());
    const [label_day, setLabelDay] = useState<string[]>([]);
    const [valeur_day, setValeurDay] = useState<number[]>([]);

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

    useEffect(() => {
        // create the valeur day with the time of the day
        if (userdata) {
            const valeur_tmp = [];
            const label_tmp = [];
            if (choix_pick === 1) {
                const log_month = userdata.exo_log.filter(log => log.date.toDate().getMonth() === day_pick.getMonth()
                    && log.date.toDate().getFullYear() === day_pick.getFullYear());
                const nb_jour = new Date(day_pick.getFullYear(), day_pick.getMonth() + 1, 0).getDate();
                //parcourir les jours du mois et les ajouter dans le tableau
                for (let i = 1; i <= nb_jour; i++) {
                    const day_tmp = new Date(day_pick.getFullYear(), day_pick.getMonth(), i);
                    const log_day = log_month.filter(log => log.date.toDate().getDate() === day_tmp.getDate());
                    const valeur_day_tmp_tmp = log_day.reduce((acc, val) => acc + val.time, 0);
                    valeur_tmp.push(valeur_day_tmp_tmp / 60);
                    label_tmp.push(day_tmp.getDate().toString());
                }
            }
            else {
                const log_year = userdata.exo_log.filter(log => log.date.toDate().getFullYear() === day_pick.getFullYear());
                //parcourir les mois du mois et les ajouter dans le tableau
                for (let i = 0; i <= 12; i++) {
                    const day_tmp = new Date(day_pick.getFullYear(), i, 1);
                    const log_day = log_year.filter(log => log.date.toDate().getMonth() === day_tmp.getMonth());
                    const valeur_day_tmp_tmp = log_day.reduce((acc, val) => acc + val.time, 0);
                    valeur_tmp.push(valeur_day_tmp_tmp / 60);
                    label_tmp.push(months[i]);
                }
            }
            setValeurDay(valeur_tmp);
            setLabelDay(label_tmp);
        }
    }, [userdata, day_pick, choix_pick]);



    const PaginationDate = () => {
        return (
            <div style={{"display": "flex", "flexDirection":"column", "justifyContent": "center"}}>
                <div style={{"alignSelf":"center"}}>
                <Pagination size='sm' style={{ "marginBottom": "5px" }}>
                    {choix.map((choix, index) => (
                        <Pagination.Item key={index}
                            disabled={0 === index}
                            active={choix_pick === index}
                            onClick={() => setChoix_pick(index)}>
                            {choix}
                        </Pagination.Item>
                    ))}
                </Pagination></div>
                <Pagination size="sm">
                    <Pagination.First />
                    {[-2, -1, 0, 1, 2].map(i => {
                        return (
                            <Pagination.Item
                                key={i}
                                active={i === 0}
                                onClick={() => {
                                    if (choix_pick === 1) {
                                        setDayPick(new Date(day_pick.getFullYear(), (day_pick.getMonth() + i + 12) % 12, 1));
                                    } else if (choix_pick == 2){
                                        setDayPick(new Date(day_pick.getFullYear() + i, day_pick.getMonth(), 1));
                                    }
                                }}
                            >
                                {choix_pick === 1 ? months[(day_pick.getMonth() + i + 12) % 12] : day_pick.getFullYear() + i}
                            </Pagination.Item>
                        );
                    })}
                    <Pagination.Last />
                </Pagination>
            </div>
        );
    };


    const ProfilRender = () => {
        if (userdata) {
            return (
                <> 
                <h1 className='Titre2' style={{ "textAlign": "center", "marginBottom": "1vh", "marginTop": "2vh" }} >Profile Page</h1>
                        <Tabs defaultActiveKey="p2" id="uncontrolled-tab-example" className="">
                            <Tab eventKey="p1" title="Profile Information" style={{"marginTop":"1vh"}}>
                                <p>Profile information to come</p>
                            </Tab>
                            <Tab eventKey="p2" title="Time Stats" style={{"marginTop":"1vh"}}>
                               <div style={{"display": "flex", "flexDirection":"column", "justifyContent": "center"}}>
                                 <div style={{"alignSelf":"center"}}>   
                                <PaginationDate />
                                </div>
                                <div style={{"width":"95vw","alignSelf":"center","maxWidth":"700px"}}> 
                                 <Line 
                                    data={{
                                    labels: label_day,
                                    datasets: [
                                        {
                                            label: 'Time in minutes',
                                            data: valeur_day,
                                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                            borderColor: 'rgba(255, 99, 132, 1)',
                                            borderWidth: 1,
                                        }
                                    ]
                                }} /></div>
                               </div>
                            </Tab>
                            <Tab eventKey="p3" title="Your sessions" style={{"marginTop":"1vh"}}>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userdata.exo.map((log, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{log.titre}</td>
                                                <td>{log.date.toDate().toLocaleDateString()}</td>
                                                <td>{formatTime(log.time_total)}</td>
                                                <td ><Button variant="outline-info" 
                                                onClick={() => window.location.href = "/updateform/" + log.id}
                                                >✏️</Button></td> 
                                                <td><Button  variant="outline-danger" onClick={() => {
                                                    if (window.confirm('Are you sure you wish to delete this item?')) {
                                                        userdata.exo.splice(index, 1);
                                                        setUserdata({ ...userdata });
                                                        const ref = doc(db, "Users", user.uid).withConverter(UserConverter);
                                                        setDoc(ref, userdata);
                                                    }
                                                } }>🗑️</Button></td>                                            
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey="p4" title="Graphique" style={{"marginTop":"1vh"}}>
                                <p>profdfgile</p>
                                <p>prdfgofile</p>
                            </Tab>
                        </Tabs> 

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