import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage/session";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import priceSlice from './priceSlice';


const reducers = combineReducers({
    user : priceSlice.reducer,
})

const persistConfig = {
    key:'root',
    storage,
    whitelist:['price']
}


const persistedReducer = persistReducer(persistConfig, reducers);



export default configureStore({
    reducer:persistedReducer,
})