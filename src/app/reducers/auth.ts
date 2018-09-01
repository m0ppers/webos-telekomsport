import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { AuthActions } from 'app/actions';

const initialState: RootState.Auth = {
    loggingIn: false,
    authenticated: false,
};
const refreshToken = localStorage.getItem('refreshToken') || null;
if (refreshToken) {
    initialState.refreshToken = refreshToken;
}

export const authReducer = handleActions<RootState.Auth, any>({
    [AuthActions.Type.START_LOGIN]: (state) => {
        return {
            ...initialState,
            loggingIn: true,
        }
    },
    [AuthActions.Type.COMPLETE_LOGIN]: (state, action) => {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        return {
            ...state,
            ...action.payload,
            authenticated: true,
            loggingIn: false,
            refreshToken: action.payload.refreshToken,
        }
    },
    [AuthActions.Type.FAIL_LOGIN]: (state, action) => {
        localStorage.removeItem('refreshToken');
        return {
            error: action.payload,
            authenticated: false,
            loggingIn: false,
        }
    },
}, initialState);