import key from './../secret.json';
import {toFixed} from '../utils/formatter';
const Binance = require('node-binance-api');


export default class binanceAPI {

    constructor() {
        this.binance = new Binance({
            APIKEY: key.key,
            APISECRET: atob(key.secret)
        });

    }

    resolve = (asyncronous) => new Promise.resolve(asyncronous);

    getAllPrice = () => this.binance.prices();

    getCandleStick = ({ticker, interval, limit, endTime}) => {
        return new Promise(resolve => {
            this.binance.candlesticks(ticker, interval, (error, ticks, symbol) => {
                resolve(ticks);
            }, { limit, endTime })
        
        });
    }
}