import Reports from "./Reports/Reports";

const Finance = (props) => {
   const openWsChanel = props.openWsChanel,
         getReportData = props.getReportData,
         reports = props.reports,
         isDisabledBtnStatistics = props.isDisabledBtnStatistics,
         isDisabledBtnStart = props.isDisabledBtnStart,
         textInfoProcess = props.textInfoProcess,
         startTimeGetStock=props.startTimeGetStock;

   return (
   <>
      <div className="wrapBtn">
         <button disabled={isDisabledBtnStart} onClick={()=>openWsChanel()} className={`btn ${isDisabledBtnStart ? 'disabled' : ''}`} title="Получение котировок">Старт</button>
         <button disabled={isDisabledBtnStatistics} onClick = {() => getReportData()} className={`btn ${isDisabledBtnStatistics ? 'disabled' : ''}`} title="Расчет статических значений">Статистика</button>  
      </div>
      <p className="infoText">
         {textInfoProcess}
      </p>
      {reports.length > 0 ? <Reports reports={reports} startTimeGetStock={startTimeGetStock} /> : null}
   </>
   )
}

export default Finance;