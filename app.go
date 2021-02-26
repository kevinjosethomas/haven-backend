package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading environment variables")
	}

	app := fiber.New()

	database := initDatabase()
	defer database.Close()

	app.Listen(":3000")
}

func initDatabase() *pgxpool.Pool {

	connectionString := os.Getenv("DATABASE_CONNECTION_URL")

	database, err := pgxpool.Connect(context.Background(), connectionString)
	if err != nil {
		log.Fatal("Database connection creation failed\n", err)
	}

	return database

}
