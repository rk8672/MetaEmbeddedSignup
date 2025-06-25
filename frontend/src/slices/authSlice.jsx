import {createSlice} from"@reduxjs/toolkit"

const initialState={
    user:null,
    token:null,
    isAuthenticated:false,
}
const authSlice=createSlice({
name:"auth",
initialState,
reducers:{
    loginSuccess:(state,action)=>{
        state.token=action.payload.token;
        state.user=action.payload.user;
        state.isAuthenticated=true;
        localStorage.setItem("token",action.payload.token);
    },

    logout:(state)=>{
        state.token=null;
        state.user=null;
        state.isAuthenticated=false;
        localStorage.removeItem("token");
    }
}
});

export const {loginSuccess,logout}=authSlice.actions;
export default authSlice.reducer;