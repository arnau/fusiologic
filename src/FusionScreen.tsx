import { createEffect, createSignal } from 'solid-js';

import styles from './App.module.css';
import { Rounds } from './Round';
import { Result } from './Result';
import { useStore } from './store';
import { cleanInput } from './cleanInput'
import { invertIndex } from './aux';


function Input() {
  const [input, setInput] = createSignal("")
  const [{ indices }, { addRound, flushRounds }]: any = useStore()

  const handleSubmit = (event: any) => {
    event.preventDefault()

    const round = cleanInput(input(), invertIndex(indices.words.entries()))
    addRound(round)

    setInput("")
  }

  const handleInput = (e: any) => {
    if (e.inputType == "insertLineBreak") {
      handleSubmit(e)
    } else {
      setInput(e.currentTarget.value)
    }
  }

  const handleCleanup = () => {
    flushRounds()
  }

  return (
    <form class={styles.inputForm} onSubmit={handleSubmit}>
      <textarea
        onInput={handleInput}
        value={input()}
        placeholder="Has trobat 2 paraules de les 182 possibles (i cap tuti dels 6 que hi ha): nat, net."
        autofocus={true}
      ></textarea>

      <div class={styles.buttonSet}>
        <button type="submit">Afegeix</button>
        <button type="button" onClick={handleCleanup}>Neteja cache</button>
      </div>
    </form>
  )
}

export function FusionScreen() {
  return (
    <div>
      <Input />
      <Rounds />
      <Result />
    </div>
  )
}
