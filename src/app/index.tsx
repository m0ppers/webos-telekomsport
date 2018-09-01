import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Authenticated } from 'app/components/Authenticated';
import { Layouted } from 'app/components/Layouted';
import { TelekomVideo } from 'app/components/TelekomVideo';
import { Login } from 'app/components/Login';
import { hot } from 'react-hot-loader';

import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';

import { Home } from 'app/components/Home';
import { Event } from 'app/components/Event';

export const AppBase = hot(module)((props: any) => (
  <div className={props.className}>
    <Switch >
      <Route path="/events/:eventId" component={Layouted(Authenticated(Event))} />
      <Route path="/videos/:videoId" component={Authenticated(TelekomVideo)} />
      <Route path="/login" component={Layouted(Login)} />
      <Route path="/" component={Layouted(Authenticated(Home))} />
    </Switch>
  </div>
));

export const App = MoonstoneDecorator(AppBase);
