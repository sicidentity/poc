# Express.js with Prisma CRUD API

A RESTful API built with Express.js and Prisma ORM, implementing CRUD operations for user management.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd microservices
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env` (if not already done)
- Update the DATABASE_URL in `.env` with your PostgreSQL credentials:
```
DATABASE_URL="postgresql://myuser:mypassword@127.0.0.1:5432/sic?schema=public"
PORT=3000
```

4. Initialize Prisma and generate the client:
```bash
npx prisma generate
npx prisma db push
```

## Project Structure

```
microservices/
├── src/
│   └── index.js          # Main application file
├── prisma/
│   └── schema.prisma     # Prisma schema
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Project dependencies
└── README.md           # Project documentation
```

## API Endpoints

### Users

| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| POST   | /users        | Create a new user   |
| GET    | /users        | Get all users       |
| GET    | /users/:id    | Get user by ID      |
| PUT    | /users/:id    | Update user by ID   |
| DELETE | /users/:id    | Delete user by ID   |

## API Usage Examples

### Create User
```bash
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","name":"Test User"}'
```

### Get All Users
```bash
curl http://localhost:3000/users
```

### Get User by ID
```bash
curl http://localhost:3000/users/1
```

### Update User
```bash
curl -X PUT http://localhost:3000/users/1 \
-H "Content-Type: application/json" \
-d '{"email":"updated@example.com","name":"Updated Name"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/users/1
```

## Running the Application

Start the server:
```bash
node src/index.js
```

The API will be available at `http://localhost:3000`

## Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Error Handling

The API includes basic error handling for common scenarios:
- Invalid request data
- Resource not found
- Database connection errors
- Duplicate email addresses

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
