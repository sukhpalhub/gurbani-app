import React, {Component} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {ShabadContext} from "../../contexts/ShabadContext";

export default class ShabadPanel extends Component {
    static contextType = ShabadContext;

    state = {
        shabad_id: null,
        lines: [],
        line_id: null,
        preferences: []
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.shabad_id !== this.context.shabad.id || this.state.line_id !== this.context.shabad.line_id) {
            this.setState({
                shabad_id: this.context.shabad.id,
                lines: this.context.shabad.lines,
                line_index: this.context.shabad.line_index,
                line_id: this.context.shabad.line_id,
            });
        }
    }

    render() {
        const {lines, line_index} = this.context.shabad;
        const preferences = this.context.preferences;
        return (
            <ShabadContext.Consumer>
                {context => (
                    <Container fluid style={{height: '100%'}}
                               className="shabad"
                               tabIndex="0"
                               onKeyDown={(e) => {
                                   switch (e.key) {
                                       case 'ArrowLeft':
                                           this.context.shabad.prevLine();
                                           break;
                                       case 'ArrowRight':
                                           this.context.shabad.nextLine();
                                           break;
                                       case ' ':
                                       case 'ArrowUp':
                                           this.context.shabad.homeLine();
                                           break
                                   }
                                   console.log(e.key);
                               }}
                    >
                        <Row className="gurbani-row">
                            <Col className="gurmukhi" style={{fontSize: preferences.shabad.gurbaniFontSize + 'rem'}}>
                                { lines.length > 0 ?
                                    lines[line_index].gurmukhi
                                    : ''
                                }
                            </Col>
                        </Row>
                        <Row className="punjabi-row">
                            <Col style={{fontSize: preferences.shabad.punjabiFontSize + 'rem'}}>
                                { lines.length > 0 ?
                                    lines[line_index].punjabi
                                    : ''
                                }
                            </Col>
                        </Row>
                        <Row className="english-row">
                            <Col style={{fontSize: preferences.shabad.englishFontSize + 'rem'}}>
                                { this.state.lines.length > 0 ?
                                    lines[line_index].english
                                    : ''
                                }
                            </Col>
                        </Row>
                    </Container>
                )}
            </ShabadContext.Consumer>
        )
    }
}
