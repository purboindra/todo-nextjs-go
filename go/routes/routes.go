package routes

import (
	"example/todo/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine) {

	server.Use(middlewares.CORSMiddleware())

	authenticate := server.Group("/")

	authenticate.Use(middlewares.Authenticate)

	server.POST("/signup", signup)
	server.POST("/signin", signin)
	server.GET("/get-user/:id", getUserById)

	authenticate.POST("/add-todo", createTodo)
	authenticate.GET("/get-todos", getTodos)
	authenticate.GET("/get-todo/:id", getTodoById)
	authenticate.PUT("/update-todo/:id", updateTodo)
	authenticate.DELETE("/delete-todo/:id", deleteTodo)
}
