import React, { PureComponent } from 'react';
import { badge, Table, Badge } from 'reactstrap';
import { clean, reduceNumber } from '../.././../../utils/digits';
import {formatMoney} from '../../../../utils/formatter';
import _ from 'lodash';

const renderDigitAnalysis = (topNumbers) => {

    return (
        <Table responsive>
            <thead>
                <tr>

                    <th>Number</th>
                    <th>Win value</th>
                </tr>
            </thead>
            <tbody>

                {topNumbers.map(obj => {
                    return (<tr>
                        <td><strong>{obj.number}</strong>{' '}<Badge pill color="success">{obj.winList.length} Wins</Badge></td>
                        <td>{formatMoney(obj.value, "SGD")}</td>
                    </tr>)
                })}


            </tbody>
        </Table>

    )
};
const getValue = (tier) => {
    switch (tier) {
        case 1: return 2000;
        case 2: return 1000;
        case 3: return 500;
        case 4: return 250;
        case 5: return 60;
    }
}
class TopNumber extends PureComponent {
    computeAllNumber = (history, permutation) => {
        let consolidateWins = {}

        history.map(draw => {
            consolidateWins = this.computeNumber(consolidateWins, "1st", draw, getValue(1), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "2nd", draw, getValue(2), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "3rd", draw, getValue(3), permutation);

            consolidateWins = this.computeNumber(consolidateWins, "s1", draw, getValue(4), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "s2", draw, getValue(4), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "s3", draw, getValue(4), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "s4", draw, getValue(4), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "s5", draw, getValue(4), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "s6", draw, getValue(4), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "s7", draw, getValue(4), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "s8", draw, getValue(4), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "s9", draw, getValue(4), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "s10", draw, getValue(4), permutation);

            consolidateWins = this.computeNumber(consolidateWins, "c1", draw, getValue(5), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "c2", draw, getValue(5), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "c3", draw, getValue(5), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "c4", draw, getValue(5), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "c5", draw, getValue(5), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "c6", draw, getValue(5), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "c7", draw, getValue(5), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "c8", draw, getValue(5), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "c9", draw, getValue(5), permutation);
            consolidateWins = this.computeNumber(consolidateWins, "c10", draw, getValue(5), permutation);

        });
        return consolidateWins;
    }

    computeNumber = (consolidateWins, prize, draw, value, permutation) => {
        //check if reduced number is inside consolidatedwin
        const cleanNum = clean(draw[prize]);
        const reducedNum = permutation ? reduceNumber(draw[prize]) : cleanNum;
        if (consolidateWins?.[reducedNum]) {
            //already in
            let winObj = consolidateWins[reducedNum];
            winObj.value += value;
            winObj.winList.push({
                number: cleanNum,
                draw: draw.id,
                prize,
            });

        } else {
            //not in yet. add a new obj
            consolidateWins[reducedNum] = {
                value,
                winList: [{
                    number: cleanNum,
                    draw: draw.id,
                    prize,
                }]
            }
        }
        return consolidateWins;

    }

    getTopNumbers = (wins, show) => {
        const topNumbers = [];
        let topNumbersValue = [];
        const winningNumbers = Object.keys(wins);
        winningNumbers.map(number => {
            const winObject = wins[number];
            if (topNumbersValue.length < show) {
                topNumbersValue.push(winObject.value);

            } else {
                topNumbersValue = topNumbersValue.sort((a, b) => a - b);
                if (winObject.value > _.head(topNumbersValue)) {
                    topNumbersValue[0] = winObject.value;
                }
            }

        });

        //find numbers with those top values
        topNumbersValue.sort((a, b) => b-a).map(value => {
            let topNumber = null;
            winningNumbers.some(number => {
                if (_.isEqual(wins[number].value, value)) {
                    topNumber = number;
                    return true;
                } else {
                    return false;
                }
            });

            if (!_.isEmpty(topNumber)) {
                //add number to reutrn array
                topNumbers.push(
                    {
                        number: topNumber,
                        ...wins[topNumber]
                    });
            }
        });
        return topNumbers;
    }

    render() {
        const { history, show, permutation } = this.props;
        const wins = this.computeAllNumber(history, permutation);
        const topNumbers = this.getTopNumbers(wins, show);
        return (
            <>
                {renderDigitAnalysis(topNumbers)}
            </>
        );
    }
}
export default TopNumber;