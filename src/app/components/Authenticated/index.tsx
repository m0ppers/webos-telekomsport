import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';

export namespace Authenticated {
    export interface Props extends RouteComponentProps<void> {
        authenticated: boolean;
    }
}

export const Authenticated = <P extends object>(Component: React.ComponentType<P>) => {
    @connect(
        (state: RootState): Pick<Authenticated.Props, 'authenticated'> => {
          return { authenticated: state.auth.authenticated };
        }
    )
    class Authenticated extends React.Component<P & Authenticated.Props> {
        componentDidMount() {
            if (!this.props.authenticated) {
                this.props.history.push('/login');
            }
        }

        render() {
            return <div>{this.props.authenticated ? <Component {...this.props}/> : null}</div>
        }
    };
    return Authenticated;
}
