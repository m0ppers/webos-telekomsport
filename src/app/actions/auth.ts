import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';
import { telekomClient } from 'app/services/telekomclient';
import { history } from 'app/utils/history';

export interface LoginPayload {
    jwt: string;
    name: string;
}

export namespace AuthActions {
    export enum Type {
        START_LOGIN = 'START_LOGIN',
        FAIL_LOGIN = 'FAIL_LOGIN',
        COMPLETE_LOGIN = 'COMPLETE_LOGIN',
    }
    export const login = (username: string, password: string) => {
        return (dispatch: Dispatch) => {
            dispatch(startLogin());
            telekomClient('auth', [username, password])
            .then((payload: LoginPayload) => {
                dispatch(completeLogin(payload));
                history.push('/video/106867');
            }, (e: Error) => {
                dispatch(failLogin(e));
            });
        }
    };
    export const startLogin = createAction(Type.START_LOGIN);
    export const failLogin = createAction<Error>(Type.FAIL_LOGIN);
    export const completeLogin = createAction<LoginPayload>(Type.COMPLETE_LOGIN);
}

export type AuthActions = Omit<typeof AuthActions, 'Type'>;
