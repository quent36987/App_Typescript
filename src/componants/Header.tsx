/* eslint-disable jsx-a11y/anchor-is-valid */
import { signOut } from "firebase/auth";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { AppState } from "../Context";
import { auth } from "../firebase";

//import "./Header.css"

const App = () => {
  
  const {user, setAlert} = AppState();

  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      message: "Logout Successfull !",
    });
  };

  return (
    <Navbar
      collapseOnSelect
      expand="md"
      bg="light"
      variant="light"
      className="px-3 py-8"
    >
      <Navbar.Brand href="/">
        AppSport💪🏽
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-na" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto px-2">
          <NavDropdown title="Sessions" id="basic-nav-dropdown">
            <NavDropdown.Item href="/chrono">All sessions</NavDropdown.Item>
            <NavDropdown.Item href="/chronoform">Create a session</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/">More information ?</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/timer" >Timer</Nav.Link>
          <Nav.Link href="/profile" >Profile</Nav.Link>
        </Nav>
        <Nav>
          {user ? 
          <Button variant="outline-danger" onClick={logOut} >Log out</Button>
          :
          <Button variant="outline-success" href="/auth/login" >Login</Button>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default App
