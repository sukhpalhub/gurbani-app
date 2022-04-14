import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {Button, Card, Col, Container, Form, InputGroup, Navbar, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {DashSquare, PlusSquare, Search} from "react-bootstrap-icons";

function App() {
  const [data, setData] = useState({
    'name_gurmukhi': null,
  });

  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    window.api.getScripture().then((data) => {
        setData(data);
    });
  }, []);

  return (
      <Container fluid style={{height: '100%'}}>
        <Row className="gurmukhi-row">
          <Col></Col>
        </Row>
        <Row className="punjabi-row">
          <Col></Col>
        </Row>
        <Row className="english-row">
          <Col></Col>
        </Row>
          {
              showSearch &&
              <Card id="searchBox">
                  <Navbar bg="light" className="d-block">
                      <DashSquare
                          className="float-end me-2"
                          onClick={() => {
                              setShowSearch(! showSearch);
                          }}
                      />
                  </Navbar>
                  <Card.Body bg="primary">
                      <InputGroup>
                          <Form.Control />
                          <InputGroup.Text>
                            <Search />
                          </InputGroup.Text>
                      </InputGroup>
                  </Card.Body>
              </Card>
          }
          {
              ! showSearch &&
              <PlusSquare
                  id="searchBoxMaxButton"
                  className="me-2 mb-2"
                  onClick={() => {
                      setShowSearch(! showSearch);
                  }}
              />
          }
      </Container>
  );
}

export default App;
