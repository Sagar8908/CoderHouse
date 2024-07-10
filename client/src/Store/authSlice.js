import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuth: false,
    user: null,
    OTP: {
        phone: '',
        hash: '',
    },
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            const { user } = action.payload;
            console.log(user);
            state.user = user;
            if (user === null) {
                state.isAuth = false;
            }
            else {
                state.isAuth = true;
            }
        },
        setOtp: (state, action) => {
            const { phone, hash } = action.payload;
            state.OTP.phone = phone;
            state.OTP.hash = hash;
        },
    },
});

export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;