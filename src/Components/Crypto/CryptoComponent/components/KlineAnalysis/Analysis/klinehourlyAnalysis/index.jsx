import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Card, CardHeader, CardBody } from 'reactstrap';


const render = (output) => {
    const labels = Object.keys(output);
    const dataDown = Object.keys(output).map(key =>
        output[key].loss / output[key].count * 100
    );

    const dataUp = Object.keys(output).map(key =>
        output[key].gain / output[key].count * 100
    );

    const bar = {
        labels,
        datasets: [
            {
                label: '% chance of down',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: dataDown,
            },
            {
                label: '% chance of up',
                backgroundColor: 'rgba(78, 245, 66,0.2)',
                borderColor: 'rgba(78, 245, 66,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(78, 245, 66,0.4)',
                hoverBorderColor: 'rgba(78, 245, 66 ,1)',
                data: dataUp,
            },
        ],
    };

    const dataLoss = Object.keys(output).map(key =>
        output[key].lossAvgPricePercent
    );

    const dataGain = Object.keys(output).map(key =>
        output[key].gainAvgPricePercent
    );


    const barGainLoss = {
        labels,
        datasets: [
            {
                label: 'Avg loss %',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: dataLoss,
            },
            {
                label: 'Avg gain %',
                backgroundColor: 'rgba(78, 245, 66,0.2)',
                borderColor: 'rgba(78, 245, 66,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(78, 245, 66,0.4)',
                hoverBorderColor: 'rgba(78, 245, 66 ,1)',
                data: dataGain,
            },
        ],
    };

    const dataVolume = Object.keys(output).map(key =>
        output[key].volume
    );


    const barVolume = {
        labels,
        datasets: [
            {
                label: 'Avg Vol',
                backgroundColor: 'rgba(29, 37, 245,0.2)',
                borderColor: 'rgba(29, 37, 245,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(29, 37, 245,0.4)',
                hoverBorderColor: 'rgba(29, 37, 245,1)',
                data: dataVolume,
            },
        ],
    };
    const options = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false
    }
    const offset = new Date().getTimezoneOffset() / 60 * -1;
    return (
        <>
            <Card>
                <CardHeader>Avg Hourly up/down Analysis ({(offset > 0 ? '+' : '')}{offset}GMT)</CardHeader>
                <CardBody>
                    <div className="chart-wrapper">
                        <Bar data={bar} options={options} />
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>Avg Hourly gain/loss % ({(offset > 0 ? '+' : '')}{offset}GMT)</CardHeader>
                <CardBody>
                    <div className="chart-wrapper">
                        <Bar data={barGainLoss} options={options} />
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>Avg Hourly trade volume ({(offset > 0 ? '+' : '')}{offset}GMT)</CardHeader>
                <CardBody>
                    <div className="chart-wrapper">
                        <Bar data={barVolume} options={options} />
                    </div>
                </CardBody>
            </Card>
        </>
    )

}
const computeHourlyAnalysis = (klineArray) => {
    const output = genOutputStructure();
    //loop the kline and sum all candle data
    klineArray.map(kline => {
        const hour = new Date(parseInt(kline.open_time)).getHours();

        output[hour].count += 1;
        output[hour].volume += parseInt(kline.Volume);

        if (kline.Open > kline.Close) {
            output[hour].loss += 1;
            output[hour].lossPricePercent += ((kline.Open - kline.Close) / kline.Open * 100);
        } else {
            output[hour].gain += 1;
            output[hour].gainPricePercent += ((kline.Close - kline.Open) / kline.Open * 100);
        }

    });

    //get the avg candle count per hour
    let avgPerHour = 0;
    Object.keys(output).map(key => {
        avgPerHour += output[key].count;
    });
    avgPerHour = Math.round(avgPerHour / 24);


    //compute avg by using avg candle  count as base
    const averagedOutput = Object.keys(output).map(key => {
        const entry = output[key];
        const adjustmentRatio = 2 - (entry.count / avgPerHour * 100) / 100;

        return {
            count: entry.count * adjustmentRatio,
            gain: entry.gain * adjustmentRatio,
            loss: entry.loss * adjustmentRatio,
            gainAvgPricePercent: entry.gainPricePercent / entry.gain * adjustmentRatio,
            lossAvgPricePercent: entry.lossPricePercent / entry.loss * adjustmentRatio,
            volume: entry.volume/ entry.count * adjustmentRatio
        }
    });
    return averagedOutput;

}


const genOutputStructure = () => {
    let i = 0;
    const struct = {};
    while (i < 24) {
        struct[i] = Object.assign({},
            {
                count: 0,
                gain: 0,
                gainPricePercent: 0,
                loss: 0,
                lossPricePercent: 0,
                volume: 0,
            });
        i += 1;
    }
    return struct;
}

export const KlineHourlyAnalysis = ({ klineArray }) => {
    if (klineArray.length > 2) {
        const minute1Ms = 60000;
        //confirm interval correct
        const klineInterval = klineArray[1].open_time - klineArray[0].open_time;
        console.log(klineInterval / 60 * minute1Ms);
        if (klineInterval === (60 * minute1Ms)) {
            return (
                render(computeHourlyAnalysis(klineArray))
            );
        }
    }
    else {
        return '';
    }

}