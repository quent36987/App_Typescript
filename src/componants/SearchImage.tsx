
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";

const SearchImage = ({ image_name }) => {
    const [url, setUrl] = useState("");
    useEffect(() => {
        // delete space and number of image_name
        var image_name_modif = image_name.replace(/[\s\d-+*]/g, "").toLocaleLowerCase().
            normalize("NFD").replace(/[\u0300-\u036f]/g, "");;
        if (image_name_modif.endsWith("s")) {
            image_name_modif = image_name_modif.substring(0, image_name_modif.length - 1);
        }
        const collectionRef = collection(db, "images");
        const queryRef = query(collectionRef, where("name", "array-contains", image_name_modif), limit(1));
        try {
            onSnapshot(queryRef, (snapshot) => {
                snapshot.forEach((doc) => {
                    const image = doc.data();
                    setUrl(image.url);
                    return;
                });
            });
        }
        catch (e) {
            console.log("Error getting cached document:", e);
        }
    }, [image_name]);

    return (
            <img src={url} alt={image_name} style={{"maxWidth":"100%","width":"auto","height":"auto","maxHeight":"13vh"}} className="rounded"></img>
    );
}

export default SearchImage;
