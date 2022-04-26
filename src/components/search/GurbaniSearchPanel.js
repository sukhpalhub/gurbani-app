import React, {Component} from "react";
import {Button, ButtonGroup, Card, Form, InputGroup, ListGroup, ListGroupItem, Navbar} from "react-bootstrap";
import {DashCircle, DashSquare, JournalAlbum, MenuUp, PlusSquare, Search, SearchHeart} from "react-bootstrap-icons";
import {ShabadContext} from "../../contexts/ShabadContext";

export default class GurbaniSearchPanel extends Component {
    static contextType = ShabadContext;

    state = {
        showSearch: true,
        searchText: '',
        results: [],
        shabad: {
            id: null,
        },
        tab_display: {
            search_tab: true,
            shabad_tab: false,
            settings_tab: false,
        }
    };

    constructor(props) {
        super(props);
    }

    adjustVirshrams = (data) => {
        return data.map((row, index) => {
            if (row.hasOwnProperty('punjabi')) {
                row.punjabi = row.punjabi.replace(/[;]/g, '');
            }
            if (row.hasOwnProperty('gurmukhi')) {
                row.gurmukhi = row.gurmukhi.replace(/[;]|[.]|[,]/g, '');
            }
            return row;
        });
    }

    searchGurbani = () => {
        this.setState({results: []});
        window.api.getScripture({
            q: this.state.searchText
        }).then((data) => {
            this.setState({
                results: this.adjustVirshrams(data)
            })
        }).catch((err) => {
            console.log(err);
        });

        return null;
    }

    showSearchTab = () => {
        this.setState({tab_display: {
            search_tab: true,
            shabad_tab: false,
            settings_tab: false,
        }});
    }

    showShabadTab = () => {
        this.setState({tab_display: {
            search_tab: false,
            shabad_tab: true,
            settings_tab: false,
        }});
    }

    showSettingsTab = () => {
        this.setState({tab_display: {
            search_tab: false,
            shabad_tab: false,
            settings_tab: true,
        }});
    }

    setShabad = (row) => {
        window.api.getShabad({
            id: row.shabad_id
        }).then(data => {
            let lineIndex = data.findIndex(line => line.id === row.id);
            data = this.adjustVirshrams(data);
            this.context.setShabad({
                id: row.shabad_id,
                line_id: row.id,
                lines: data,
                home_index: lineIndex,
                line_index: lineIndex,
                nextLine: this.nextLine,
                prevLine: this.prevLine,
                homeLine: this.homeLine,
                visited_lines: [],
                preferences: this.state.preferences,
            });
            this.showShabadTab();
        });
    }

    homeLine = () => {
        let shabad = this.context.shabad;
        shabad.line_index = shabad.home_index;
        this.context.setShabad(shabad);
    }

    nextLine = () => {
        let shabad = this.context.shabad;
        if (shabad.lines.length === (shabad.line_index + 1)) {
            return;
        }

        shabad.line_index++;
        this.context.setShabad(shabad);
    }


    prevLine = () => {
        let shabad = this.context.shabad;
        if (shabad.line_index === 0) {
            return;
        }

        shabad.line_index--;
        this.context.setShabad(shabad);
    }

    setShabadRow = (row) => {
        let shabad = this.context.shabad;
        shabad.line_id = row.id;
        shabad.line_index = shabad.lines.findIndex(line => line.id === row.id);
        this.context.setShabad(shabad);
    }

    render() {
        const {tab_display} = this.state;
        let sizeLabelStyle = {
            width: "390px",
            textAlign: "right",
            paddingRight: "10px",
            paddingTop: "10px"
        };

        return (
            <ShabadContext.Consumer>
                {context => (
                    <div>
                    {
                        this.state.showSearch &&
                            <Card id="searchBox" className="search-box">
                                <Navbar bg="light" className="d-block">
                                    <DashSquare
                                        className="float-end me-2"
                                        onClick={() => {
                                            this.setState({
                                                showSearch: !this.state.showSearch
                                            });
                                        }}
                                    />
                                </Navbar>
                                <Card.Body bg="primary" className="p-0">
                                    {
                                        tab_display.search_tab &&
                                        <div className="p-2">
                                        <InputGroup>
                                            <Form.Control
                                                size="sm"
                                                className="gurmukhi"
                                                value={this.state.searchText}
                                                onChange={(e) => {
                                                    this.setState({searchText: e.target.value});
                                                }}
                                                onKeyDown={
                                                    (e) => {
                                                        if (e.key === 'Enter') {
                                                            this.searchGurbani();
                                                        }
                                                    }
                                                }
                                            />
                                            <InputGroup.Text onClick={() => this.searchGurbani()}>
                                                <Search/>
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <ListGroup className="gurmukhi mt-2">{this.state.results.map((row) =>
                                            <ListGroup.Item
                                                key={row.id}
                                                onClick={() => {
                                                this.setShabad(row);
                                            }}>{row.gurmukhi}</ListGroup.Item>
                                        )}</ListGroup>
                                        </div>
                                    }

                                    {
                                        tab_display.shabad_tab &&
                                        <div>
                                            <ListGroup className="gurmukhi">{this.context.shabad.lines.map((row, index) =>
                                                <ListGroup.Item
                                                    className={ index == context.shabad.line_index ? 'text-primary bg-light' : ''}
                                                    key={row.id}
                                                    onClick={() => {
                                                        this.setShabadRow(row);
                                                    }}>{row.gurmukhi}</ListGroup.Item>
                                            )}</ListGroup>
                                        </div>
                                    }

                                    {
                                        tab_display.settings_tab &&
                                        <ListGroup>
                                            <ListGroupItem>
                                            <InputGroup>
                                                <Form.Label className="col-md-8">Gurmukhi Size</Form.Label>
                                                <Button onClick={(e) => {
                                                    let pref = context.preferences;
                                                    pref.shabad.gurbaniFontSize--;
                                                    context.setPreferences(pref);
                                                }}
                                                    className="btn-secondary"
                                                >-</Button>
                                                <Form.Control
                                                    type="text"
                                                    value={context.preferences.shabad.gurbaniFontSize}
                                                />
                                                <Button onClick={(e) => {
                                                    let pref = context.preferences;
                                                    pref.shabad.gurbaniFontSize++;
                                                    context.setPreferences(pref);
                                                }}
                                                    className="btn-secondary"
                                                >+</Button>
                                            </InputGroup>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                            <InputGroup className="mt-2">
                                                <Form.Label className="col-md-8">Punjabi Size</Form.Label>
                                                <Button onClick={(e) => {
                                                    let pref = context.preferences;
                                                    pref.shabad.punjabiFontSize--;
                                                    context.setPreferences(pref);
                                                }}
                                                    className="btn-secondary"
                                                >-</Button>
                                                <Form.Control
                                                    type="text"
                                                    value={context.preferences.shabad.punjabiFontSize}
                                                />
                                                <Button onClick={(e) => {
                                                    let pref = context.preferences;
                                                    pref.shabad.punjabiFontSize++;
                                                    context.setPreferences(pref);
                                                }}
                                                    className="btn-secondary"
                                                >+</Button>
                                            </InputGroup>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                            <InputGroup className="mt-2">
                                                <Form.Label className="col-md-8">English Size</Form.Label>
                                                <Button onClick={(e) => {
                                                    let pref = context.preferences;
                                                    pref.shabad.englishFontSize--;
                                                    context.setPreferences(pref);
                                                }}
                                                    className="btn-secondary col-md-1"
                                                >-</Button>
                                                <Form.Control
                                                    className="col-md-2"
                                                    type="text"
                                                    value={context.preferences.shabad.englishFontSize}
                                                />
                                                <Button onClick={(e) => {
                                                    let pref = context.preferences;
                                                    pref.shabad.englishFontSize++;
                                                    context.setPreferences(pref);
                                                }}
                                                    className="btn-secondary col-md-1"
                                                >+</Button>
                                            </InputGroup>
                                            </ListGroupItem>
                                        </ListGroup>
                                    }

                                    <Navbar bg="light" className="d-block">
                                        <Search
                                            onClick={() => {
                                                this.showSearchTab()
                                            }}
                                        />
                                        <JournalAlbum
                                            className="pl-3"
                                            onClick={() => {
                                                this.showShabadTab()
                                            }}
                                        />
                                        <SearchHeart
                                            className="pl-3"
                                            onClick={() => {
                                                this.showSettingsTab()
                                            }}
                                        />
                                    </Navbar>
                                </Card.Body>
                            </Card>
                    }
                    {
                        ! this.state.showSearch &&
                        <PlusSquare
                            id="searchBoxMaxButton"
                            className="me-2 mb-2"
                            onClick={() => {
                                this.setState({
                                    showSearch: ! this.state.showSearch
                                });
                            }}
                        />
                    }
                </div>
            )}
            </ShabadContext.Consumer>
        )
    }
}