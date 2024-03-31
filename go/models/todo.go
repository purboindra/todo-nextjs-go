package models

import (
	"example/todo/db"
	"log"
	"strconv"
)

type Todo struct {
	ID          string `json:"id"`
	Title       string `binding:"required" json:"title"`
	Description string `binding:"required" json:"description"`
	Created_at  string `json:"created_at"`
	Updated_at  string `json:"updated_at"`
	IsComplete  bool   `json:"isComplete"`
	UserId      string `json:"user_id"`
}

func (todo *Todo) AddTodo() error {
	query := `INSERT INTO todos(title,description,created_at,updated_at,isComplete,user_id) VALUES (?, ?, ?, ?, ?, ?)`
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		log.Println("ERROR QUERY", err.Error())
		return err
	}

	defer stmt.Close()

	result, err := stmt.Exec(todo.Title, todo.Description, todo.Created_at, todo.Updated_at, todo.IsComplete, todo.UserId)

	if err != nil {
		log.Println("ERROR EXEC", err.Error())

		return err
	}

	id, err := result.LastInsertId()

	if err != nil {
		return err
	}

	todo.ID = strconv.FormatInt(id, 10)
	return nil
}

func GetTodos(userId int64) ([]Todo, error) {
	query := `SELECT * FROM todos WHERE user_id = ?`
	rows, err := db.DB.Query(query, userId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var todos []Todo

	for rows.Next() {
		var todo Todo
		err := rows.Scan(&todo.ID, &todo.Title, &todo.Description, &todo.Created_at, &todo.Updated_at, &todo.IsComplete, &todo.UserId)

		if err != nil {
			return nil, err
		}

		todos = append(todos, todo)
	}
	return todos, nil
}

func GetTodoById(id int64) (*Todo, error) {
	query := `SELECT * FROM todos WHERE id = ?`

	var todo Todo

	result := db.DB.QueryRow(query, id)

	err := result.Scan(&todo.ID, &todo.Title, &todo.Description, &todo.Created_at, &todo.Updated_at, &todo.IsComplete, &todo.UserId)

	if err != nil {
		return nil, err
	}

	return &todo, nil
}

func (todo *Todo) UpdateTodo() error {
	log.Println("UPDATE TODO CALLED")
	query := `
UPDATE todos SET isComplete = ?, updated_at = ? WHERE id = ?
`
	smtm, err := db.DB.Prepare(query)

	log.Println("ERROR", err)

	if err != nil {
		return err
	}

	defer smtm.Close()

	result, err := smtm.Exec(todo.IsComplete, todo.Updated_at, todo.ID)

	log.Println("UPDATE TODO", result)

	if err != nil {
		return err
	}

	return nil
}

func (todo Todo) DeleteTodo() error {
	query := `DELETE FROM todos where id = ?`

	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(todo.ID)

	if err != nil {
		return err
	}

	return nil
}
