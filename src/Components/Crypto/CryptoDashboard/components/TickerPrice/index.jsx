import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import { CaretDownFilled, CaretUpFilled, BoldOutlined } from '@ant-design/icons';
import { getStyle } from '@coreui/coreui-pro/dist/js/coreui-utilities'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { toFixed } from '../../../../../utils/formatter';

// const brandPrimary = getStyle('--primary');
const brandSuccess = getStyle('--success');
// const brandInfo = getStyle('--info');
// const brandWarning = getStyle('--warning');
const brandDanger = getStyle('--danger');

const renderStyle = (isUp, upStyle, downStyle) => {
    return (isUp? upStyle : downStyle);
}

const computeMaxBoundOffset = (priceArr) => {
    //add alittle to top bound
    const min =  Math.min.apply(Math, priceArr);
    const max = Math.max.apply(Math, priceArr);
    const priceChange = max - min;

    return priceChange * 0.1;
}


const upStyle = { color: "#219519" };
const downStyle = { color: "#B01A1A" };


const TickerPrice = ({ props }) => {
    const { ticker, price } = props;
    const priceArr = price.map(price => price[1]);
    const latestPrice = price[price.length - 1][1];
    const oldestPrice = price[0][1];

    const labels = price.map(price => new Date(price[0]).getHours() + ':00hrs');

    const isUp = oldestPrice < latestPrice;
    const percentChange = toFixed(Math.abs(100 - ((latestPrice / oldestPrice) * 100)));
    const boundOffset = computeMaxBoundOffset(priceArr);

    const cardChartData2 = {
        labels,
        datasets: [
            {
                label: 'Price',
                backgroundColor: renderStyle(isUp, brandSuccess, brandDanger),
                borderColor: 'rgba(255,255,255,.55)',
                data: priceArr,
            },
        ],
    };

    const cardChartOpts2 = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        color: 'transparent',
                        zeroLineColor: 'transparent',
                    },
                    ticks: {
                        fontSize: 2,
                        fontColor: 'transparent',
                    },

                }],
            yAxes: [
                {
                    display: false,
                    ticks: {
                        display: false,
                        min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 0,
                        max: Math.max.apply(Math, cardChartData2.datasets[0].data) + boundOffset,
                    },
                }],
        },
        elements: {
            line: {
                //tension: 0.00001,
                borderWidth: 2,
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
    };

    return (
        <div className="animated fadeIn">
            <Card className={"text-white "+ (isUp? "bg-success" : "bg-danger")}>
                <CardBody className="pb-0">

                    <div className="text-value" style={isUp ? upStyle : downStyle}>{isUp ? <CaretUpFilled /> : <CaretDownFilled />} {percentChange}%</div>
                    <div style={{fontWeight: "BoldOutlined"}}>{ticker}</div>
                    <div className="chart-wrapper mt-3" style={{ height: '70px' }}>
                        <Line data={cardChartData2} options={cardChartOpts2} height={70} />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default TickerPrice;