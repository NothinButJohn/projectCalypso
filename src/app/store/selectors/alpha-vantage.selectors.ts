import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StocksState } from '../reducers/alpha-vantage.reducers';


const stocksFeatureSelector = createFeatureSelector<StocksState>('stocks');

export const stocksSearchResultsSelector = createSelector(
    stocksFeatureSelector,
    (state: StocksState): any => {
        return state.searchResults
    }
)

export const candlestickSeriesDataSelector = createSelector(
    stocksFeatureSelector,
    (state: StocksState): any => {
        return state.chartOptions
    }
)
export const selectedIntervalSelector = createSelector(
    stocksFeatureSelector,
    (state: StocksState): any => {
        return state.selectedInterval
    }
)
export const selectedStockSelector = createSelector(
    stocksFeatureSelector,
    (state: StocksState): any => {
        return state.selectedStock
    }
)
export const intradayIntervalsSelector = createSelector(
    stocksFeatureSelector,
    (state: StocksState): any => {
        return state.intradayIntervals
    }
)
export const companyOverviewSelector = createSelector(
    stocksFeatureSelector,
    (state: StocksState): any => {
        return state.companyOverview
    }
)
export const technicalIndicatorsSelector = createSelector(
    stocksFeatureSelector,
    (state: StocksState): any => {
        return state.technicalIndicators
    }
)
export const seriesRangeSelector = createSelector(
    stocksFeatureSelector,
    (state: StocksState): any => {
        return state.seriesRange
    }
)