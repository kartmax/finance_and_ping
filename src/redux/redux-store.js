import { combineReducers, createStore } from "redux";

import FINANCE_REDUCER from "./reducers/finance-reducer";
import PING_REDUCER from "./reducers/ping-reducer";

let reducers = combineReducers({
   FINANCE_REDUCER,
   PING_REDUCER
});

let store = createStore(reducers);

export default store;