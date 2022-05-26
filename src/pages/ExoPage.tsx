import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Timer from '../componants/timer';
import { db } from "../firebase";
import "./chrono.css";
import "./allPage.css";
import { onSnapshot, collection, query, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { AppState } from '../Context';
import { Accordion, Button, Card, Col, FloatingLabel, Form, FormControl, Row } from 'react-bootstrap';
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
    public id: string;

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

    getMoreInfo() {
        return (
            <div>
                <div>
                    <h3>{this.titre}</h3>
                    <p>{this.description}</p>
                </div>
                <div>
                    <h4>Exercices</h4>
                    <ul>
                        {this.exercises.map(item => (
                            <li key={item.id}>{item.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
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
    const [trie, setTrie] = useState("");
    const [list_user, setListUser] = useState([]);
    const [list_exo, setListExo] = useState<Exo[]>([]);
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
        async function getUserData() {
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
        getUserData();
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
        console.log("exo :", list_exo);

        let number = props.match.params.number;
        if (!number) {
            return <>
                
                <div className="courselist">
                    <Row xs={1} md={2} className="g-0">
                        {list_exo.filter(exo => {
                            if (trie === "") {
                                return true;
                            }
                            else{
                                return exo.titre.toLowerCase().includes(trie.toLowerCase())
                            }}).map((exo, index) => {

                            return <Col>
                                <Card style={{ "margin": "10px" }}>
                                    <Card.Header>
                                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                            <div style={{ "textAlign": "left" }}>{data[exo.type].name}</div>
                                            <div style={{ "textAlign": "right" }}>⏱️ {formatTime(exo.time_total)}</div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Title>{exo.titre}</Card.Title>
                                        <Card.Text>
                                            {exo.description}
                                        </Card.Text>
                                        <div style={{ "display": "flex", "margin": "10px", "alignItems": "baseline" }}>
                                            <Button variant="btn btn-outline-success" style={{ "marginRight": "5px" }} >Go</Button>
                                            <Accordion style={{ "flexGrow": 1 }} >
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header style={{ "fontSize": "5px", "padding": "0px" }}>
                                                        more info ?</Accordion.Header>
                                                    <Accordion.Body>
                                                        {exo.getMoreInfo()}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        })}</Row>
                </div>
            </>
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
            <h1 className='Titre2' style={{ "textAlign": "center", "marginBottom":"2vh", "marginTop":"2vh" }} >Find the session of your dreams</h1>
            <div style={{ "marginLeft": "3vw","marginRight":"3vW", "marginBottom":"2vh" }}>
            <Form className="d-flex">
                <FormControl
                    type="search"
                    id="dsfsdf"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => {
                        setTrie(e.target.value);
                    }}
                    value={trie}
                />
                <Form.Select aria-label="Default select example" style={{"width":"45%"}}>
                    <option>All</option>
                    <option value="1">Mine</option>
                    <option value="2">Friend</option>
                </Form.Select>
            </Form>
        </div>
            <PageRender />
        </div>
    );
}

export default withRouter(ChronoPage);