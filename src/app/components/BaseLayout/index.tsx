import * as React from 'react';
import * as style from './style.css';

export namespace BaseLayout {
    export interface Props {
    }
}

export class BaseLayout extends React.Component<BaseLayout.Props> {
    render() {
        return (
            <div className={style.base}>
                {this.props.children}
            </div>
        )
    }
}