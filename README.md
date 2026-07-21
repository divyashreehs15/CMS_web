# Prison Management System (Prison Desk)

A full-stack web application designed to streamline prison administration by providing a centralized platform for managing inmate records, legal information, health records, work assignments, wages, behavior, and family interactions. The system offers secure role-based access for jail staff and family members while maintaining data integrity and security through JWT authentication and PostgreSQL.

---

## 📌 Project Overview

The Prison Management System (CMS) is a web-based application developed to digitize prison administration and replace manual record-keeping with a secure, scalable, and efficient system.

The application enables jail authorities to maintain comprehensive inmate records, monitor prisoner activities, update legal and medical information, manage work assignments, and process family visit requests. Family members can securely access authorized prisoner information without requiring direct interaction with prison staff.

The system follows a modern client-server architecture with a **Next.js frontend**, **Node.js/Express backend**, and **PostgreSQL database**.

---

## ✨ Features

### 👮 Jailer Module

- Secure Login & Authentication
- Add, Update, and Delete Prisoner Records
- Manage Health Records
- Manage Legal Information
- Assign Prison Work
- Track Prisoner Wages
- Record Prisoner Behaviour
- Manage Family Visit Requests
- View Complete Prisoner Profiles

### 👨‍👩‍👧 Family Member Module

- Secure Login
- View Prisoner Information
- Access Health Updates
- Check Legal Status
- View Work Assignments
- Track Visit Requests

---

## 🏗️ System Architecture

```
                Browser
                    │
                    ▼
          Next.js Frontend (React)
                    │
           Axios HTTP Requests
                    │
         JWT Authentication Token
                    │
                    ▼
          Express REST API Server
                    │
                    ▼
          PostgreSQL Relational Database
```

The frontend communicates with the backend using REST APIs. Authentication is managed using JSON Web Tokens (JWT), while PostgreSQL stores all application data securely.

---

## 🛠️ Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Radix UI (shadcn/ui)
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- PostgreSQL
- pg
- bcryptjs
- JSON Web Tokens (JWT)

---

## 📂 Project Structure

```
CMS_web/
│
├── backend/
│   ├── package.json
│   └── src/
│       ├── db/
│       │   ├── db.js
│       │   ├── init.js
│       │   └── schema.sql
│       ├── middleware/
│       │   └── auth.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── prisoners.js
│       │   ├── health.js
│       │   ├── legal.js
│       │   ├── work.js
│       │   ├── wages.js
│       │   ├── behavior.js
│       │   ├── visits.js
│       │   └── family.js
│       └── index.js
│
└── frontend/
    ├── package.json
    ├── next.config.ts
    └── src/
        ├── app/
        ├── components/
        ├── contexts/
        ├── services/
        └── lib/
```

---

## 🔐 Authentication

The application uses **JWT-based authentication**.

### Authentication Flow

1. User logs in using valid credentials.
2. Backend verifies the credentials.
3. A JWT token is generated.
4. The frontend stores the token in Local Storage.
5. Every protected API request includes the JWT in the Authorization header.
6. Backend middleware validates the token before granting access.

Passwords are securely hashed using **bcryptjs** before being stored in the database.

---

## 🗄️ Database Design

The application follows a relational database model.

### Main Table

- prisoners

### Related Tables

- health_records
- legal_info
- work_assignments
- wages
- behavior_records
- visit_requests
- family_members

Each table references **prisoner_id** using PostgreSQL foreign keys, ensuring referential integrity between records.

---

## 🔄 Application Workflow

### Jailer Workflow

```
Login
   │
   ▼
Dashboard
   │
   ▼
Manage Prisoners
   │
   ├── Health Records
   ├── Legal Information
   ├── Behaviour Records
   ├── Work Assignments
   ├── Wage Management
   └── Visit Requests
```

### Family Member Workflow

```
Login
   │
   ▼
Dashboard
   │
   ▼
View Prisoner Information
   │
   ├── Health Updates
   ├── Legal Status
   ├── Work Details
   └── Visit Information
```

---

## 🚀 REST API Modules

| Module | Endpoint |
|---------|----------|
| Authentication | `/api/auth` |
| Prisoners | `/api/prisoners` |
| Health | `/api/health` |
| Legal | `/api/legal` |
| Behaviour | `/api/behavior` |
| Work | `/api/work` |
| Wages | `/api/wages` |
| Family | `/api/family` |
| Visits | `/api/visits` |

---

## ⚙️ Key Implementation Details

### PostgreSQL Transactions

The backend uses PostgreSQL transaction blocks:

- BEGIN
- COMMIT
- ROLLBACK

This ensures that updates involving multiple related tables either complete successfully or are rolled back completely in case of errors.

### Data Integrity

- PostgreSQL Foreign Keys
- Relational Database Design
- Transaction Management
- Input Validation

The backend also includes helper utilities such as `fixArrayField()` to convert incoming string values into PostgreSQL array formats when required.

### API Routing

The frontend uses **Next.js rewrites** to proxy API requests to the backend server.

Example:

```
Frontend
http://localhost:3000/api/prisoners

↓

Backend
http://localhost:3001/api/prisoners
```

---

## 💻 Installation

### Clone Repository

```bash
git clone https://github.com/divyashreehs15/CMS_web.git

cd CMS_web
```

### Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=3001
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

Initialize the database:

```bash
node src/db/init.js
```

Run the backend:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Open:

```
http://localhost:3000
```

---

## 📊 Technologies Used

| Layer | Technologies |
|------|--------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, Axios, Recharts |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JWT, bcryptjs |
| UI Components | Radix UI, Lucide React |

---

## 🔒 Security Features

- JWT Authentication
- Password Hashing using bcryptjs
- Protected REST APIs
- Role-Based Access Control
- PostgreSQL Foreign Key Constraints
- Transaction-Based Database Updates

---

## 📈 Future Enhancements

- Advanced Search & Filtering
- Role-Based Authorization
- Medical Document Uploads
- Legal Document Management
- Dashboard Analytics
- Audit Logs
- Prison Capacity Monitoring
- Email Notifications
- SMS Alerts
- QR Code-Based Visitor Verification

---

## 👩‍💻 Author

**Divya Shree**

Computer Science Engineering Student

---

## 📄 License

This project was developed for educational and academic purposes.
