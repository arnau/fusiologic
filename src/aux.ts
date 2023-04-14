import type { Bag, DigramIndex, Letter, LetterSet, Word } from "./types";

export function isTuti(word: Word, max: number) {
  const wordLetterNumber = (new Set(word)).size

  return wordLetterNumber == max
}

export function totalScore(list: Word[], letterNumber: number) {
  return list.reduce((acc: number, word: Word) => acc + score(word, letterNumber), 0)
}

export function score(word: string, letterNumber: number) {
  let points = 0
  const length = word.length

  if (length == 3) { points = 1 }
  if (length == 4) { points = 2 }
  if (length > 4) { points = length }

  if (length >= letterNumber) {
    const unique = new Set(word)

    // tuti +10
    if (unique.size == letterNumber) {
      points += 10
    }
  }

  return points
}

export function shuffle(list: Array<any>): Array<any> {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }

  return list
}


// Errors

const messages = {
  missingRequired: (letter: Letter) => `Manca una “${letter.toUpperCase()}”`,
  tooShort: "Massa curta",
  invalidLetters: (letters: LetterSet) => `Lletres invàlides: ${letters.join(",")}`,
  unknownWord: (word: string) => word,
  alreadyFound: "Ja hi és"
}

export function validate(input: string, bag: Bag, isFound: boolean) {
  const { letters, requiredLetter, wordIndex } = bag
  const letterSet = [...letters, requiredLetter]
  const inputSet = [...input]

  if (isFound) {
    return failWith(input, messages.alreadyFound)
  }

  if (input.length < 3) {
    return failWith(input, messages.tooShort)
  }

  if (!input.includes(bag.requiredLetter)) {
    return failWith(input, messages.missingRequired(requiredLetter))
  }

  const diff = inputSet.filter(x => !letterSet.includes(x))
  if (diff.length > 0) {
    return failWith(input, messages.invalidLetters(diff))
  }

  if (!wordIndex.has(input)) {
    return failWith(input, messages.unknownWord(input))
  }

  return ({ isValid: true, value: input })
}

export function failWith(value: string, reason: string) {
  return ({ isValid: false, value, reason })
}


// Indices

export function invertIndex(index: any) {
  const result: any = new Map()

  for (const [key, value] of index) {
    result.set(value, key)
  }

  return result
}


// Metrics

export function collectDigrams(words: Array<Word>): DigramIndex {
  const result: DigramIndex = {}

  for (const word of words) {
    const di = word.slice(0, 2)
    const value = result[di] ?? 0

    result[di] = value + 1
  }

  return result
}
