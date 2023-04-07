export type Round = Array<string>
export type Cache = Array<Round>

export type Letter = string
export type LetterSet = Array<Letter|null>

export type Word = string
export type WordSet = Set<Word>

export type Digram = string
// export type DigramMap = Map<Digram, [number, number]>
export interface DigramMap {
  [key: string]: DigramValue,
}

export interface DigramValue {
  // signal pair
  found: () => number,
  setFound: any,
  total: number,
}


export interface Bag {
  letters: LetterSet,
  requiredLetter: Letter,
  wordMap: Map<string, string>,
}
