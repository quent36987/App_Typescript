import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import {  RouteComponentProps, withRouter } from 'react-router-dom';
import { AppState } from '../Context';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './allPage.css';
import { Tab, Tabs } from 'react-bootstrap';
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
      data: [100,-500,70,9,400,5] ,
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


class User {
    public firstName: string;
    public lastName : string;
    public genre: string;
    public date_inscription: Timestamp;

    public last_exo_date: Timestamp;
    public temps_tt: number;

    public exo: {date : Timestamp, exo : string, time : number}[];
    constructor(firstName,lastName, exo,date_inscription) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.exo = exo;
        this.date_inscription = date_inscription;
        this.last_exo_date = Timestamp.now();
        this.temps_tt = 0;
        this.genre = "";

        if (this.exo && this.exo.length > 0) {
            this.temps_tt = 0;
            var max = this.exo[0].date.seconds;
            for (let i = 0; i < this.exo.length; i++) {
                 this.temps_tt += this.exo[i].time;
                if (this.exo[i].date.seconds >  max) {
                    max = this.exo[i].date.seconds;
                }
         }
          this.last_exo_date = new Timestamp(max,0);
        }
    }  
}

const UserConverter = {
    toFirestore: (user) => {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            exo: user.exo,
            date_inscription: user.date_inscription
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.firstName,data.lastName , data.exo_log, data.date_inscription);
    }
};


const ProfilePage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const { user, setAlert } = AppState();
    const [userdata , setUserdata] = useState(new User("","",null,new Timestamp(0,0)));

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
        if (user) {
            setAlert({
                open: true,
                message: "you must be logged in to access this page",
                type: "error",
            });
        }
    }, [props] )

    useEffect(() => {
        async function getdata() {
            if (user) {
                const ref = doc(db, "Users", user.uid).withConverter(UserConverter);
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    setUserdata(docSnap.data());
                } else {
                    setAlert({
                    open: true,
                    message: "error to get user data",
                    type: "error",});
                }
            }
        };
        getdata();
    }, [user]);

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
                        <span className='valeuritem'> {userdata.date_inscription !== undefined ? userdata.date_inscription.toDate().toDateString() : null} </span>
                    </div>
                    <div className='div-Profile-info-item'>
                        <span className='titreitem'>Dernier séance faite</span>
                        <span className='valeuritem'> {!userdata.last_exo_date !== undefined ? userdata.last_exo_date.toDate().toDateString() : null} </span>
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
            <Tab eventKey="home" title="Exercices" style={{"maxWidth" : "90vw", 
                                                    "paddingLeft" : "4vw", 
                                                    "paddingRight" : "4vw"}}>
                <Line options={options} data={data} />
            </Tab>
            <Tab eventKey="profile" title="Stats" style={{"maxWidth" : "90vw", "paddingLeft" : "4vw", 
                                                    "paddingRight" : "4vw"}}>
                    <Pie data={data2} />
            </Tab>
            <Tab eventKey="contact" title="Graphique" style={{"maxWidth" : "90vw","paddingLeft" : "4vw", 
                                                    "paddingRight" : "4vw"}}>
            <p>profdfgile</p>
                <p>prdfgofile</p>
            </Tab>
            </Tabs>
        </div>

        </div>
        </>
    );
}

export default withRouter(ProfilePage);