import Finance from "./Finance";
import { connect } from "react-redux";
import { setStocksAC,
         setReportsAC,
         isDisabledBtnStartAC,
         setTextInfoProcessAC,
         setStartTimeGetStockAC,
         setBeforeDataAC } from "../../redux/reducers/finance-reducer";
import React from "react";


const mapStateToProps = (state) => {
   return {
      stocks : state.FINANCE_REDUCER.stocks,
      reports : state.FINANCE_REDUCER.reports,
      isDisabledBtnStatistics : state.FINANCE_REDUCER.isDisabledBtnStatistics,
      isDisabledBtnStart : state.FINANCE_REDUCER.isDisabledBtnStart,
      textInfoProcess : state.FINANCE_REDUCER.textInfoProcess,
      startTimeGetStock : state.FINANCE_REDUCER.startTimeGetStock,
      beforeLengthStocks : state.FINANCE_REDUCER.beforeLengthStocks,
      beforeSummaStocks : state.FINANCE_REDUCER.beforeSummaStocks,
      beforeSummaArrDiff : state.FINANCE_REDUCER.beforeSummaArrDiff,
      beforeAverage : state.FINANCE_REDUCER.beforeAverage,
   }
}
const mapDispatchToProps = {
   setStocksAC,
   setReportsAC,
   isDisabledBtnStartAC,
   setTextInfoProcessAC,
   setStartTimeGetStockAC,
   setBeforeDataAC,
}

class FinanceApiContainer extends React.Component {
      componentDidMount() {
         if(!this.props.isDisabledBtnStart) {
            this.props.setTextInfoProcessAC('Нажмите Старт для получение котировок')
         }
      }
      getDateTimeShow = () => {
         let date = new Date();
         date = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
         return date;
      }
      openWsChanel = () => {
         this.props.isDisabledBtnStartAC(true);
         this.props.setTextInfoProcessAC('Идет процесс получения котировок...')
         const url = "wss://trade.trademux.net:8800/?password=1234";
         const ws = new WebSocket(url); 
         this.props.setStartTimeGetStockAC(this.getDateTimeShow())
         ws.addEventListener("message", (e) => {
            const data = JSON.parse(e.data);
            this.props.isDisabledBtnStatistics && this.props.setTextInfoProcessAC('Нажмите Статистика для расчета показателей')
            this.props.setStocksAC(data);
         })
      }
   
      /*
      Как рассчитать Стандартное отклонение
      1. Находим среднее арифметическое выборки.
      2. От каждого значения выборки отнимаем среднее арифметическое.
      3. Каждую полученную разницу возводим в квадрат.
      4. Суммируем полученные значения квадратов разниц.
      5. Делим на размер выборки минус 1.
      6. Находим квадратный корень.
      */ 
      
      // получение среза массива для оптимизированных последующих расчетов
      getNewSliceArr = (arr, beforeLengthStocks) => {
         return arr.slice(beforeLengthStocks)
      }
      // Сумма выборки
      getSumma = (arr, beforeLengthStocks, beforeSummaStocks) => {
         let result = 0;
         const arrNew = this.getNewSliceArr(arr, beforeLengthStocks);
         arrNew.forEach(item => result+=item.value);
         result+=beforeSummaStocks;
         return result;
      }
      // Среднее арифметическое выборки(1)
      getAverage = (arr, beforeLengthStocks, beforeSummaStocks) => {
         let summa = this.getSumma(arr, beforeLengthStocks, beforeSummaStocks);
         return ( (summa / arr.length).toFixed(2) )
      }
      
      // Сумма квадратов разниц между значениями и средним арифметическим
      getSummaDiffPow = (arr, beforeLengthStocks, beforeSummaStocks, beforeSummaArrDiff, beforeAverage) => {
         const average = this.getAverage(arr, beforeLengthStocks, beforeSummaStocks);
         const arrNew = this.getNewSliceArr(arr, beforeLengthStocks);
         const arrDiff = arrNew.map( item => Math.pow((item.value - average), 2) ); //(2,3)
         let summaPowDiff = 0;
         arrDiff.forEach(val => summaPowDiff+=Number(val)); //(4)
         // корректировка сумы квадратов разниц между значениями из придыдущей порции котировок и средним арифметичеким
         // если среднее арифметическое отличается от предыдущего
         /*
         Способ корректировки суммы квадратов разниц предыдущей порции
         Разница между средними арифметическими возводим в квадрат и умножаем на количество котировок предыдущей порции
         На полученное значение корректируем предыдущее значение суммы квадратов разниц котировок
         */
         if(average !== beforeAverage && (beforeAverage !== 0 && beforeAverage !== undefined)) {
            const diffAverage = average - beforeAverage;
            const valCorrectOnBeforeSummaArrDiff = Math.pow(diffAverage, 2) * beforeLengthStocks;
            summaPowDiff = summaPowDiff + beforeSummaArrDiff + valCorrectOnBeforeSummaArrDiff;
            return summaPowDiff;
         }
         summaPowDiff+=beforeSummaArrDiff;
         return summaPowDiff;
      }
      // Old
      getOldSummaDiffPow = (arr, beforeLengthStocks, beforeSummaStocks, beforeSummaArrDiff, beforeAverage) => {
         const average = this.getAverage(arr, beforeLengthStocks, beforeSummaStocks);
         const arrNew = this.getNewSliceArr(arr, beforeLengthStocks);
         const arrDiff = arrNew.map( item => Math.pow((item.value - average), 2) ); //(2,3)
         let summaPowDiff = 0;
         arrDiff.forEach(val => summaPowDiff+=Number(val)); //(4)
         // корректировка сумы квадратов разниц между значениями из придыдущей порции котировок и средним арифметичеким
         // если среднее арифметическое отличается от предыдущего
         if(average !== beforeAverage && (beforeAverage !== 0 && beforeAverage !== undefined)) {
            const oldPathStocks = arr.slice(0, beforeLengthStocks);
            const arrDiffOldPathStocks = oldPathStocks.map( item => Math.pow((item.value - average), 2) );
            let summaPowDiffOpdPathStocks = 0;
            arrDiffOldPathStocks.forEach(val => summaPowDiffOpdPathStocks+=Number(val));
            summaPowDiff+=summaPowDiffOpdPathStocks
            return summaPowDiff;
         }
         summaPowDiff+=beforeSummaArrDiff;
         return summaPowDiff;
      }

      // Стандартное октклонение выборки
      getStandartDeviation = (arr, beforeLengthStocks, beforeSummaStocks, beforeSummaArrDiff, beforeAverage) => {
         let summaDiff = this.getSummaDiffPow(arr, beforeLengthStocks, beforeSummaStocks, beforeSummaArrDiff, beforeAverage);
         return Math.sqrt(summaDiff / (arr.length-1)).toFixed(2); //(5,6)
      }
      // Old
      getOldStandartDeviation = (arr, beforeLengthStocks, beforeSummaStocks, beforeSummaArrDiff, beforeAverage) => {
         let summaDiff = this.getOldSummaDiffPow(arr, beforeLengthStocks, beforeSummaStocks, beforeSummaArrDiff, beforeAverage);
         return Math.sqrt(summaDiff / (arr.length-1)).toFixed(2); //(5,6)
      }

      // Поиск Моды
      searchMod = (arrSliceSort, objBeforeMode) => {
         let countBeforeMode = 0;
         let valueBeforeMode = 0;
         if(objBeforeMode[0] !== undefined) {
            if(objBeforeMode[0].moda !== undefined) {
               countBeforeMode = objBeforeMode[0].moda.count;
               valueBeforeMode = objBeforeMode[0].moda.value;
            }
         }
         if(countBeforeMode !== 0) {
            // если первый элемент новой порции меньше/равно значению моды из предыдущей порции
            // то есть вероятность того, что это значение предыдущей моды встречается в новой порции
            if(arrSliceSort[0] <= objBeforeMode.value) {
               const IdxBeforeModeInArrSliceSort = arrSliceSort.indexOf(valueBeforeMode);
               // если вхождение обнаружено
               if(IdxBeforeModeInArrSliceSort !== -1) {
                  // если обнаружено только одно вхождение
                  if(arrSliceSort[IdxBeforeModeInArrSliceSort + 1] !== valueBeforeMode) {
                     countBeforeMode+=1;
                  } else {
                     for(let i = IdxBeforeModeInArrSliceSort; i < arrSliceSort.length-1; i++) {
                        if(arrSliceSort[i] === arrSliceSort[i+1]) {
                           countBeforeMode+=1
                        } else {
                           countBeforeMode+=1;
                           break;
                        }
                     }
                  }
               }
            }
         }

         let countMod=1;
         let valueMod=0;
         let countModDop=1;
         arrSliceSort.forEach((item, idx, arr)=>{
            if(item !== valueBeforeMode) {
               if(item === arr[idx+1]){
                  countModDop++;
               } else {
                  if(countModDop > countMod){
                     countMod = countModDop;
                     valueMod = item;
                  }
                  countModDop = 1;
               }
            }
         });
         
         if(valueMod > 0) {
            if(countMod >= countBeforeMode) {
               return (
                  {value : valueMod, count : countMod}
               )
            } 
         } 
         return (
            {value : valueBeforeMode, count : countBeforeMode}
         )
      }

      // Old
      searchOldMod = (arrSort) => {
         let countMod=1;
         let valueMod=0;
         let countModDop=1;
         arrSort.forEach((item, idx, arr)=>{
            if(item === arr[idx+1]){
               countModDop++;
            } else {
               if(countModDop > countMod){
                  countMod = countModDop;
                  valueMod = item;
               }
               countModDop = 1;
            }
         });
         if(valueMod > 0) {
            return (
               {value : valueMod, count : countMod}
            )
         }
      }

      // Поиск медианы
      searchMedian = (arrSort) => {
         if(arrSort.length % 2 !== 0) {
            let idx = Math.floor(arrSort.length / 2);
            return(arrSort[idx])
         } else {
            let idx = arrSort.length / 2;
            return (arrSort[idx] +  arrSort[idx-1]) / 2;
         }
      }

      // Поиск потеряных котировок
      searchLost = (arrSortIdx) => {
         const length = arrSortIdx.length,
             lastElem = arrSortIdx[length-1],
             firstElem = arrSortIdx[0],
             idx  = lastElem - firstElem;

         let result = lastElem - arrSortIdx[idx];
         if(result !== 0) {
            result = lastElem - firstElem - length + 1;
         }
         return result;
      }
   
      getReportData = () => {
         if(this.props.stocks.length > 0) {
            const timeStart = new Date();
            
            const copyStocks = [...this.props.stocks];
            const copySliceStocks = this.getNewSliceArr(copyStocks, this.props.beforeLengthStocks);
            const valueSortSliceArr = copySliceStocks.map(item => item.value).sort((a,b)=>a-b);
            const idxSortArr = copyStocks.map(item => item.id);

            // const valueSortSliceArr = copyStocks.map(item => item.value).sort((a,b)=>a-b);
            // const idxSortArr = copyStocks.map(item => item.id);

            const standart_deviation = this.getStandartDeviation(copyStocks, 
                                                                  this.props.beforeLengthStocks, 
                                                                  this.props.beforeSummaStocks,
                                                                  this.props.beforeSummaArrDiff,
                                                                  this.props.beforeAverage
                                                                  );
            const moda =  this.searchMod(valueSortSliceArr, this.props.reports);
            const mediana = this.searchMedian(valueSortSliceArr);
            const lost = this.searchLost(idxSortArr);

            // Old
            // console.log(this.getOldStandartDeviation(copyStocks, 
            //    this.props.beforeLengthStocks, 
            //    this.props.beforeSummaStocks,
            //    this.props.beforeSummaArrDiff,
            //    this.props.beforeAverage
            //    ))
            // console.log(this.searchOldMod(copyStocks.map(item => item.value).sort((a,b)=>a-b)));
            
            
   
            const timeFinish = new Date();
            const interval = timeFinish.getTime() - timeStart.getTime();
            const time_finish_show = this.getDateTimeShow();
            const count_stocks = this.props.stocks.length;
   
            this.props.setReportsAC({ 
               standart_deviation, 
               interval,
               moda,
               mediana,
               lost,
               time_finish_show,
               count_stocks
            });

            // сохранение некоторых данных текущих расчетов для оптимизации последующих расчетов
            // так не придется заново проходить все значения котировок с самого начала
            const beforeLengthStocks = copyStocks.length;
            const beforeSummaStocks = this.getSumma(copyStocks, this.props.beforeLengthStocks, this.props.beforeSummaStocks);
            const beforeSummaArrDiff =  this.getSummaDiffPow(copyStocks, this.props.beforeLengthStocks, this.props.beforeSummaStocks, this.props.beforeSummaArrDiff);
            const beforeAverage = this.getAverage(copyStocks, this.props.beforeLengthStocks, this.props.beforeSummaStocks);
            this.props.setBeforeDataAC({beforeLengthStocks, beforeSummaStocks, beforeSummaArrDiff, beforeAverage});

         }
      }

      render(){
         return (
            <Finance 
               openWsChanel={this.openWsChanel} 
               getReportData={this.getReportData} 
               reports={this.props.reports}
               isDisabledBtnStatistics={this.props.isDisabledBtnStatistics}
               isDisabledBtnStart={this.props.isDisabledBtnStart}
               textInfoProcess={this.props.textInfoProcess}
               startTimeGetStock={this.props.startTimeGetStock}
            />
         )
      }
}

const FinanceContainer = connect(mapStateToProps, mapDispatchToProps)(FinanceApiContainer);

export default FinanceContainer;