// VALUES TYPE
const SET_INPUT_PING = 'SET_INPUT_PING';
const IS_DISABLED_BTN_PING = 'IS_DISABLED_BTN_PING';
const SET_DATA_PING = 'SET_DATA_PING';


// ACTION CREATORS
export const setInputPingAC = (text) => ({type : SET_INPUT_PING, text});
export const isDisabledBtnPingAC = (bool) => ({type : IS_DISABLED_BTN_PING, bool});
export const setDataPingAC = (data) => ({type : SET_DATA_PING, data});


// INITIAL STATE
const initialState = {
   text_input : '',
   is_disabled_btn_ping : true,
   data_ping : null,
}

// REDUCER
const PING_REDUCER = (state = initialState, action) => {
   switch (action.type) {
      case SET_INPUT_PING: {
         return { ...state, text_input : action.text }
      }
      case IS_DISABLED_BTN_PING: {
         return { ...state, is_disabled_btn_ping : action.bool }
      }
      case SET_DATA_PING: {
         return { ...state, data_ping : action.data }
      }
      default:
         return state;
   }
}

export default PING_REDUCER;