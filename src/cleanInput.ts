

export function cleanInput(input: string, indices: any) {
  const { words, wordsInverted } = indices
  let value = input.includes(":")
    ? input.trim().split(":")[1]
    : input.trim()

  if (value.endsWith(".")) {
    value = value.slice(0, -1)
  }

  const list = value
    .split(", ")
    .reduce((acc: Array<string>, token: string) => {
      const phrase = token.trim().toLowerCase()
      let word = wordsInverted.get(phrase)

      if (word === undefined && words.has(phrase)) {
        word = phrase
      }

      if (word !== undefined) {
        acc.push(word!)
      }

      return acc
    }, [])

  list.sort()

  return list
}
