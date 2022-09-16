import Ping from "./Ping";
import { connect } from "react-redux";
import { setInputPingAC, isDisabledBtnPingAC, setDataPingAC } from "../../redux/reducers/ping-reducer";
import React from "react";
import pingJS from "ping.js";

const mapStateToProps = (state) => {
   return {
      text_input : state.PING_REDUCER.text_input,
      is_disabled_btn_ping : state.PING_REDUCER.is_disabled_btn_ping,
      data_ping : state.PING_REDUCER.data_ping,
   }
}
const mapDispatchToProps = {
   setInputPingAC,
   isDisabledBtnPingAC,
   setDataPingAC,
}
class PingApiContainer extends React.Component {

   onChangeText = (text) => {
      this.props.setInputPingAC(text);
      text.length > 0 ? this.props.isDisabledBtnPingAC(false) : this.props.isDisabledBtnPingAC(true);
   }

   onPingUrl = (url) => {
      this.props.isDisabledBtnPingAC(true);
      let that = this;
      const p = new pingJS();
      p.ping(url, function(err, data) {
         if (err) {
            data = {url_ping : url, time_ping : null};
         } else {
            data = {url_ping : url, time_ping : data}
         }
         that.props.setDataPingAC(data)
         that.props.isDisabledBtnPingAC(false);
      })
    };

   render () {
      return (
         <Ping
            text_input={this.props.text_input}
            onChangeText={this.onChangeText}
            is_disabled_btn_ping={this.props.is_disabled_btn_ping}
            onPingUrl={this.onPingUrl}
            data_ping={this.props.data_ping}
         />
      )
   }
}

const PingContainer = connect(mapStateToProps, mapDispatchToProps)(PingApiContainer);

export default PingContainer;