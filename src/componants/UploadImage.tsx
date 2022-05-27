import { useState } from "react";
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { v4 } from "uuid";
import { db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

function UploadImage() {
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUploadinput, setImageUploadinput] = useState("");

    const [image_name, setImage_name] = useState("");

    const uploadFile = () => {

        //split image_name with ; and create a array
        var image_name_array = image_name.split(";");
        for (var i = 0; i < image_name_array.length; i++) {
            //delete space and number of image_name_array
            image_name_array[i] = image_name_array[i].replace(/[\s\d-+]/g, "").toLocaleLowerCase();
            //delete the accent
            image_name_array[i] = image_name_array[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            //if finish with s delete it
            if (image_name_array[i].endsWith("s")) {
                image_name_array[i] = image_name_array[i].substring(0, image_name_array[i].length - 1);
            }
        }
        if (imageUploadinput !== "") {
       
            const collectionRef = collection(db, "images");
            addDoc(collectionRef, { url: imageUploadinput, name: image_name_array });
            console.log("add !");
            setImage_name("");
            setImageUploadinput("");
            return; 
        }
        if (imageUpload == null || image_name_array.length === 0) return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            // get the url of the image
            getDownloadURL(snapshot.ref).then((url) => {
                const collectionRef = collection(db, "images");
                addDoc(collectionRef, { url: url, name: image_name_array });
                console.log("add !");
                setImageUpload(null);
                setImage_name("");
            });
        });
        
    };

    return (
        <div >
            <div>
                <input type="text" value={image_name}  placeholder="name" onChange={(e) => setImage_name(e.target.value)} />
            </div>
            <div>
                <input type="text" value={imageUploadinput} onChange={(event) => {
                    setImageUploadinput(event.target.value);
                }} />
            </div>
            <input
                type="file"
                onChange={(event) => {
                    setImageUpload(event.target.files[0]);
                }}
            />
            <button onClick={uploadFile}> Upload Image</button>

        </div>
    );
}

export default UploadImage;
