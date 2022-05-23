
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AppState } from "../Context";

const Signup = ({ handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setAlert } = AppState();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      console.log("password and confirm password are not the same");
      setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Sign Up Successful. Welcome" + result.user.email);
      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });

      handleClose();
    } catch (error) {
      console.log("error" + error.message);
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
    }
  };

  return (
    <div>
      <input

        type="email"

        value={email}
        onChange={(e) => setEmail(e.target.value)}

      />
      <input

        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}

      />
      <input

        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}

      />
      <button


        style={{ backgroundColor: "#EEBC1D" }}
        onClick={handleSubmit}
      >
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
