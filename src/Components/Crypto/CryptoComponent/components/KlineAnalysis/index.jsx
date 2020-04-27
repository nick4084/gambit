import React from 'react';
import { KlineHourlyAnalysis } from './Analysis/klinehourlyAnalysis';

export const KlineAnalysis = ({klineArray}) => {


    return (
        <div>
            <KlineHourlyAnalysis klineArray={klineArray} />

        </div>
    );
}