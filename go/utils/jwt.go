package utils

import (
	"errors"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const secretKey = "secret"

func GenerateToken(email string, userId int64) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":  email,
		"userId": userId,
		"exp":    time.Now().Add(time.Hour * 2).Unix(),
	})

	return token.SignedString([]byte(secretKey))
}

func VerifyToken(token string) (int64, error) {
	parsedToken, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		_, oke := t.Method.(*jwt.SigningMethodHMAC)

		if !oke {
			return nil, errors.New("unexpected signin method")
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		return 0, errors.New(err.Error())
	}

	tokenIsValid :=
		parsedToken.Valid

	if !tokenIsValid {
		return 0, errors.New("invalid token")
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)

	if !ok {
		return 0, errors.New("invalid token claims")
	}

	log.Println("EXPIRED: ", claims["exp"])

	userId := int64(claims["userId"].(float64))

	return userId, nil
}

func EnableCors(ctx *gin.Context) {
	ctx.Writer.Header().Set("Access-Control-Allow-Origin", "no-cors")
	ctx.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	ctx.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	ctx.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
}
