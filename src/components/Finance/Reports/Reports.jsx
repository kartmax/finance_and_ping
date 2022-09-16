import s from "./Reports.module.css";

const Report = (props) => {
   const report = props.report,
         startTimeGetStock = props.startTimeGetStock;

   return (
      <div className={s.report}>
         <div className={s.reportHeader}>
            <p>Время окончания расчета показателей = {report.time_finish_show}</p>
            <p>Время начала получения котировок = {startTimeGetStock}</p>
            <p>Количество котировок = {report.count_stocks}</p>
         </div>
         <div className={s.reportBody}>
            <p>Стандартное отклонение = {report.standart_deviation}</p> 
            <p>{report.moda !== undefined ? `Мода = ${report.moda.value} (${report.moda.count})` : `Мода не обнаружена`}</p>
            <p>Медиана = {report.mediana}</p>
            <p>Количество утерянных котировок = {report.lost}</p>
            <p>Время потраченное на расчеты (миллисекунд) = {report.interval}</p>
         </div>
      </div>
   )
}

const Reports = (props) => {
   let reports = props.reports;
   const startTimeGetStock = props.startTimeGetStock;
   let elemsReports = reports.map((report, idx) => <Report key={idx} report={report} startTimeGetStock={startTimeGetStock}/>)
   
   return (
      <div className={s.reports}>
         {elemsReports}
      </div>
   )
}

export default Reports;