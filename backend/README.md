#Speed Share – Backend

Backend of the Speed Share project, an API responsible for authentication, authorization, and data management for temporary and secure document storage.

## Features

- User registration and login
- Authentication using JWT (JSON Web Token)
- Password hashing with BCrypt
- SQLite database
- Automatic database creation on startup
- CORS configuration for frontend integration
- Ready for protected routes with authorization

## Technologies

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQLite
- JWT Authentication
- BCrypt.Net
- DotNetEnv

## Requirements

- .NET SDK 10.0 or higher
- SQLite (embedded)

## Environment Variables

Create a .env file in the root of the backend project:
```env
JWT_KEY=your_super_secret_key_min_32_chars
```
An example file is provided as .env.example.

## Installation

Restore dependencies:
```bash
dotnet restore
```

## Running the Project
```bash
dotnet run
```

The API will be available at:

```
https://localhost:5116
```

## API Endpoints

### Auth

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | /api/auth/register    | Create a new user                    |
| POST   | /api/auth/login       | Authenticate user and return JWT     |
## Database

Uses SQLite

Database and tables are created automatically at startup using EnsureCreated

No migrations required for initial development

## Project Structure

```
backend/
├── Controllers/     # API controllers
├── Data/            # Database context
├── Models/          # Entities and DTOs
├── Services/        # Business logic (TokenService, interfaces)
├── Program.cs       # Application entry point
├── appsettings.json # Configuration
└── .env             # Environment variables
```

Notes

This backend is designed to work together with the Speed Share Frontend.

JWT tokens can be used to protect routes with [Authorize].

Suitable for development and small to medium projects.