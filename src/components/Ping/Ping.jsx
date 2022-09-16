import s from "./Ping.module.css";
import React from "react";

const PingReport = (props) => {
   return (
      <div className={s.pingReport}>
         <p className="infoText">{props.time_ping !== null ? `Время ответа ${props.url_ping} - ${props.time_ping} миллисекунд` : `Сервер ${props.url_ping} не отвечает`}</p>
      </div>
   )
}

const Ping = (props) => {
   const text_input = props.text_input,
         onChangeText = props.onChangeText,
         isDisabledBtnPing = props.is_disabled_btn_ping,
         onPingUrl = props.onPingUrl,
         data_ping = props.data_ping;


   const inputRef = React.createRef()

   const onChange = () => {
      let text = inputRef.current.value;
      onChangeText(text);
   }
   const onPing = (e) => {
      e.preventDefault();
      let url = inputRef.current.value;
      onPingUrl(url);
   }

   return (
      <div className={s.pingWrap}>
         <form className={s.pingForm}>
            <input onChange={onChange} ref={inputRef} value={text_input} type="text" placeholder="Введите url-адрес ресурса в формате http(s)/www.ukr.net" />
            {data_ping !== null && <PingReport url_ping={data_ping.url_ping} time_ping={data_ping.time_ping} />}
            <button onClick={onPing} disabled={isDisabledBtnPing} className={`btn ${isDisabledBtnPing ? 'disabled' : ''}`}>Ping</button>
         </form>

      </div>
   )
}

export default Ping;