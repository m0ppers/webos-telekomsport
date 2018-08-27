import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { AuthActions } from 'app/actions';
import { RootState } from 'app/reducers';

export namespace Login {
    export interface Props {
        login: Function,
    }

    export interface State {
        email: string;
        password: string;
    }
}

@connect(
    (state: RootState): object => {
      return {};
    },
    (dispatch: Dispatch): Pick<Login.Props, 'login'> => ({
      login: bindActionCreators(AuthActions.login, dispatch)
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
        this.props.login(this.state.email, this.state.password);
        event.preventDefault();
    }

    changePassword(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            password: event.target.value,
        });
    }

    changeEmail(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            email: event.target.value,
        });
    }

    render() {
        return (
            <div>
                <form>
                    Email: <input type="email" value={this.state.email} onChange={this.changeEmail.bind(this)}></input>
                    Password: <input type="password" value={this.state.password} onChange={this.changePassword.bind(this)}></input>
                    <button onClick={this.login.bind(this)}>Login</button>
                </form>
            </div>
        )
    }
};