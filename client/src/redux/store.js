import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from './user/userSlice'
import storage from 'redux-persist/lib/storage'
import {persistReducer,persistStore} from 'redux-persist'

const rootReducer=combineReducers({
    user:userReducer
})
const persistConfig={
    key:'root',
    storage,
    version:1
}
const persistedReducer = persistReducer(persistConfig,rootReducer) // to store state in local storage so that it will not vaish after refresh

export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false}) , //to avoid serializable error in browser
});

export const persistor=persistStore(store)  //export for main js to wrap everything in it