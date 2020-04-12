import React, { PureComponent } from 'react';
import { clean, reduceNumber, isValidNumber, isMatchPermutation, getPrizeTitle } from '../../../../utils/digits';
import { formatDate } from '../../../../utils/formatter';
import _ from 'lodash';
import { winningNumber } from '../../../../models';
import { Card, CardBody, CardHeader, Input, Table, Badge, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, FormText } from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import { Loading } from '../../../../Components/Loading';
import { Empty } from '../../../../Components/Empty';

import './index.css';
const renderSearchResult = (searchResult) => {

    return (
        <Table responsive>
            <thead>
                <tr>

                    <th>draw</th>
                    <th>number</th>


                </tr>
            </thead>
            <tbody>
                {searchResult.reverse().map(result => {
                    return (
                        <tr>
                            <td>#{result.draw_id}{' on '}{result.date}</td>
                            <td>{result.number}{' '} {renderPrizeTag(result.prize)}</td>

                        </tr>
                    );
                })}


            </tbody>
        </Table>

    )
};

const renderPrizeTag = (prize) => {
    switch (prize) {
        case '1st':
            return <Badge color='danger'>{prize}</Badge>
        case '2nd':
            return <Badge color='warning'>{prize}</Badge>
        case '3rd':
            return <Badge color='primary'>{prize}</Badge>
        case 'Starter':
            return <Badge color='success' >{prize}</Badge>
        case 'Consolation':
            return <Badge>{prize}</Badge>
        default:
            return '';
    }
}

class Search extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            isSearching: false,
            isPermutation: false,
            searchResult: [],
        }
        this.searchHistory = this.searchHistory.bind(this);
    }
    onSearchHistory = e => {
        const searchQuery = e.target.value;
        this.setState({
            searchQuery
        });
        this.searchHistory(searchQuery, this.state.isPermutation);

    }
    searchHistory = (searchQuery, isPermutation) => {
        /*
        {
            number
            prize
            draw_id
            date
        
        }
        */

        if (_.isEqual(searchQuery.length, 4) && isValidNumber(searchQuery)) {
            this.setState({
                isSearching: true,
            });
            const { history } = this.props;
            const relevantNumber = []
            history.map(draw => {
                const { year, month, day, id } = draw;

                const prizes = ['1st', '2nd', '3rd',
                    's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10',
                    'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];
                prizes.map(prize => {
                    const drawNum = draw[prize];
                    if (_.isEqual(drawNum, searchQuery) || (isPermutation && isMatchPermutation(drawNum, searchQuery))) {
                        //add to list
                        relevantNumber.push(new winningNumber(drawNum, getPrizeTitle(prize), id, formatDate(year + '-' + month + '-' + day)).get());
                    }
                });
            });
            this.setState({ searchResult: relevantNumber });
        } else {
            this.setState({ searchResult: [] });

        }

        this.setState({
            isSearching: false,
        });

    };

    onPermutationChecked = (e) => {
        this.setState({ isPermutation: e.target.checked });
        this.searchHistory(this.state.searchQuery, e.target.checked);

    }
    render() {
        const { searchResult, searchQuery, isPermutation, isSearching } = this.state;
        return (
            <Card>
                <CardHeader >

                    <FormGroup >
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="icon-magnifier icons"></i></InputGroupText>
                            </InputGroupAddon>

                            <Input style={{ height: "45px" }}
                                value={searchQuery}
                                placeholder={"search for number here"}
                                onChange={this.onSearchHistory}/>
                            <InputGroupAddon addonType="append">
                                <InputGroupText>permutation:
                                <AppSwitch
                                        className={'mx-1'}
                                        variant={'3d'}
                                        outline={'alt'}
                                        color={'success'}
                                        label
                                        dataOn={'\u2713'}
                                        dataOff={'\u2715'}
                                        onChange={this.onPermutationChecked.bind(this)}
                                        {...isPermutation ? { 'checked': true } : {}} />
                                </InputGroupText>
                            </InputGroupAddon>


                        </InputGroup>

                        <FormText color="muted">
                            ex. 1234
                  </FormText>
                    </FormGroup>

                </CardHeader>
                <CardBody className="searchBody-container">
                    {isSearching ? <Loading /> :
                        _.isEqual(searchResult, []) ? <Empty title="No result found" /> : renderSearchResult(searchResult)}
                </CardBody>
            </Card >

        );
    }
}
export default Search;