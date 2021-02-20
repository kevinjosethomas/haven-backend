package main

import "github.com/gofiber/fiber/v2"

func main() {
	app := fiber.New()

	app.Get("", func(ctx *fiber.Ctx) error {
		return ctx.SendString("Hello World!")
	})

	app.Listen(":3000")
}
