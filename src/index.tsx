/* @refresh reload */
import { render } from 'solid-js/web';
import { Route, Router } from "@solidjs/router";
import { GameScreen } from "./GameScreen";
import { FusionScreen } from "./FusionScreen";

import App from './App';
import './index.css';

render(
  () => (
    <Router root={App}>
      <Route path="/fusio" component={FusionScreen} />
      <Route path="/" component={GameScreen} />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
);
