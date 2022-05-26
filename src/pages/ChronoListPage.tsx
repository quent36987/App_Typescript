import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { db } from "../firebase";
import "./chrono.css";
import "./allPage.css";
import { onSnapshot, collection, query, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { AppState } from '../Context';
import { Accordion, Button, Card, Col, FloatingLabel, Form, FormControl, Row } from 'react-bootstrap';
import { Item } from '../data/Item_type';
import { data } from '../data/type_exo_data';
import { User, UserConverter } from '../data/UserClass';
import { Exo, ExoConverter } from '../data/ExoClass';




const ChronoListPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
    const [trie, setTrie] = useState("");
    const [typetrie, setTypeTrie] = useState("0");
    const [user_info, setListUser] = useState<User>(null);
    const [list_exo_public, setListExoPublic] = useState<Exo[]>([]);
    const [list_exo_user, setListExoUser] = useState<Exo[]>([]);
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
            setListExoPublic(list_exos);
        });
    }, [props])
    useEffect(() => {
        async function getUserData() {
            if (user) {
                const docRef = doc(db, "Users", user.uid).withConverter<User>(UserConverter);
                try {
                    const docc = await getDoc(docRef);
                    setListUser(docc.data());
                    const list: Exo[] = [];
                    docc.data().exo.forEach((doc: Exo,index) => {
                        list.push(new Exo(doc.cycles, doc.date, doc.description, doc.exercises,
                            doc.recovery_time, doc.rest_time, doc.time_total,
                            doc.titre, doc.type, doc.useruid,index.toString()));
                    });
                    setListExoUser(list);
                } catch (e) {

                    console.log("Error getting cached document:", e);
                }
            }
        };
        getUserData();
    }, [user]);

    useEffect(() => {
        if (typetrie === "0") {
            setListExo(list_exo_public.concat(list_exo_user));

        } else if (typetrie === "1") {
            setListExo(list_exo_user);
        } else {
            setListExo(list_exo_public);
        }
    }, [typetrie, list_exo_public, list_exo_user]);



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
        return <div className="courselist">
            <Row xs={1} md={2} className="g-0">
                {list_exo.filter(exo => {
                    if (trie === "") {
                        return true;
                    }
                    else {
                        return exo.titre.toLowerCase().includes(trie.toLowerCase())
                    }
                }).map((exo, index) => {

                    return <Col>
                        <Card style={{ "margin": "10px" }}>
                            <Card.Header>
                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                    <div style={{ "textAlign": "left" }}>{data[exo.type].name}</div>
                                    <div style={{ "textAlign": "right", "fontFamily": "cursive" }}>⏱️ {formatTime(exo.time_total)}</div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>{exo.titre}</Card.Title>
                                <Card.Text>
                                    {exo.description}
                                </Card.Text>
                                <div style={{ "display": "flex", "margin": "10px", "alignItems": "baseline" }}>
                                    <Button variant="btn btn-outline-success" style={{ "marginRight": "5px" }}
                                        onClick={() => window.location.href = "/chrono/" + exo.id} >Go</Button>
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
    }

    return (
        <div>
            <h1 className='Titre2' style={{ "textAlign": "center", "marginBottom": "2vh", "marginTop": "2vh" }} >Find the session of your dreams</h1>
            <div style={{ "marginLeft": "3vw", "marginRight": "3vW", "marginBottom": "2vh" }}>
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
                    <Form.Select aria-label="Default select example" style={{ "width": "45%" }}
                        value={typetrie} onChange={(e) => { setTypeTrie(e.target.value); }}>
                        <option value="0">All</option>
                        <option value="1">Mine</option>
                        <option value="2">Public</option>
                    </Form.Select>
                </Form>
            </div>
            <PageRender />
        </div>
    );
}

export default withRouter(ChronoListPage);