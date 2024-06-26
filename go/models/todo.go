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

	// layout := "2006-01-02T15:04:05.000Z"

	// sort.Slice(todos, func(i, j int) bool {
	// 	time1, _ := time.Parse(layout, todos[i].Created_at)
	// 	time2, _ := time.Parse(layout, todos[j].Created_at)

	// 	log.Println("TIME 1 IS", time1)
	// 	log.Println("TIME 2 IS", time2)

	// 	return time2.Before(time1)
	// })

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
	query := `
UPDATE todos SET isComplete = ?,Title =?,Description=?, updated_at = ? WHERE id = ?
`
	smtm, err := db.DB.Prepare(query)

	log.Println("ERROR", err)

	if err != nil {
		return err
	}

	defer smtm.Close()

	result, err := smtm.Exec(todo.IsComplete, todo.Title, todo.Description, todo.Updated_at, todo.ID)

	log.Println("UPDATE TODO", result)

	if err != nil {
		return err
	}

	return nil
}

func (todo *Todo) DeleteTodo() error {
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

func SearchTodo(q string, userId int64) ([]Todo, error) {
	query := `SELECT * FROM todos WHERE user_id = ? AND title LIKE ?`

	var todos []Todo

	rows, err := db.DB.Query(query, userId, "%"+q+"%")

	log.Println("ERROR QUERY PREPARE", err)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var t Todo
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Created_at, &t.Updated_at, &t.IsComplete, &t.UserId); err != nil {
			return nil, err
		}

		todos = append(todos, t)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	log.Println("ERROR EXEC QUERY", err)

	return todos, nil
}
