import * as React from 'react';
import Panels from '@enact/moonstone/Panels';


export const Layouted = <P extends object>(Component: React.ComponentType<P>) => {
    class Layouted extends React.Component<P> {
        render() {
            return <Panels noCloseButton><Component {...this.props}/></Panels>
        }
    };
    return Layouted;
}