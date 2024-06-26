package routes

import (
	"example/todo/db"
	"example/todo/models"
	"example/todo/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func signup(ctx *gin.Context) {
	db.InitDB()
	utils.EnableCors(ctx)

	var user models.User

	err := ctx.ShouldBindJSON(&user)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	err = user.SaveUser()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	token, err := utils.GenerateToken(user.Email, user.ID)

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Create user succesfully!",
		"token":   token,
	})
}

func signin(ctx *gin.Context) {
	var user *models.User

	err := ctx.ShouldBindJSON(&user)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	_, err = user.Login()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	token, err := utils.GenerateToken(user.Email, user.ID)

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	ctx.Set("userId", user.ID)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Login successfully",
		"user":    user,
		"token":   token,
	})
}

func getUserById(context *gin.Context) {
	param := context.Param("id")

	id, err := strconv.ParseInt(param, 10, 64)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	result, err := models.GetUserById(id)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}
	context.JSON(http.StatusOK, result)
}

func getUser(context *gin.Context) {

	token := context.Request.Header.Get("Authorization")

	userId, err := utils.VerifyToken(token)

	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	result, err := models.GetUser(userId)

	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"message": err.Error(),
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "Success get user",
		"user":    result,
	})

}
