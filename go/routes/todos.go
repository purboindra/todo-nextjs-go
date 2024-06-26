package routes

import (
	"errors"
	"example/todo/models"
	"example/todo/utils"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func createTodo(ctx *gin.Context) {

	var todo models.Todo

	err := ctx.ShouldBindJSON(&todo)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	userId := ctx.GetInt64("userId")

	todo.UserId = strconv.FormatInt(userId, 10)

	todo.Created_at = time.Now().Format("2006-01-02 15:04:05")

	err = todo.AddTodo()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Todo create successfully!",
	})
}

func getTodoById(ctx *gin.Context) {

	userId, err := utils.VerifyToken(ctx.Request.Header.Get("Authorization"))

	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	param := ctx.Param("id")
	id, err := strconv.ParseInt(param, 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
	}

	todo, err := models.GetTodoById(id)

	if todo.UserId != strconv.FormatInt(userId, 10) {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Success get todo",
		"todo":    todo,
	})
}

func getTodos(ctx *gin.Context) {

	userId, err := utils.VerifyToken(ctx.Request.Header.Get("Authorization"))

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": err.Error(),
		})
		return
	}

	todos, err := models.GetTodos(userId)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	if len(todos) == 0 {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Success get todos",
			"data":    []models.Todo{},
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Success get todos",
		"data":    todos,
	})
}

func updateTodo(ctx *gin.Context) {

	param := ctx.Param("id")

	id, err := strconv.ParseInt(param, 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	todo, err := models.GetTodoById(id)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	userId := ctx.GetInt64("userId")

	if todo.UserId != strconv.FormatInt(userId, 10) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": errors.New("Unauthorized"),
		})
		return
	}

	var updatedTodo models.Todo

	log.Println(updatedTodo)

	err = ctx.ShouldBindJSON(&updatedTodo)

	if todo.UserId != strconv.FormatInt(userId, 10) {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	time := time.Now()

	log.Println("IS COMPLETE TODO", updatedTodo.IsComplete)
	log.Println("TITLE TODO", updatedTodo.Title)

	updatedTodo.ID = todo.ID
	updatedTodo.Updated_at = time.String()

	if todo.UserId != strconv.FormatInt(userId, 10) {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	err = updatedTodo.UpdateTodo()

	if todo.UserId != strconv.FormatInt(userId, 10) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": err,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Todo updated successfully",
	})
}

func deleteTodo(ctx *gin.Context) {
	param := ctx.Param("id")
	todoId, err := strconv.ParseInt(param, 10, 64)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	userId, err := utils.VerifyToken(ctx.Request.Header.Get("Authorization"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	result, err := models.GetTodoById(todoId)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	if result.UserId != strconv.FormatInt(userId, 10) {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	err = result.DeleteTodo()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Todo was deleted successfully",
	})

}

func searchTodo(ctx *gin.Context) {

	query := ctx.Query("q")

	log.Println("QUERY IS", query)

	userId, err := utils.VerifyToken(ctx.Request.Header.Get("Authorization"))

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": err.Error(),
		})
		return
	}

	var searchResults []models.Todo

	searchResults = searchResults[:0]

	results, err := models.SearchTodo(query, userId)

	if err != nil {
		log.Println("Error searching todo:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	for _, data := range results {
		if strings.Contains(data.Title, query) {
			searchResults = append(searchResults, data)
		}
	}

	if len(searchResults) == 0 {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Success get todos",
			"data":    []models.Todo{},
		})
	} else {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Success get todos",
			"data":    searchResults,
		})
	}

}
