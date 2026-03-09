# Speed Share

This project was born out of a personal need I had for a simple and reliable document storage solution. After building it for myself, I realized it could be useful for others too, so I decided to open it up to help the community.

The idea is straightforward: a secure, transparent, and easy-to-use platform where you can upload, manage, and retrieve your documents without unnecessary complexity. 

### 💡 The "Storage for Everyone" Concept
This project introduces a social approach to digital storage:
- **Ads for Storage**: Don't have the means to pay? You can watch ads to gain storage (up to 8GB). It's a way to ensure everyone has access to secure document hosting.
- **Dynamic Pricing**: A PIX-based payment system for those who prefer a direct upgrade, with a focus on affordability.
- **Community Driven**: Features like gaining extra space by sharing or subscribing to help the project grow.

It is built as a full-stack application composed of a .NET backend and a React frontend.

## 🛠 Technologies

### Backend
- **.NET 10** (Preview)
- **C#**
- **SQLite** (Database)
- **Entity Framework Core** (ORM)
- **JWT** (Authentication)
- **BCrypt** (Password Hashing)

### Frontend
- **React**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Axios** (HTTP Client)
- **Lucide React** (Icons)

## 🚀 Features

- **Authentication**: User registration and login with JWT support.
- **Responsive UI**: Modern interface built with Tailwind CSS.
- **Storage Upgrades**: Frontend implementation for upgrading storage via PIX or by watching Ads.
- **Routing**: Navigation setup for Home, Login, Register, and informational pages.

## 📋 Kanban Status

### ✅ Done
- [x] Initial Project Setup (Backend & Frontend)
- [x] Database Configuration (SQLite)
- [x] Authentication System (Register/Login endpoint)
- [x] Basic Frontend Routing
- [x] UI Components (Home, Forms, Modals)
- [x] Storage Upgrade UI (Ads and PIX integration layouts)
- [x] File Upload & Download Logic (Frontend components exist, Backend controller missing)

### 🚧 In Progress
- [ ] File Storage Service Implementation (Local/Cloud)
- [ ] Ad-Reward Integration (Connect frontend ad logic to backend storage limits)

### 📝 To Do
- [ ] Create `FileController` in Backend
- [ ] Implement actual file storage (Local/Cloud)
- [ ] User Dashboard to view stored files
- [ ] Integration with a Real Payment Gateway for PIX
- [ ] Real Ad Provider integration (currently simulated)

## 🏃‍♂️ Running the Application

### 🐳 With Docker (Recommended)

To run the entire stack (Frontend + Backend) using Docker Compose:

1. Ensure you have Docker and Docker Compose installed.
2. Run the following command in the root directory:

   ```bash
   docker-compose up --build
   ```

3. Access the services:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5116](http://localhost:5116)

The database will be persisted in a `./docker_data` folder in the root directory.

### 💻 Development (Manual)

To run the services individually for development:

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file based on `.env.example` and set your `JWT_KEY`.
3. Run the application:
   ```bash
   dotnet run
   ```
   The backend will start on port **5116**.

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on port **5173** and is configured to proxy requests to the backend on port 5116.