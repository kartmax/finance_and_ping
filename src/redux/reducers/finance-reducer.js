// VALUES TYPE
const SET_STOCKS = 'SET_STOCKS';
const SET_REPORTS = 'SET_REPORTS';
const IS_DISABLED_BTN_START = 'IS_DISABLED_BTN_START';
const SET_TEXT_INFO_PROCESS = 'SET_TEXT_INFO_PROCESS';
const SET_START_TIME_GET_STOCK = 'SET_START_TIME_GET_STOCK';
const SET_BEFORE_DATA = 'SET_BEFORE_DATA';

// ACTION CREATORS
export const setStocksAC = (dataStock) => ({type: SET_STOCKS, dataStock});
export const setReportsAC = (dataReport) => ({type: SET_REPORTS, dataReport});
export const isDisabledBtnStartAC = (boll) => ({type: IS_DISABLED_BTN_START, boll});
export const setTextInfoProcessAC = (text) => ({type: SET_TEXT_INFO_PROCESS, text});
export const setStartTimeGetStockAC = (time) => ({type: SET_START_TIME_GET_STOCK, time});
export const setBeforeDataAC = (dataBefore) => ({type: SET_BEFORE_DATA, dataBefore});

// INITIAL STATE
let initialState = {
   stocks : [],
   beforeLengthStocks : 0,
   beforeSummaStocks : 0,
   beforeAverage : 0,
   beforeSummaArrDiff : 0,
   reports : [],
   isDisabledBtnStart : false,
   isDisabledBtnStatistics : true,
   textInfoProcess : '',
   startTimeGetStock : ''
};

// REDUCER
const FINANCE_REDUCER = (state = initialState, action) => {
   switch (action.type) {
      case SET_STOCKS: {
         return {...state, 
                  stocks: [...state.stocks, action.dataStock],
                  isDisabledBtnStatistics : false
               }
      }
      case SET_REPORTS: {
         return {...state, reports: [action.dataReport, ...state.reports]}
      }
      case IS_DISABLED_BTN_START: {
         return {...state, 
                  isDisabledBtnStart : action.boll
               }
      }
      case SET_TEXT_INFO_PROCESS: {
         return {...state, textInfoProcess : action.text}
      }
      case SET_START_TIME_GET_STOCK: {
         return {...state, startTimeGetStock : action.time}
      }
      case SET_BEFORE_DATA: {
         return {...state, 
                  beforeLengthStocks : action.dataBefore.beforeLengthStocks,
                  beforeSummaStocks : action.dataBefore.beforeSummaStocks,
                  beforeSummaArrDiff : action.dataBefore.beforeSummaArrDiff,
                  beforeAverage : action.dataBefore.beforeAverage
               }
      }
      default:
         return state;
   }
}

export default FINANCE_REDUCER;

