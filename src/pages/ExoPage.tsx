import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Timer from '../componants/timer';
import { db } from "../firebase";
import "./chrono.css";
import "./allPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { onSnapshot, collection, query, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { AppState } from '../Context';
import { Accordion, Button, Card } from 'react-bootstrap';
import { Item } from '../data/Item_type';
import { data } from '../data/type_exo_data';


class Exo {
    public cycles: number;
    public date: Timestamp;
    public description: string;
    public exercises: Item[] = [];
    public recovery_time: number;
    public rest_time: number;
    public time_total: number;
    public titre: string;
    public type: number;
    public useruid: number;
    public id : string;

    constructor(cycles: number, date: Timestamp, description: string, exercises: Item[],
        recovery_time: number, rest_time: number, time_total: number,
        titre: string, type: number, useruid: number) {
        this.cycles = cycles;
        this.date = date;
        this.description = description;
        this.exercises = exercises;
        this.recovery_time = recovery_time;
        this.rest_time = rest_time;
        this.time_total = time_total;
        this.titre = titre;
        this.type = type;
        this.useruid = useruid;
    }
}


const ExoConverter = {
    toFirestore: (a) => {
        return {
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Exo(data.cycles, data.date, data.description,
            data.exercises, data.recovery_time, data.rest_time,
            data.time_total, data.titre, data.type, data.useruid);
    }
};




const ChronoPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
    const [trie, setTrie ]= useState("");
    const [list_user, setListUser] = useState([]);
    const [list_exo,setListExo] = useState<Exo[]>([]);
    const { user } = AppState();


    useEffect(() => {
        logging.info(`Loading ${props.name}`);
        const collectionRef = collection(db, "exercises").withConverter<Exo>(ExoConverter);
        const queryRef = query(collectionRef);
        onSnapshot(queryRef, (snapshot) => {
            const list_exos: Exo[] = [];
            snapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list_exos.push(exo);
            });
            setListExo(list_exos);
            console.log("akout");
        });
        console.log(queryRef);
    }, [props])



    useEffect(() => {
        async function etst() {
            if (user) {
                const docRef = doc(db, "Users", user.uid);
                try {
                    const docc = await getDoc(docRef);
                    setListUser(docc.data().exo_log);
                    console.log("data");
                } catch (e) {

                    console.log("Error getting cached document:", e);
                }
            }
        };
        etst();
    }, [props]);



    // load the timer (this page + '/' + timer)
    function loadChronoPage(index: number) {
        window.location.href = "/chrono/" + (index === 0 ? "" : index.toString());
    }
    function formatTime(time: number) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) {
            return `${minutes}:0${seconds}`
        }
        return `${minutes}:${seconds}`;
    }

    // return list with all exo or a timer of one exo
    function PageRender() {
        console.log("exo :",list_exo);
        
        let number = props.match.params.number;
        if (!number) {
            return <div>
                <h1 className='Titre2' style={{ "textAlign": "center" }} >dssff</h1>
                <div className="courselist">
                    {list_exo.map((exo, index) => { 
                       return <Card style={{ "margin": "10px" }}>
                            <Card.Header>{exo.titre}</Card.Header>
                            <Card.Body>
                                <Card.Title>Special title treatment</Card.Title>
                                <Card.Text>
                                    With supporting text below as a natural lead-in to additional content.
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
                                <Accordion style={{ "margin": "10px" }} >
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header style={{ "fontSize": "5px", "padding": "0px" }}>more info ?</Accordion.Header>
                                        <Accordion.Body>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                                            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                                            est laborum.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Card.Body>
                        </Card> })}
                </div>
            </div>
        }
        else {
           /* return <div>
                <button className='buttonback' onClick={() => loadChronoPage(0)}>BACK</button>
                <Timer exercises_time={list[number - 1].exercises_time}
                    rest_time={list[number - 1].rest_time}
                    exercises={list[number - 1].exercises}
                    cycles={list[number - 1].cycles}
                    recovery_time={list[number - 1].recovery_time}
                    name={list[number - 1].name}
                    type={list[number - 1].type}
                    exercises_info={list[number - 1].exercises_info}
                    pyramide={list[number - 1].pyramide}
                    exercise_id={list[number - 1].id} />
            </div>*/
        }

    }

    return (
        <div>
            <PageRender />
        </div>
    );
}

export default withRouter(ChronoPage);