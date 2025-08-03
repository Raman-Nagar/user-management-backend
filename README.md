# 🛠️ User Management Backend (Node.js + Express)

This is the backend API for a full-featured **User Management System**, supporting:
- JWT Authentication (access + refresh tokens)
- Email verification
- Role-based access (admin/user)
- Profile management & avatar upload
- Password reset via email
---

## ⚙️ Tech Stack

- **Node.js** + **Express.js**
- **MySQL** with **Sequelize ORM**
- **JWT Auth** (access & refresh token flow)
- **Multer** (image upload)
- **Passport.js** with **Google OAuth2**
- **Nodemailer** (for email verification)
- **dotenv** for env configs

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Raman-Nagar/user-management-backend.git
cd user-management-backend
```

### 2. Install Dependencies

```bash
npm install
```
### 3. Set Environment Variables
# Server
PORT=5000

# MySQL Database
MYSQL_HOST= 
MYSQL_DB= 
MYSQL_USER= 
MYSQL_PASSWORD= 
MYSQL_PORT= 

# JWT
JWT_SECRET= 
JWT_REFRESH_SECRET= 
EMAIL_TOKEN_SECRET= 

# Email (e.g., Mailtrap or SMTP)
MAIL_SERVICE=gmail 
MAIL_PORT=465 
MAIL_USER=XYZ@gmail.com 
MAIL_PASS=your_mail_password 
MAIL_FROM=XYZ@gmail.com 

# Frontend (for links in emails)
FRONTEND_URL=http://localhost:5173

# Cloudinary (for image url)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=


### 4. Migrate DB & Seed (Optional)

```bash
npx sequelize init  
npx sequelize-cli db:migrate 
```
### 5. Start the Server

```bash
npm run dev
```
### 6. 🧰 API Endpoints
| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| POST   | /api/auth/register         | Register new user          |
| POST   | /api/auth/login            | Login and get tokens       |
| POST   | /api/auth/logout           | Logout and clear cookies   |
| GET    | /api/auth/verify-email     | Email verification         |
| POST   | /api/auth/refresh-token    | Refresh access token       |
| POST   | /api/auth/forgot-password  | Send Reset password link   |
| POST   | /api/auth/reset-password/:token | Reset your password   |
| GET    | /api/user/all              | Get All users              |
| GET    | /api/user/me               | Get current logged-in user |
| PUT    | /api/user/:id              | Update profile info        |
| POST   | /api/user/add              | Add new user               |
| PUT    | /api/user/:id              | Upload profile picture     |

---

