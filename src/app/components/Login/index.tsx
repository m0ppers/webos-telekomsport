import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { AuthActions } from 'app/actions';
import { RootState } from 'app/reducers';
import Input from '@enact/moonstone/Input';

type StupidWebOSInputEvent = any;

export namespace Login {
    export interface Props {
        passwordLogin: Function,
        error: string,
    }

    export interface State {
        email: string;
        password: string;
    }
}

@connect(
    (state: RootState): object => {
      return {
          error: state.auth.error,
      };
    },
    (dispatch: Dispatch): Pick<Login.Props, 'passwordLogin'> => ({
        passwordLogin: bindActionCreators(AuthActions.passwordLogin, dispatch)
    })
)
export class Login extends React.Component<Login.Props, Login.State> {
    constructor(props: Login.Props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    login(event: React.MouseEvent<HTMLButtonElement>) {
        this.props.passwordLogin(this.state.email, this.state.password);
        event.preventDefault();
    }

    changePassword(event: StupidWebOSInputEvent) {
        this.setState({
            ...this.state,
            password: event.value,
        });
    }

    changeEmail(event: StupidWebOSInputEvent) {
        this.setState({
            ...this.state,
            email: event.value,
        });
    }

    render() {
        let error = null;
        if (this.props.error) {
            error = (
                <div>
                    <div>Fehler beim Login</div>
                    <div>{this.props.error}</div>
                </div>
            )
        }
        return (
            <div>
                {error}
                <form>
                    Email: <Input type="email" value={this.state.email} onChange={this.changeEmail.bind(this)}></Input>
                    Password: <Input type="password" value={this.state.password} onChange={this.changePassword.bind(this)}></Input>
                    <button onClick={this.login.bind(this)}>Login</button>
                </form>
            </div>
        )
    }
};