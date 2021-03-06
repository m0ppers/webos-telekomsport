import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';
import { telekomClient } from 'app/services/telekomclient';
import { history } from 'app/utils/history';

export interface LoginPayload {
    refreshToken: string;
    jwt: string;
    name: string;
}

export namespace AuthActions {
    export enum Type {
        START_LOGIN = 'START_LOGIN',
        FAIL_LOGIN = 'FAIL_LOGIN',
        COMPLETE_LOGIN = 'COMPLETE_LOGIN',
    }

    export const fail = (dispatch: Dispatch, e: string) => {
        dispatch(failLogin(e));
        if (history.location.pathname != '/login') {
            history.push('/login');
        }
    }
    
    export const passwordLogin = (username: string, password: string) => {
        return (dispatch: Dispatch) => {
            dispatch(startLogin());
            telekomClient('passwordAuth', [username, password])
            .then((payload: LoginPayload) => {
                dispatch(completeLogin(payload));
                history.push('/');
            }, (e: string) => {
                fail(dispatch, e);
            });
        }
    };

    export const refreshTokenLogin = (refreshToken: string) => {
        return (dispatch: Dispatch) => {
            dispatch(startLogin());
            telekomClient('refreshAuth', [refreshToken])
            .then((payload: LoginPayload) => {
                dispatch(completeLogin(payload));
            }, (e: string) => {
                fail(dispatch, e);
            });
        }
    };

    export const startLogin = createAction(Type.START_LOGIN);
    export const failLogin = createAction<string>(Type.FAIL_LOGIN);
    export const completeLogin = createAction<LoginPayload>(Type.COMPLETE_LOGIN);
}

export type AuthActions = Omit<typeof AuthActions, 'Type'>;
