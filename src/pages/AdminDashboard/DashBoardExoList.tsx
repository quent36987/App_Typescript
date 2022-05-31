import { collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Tab, Table } from "react-bootstrap";
import logging from "../../config/logging";
import { Exo, ExoConverter } from "../../data/ExoClass";
import { db } from "../../firebase";
import IPage from "../../interfaces/page"
import { formatTime } from "../../Utils/utils";



const DashBoardExoList: React.FunctionComponent<IPage> = props => {
    const [list_exo, setListExo] = useState<Exo[]>([]);

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
        const collectionRef = collection(db, "exercises").withConverter<Exo>(ExoConverter);
        const queryRef = query(collectionRef);
        onSnapshot(queryRef, (snapshot) => {
            const list: Exo[] = [];
            snapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            });
            setListExo(list);
        });
    }, [props])



    return (
        <div>
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
                    {list_exo.map((log, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{log.titre}</td>
                            <td>{log.date.toDate().toLocaleDateString()}</td>
                            <td>{formatTime(log.time_total)}</td>
                            <td ><Button variant="outline-info"
                                onClick={() => window.location.href = "/updateform/" + log.id}
                            >✏️</Button></td>
                            <td><Button variant="outline-danger" onClick={() => {
                                if (window.confirm('Are you sure you wish to delete this item?')) {
                                     deleteDoc(doc(db, "exercises", log.id));
                                }
                            }}>🗑️</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default DashBoardExoList;