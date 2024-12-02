# Student Digital ID System

A modern digital identification system for students using QR codes with time-sensitive validation. The system consists of a Node.js/Express backend API and a Streamlit frontend interface.

## Features

- **Digital ID Generation**: Generate secure, time-sensitive QR codes for student identification
- **Real-time Validation**: Validate QR codes with expiration checks
- **User Management**: Complete CRUD operations for student records
- **Secure Storage**: Encrypted QR signatures and secure data handling
- **Modern UI**: Clean and intuitive Streamlit interface

## Tech Stack

### Backend
- Node.js/Express
- PostgreSQL with Prisma ORM
- QR Code generation and encryption
- RESTful API design

### Frontend
- Streamlit (Python)
- Modern UI components
- Real-time QR code display

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sic_apps
```

2. Install backend dependencies:
```bash
cd microservices
npm install
```

3. Install frontend dependencies:
```bash
cd ../ui
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the microservices directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
ENCRYPTION_KEY="your-32-character-secret-key-here"
PORT=3000
```

5. Initialize the database:
```bash
cd microservices
npx prisma migrate dev
npx prisma db seed
```

### Running the Application

You can start both applications using the provided batch file:
```bash
./start-apps.bat
```

Or run them separately:

1. Backend:
```bash
cd microservices
npm start
```

2. Frontend:
```bash
cd ui
streamlit run app.py
```

## API Endpoints

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### QR Code Operations
- `GET /api/qr/generate/:userId` - Generate QR code for user
- `POST /api/qr/validate` - Validate QR code

## Security Features

- Time-sensitive QR codes (5-minute expiration)
- Encrypted QR signatures
- Secure data transmission
- Rate limiting on API endpoints

## Database Schema

### User
- `id` (UUID): Unique identifier
- `fullName`: Student's full name
- `email`: Unique email address
- `dateOfBirth`: Date of birth
- `studentNumber`: Unique student number
- `program`: Academic program
- `yearOfStudy`: Current year
- `qrSignature`: Latest QR code signature
- `qrTimestamp`: QR code generation time

### NIN (National ID)
- `id` (UUID): Unique identifier
- `ninNumber`: National ID number
- `registrationDate`: Registration date
- `registrationLocation`: Registration location
- `userId`: Reference to User

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
