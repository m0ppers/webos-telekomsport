import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { AuthActions } from 'app/actions';

const initialState: RootState.Auth = {
    loggingIn: false,
    authenticated: false,
};

export const authReducer = handleActions<RootState.Auth, any>({
    [AuthActions.Type.START_LOGIN]: (state) => {
        return {
            ...initialState,
            loggingIn: true,
        }
    },
    [AuthActions.Type.COMPLETE_LOGIN]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            authenticated: true,
            loggingIn: false,
        }
    },
    [AuthActions.Type.FAIL_LOGIN]: (state, action) => {
        return {
            ...state,
            error: action.payload,
            authenticated: true,
            loggingIn: false,
        }
    },
}, initialState);