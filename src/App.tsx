import { Route, Routes, A } from "@solidjs/router";

import { StoreProvider } from "./store"
import { GameScreen } from "./GameScreen";
import { FusionScreen } from "./FusionScreen";

import styles from './App.module.css';

function App() {
  return (
    <StoreProvider>
      <div class={styles.App}>
        <header class={styles.header}>
          <h1>Fusiològic</h1>
          <nav class={styles.nav}>
            <A href="/" end={true}>joc</A>
            <A href="/fusio">fusió</A>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/fusio" component={FusionScreen} />
            <Route path="/" component={GameScreen} />
          </Routes>
        </main>
      </div>
    </StoreProvider>
  )
}

export default App;
