import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody, ListGroup, ListGroupItem, Input } from 'reactstrap';
import { AppSwitch } from '@coreui/react';

import CandleStickChartWithBollingerBandOverlay from './components/chartComponent';
import { readCsv, getFileNames } from '../../../utils/csv';
import { Empty } from '../../Empty';
import { KlineAnalysis } from './components/KlineAnalysis';
import './index.css';
import isEmpty from 'lodash/isEmpty';
import { ema } from 'react-stockcharts/lib/indicator';

const dataDirPath = 'src/Data/crypto/';


class CryptoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choosenFileName: '',
            rawChartData: [],
            chartData: [],
            dataDirFiles: [],
            chartConfig: {
                bb: {
                    show: true,
                    value: 'close'
                },
                sma: {
                    show: true,
                    value: [20]
                },
                ema: {
                    show: true,
                    value: [7, 25, 99]
                },
                macd: {
                    show: true,
                    fast: 12,
                    slow: 26,
                    signal: 9
                },
                rsi: {
                    show: true,
                    value: 14,
                },
                atr: {
                    show: true,
                    value: 14,
                }
            }
        }
        this.loadChart();
        this.loadCsvList();
    }

    async loadCsvList() {
        const dataDirFiles = await getFileNames(dataDirPath);
        this.setState({ dataDirFiles });
    }

    async loadChart(filename) {
        const rawChartData = await readCsv(`${dataDirPath}${filename}`);
        const chartData = rawChartData.map(row => {
            return {
                date: new Date(parseInt(row.Close_time)),
                open: parseFloat(row.Open),
                high: parseFloat(row.High),
                low: parseFloat(row.Low),
                close: parseFloat(row.Close),
                volume: parseFloat(row.Volume)
            }
        });
        this.setState({ chartData, rawChartData });
    }
    componentDidMount() {

    }

    onCSVListClicked = async (e) => {
        const filename = e.target.innerHTML;
        this.setState({ choosenFileName: filename });
        this.loadChart(filename);
    }


    onToggleShow = (e, key) => {
        const { chartConfig } = this.state;
        chartConfig[key].show = e.target.checked;
        this.setState({ chartConfig });
    }
    onSmaChange = (e) => {
        const { chartConfig } = this.state;
        chartConfig.sma.value[0] = e.target.value;
        this.setState({ chartConfig });
    }
    onEmaChange = (e, i) => {
        const { chartConfig } = this.state;
        const newValue = parseInt(e.target.value);
        let emaValue = chartConfig.ema.value;

        emaValue[i] = newValue;

        chartConfig.ema.value = emaValue;
        this.setState({ chartConfig });
    }

    onMacdChange = (e, key, i) => {
        let { chartConfig } = this.state;
        switch (key) {
            case 'show':
                chartConfig.macd[key] = e.target.checked;
                break;
            case 'fast':
                chartConfig.macd.fast = parseInt(e.target.value);
                break;
            case 'slow':
                chartConfig.macd.slow = parseInt(e.target.value);
                break;
            case 'signal':
                chartConfig.macd[key] = e.target.value;
                break;
        }
        this.setState({ chartConfig });
    }

    onRsiChange = (e) => {
        const { chartConfig } = this.state;
        chartConfig.rsi.value = e.target.value;
        this.setState({ chartConfig });
    }

    onAtrChange = (e) => {
        const { chartConfig } = this.state;
        chartConfig.atr.value = e.target.value;
        this.setState({ chartConfig });
    }

    render() {
        const { dataDirFiles, choosenFileName, chartData, rawChartData, chartConfig } = this.state;
        return (
            <div>
                <Card>
                    <CardHeader>
                        Data to analyze
                    </CardHeader>
                    <CardBody>
                        <h3>Avaliable CSVs</h3>
                        <h4>choose a csv to analyze</h4>
                        <ListGroup>
                            {dataDirFiles?.map(item => {
                                if (item.split('.')[1] === 'csv') {
                                    return (
                                        <ListGroupItem action key={item} onClick={this.onCSVListClicked}>{item}</ListGroupItem>
                                    )
                                }
                            })}
                        </ListGroup>
                    </CardBody>
                </Card>

                {isEmpty(choosenFileName) ? <Empty /> : <>
                    <Card>
                        <CardHeader>
                            chart
                </CardHeader>

                        <CardBody>
                            <span><i className='cui-settings'> Indicator config</i></span>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <CardBody className="configOption__container flex">
                                            <span>Bollinger Band : </span><AppSwitch className={'mx-1'} color={'success'} onChange={e => this.onToggleShow(e, 'bb')} checked={chartConfig.bb.show} />
                                        </CardBody>
                                    </Col>

                                    <Col>
                                        <CardBody className="configOption__container flex">
                                            <span>SMA: </span><AppSwitch className={'mx-1'} color={'success'} onChange={e => this.onToggleShow(e, 'sma')} checked={chartConfig.sma.show} /><Input className="value-input__container" type="number" placeholder="sma1" value={chartConfig.sma.value[0]} onChange={this.onSmaChange} />
                                        </CardBody>
                                    </Col>
                                </Row>
                                <Row className="config__row">
                                    <Col>
                                        <CardBody className="configOption__container flex">
                                            <span>EMA(up to 3): </span><AppSwitch className={'mx-1'} color={'success'} onChange={e => this.onToggleShow(e, 'ema')} checked={chartConfig.ema.show} /><Input className="value-input__container" type="number" placeholder="Ema1" value={chartConfig.ema.value[0]} onChange={e => this.onEmaChange(e, 0)} />
                                            <Input className="value-input__container" type="number" placeholder="Ema2" value={chartConfig.ema.value[1]} readOnly={chartConfig.ema.value.length <= 0 ? true : false} onChange={e => this.onEmaChange(e, 1)} />
                                            <Input className="value-input__container" type="number" placeholder="Ema3" value={chartConfig.ema.value[2]} readOnly={chartConfig.ema.value.length <= 1 ? true : false} onChange={e => this.onEmaChange(e, 2)} />

                                        </CardBody>
                                    </Col>

                                    <Col>
                                        <CardBody className="configOption__container">
                                            <Row className="multi-row">
                                                <Col><span>MACD: </span></Col><Col><AppSwitch className={'mx-1'} color={'success'} onChange={e => this.onMacdChange(e, 'show')} checked={chartConfig.macd.show} /></Col>
                                                <Col><span>Signal: </span></Col><Col><Input className="value-input__container" type="number" placeholder="Signal" value={chartConfig.macd.signal} onChange={e => this.onMacdChange(e, 'signal')} /></Col>
                                            </Row>
                                            <Row className="multi-row">
                                                <Col><span>Ema fast: </span></Col><Col><Input className="value-input__container" type="number" placeholder="Ema fast" value={chartConfig.macd.fast} onChange={e => this.onMacdChange(e, 'fast')} /></Col>
                                                <Col><span>Ema slow: </span></Col><Col><Input className="value-input__container" type="number" placeholder="Ema slow" value={chartConfig.macd.slow} onChange={e => this.onMacdChange(e, 'slow')} /></Col>

                                            </Row>

                                        </CardBody>
                                    </Col>
                                </Row>
                                <Row className="config__row">
                                    <Col>
                                        <CardBody className="configOption__container flex">
                                            <span>RSI: </span><AppSwitch className={'mx-1'} color={'success'} onChange={e => this.onToggleShow(e, 'rsi')} checked={chartConfig.rsi.show} /><Input className="value-input__container" type="number" placeholder="period" value={chartConfig.rsi.value} onChange={e => this.onRsiChange(e)} />

                                        </CardBody>
                                    </Col>

                                    <Col>
                                    <CardBody className="configOption__container flex">
                                        <span>ATR: </span><AppSwitch className={'mx-1'} color={'success'} onChange={e => this.onToggleShow(e, 'atr')} checked={chartConfig.atr.show} /><Input className="value-input__container" type="number" placeholder="period" value={chartConfig.atr.value} onChange={e => this.onAtrChange(e)} />

                                    </CardBody>
                                    </Col>
                                </Row>
                            </CardBody>
                        </CardBody>

                        <CardBody className={"candleAnalysis__card"}>
                            {chartData.length > 0 ?
                                <CandleStickChartWithBollingerBandOverlay type={'svg'} data={chartData} indicatorConfig={chartConfig} />
                                : <Empty />}
                        </CardBody>
                    </Card>

                    <KlineAnalysis klineArray={rawChartData} /></>}



            </div>
        );
    }
}
export default CryptoComponent;