const fs = require('fs/promises')

const url = 'https://www.vilaweb.cat/paraulogic/'
const re_yesterday = /var\sy=({.+?});/
const re_today = /var\st=(\{.+?\});/

async function reshape(yesterday, today) {
  let today_date = new Date()
  let yesterday_date = new Date();
  yesterday_date.setDate(yesterday_date.getDate() - 1);

  return [
    {
      id: yesterday_date.toISOString().split("T")[0],

      letters: yesterday.l,
      words: yesterday.p,
    },
    {
      id: today_date.toISOString().split("T")[0],
      letters: today.l,
      words: today.p,
    },
  ]
}

async function main() {
  const local = process.argv[2] == "local"

  try {
    const response = await fetch(url)

    if (response.status == 200) {
      const body = (await response.text()).replaceAll('&nbsp;', ' ')

      const y = re_yesterday.exec(body)[1]
      const t = re_today.exec(body)[1]
      const [yesterday, today] = await reshape(JSON.parse(y), JSON.parse(t))
      const yesterday_json = JSON.stringify(yesterday)
      const today_json = JSON.stringify(today)

      const bag = `export const yesterday = ${yesterday_json}\nexport const today = ${today_json}`

      await fs.writeFile("src/bag.ts", bag, { encoding: 'utf-8' })

      if (local) {
        await fs.writeFile(`word_db/${today.id}.json`, today_json, { encoding: 'utf-8' })
      }
    }
  } catch (error) {
    console.log(error)
  }
}


main();
