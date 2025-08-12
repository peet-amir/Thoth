# Thoth LMS

Thoth is a modern Learning Management System built with Node.js, Express, and PostgreSQL. It provides a robust platform for creating, managing, and delivering online courses.

## Features

- User Authentication & Authorization
- Course Management
- Module-based Learning
- Progress Tracking
- Assessment System
- File Management
- User Analytics
- RESTful API

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (>= 14.0.0)
- PostgreSQL
- Redis (optional, for caching)
- AWS Account (for S3 storage)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/peet-amir/Thoth.git
   cd Thoth
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
thoth-lms/
├── src/
│   ├── api/                    # API routes and controllers
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── validators/
│   ├── config/                 # Configuration files
│   ├── db/                     # Database related files
│   │   ├── migrations/
│   │   ├── models/
│   │   └── seeds/
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   └── app.js                 # Main application file
├── tests/                     # Test files
└── docs/                      # Documentation
```

## API Documentation

API documentation is available at `/api-docs` when running the server.

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Peter Amir - peter.amir@integrant.com

Project Link: [https://github.com/peet-amir/Thoth](https://github.com/peet-amir/Thoth)