package db

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var error error

	DB, error = sql.Open("sqlite3", "api.db")

	if error != nil {
		panic("Error connecting to DB: " + error.Error())
	}

	DB.SetMaxOpenConns(5)
	DB.SetMaxIdleConns(10)

	createTable()
}
func createTable() {
	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		username TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)
	`

	_, err := DB.Exec(createUsersTable)

	if err != nil {
		panic("Cant create table")
	}

	createTodoTable := `
	CREATE TABLE IF NOT EXISTS todos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		description TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT NULL,
		isComplete BOOLEAN DEFAULT FALSE,
		user_id INTEGER,
		FOREIGN KEY (user_id) REFERENCES users(id)
	)
	`

	_, err = DB.Exec(createTodoTable)

	if err != nil {
		panic("Could no create events table")
	}
}
