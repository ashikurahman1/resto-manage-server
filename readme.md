# RestoManage API - Scalable Restaurant Backend

| Home Page | Admin Dashboard |
| :---: | :---: |
| ![Home Page](/Screenshots/home_page.png) | ![Admin Dashboard](/Screenshots/admin_dash.png) |

## Project Overview
The RestoManage Backend is a robust RESTful API built to handle the complex operations of a modern restaurant system. It manages authentication, menu inventory, and multi-stage order processing with a strong focus on data integrity and security.

## Key Features
- **Secure Authentication**: Implemented JWT (JSON Web Token) with Bearer token strategies and bcrypt password hashing.
- **RBAC (Role-Based Access Control)**: Middleware-driven security to strictly separate Admin and Member permissions.
- **Relational Database**: Optimized MySQL integration for managing complex relationships between Users, Categories, Foods, and Orders.
- **Order Lifecycle Management**: A multi-stage order system (Pending, Cooking, Completed, Cancelled) with robust error handling for schema mismatches.
- **Schema Resilience**: Robust numeric validation and data sanitation to prevent "Data Truncation" errors and ensure database stability.
- **CORS & Security**: Configured with secure CORS policies and environment-driven configurations.

## Tech Stack
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM/Driver**: [MySQL2/Promise](https://sidorares.github.io/node-mysql2/)
- **Auth**: [JWT](https://jwt.io/) & [BcryptJS](https://github.com/dcodeIO/bcrypt.js)
- **Validation/Utility**: [Dotenv](https://github.com/motdotla/dotenv)

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server

### Database Setup
1. Create a database named `restaurant_db`.
2. Ensure you have the `users`, `foods`, `orders`, and `order_items` tables initialized with the correct schema (including the `address`, `phone`, and `is_available` columns).

### Installation
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file and add:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_key
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=1234
   DB_NAME=restaurant_db
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints Summary

### Auth
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate & get token

### Foods
- `GET /api/foods` - Fetch all dishes
- `POST /api/foods` - (Admin) Create new dish
- `PUT /api/foods/:id` - (Admin) Update dish details
- `DELETE /api/foods/:id` - (Admin) Remove dish

### Orders
- `POST /api/orders` - Place new order
- `GET /api/orders/my-orders` - User order history
- `GET /api/orders` - (Admin) View all customer orders
- `PUT /api/orders/:id` - (Admin) Update order status

---

