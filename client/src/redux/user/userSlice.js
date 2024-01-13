import {createSlice} from '@reduxjs/toolkit';

const initialState={
    currentUser:null,
    error:null,
    loading:false
};


const userSlice= createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
                state.loading=true;
                state.error=null;
        },
        
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        clearError:(state)=>{
            state.error=null;
        },
        updateUserStart:(state)=>{
            state.loading=true;
            state.error=null;
        }, 
        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        updateUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        deleteUserStart:(state)=>{
            state.loading=true;
            state.error=null;

        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        deleteUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        signOutUserStart:(state)=>{
            state.loading=true;
            state.error=null;

        },
        signOutSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        signOutUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        }
    }
});

export const{
    signInFailure,
    signInStart,
    signInSuccess,
    updateUserStart,
    updateUserFailure,
    updateUserSuccess,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserFailure,
    signOutSuccess,
    signOutUserStart,
    clearError

    
}=userSlice.actions;

export default userSlice.reducer;