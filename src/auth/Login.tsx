import { useState } from "react";
import { auth } from "./../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AppState } from "../Context";
import { Button, Form } from "react-bootstrap";
import { Link } from "@material-ui/core";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAlert } = AppState();


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

    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label >Email address</Form.Label>
        <Form.Control 
         type="email"
         name="email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"  />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control 
         type="password"
         name="password"
         value={password}
        onChange={(e) => setPassword(e.target.value)}
         placeholder="Password" />
      </Form.Group>
      <p>Pas encore enregistré ? <Link href="/auth/signup" >Clic ici !</Link></p>
      <Button onClick={handleSubmit} >
        Submit
      </Button>
    </Form>
  );
};

export default Login;
