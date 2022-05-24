/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap"

//import "./Header.css"

const App = () => {
  return (
    <Navbar
      collapseOnSelect
      expand="md"
      bg="light"
      variant="light"
      className="px-3 py-8"
    >
      <Navbar.Brand href="/">
        AppSport
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-na" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto px-2">
          <NavDropdown title="Séances" id="basic-nav-dropdown">
            <NavDropdown.Item href="/chrono">Toutes les séances</NavDropdown.Item>
            <NavDropdown.Item href="/chronoform">Créer une séance</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/">Plus d'info ?</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/profile" >Profile</Nav.Link>
        </Nav>
        <Nav>
          <Button variant="outline-success" href="/auth/login" >Login</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default App
