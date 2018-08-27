import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Authenticated } from 'app/components/Authenticated';
import { TelekomVideo } from 'app/components/TelekomVideo';
import { Login } from 'app/components/Login';
import { hot } from 'react-hot-loader';

import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';

export const AppBase = hot(module)(() => (
  <Switch>
    <Route path="/login" component={Login} />

    <Route path="/video/:videoId" component={Authenticated(TelekomVideo)} />
    <Route path="/" component={Authenticated(() => null)} />
  </Switch>
));

export const App = MoonstoneDecorator(AppBase);
