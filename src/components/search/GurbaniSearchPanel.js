import React, {Component} from "react";
import {Button, ButtonGroup, Card, Form, InputGroup, ListGroup, ListGroupItem, Navbar} from "react-bootstrap";
import {DashCircle, DashSquare, JournalAlbum, MenuUp, PlusSquare, Search, SearchHeart} from "react-bootstrap-icons";
import {ShabadContext} from "../../contexts/ShabadContext";

export default class GurbaniSearchPanel extends Component {
    static contextType = ShabadContext;

    state = {
        showSearch: true,
        searchFocus: false,
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

    componentDidMount() {
        this.searchInput.focus();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.searchFocus && this.state.searchFocus) {
            this.setState({searchFocus: false});
            this.searchInput.select();
        }
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
        let state = this.state;
        state.showSearch = true;
        state.tab_display = {
            search_tab: true,
            shabad_tab: false,
            settings_tab: false,
        };
        state.searchFocus = true;
        this.setState(state);
    }

    showShabadTab = () => {
        this.setState({tab_display: {
            search_tab: false,
            shabad_tab: true,
            settings_tab: false,
        }});
        this.setShabadFocus();
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
                showShabadTab: this.showShabadTab,
                showSearchTab: this.showSearchTab,
                autoNextIndex: 0,
                autoNext: this.autoNext,
                toggleSearchBox: this.toggleSearchBox,
            });
            this.showShabadTab();
        });
    }

    homeLine = () => {
        let shabad = this.context.shabad;
        shabad.line_index = shabad.home_index;
        this.context.setShabad(shabad);
    }

    autoNext = () => {
        let shabad = this.context.shabad;
        shabad.visited_lines[shabad.autoNextIndex] = shabad.lines[shabad.autoNextIndex];
        shabad.line_index = shabad.autoNextIndex;

        if (shabad.autoNextIndex === shabad.lines.length) {
            shabad.line_index = shabad.home_index;
        } else {
            shabad.autoNextIndex++;
        }

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

    setShabadFocus = () => {
        document.getElementById('root').firstElementChild.focus();
    }

    toggleSearchBox = () => {
        this.setState({showSearch: ! this.state.showSearch});
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
                            <Card id="searchBox" className={ this.state.showSearch ? 'search-box' : 'search-box d-none'}>
                                <Navbar bg="light" className="d-block">
                                    <DashSquare
                                        className="float-end me-2"
                                        onClick={() => {
                                            this.setState({
                                                showSearch: !this.state.showSearch
                                            });
                                            this.setShabadFocus();
                                        }}
                                    />
                                </Navbar>
                                <Card.Body bg="primary" className="p-0">
                                        <div className={tab_display.search_tab ? "p-2" : 'p-2 d-none'}>
                                        <InputGroup>
                                            <Form.Control
                                                ref={inputEl => (this.searchInput = inputEl)}
                                                id="search-field"
                                                size="sm"
                                                className="gurmukhi"
                                                value={this.state.searchText}
                                                onChange={(e) => {
                                                    this.setState({searchText: e.target.value});
                                                    if (e.target.value.length > 2) {
                                                        this.searchGurbani();
                                                    }
                                                }}
                                                onKeyDown={
                                                    (e) => {
                                                        if (e.key === 'Enter') {
                                                            this.searchGurbani();
                                                        }
                                                        if (e.key === 'ArrowDown') {
                                                            console.log('selecting');
                                                           document.getElementById('search-result-0').setAttribute('selected', 'selected');
                                                        }
                                                    }
                                                }
                                            />
                                            <InputGroup.Text onClick={() => this.searchGurbani()}>
                                                <Search/>
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <ListGroup id="search-results"
                                                   className="gurmukhi mt-2"
                                                   onKeyDown={
                                                       (e) => {
                                                           if (e.key === 'ArrowDown') {
                                                           }
                                                       }
                                       }>{this.state.results.map((row, index) =>
                                            <ListGroup.Item
                                                id={`search-result-${index}`}
                                                key={row.id}
                                                onClick={() => {
                                                this.setShabad(row);
                                            }}>{row.gurmukhi}</ListGroup.Item>
                                        )}</ListGroup>
                                        </div>

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
                    {
                        ! this.state.showSearch &&
                        <PlusSquare
                            id="searchBoxMaxButton"
                            className="me-2 mb-2"
                            onClick={() => {
                                this.setState({
                                    showSearch: ! this.state.showSearch
                                });
                                this.setShabadFocus();
                            }}
                        />
                    }
                </div>
            )}
            </ShabadContext.Consumer>
        )
    }
}