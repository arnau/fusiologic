import { A } from "@solidjs/router";

import { StoreProvider } from "./store"
import styles from './App.module.css';

function App(props: any) {
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
          {props.children}
        </main>
      </div>
    </StoreProvider>
  ) 
}

export default App;
