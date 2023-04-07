_default:
  just --list

fetch_words:
  node word_fetcher.js

fetch_local_words:
  node word_fetcher.js local

fetch_source:
  curl -L -o "raw_sources/$(date +'%Y-%m-%dT%H:%M:%S')_paraulogic.html" https://www.vilaweb.cat/paraulogic/
