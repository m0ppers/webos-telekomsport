import * as React from 'react';
import { BaseLayout } from 'app/components/BaseLayout';

export const Layouted = <P extends object>(Component: React.ComponentType<P>) => {
    class Layouted extends React.Component<P> {
        render() {
            return <BaseLayout><Component {...this.props}/></BaseLayout>
        }
    };
    return Layouted;
}