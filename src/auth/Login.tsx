import { useState } from "react";
import { auth, db } from "./../firebase";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { AppState } from "../Context";
import { Button, Form } from "react-bootstrap";
import { Link } from "@material-ui/core";
import GoogleButton from "react-google-button";
import { doc, setDoc, Timestamp } from "firebase/firestore";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAlert } = AppState();

  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = async() => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        setAlert({
          open: true,
          message: `Sign Up Successful. Welcome ${res.user.email}`,
          type: "success",
        });
        try {
            setDoc(doc(db, "Users", res.user.uid), {
            firstName: res.user.displayName,
            lastName: "",
            genre: "",
            date_inscription: Timestamp.now(),
          });
          console.log(res.user.uid);
          setAlert({
            open: true,
            message: `Sign Up Successful. Welcome ${res.user.email}`,
            type: "success",
          });
          window.location.href = "/";
        }
        catch (error) {
          console.log(error);
          setAlert({
            open: true,
            type: "error",
            message: "Error on creating user"
          });
        }
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
        return;
      });
  };


  const handleSubmit = async () => {
    if (!email || !password) {
      console.log("email or password is empty");
      setAlert({
        open: true,
        message: "Please fill all the Fields",
        type: "error",
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign Up Successful. Welcome" + result.user.email); 
      window.location.href = "/";
      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });
    } catch (error) {
      console.log(error.message);
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
    }
  };


  return (
    <>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label >Email address</Form.Label>
        <Form.Control 
         type="email"
         name="email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         autoComplete="email"
        placeholder="Enter email"  />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control 
         type="password"
         name="password"
         autoComplete="current-password"
         value={password}
        onChange={(e) => setPassword(e.target.value)}
         placeholder="Password" />
      </Form.Group>
      <p>Pas encore enregistré ? <Link href="/auth/signup" >Clic ici !</Link></p>
      <Button onClick={handleSubmit} >
        Submit
      </Button>
    </Form>
    <p style={{ "marginTop": "10px" }}>OR</p>
    <GoogleButton

      style={{ width: "100%", outline: "none", "margin": "10px" }}
      onClick={signInWithGoogle}
    />
    </>
  );
};

export default Login;
