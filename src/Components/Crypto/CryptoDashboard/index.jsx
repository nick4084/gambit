import React from 'react';
import { Row, Col, Card, CardHeader, DropdownToggle, DropdownMenu, DropdownItem, ButtonGroup, ButtonDropdown } from 'reactstrap';
import BinanceAPI from '../../../utils/binance';

import { Loading } from '../../Loading';
import TickerPrice from './components/TickerPrice';
import dashboardConfig from './dashboardDisplay.json';


const renderDashboard = (state) => {
    const { priceTicker } = state;
    const tickers = dashboardConfig.tickers;
    return (
        <Row>
            {priceTicker.map((ticker, i) => {
                return (
                    <Col sm="6" md="4" lg="3">
                        <TickerPrice props={Object.assign({ ticker: tickers[i] }, { price: ticker })} />
                    </Col>
                )
            })}

        </Row>

    );
}


class CryptoDashboard extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            binance: new BinanceAPI(),
            interval: '1h',
            limit: 7,
            isLoading: true,
            prices: {},
        }
        this.loadPrice = this.loadPrice.bind(this);
        this.loadPrice();
    }

    async loadPrice(interval = this.state.interval, limit = this.state.limit) {
        const { binance } = this.state;
        const tickers = dashboardConfig.tickers;
        const CandleProps = {
            limit,
            interval,
            endTime: parseInt(new Date().getTime() / 100000) * 100000
        }
        const fetchTickers = tickers.map(ticker => {
            return binance.getCandleStick(Object.assign({ ticker }, CandleProps));
        });

        const priceTicker = await Promise.all(fetchTickers);
        this.setState({ priceTicker, isLoading: false });
    }
    onChangeInterval = (value) => {
        this.setState({ interval: value });
        this.loadPrice(value);

    }

    onChangeLimit = (value) => {
        this.setState({ limit: value });
        this.loadPrice(this.state.interval, value);

    }
    render() {
        const { isLoading, interval } = this.state;
        return (
            <>
                <Card>
                    <CardHeader><h4>Market Overview</h4>
                        <ButtonGroup className="float-right">
                            <ButtonDropdown id='card1' isOpen={this.state.card1} toggle={() => { this.setState({ card1: !this.state.card1 }); }}>
                                <DropdownToggle caret className="p-0">
                                    <i className="icon-settings"> Interval</i>
                                </DropdownToggle>
                                <DropdownMenu right onClick={(e) => this.onChangeInterval(e.target.value)}>
                                    <DropdownItem value="1m">1min</DropdownItem>
                                    <DropdownItem value="3m">3min</DropdownItem>
                                    <DropdownItem value="5m">5min</DropdownItem>
                                    <DropdownItem value="15m">15min</DropdownItem>
                                    <DropdownItem value="30m">30min</DropdownItem>
                                    <DropdownItem value="1h">1hour</DropdownItem>
                                    <DropdownItem value="2h">2hour</DropdownItem>
                                    <DropdownItem value="4h">4hour</DropdownItem>
                                    <DropdownItem value="4h">4hour</DropdownItem>
                                    <DropdownItem value="6h">6hour</DropdownItem>
                                    <DropdownItem value="1d">1Day</DropdownItem>
                                    <DropdownItem value="1w">1week</DropdownItem>
                                    <DropdownItem value="1M">1month</DropdownItem>
                                </DropdownMenu>
                            </ButtonDropdown>
                        </ButtonGroup>
                        {' '}
                        <ButtonGroup className="float-right">
                            <ButtonDropdown id="card2" isOpen={this.state.card2} toggle={() => { this.setState({ card2: !this.state.card2 }); }}>
                                <DropdownToggle caret className="p-0">
                                    <i className="icon-settings"> datapoints</i>
                                </DropdownToggle>
                                <DropdownMenu right onClick={(e) => this.onChangeLimit(e.target.value)}>
                                    <DropdownItem value={5}>5</DropdownItem>                                    
                                    <DropdownItem value={6}>6</DropdownItem>
                                    <DropdownItem value={7}>7</DropdownItem>                                    
                                    <DropdownItem value={8}>8</DropdownItem>
                                    <DropdownItem value={9}>9</DropdownItem>                                    
                                    <DropdownItem value={10}>10</DropdownItem>

                                </DropdownMenu>
                            </ButtonDropdown>
                        </ButtonGroup>
                    </CardHeader>
                </Card>
                <div>
                    {isLoading ? <Loading /> : renderDashboard(this.state)}
                </div>
                <hr />
            </>
        );
    }
};
export default CryptoDashboard;