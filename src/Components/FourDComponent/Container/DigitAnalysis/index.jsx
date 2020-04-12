import React, { PureComponent } from 'react';
import { clean } from '../../../../utils/digits';
import { Bar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import _ from 'lodash';

const renderDigitAnalysis = (AnalysedResult) => {
    const labels = Object.keys(AnalysedResult);
    const data = Object.values(AnalysedResult);
    
    const bar = {
        labels,
        datasets: [
            {
                label: 'occurance %',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data,
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
    return (
        <div className="chart-wrapper">
            <Bar data={bar} options={options} />
        </div>
    )
};

class DigitAnalysis extends PureComponent {
    analyseHistory(history) {
        let counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }

        const digitsCountPerDraw = history.map(draw => {
            let rtn = {
                year: draw.year,
                month: draw.month,
                day: draw.day
            }
            // delete draw.year;
            // delete draw.month;
            // delete draw.day;
            // delete draw.id;
            const winningNumbers = Object.values(_.pick(draw, 
                ['1st', '2nd', '3rd',
                 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10',
                  'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10']));
            //const winningNumbers = Object.values(draw);

            let xooo = Object.assign({}, counts);
            let oxoo = Object.assign({}, counts);
            let ooxo = Object.assign({}, counts);
            let ooox = Object.assign({}, counts);

            winningNumbers.forEach(number => {
                let num = clean(number);
                xooo = this.addCount(xooo, num.charAt(0));
                oxoo = this.addCount(oxoo, num.charAt(1));
                ooxo = this.addCount(ooxo, num.charAt(2));
                ooox = this.addCount(ooox, num.charAt(3));
            });

            return Object.assign(rtn, {
                pos1: xooo,
                pos2: oxoo,
                pos3: ooxo,
                pos4: ooox
            })

        });
        return digitsCountPerDraw;


    }
    getAvgOverall(digitsCountPerDraw) {
        //sum up from pos count to overall
        let counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }

        let overallDrawCount = Object.assign({}, counts);
        let totalDraw = digitsCountPerDraw.length;
        digitsCountPerDraw.map(count => {
            overallDrawCount = {
                0: overallDrawCount["0"] + count.pos1["0"] + count.pos2["0"] + count.pos3["0"] + count.pos4["0"],
                1: overallDrawCount["1"] + count.pos1["1"] + count.pos2["1"] + count.pos3["1"] + count.pos4["1"],
                2: overallDrawCount["2"] + count.pos1["2"] + count.pos2["2"] + count.pos3["2"] + count.pos4["2"],
                3: overallDrawCount["3"] + count.pos1["3"] + count.pos2["3"] + count.pos3["3"] + count.pos4["3"],
                4: overallDrawCount["4"] + count.pos1["4"] + count.pos2["4"] + count.pos3["4"] + count.pos4["4"],
                5: overallDrawCount["5"] + count.pos1["5"] + count.pos2["5"] + count.pos3["5"] + count.pos4["5"],
                6: overallDrawCount["6"] + count.pos1["6"] + count.pos2["6"] + count.pos3["6"] + count.pos4["6"],
                7: overallDrawCount["7"] + count.pos1["7"] + count.pos2["7"] + count.pos3["7"] + count.pos4["7"],
                8: overallDrawCount["8"] + count.pos1["8"] + count.pos2["8"] + count.pos3["8"] + count.pos4["8"],
                9: overallDrawCount["9"] + count.pos1["9"] + count.pos2["9"] + count.pos3["9"] + count.pos4["9"],
            }
        });
        //avg out to per draw
        const avgOverall = {
            0: this.getOverallPercentage(overallDrawCount["0"], totalDraw),
            1: this.getOverallPercentage(overallDrawCount["1"], totalDraw),
            2: this.getOverallPercentage(overallDrawCount["2"], totalDraw),
            3: this.getOverallPercentage(overallDrawCount["3"], totalDraw),
            4: this.getOverallPercentage(overallDrawCount["4"], totalDraw),
            5: this.getOverallPercentage(overallDrawCount["5"], totalDraw),
            6: this.getOverallPercentage(overallDrawCount["6"], totalDraw),
            7: this.getOverallPercentage(overallDrawCount["7"], totalDraw),
            8: this.getOverallPercentage(overallDrawCount["8"], totalDraw),
            9: this.getOverallPercentage(overallDrawCount["9"], totalDraw),
        }
        console.log(avgOverall);
        return avgOverall;
    }

    getOverallPercentage(totalCount, totalDraw) {
        //there are 92 number in a draw 4x23
        return (totalCount / totalDraw) / 92 * 100;
    }

    addCount(counts, winDigit) {
        counts[winDigit] = counts[winDigit] + 1;
        return counts;
    }
    render() {
        const { history } = this.props;
        const digitsCount = this.analyseHistory(history);
        const AnalysedResult = this.getAvgOverall(digitsCount);
        return (
            <>
                {renderDigitAnalysis(AnalysedResult)}
            </>
        );
    }
}
export default DigitAnalysis;