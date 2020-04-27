
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	CandlestickSeries,
	LineSeries,
	BollingerSeries,
	MACDSeries,
	BarSeries,
	AreaSeries,
	RSISeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip, MovingAverageTooltip, BollingerBandTooltip, MACDTooltip, RSITooltip, SingleValueTooltip } from "react-stockcharts/lib/tooltip";
import { ema, sma, bollingerBand, macd, rsi, atr } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

const gt = (a, b) => {
	return parseFloat(a) > parseFloat(b);
}

const candleGainStroke = {
	stroke: "#46734c",
	wickStroke: "#6BA583",
	fill: "#8ee833"
}

const candleLoseStroke = {
	stroke: "#DB0000",
	wickStroke: "#DB0000",
	fill: "#DB0000"
}
const bbStroke = {
	top: "#964B00",
	middle: "#000000",
	bottom: "#964B00",
};

const macdAppearance = {
	stroke: {
		macd: "#FF0000",
		signal: "#00F300",
	},
	fill: {
		divergence: "#4682B4"
	},
};


const bbFill = "#4682B4";

const mouseEdgeAppearance = {
	textFill: "#542605",
	stroke: "#05233B",
	strokeOpacity: 1,
	strokeWidth: 3,
	arrowWidth: 5,
	fill: "#BCDEFA",
};

class CandleStickChartWithBollingerBandOverlay extends React.Component {

	render() {
		const { type, data: initialData, width, ratio, indicatorConfig } = this.props;
		const {
			sma: smaConfig,
			ema: emaConfig,
			bb: bbConfig,
			macd: macdConfig,
			rsi: rsiConfig,
			atr: atrConfig,
		} = indicatorConfig;


		/****************************
		 * 							*
		 * 	Indicator declaration   *
		 * 							*
		 ***************************/

		const sma1 = sma()
			.options({ windowSize: smaConfig.value[0] })
			.merge((d, c) => { d.sma1 = c; })
			.accessor(d => d.sma1);

		const ema1 = ema()
			.options({
				windowSize: emaConfig.value[0],
				sourcePath: "close", // optional will default to close as the source
			})
			.skipUndefined(true) // defaults to true
			.merge((d, c) => { d.ema1 = c; }) // Required, if not provided, log a error
			.accessor(d => d.ema1) // Required, if not provided, log an error during calculation
			.stroke("blue"); // Optional

		const ema2 = ema()
			.options({ windowSize: emaConfig.value[1] })
			.merge((d, c) => { d.ema2 = c; })
			.accessor(d => d.ema2);

		const ema3 = ema()
			.options({ windowSize: emaConfig.value[2] })
			.merge((d, c) => { d.ema3 = c; })
			.accessor(d => d.ema3);

		const bband = bollingerBand()
			.merge((d, c) => { d.bb = c; })
			.accessor(d => d.bb);

		const macdCalculator = macd()
			.options({
				fast: macdConfig.fast,
				slow: macdConfig.slow,
				signal: macdConfig.signal,
			})
			.merge((d, c) => { d.macd = c; })
			.accessor(d => d.macd);


		const smaVolume50 = sma()
			.options({ windowSize: 20, sourcePath: "volume" })
			.merge((d, c) => { d.smaVolume50 = c; })
			.accessor(d => d.smaVolume50)
			.stroke("#4682B4")
			.fill("#4682B4");


		const rsiCalculator = rsi()
			.options({ windowSize: rsiConfig.value })
			.merge((d, c) => { d.rsi = c; })
			.accessor(d => d.rsi);

		const atr1 = atr()
			.options({ windowSize: atrConfig.value })
			.merge((d, c) => { d.atr14 = c; })
			.accessor(d => d.atr14);

		const movingAverages = () => {
			//return all ma funcitons that show = true
			const ma = []
			const emaObj = [ema1, ema2, ema3];
			Object.keys(indicatorConfig).map(key => {
				switch (key) {
					case 'sma':
						if (indicatorConfig[key].show) ma.push(sma1);
						break;
					case 'ema':
						if (indicatorConfig[key].show) {
							indicatorConfig[key].value.map((ema, i) => {
								if (showEma(indicatorConfig[key], i + 1)) ma.push(emaObj[i]);
							});
						}
				}
			});
			return ma;
		}

		const showEma = (emaConfig, num) => (emaConfig.show && emaConfig.value.length >= num && !isNaN(emaConfig.value[num - 1]) && emaConfig.value[num - 1] > 0)

		const generateToolTipOptions = (movingAverages) => {
			return movingAverages.map(ma => {
				return {
					yAccessor: ma.accessor(),
					type: ma.type(),
					stroke: ma.stroke(),
					windowSize: ma.options().windowSize,
				}
			});
		}

		const calculatedData = rsiCalculator(atr1(bband(smaVolume50(macdCalculator(ema1(ema2(ema3(sma1(initialData)))))))));
		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		//own offset
		let macdChartOffset = 120;
		let volumeChartOffset = 150;
		let atrChartOffset = 125; 
		let rsiChartOffset = 125;

		const CandleChartHeight = 800;
		const canvasHeight = () => {
			let height = 1000;
			if(macdConfig.show){
				height += 150;
				volumeChartOffset += 120;
				
			};
			if(rsiConfig.show){
				height += 125;
				volumeChartOffset += 125;
				macdChartOffset += 125;
			};
			if(atrConfig.show){
				height += 125;
				volumeChartOffset += 125;
				macdChartOffset += 125;
				rsiChartOffset+= 125;
			};

			return height;
		};
		//const canvasHeight = macdConfig.show ? 1150 : 1000;



		var margin = { left: 70, right: 70, top: 20, bottom: 30 };
		var gridHeight = CandleChartHeight - margin.top - margin.bottom;
		var gridWidth = width - margin.left - margin.right;

		const yGrid = {
			innerTickSize: -1 * gridWidth,
			tickStrokeDasharray: 'Solid',
			tickStrokeOpacity: 0.2,
			tickStroke: "#000000",
			tickStrokeWidth: 1
		};
		const xGrid = {
			innerTickSize: -1 * gridHeight,
			tickStrokeDasharray: 'Solid',
			tickStrokeOpacity: 0.1,
			tickStroke: "#000000",
			tickStrokeWidth: 1
		};
		/****************************
		 * 			Render		    *
		 ***************************/

		return (
			
			<ChartCanvas
				height={canvasHeight()}
				width={width}
				ratio={ratio}
				margin={margin}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart id={1}
					height={CandleChartHeight}
					yExtents={[d => [d.high, d.low], sma1.accessor(), ema1.accessor(), ema2.accessor(), ema3.accessor(), bband.accessor()]}
					padding={{ top: 10, bottom: 20 }}
					onContextMenu={(...rest) => { console.log("chart - context menu", rest); }}>
					<XAxis axisAt="bottom" orient="bottom" {...xGrid} />
					<YAxis axisAt="right" orient="right" ticks={5} {...yGrid}
						onDoubleClick={(...rest) => { console.log("yAxis - double click", rest); }}
						onContextMenu={(...rest) => { console.log("yAxis - context menu", rest); }}
					/>

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries
						stroke={d => gt(d.close, d.open) ? candleGainStroke.stroke : candleLoseStroke.stroke}
						wickStroke={d => gt(d.close, d.open) ? candleGainStroke.wickStroke : candleLoseStroke.wickStroke}
						fill={d => gt(d.close, d.open) ? candleGainStroke.fill : candleLoseStroke.fill} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => gt(d.close, d.open) ? candleGainStroke.fill : candleLoseStroke.fill} />
					{showEma(emaConfig, 1) ? <>
						<LineSeries yAccessor={ema1.accessor()} stroke={ema1.stroke()} />
						<CurrentCoordinate yAccessor={ema1.accessor()} fill={sma1.stroke()} /></> : ''}
					{showEma(emaConfig, 2) ? <>
						<LineSeries yAccessor={ema2.accessor()} stroke={ema2.stroke()} />
						<CurrentCoordinate yAccessor={ema2.accessor()} fill={ema2.stroke()} /></> : ''}
					{showEma(emaConfig, 3) ? <>
						<LineSeries yAccessor={ema3.accessor()} stroke={ema3.stroke()} />
						<CurrentCoordinate yAccessor={ema3.accessor()} fill={ema3.stroke()} /></> : ''}

					<OHLCTooltip origin={[-40, 0]} />

					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={generateToolTipOptions(movingAverages())} />

					{(bbConfig.show) ? <>
						<BollingerBandTooltip
							origin={[-38, 60]}
							yAccessor={d => d.bb}
							options={bband.options()} />
						<BollingerSeries yAccessor={d => d.bb}
							stroke={bbStroke}
							fill={bbFill} /> </> : ''}
				</Chart>
				<Chart id={2}
					yExtents={[d => d.volume, smaVolume50.accessor()]}
					height={150} origin={(w, h) => [0, h - volumeChartOffset]}>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")} />

					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume} fill={d => gt(d.close, d.open) ? candleGainStroke.fill : candleLoseStroke.fill} />
					<AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()} />
					<CurrentCoordinate yAccessor={smaVolume50.accessor()} fill={smaVolume50.stroke()} />
					<CurrentCoordinate yAccessor={d => d.volume} fill="#9B0A47" />
				</Chart>

				{macdConfig.show ? <Chart id={3}
					height={150}
					origin={(w, h) => [0, h - macdChartOffset]}
					padding={{ top: 10, bottom: 10 }}
					yExtents={macdCalculator.accessor()}>

					{/* <XAxis axisAt="bottom" orient="bottom" /> */}
					<YAxis axisAt="right" orient="right" ticks={2} />

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")}
						rectRadius={5}
						{...mouseEdgeAppearance}
					/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")}
						{...mouseEdgeAppearance}
					/>

					<MACDSeries yAccessor={d => d.macd}
						{...macdAppearance} />
					<MACDTooltip
						origin={[-38, 15]}
						yAccessor={d => d.macd}
						options={macdCalculator.options()}
						appearance={macdAppearance}
					/>
				</Chart> : ''}
				{rsiConfig.show? 
				<Chart id={4}
					yExtents={[0, 100]}
					height={125} origin={(w, h) => [0, h - rsiChartOffset]}
				>
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right"
						orient="right"
						tickValues={[30, 50, 70]} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<RSISeries yAccessor={d => d.rsi} />

					<RSITooltip origin={[-38, 15]}
						yAccessor={d => d.rsi}
						options={rsiCalculator.options()} />
				</Chart>: ''}

				{atrConfig.show? 
				<Chart id={5}
					yExtents={atr1.accessor()}
					height={125} origin={(w, h) => [0, h - atrChartOffset]} padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={2} />

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<LineSeries yAccessor={atr1.accessor()} stroke={atr1.stroke()} />
					<SingleValueTooltip
						yAccessor={atr1.accessor()}
						yLabel={`ATR (${atr1.options().windowSize})`}
						yDisplayFormat={format(".2f")}
						/* valueStroke={atr14.stroke()} - optional prop */
						/* labelStroke="#4682B4" - optional prop */
						origin={[-40, 15]} />
				</Chart>: ''}
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CandleStickChartWithBollingerBandOverlay.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithBollingerBandOverlay.defaultProps = {
	type: "svg",
};
CandleStickChartWithBollingerBandOverlay = fitWidth(CandleStickChartWithBollingerBandOverlay);

export default CandleStickChartWithBollingerBandOverlay;
