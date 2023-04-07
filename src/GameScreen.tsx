import styles from './GameScreen.module.css';
import { LetterGrid } from "./LetterGrid"
import { Match, Switch } from "solid-js";
import { GameInput } from './GameInput';
import { GameInputProvider, useGameInput } from './GameInputContext';
import { useStore } from './store';
import { score } from './aux';
import { GameResult } from './GameResult';


export function GameScreen() {
  return (
    <GameInputProvider>
      <div class={styles.screen}>
        <LetterGrid />
        <GameInput />
        <GameDisplay />
        <GameResult />
      </div>
    </GameInputProvider>
  )
}

function GameDisplay() {
  const [{ display }] = useGameInput()
  const [{ letters }]: any = useStore()

  return (
    <div class={styles.display}>
      <Switch>
        <Match when={display().isValid && display().value.length > 0}>
          <span class={styles.success}>{display().value}</span>
          <span class={styles.score}>+{score(display().value, letters().length + 1)}</span>
        </Match>
        <Match when={!display().isValid}>
          <span class={styles.error}>{display().reason}</span>
        </Match>
      </Switch>
    </div>
  )
}
