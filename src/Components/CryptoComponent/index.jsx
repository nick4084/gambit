import React, { Component } from 'react';
import {Card, CardHeader, CardBody} from 'reactstrap';
import CandleStickChartWithBollingerBandOverlay from './components/chartComponent';
import { TypeChooser } from "react-stockcharts/lib/helper";
import { readCsv } from '../../utils/csv';
import { formatDate } from '../../utils/formatter';
import { Empty } from '../Empty';

const moment = require('moment');
class CryptoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawChartData: [],
            chartData: []
        }
        this.loadChart();
    }

    async loadChart() {
        const rawChartData = await readCsv('src/Data/crypto/17 AUG, 2017_to_23 Feb, 2020_1h.csv');
        const chartData = rawChartData.map(row => {
            return {
                date: new Date(parseInt(row.Close_time)),
                open: row.Open,
                high: row.High,
                low: row.Low,
                close: row.Close,
                volume: row.Volume
            }
        });
        console.log(chartData);
        this.setState({ chartData, rawChartData });
    }
    componentDidMount() {

    }
    render() {
        return (
            <div>
                <Card>
                    <CardHeader>
                        chart
                    </CardHeader>
                    <CardBody>
                        {this.state.chartData.length > 0 ? <TypeChooser>
                            {type => <CandleStickChartWithBollingerBandOverlay type={type} data={this.state.chartData} />}
                        </TypeChooser> : <Empty />}
                    </CardBody>
                </Card>

            </div>
        );
    }
}
export default CryptoComponent;