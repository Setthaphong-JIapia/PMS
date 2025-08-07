# PMS (Project Management System)

PMS (Project Management System) is a web-based application designed for university students and faculty to manage academic projects. It is built with Node.js, Express.js, and MySQL, and allows for secure user authentication, project creation, role assignment, progress tracking, and advisor-student communication.

## Features

- User roles: Admin, Student, Advisor
- User authentication with hashed passwords (bcrypt)
- Project creation, editing, and deletion
- Assign multiple students to a project
- Assign one advisor per project
- Role-based access control
- Search functionality for projects
- Dashboard for tracking project progress
- Mobile-responsive UI
- JWT-based session management

## Technologies Used

- Node.js + Express.js (Backend)
- MySQL (Database)
- EJS (Templating engine)
- bcrypt (Password hashing)
- JSON Web Token (Authentication)
- Tailwind CSS or Bootstrap (Frontend styling)
- dotenv (Environment variable management)

## Installation

1. Clone this repository  
   `git clone https://github.com/Setthaphong-JIapia/PMS.git`  
   `cd PMS`

2. Install dependencies  
   `npm install`

3. Create a `.env` file in the root directory and configure it:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=pms
   JWT_SECRET=your_jwt_secret
   PORT=3000
   
## Folder Structure

PMS/
├── controllers/        # Business logic
├── models/             # DB models & queries
├── routes/             # Route definitions
├── views/              # EJS views
├── public/             # Static files (CSS, JS)
├── middleware/         # Auth middleware
├── .env                # Environment variables
├── app.js              # Main server file
└── package.json

## Usage
 - Admins can view and manage all projects

 - Students can view and update their own project

 - Advisors can monitor assigned student projects

 - All users have individual dashboards
