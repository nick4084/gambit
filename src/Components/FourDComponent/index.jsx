import React, { Component } from 'react';

//import containers
import DigitAnalysis from './Container/DigitAnalysis';
import TopNumber from './Container/TopNumber';
import Search from './Container/Search';


import {
    Card, CardHeader, Row, Col, CardBody
} from 'reactstrap';
import { readCsv } from '../../utils';

const DATA_DIR = "src/Data/4d/";
const HistoryCsv = DATA_DIR + "win_history.csv";

class FourD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
        }

        this.loadHistory = this.loadHistory.bind(this);
        this.loadHistory();
    }

    async loadHistory() {
        const history = await readCsv(HistoryCsv);
        console.log(history);
        this.setState({
            history
        });
    }

    render() {
        return (
            <>
                <div>
                    <Row>
                        <Col xs="12" sm="12" md="12">
                            <Search history={this.state.history} />
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="12" sm="8" md="4">
                            <Card>
                                <CardHeader>
                                    <strong>Chance of digit occurance in a draw</strong>
                                </CardHeader>
                                <CardBody>

                                    <DigitAnalysis history={this.state.history} />

                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <strong>Pattern</strong>
                                </CardHeader>
                                <CardBody>

                                    {/* <DigitAnalysis history={this.state.history} /> */}

                                </CardBody>
                            </Card>
                        </Col>

                        <Col xs="12" sm="8" md="4">
                            <Card>
                                <CardHeader>
                                    <strong>Top 10 winning numbers</strong>
                                </CardHeader>
                                <CardBody>
                                    <TopNumber history={this.state.history} show={10} permutation={false} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" sm="8" md="4">
                            <Card>
                                <CardHeader>
                                    <strong>Top 10 winning permutation numbers</strong>
                                </CardHeader>
                                <CardBody>
                                    <TopNumber history={this.state.history} show={10} permutation={true} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>



                </div>

            </>

        );
    }
}
export default FourD;