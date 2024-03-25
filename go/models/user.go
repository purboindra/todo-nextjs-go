package models

import (
	"errors"
	"example/todo/db"
	"example/todo/utils"
	"log"
	"time"
)

type User struct {
	ID         int64
	Email      string `binding:"required"`
	Password   string `binding:"required"`
	Username   string
	Created_at time.Time
}

func (user User) SaveUser() error {
	query := `INSERT INTO USERS (email, password, username, created_at) VALUES (?, ?, ?, ?)`

	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	hashedPassword, err := utils.HashedPassword(user.Password)

	if err != nil {
		return err
	}

	result, err := stmt.Exec(&user.Email, hashedPassword, &user.Username, &user.Created_at)

	if err != nil {
		return err
	}

	userId, err := result.LastInsertId()

	if err != nil {
		return err
	}

	user.ID = userId

	return nil
}

func (user *User) Login() (*User, error) {
	query := `SELECT * FROM users WHERE email = ?`
	row := db.DB.QueryRow(query, user.Email)

	var password string
	err := row.Scan(&user.ID, &user.Email, &password, &user.Username, &user.Created_at)

	if err != nil {
		return nil, err
	}

	passwordValid := utils.CheckHashPasswordk(user.Password, password)

	if !passwordValid {
		return nil, errors.New("user not valid!")
	}

	return user, nil
}

func GetUserById(userId int64) (*User, error) {
	query := `SELECT * FROM users WHERE ID = ?`
	row := db.DB.QueryRow(query, userId)

	var user User
	err := row.Scan(&user.ID, &user.Email, &user.Password, &user.Username, &user.Created_at)
	if err != nil {
		return nil, err
	}

	log.Println(user)

	return &user, nil

}
