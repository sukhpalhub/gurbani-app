import React, {Component} from "react";
import {Card, Form, InputGroup, ListGroup, Navbar} from "react-bootstrap";
import {DashSquare, PlusSquare, Search} from "react-bootstrap-icons";

export default class GurbaniSearchPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearch: true,
            searchText: '',
            results: [],
            preferences: {
                vishrams: false
            }
        };
        this.searchGurbani.bind();
    }

    adjustVirshrams = (data) => {
        return data.map((row, index) => {
            let gurmukhi = row.gurmukhi;
            gurmukhi = gurmukhi.replace(';', '');
            row.gurmukhi = gurmukhi;
            return row;
        });
    }

    searchGurbani = (e) => {
        this.setState({results: []});
        window.api.getScripture({
            q: this.state.searchText
        }).then((data) => {
            this.setState({
                results: this.adjustVirshrams(data)
            })
        });
        return null;
    }

    render() {
        return (
        <div>
            {
                this.state.showSearch &&
                <Card id="searchBox" className="search-box">
                    <Navbar bg="light" className="d-block">
                        <DashSquare
                            className="float-end me-2"
                            onClick={() => {
                                this.state.set({
                                    showSearch: ! this.state.showSearch
                                });
                            }}
                        />
                    </Navbar>
                    <Card.Body bg="primary">
                        <InputGroup>
                            <Form.Control
                                size="sm"
                                className="gurmukhi"
                                value={this.state.searchText}
                                onChange={(e) => {
                                    this.setState({searchText: e.target.value});
                                }}
                            />
                            <InputGroup.Text onClick={(e) => this.searchGurbani(e)}>
                                <Search />
                            </InputGroup.Text>
                        </InputGroup>
                        <ListGroup className="gurmukhi mt-2">
                        {
                            this.state.results.map((row) =>
                                <ListGroup.Item key={row.id}>{row.gurmukhi}</ListGroup.Item>
                            )
                        }
                        </ListGroup>
                    </Card.Body>
                </Card>
            }
            {
                ! this.state.showSearch &&
                <PlusSquare
                    id="searchBoxMaxButton"
                    className="me-2 mb-2"
                    onClick={() => {
                        this.state.set({
                            showSearch: ! this.state.showSearch
                        });
                    }}
                />
            }
        </div>
        )
    }
}