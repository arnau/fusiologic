use regex::Regex;
use std::env;

use rusqlite::{params, Connection};

const SOURCE_URL: &str = "https://www.vilaweb.cat/paraulogic/";
fn main() -> Result<(), ureq::Error> {
    let sink_path = env::var("FUSIOLOGIC_SINK").unwrap();
    let conn = Connection::open(sink_path).unwrap();

    conn.execute(
        r#"
        CREATE TABLE IF NOT EXISTS gameset (
            stamp date NOT NULL PRIMARY KEY,
            letters text NOT NULL,
            words text NOT NULL
        );
        "#,
        (),
    )
    .unwrap();

    let re_today = Regex::new(r#"var\st=\{"l":(\[.+?\]),"p":(\{[^\}]+?})"#).unwrap();
    let re_date = Regex::new(r#"data-joc="([^"]+?)""#).unwrap();

    let body: String = ureq::get(SOURCE_URL).call()?.into_string()?;

    let today_caps = re_today.captures(&body).unwrap();
    let date_caps = re_date.captures(&body).unwrap();

    conn.execute(
        r#"
        INSERT OR IGNORE INTO gameset
            (stamp, letters, words)
        VALUES
            (?1, ?2, ?3);
        "#,
        params![&date_caps[1], &today_caps[1], &today_caps[2]],
    ).unwrap();

    Ok(())
}
