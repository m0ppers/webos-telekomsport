import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';
import { AuthActions } from 'app/actions';
import { bindActionCreators, Dispatch } from 'redux';

export namespace Authenticated {
    export interface Props extends RouteComponentProps<void> {
        authenticated: boolean;
        refreshToken?: string;
        refreshTokenLogin: Function;
    }
}

export const Authenticated = <P extends object>(Component: React.ComponentType<P>) => {
    @connect(
        (state: RootState): Pick<Authenticated.Props, 'authenticated' | 'refreshToken'> => {
            return {
                authenticated: state.auth.authenticated,
                refreshToken: state.auth.refreshToken,
            };
        },
        (dispatch: Dispatch): Pick<Authenticated.Props, 'refreshTokenLogin'> => ({
            refreshTokenLogin: bindActionCreators(AuthActions.refreshTokenLogin, dispatch)
        })
    )
    class Authenticated extends React.Component<P & Authenticated.Props> {
        componentDidMount() {
            if (!this.props.authenticated) {
                if (this.props.refreshToken) {
                    this.props.refreshTokenLogin(this.props.refreshToken)
                } else {
                    this.props.history.push('/login');
                }
            }
        }

        render() {
            return <div>{this.props.authenticated ? <Component {...this.props}/> : null}</div>
        }
    };
    return Authenticated;
}
