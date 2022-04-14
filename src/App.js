import React from 'react';
import './App.css';
import {Col, Container, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import GurbaniSearchPanel from "./components/search/GurbaniSearchPanel";

function App() {
  return (
      <Container fluid style={{height: '100%'}}>
        <Row className="gurmukhi-row">
          <Col>test</Col>
        </Row>
        <Row className="punjabi-row">
          <Col></Col>
        </Row>
        <Row className="english-row">
          <Col></Col>
        </Row>
        <GurbaniSearchPanel />
      </Container>
  );
}

export default App;
