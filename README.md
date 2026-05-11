# E-Commerce Project

This is a full-stack e-commerce project built with Node.js, Express, and SQLite. The project employs a structured **Controller-Route-Service (CRS)** or MVC architecture to separate concerns, making the backend modular, scalable, and easy to maintain.

## 🏗 Project Architecture

The architecture is designed to enforce separation of concerns, dividing the application into distinct layers:

### 1. Frontend (Client-Side)
- **HTML/CSS/JS**: Located in the root directory and corresponding folders (`css/`, `js/`, `images/`).
- Handles the User Interface, DOM manipulation, and dynamic API requests (using `fetch`).
- Responsibilities: Presenting the products, handling user interactions (login, register, add to cart), and sending data to the backend.

### 2. Backend (Server-Side)
The backend is located entirely within the `backend/` folder and serves as a RESTful API.
- **`server.js`**: The main entry point. It configures the Express application, sets up middleware (like CORS and JSON parsing), configures `.env` variables, and mounts the API routes.
- **`routes/`**: Acts as the traffic controller. It defines the API endpoints (e.g., `/api/products`, `/api/auth`) and maps incoming HTTP requests to the corresponding controller functions.
- **`controllers/`**: Extracts the HTTP request data (`req.body`, `req.params`) and passes it to the Service layer. It then sends the appropriate HTTP response (`res.status().json()`) based on the Service's outcome.
- **`services/`**: Contains the core **Business Logic**. This layer validates business rules (e.g., checking if a user already exists before registration) and orchestrates calls to the Repository layer.
- **`repositories/`**: The Data Access Layer. It is responsible for directly interacting with the database (SQLite). This layer abstracts away the SQL queries so the rest of the application doesn't need to know how data is stored or retrieved.
- **`config/`**: Contains configuration files, such as the database connection setup.
- **`data/`**: Stores the SQLite database file (`ecommerce.db`).

## 🔐 Environment Variables (`.env`)

To keep sensitive information (like JWT secrets and database paths) secure, this project uses the `dotenv` library.

**Setup Instructions:**
1. Copy the `.env.example` file to create a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and replace the placeholder values with your actual configuration.
3. The `.env` file is included in `.gitignore` to prevent sensitive credentials from being committed to version control.

## 🚀 Running the Project

1. Ensure Node.js is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   # or
   node backend/server.js
   ```
4. Open `index.html` in your browser (or use a local server like Live Server).

## 🛠 Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Bootstrap/Isotope (if applicable).
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens), bcrypt (Password Hashing)
