import {configureStore} from "@reduxjs/toolkit";
import authreducer from "../slices/authSlice";
import configreducer from "../slices/configSlice";

const store=configureStore({
reducer:{
auth:authreducer,
config:configreducer,
}
})

export default store;