# AgriConnect: Kenyan Farm-to-Buyer Web Application

AgriConnect is a full-stack web application designed to connect smallholder farmers directly with buyers across Kenya. By eliminating unnecessary intermediaries, the platform streamlines agricultural logistics, provides transparent wholesale and retail pricing, and enhances market access for local producers.

---

## Key Features & Modules

* **User Authentication & Security:** Secure registration and login workflows supporting role-based access for Farmers, Buyers, and Administrators, integrated with a password recovery mechanism and secure password hashing.
* **Produce Catalogue & Discovery:** Interactive product listings featuring category filters, search capabilities, real-time inventory tracking, and produce approval workflows.
* **Shopping Cart & Checkout:** Dynamic cart management with real-time subtotal and logistics fee calculations, order summary generation, and order placement handling.
* **Dashboard Analytics & Backend Metrics:** RESTful API endpoints providing analytical metrics such as verified farmer counts, produce status tracking, and order updates.
* **Support & Feedback:** Integrated contact messaging system for user inquiries and customer support.

---

## Tech Stack & Architecture

* **Frontend:** HTML5, Tailwind CSS, JavaScript (Vanilla DOM architecture)
* **Backend Framework:** Node.js, Express.js
* **Database Management:** MySQL / MariaDB (managed via XAMPP)
* **Security & Authentication:** Password hashing using `bcrypt` / Node.js `crypto` (PBKDF2), and parameterized SQL queries to safeguard against SQL Injection (SQLi).

---

## Environment Variables

Create a `.env` file in the root directory of your project folder with the following configuration:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=agriconnect_db
```

---

## Setup & Installation Instructions

### Prerequisites

Ensure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (v16.x or higher)
* [XAMPP Control Panel](https://www.apachefriends.org/) (for Apache and MySQL services)
* Git

### Step 1: Clone the Repository

Open your terminal or command prompt and clone the project repository:

```bash
git clone https://github.com/your-username/AgriConnect.git
cd AgriConnect
```

### Step 2: Install Project Dependencies

Install all required Node.js backend packages:

```bash
npm install
```

### Step 3: Configure Database

1. Open the **XAMPP Control Panel** and start both **Apache** and **MySQL** services.
2. Navigate to phpMyAdmin in your web browser (`http://localhost/phpmyadmin/`).
3. Create a new database named `agriconnect_db`.
4. Import the schema script located at `server/models/schema.sql` into `agriconnect_db`.

### Step 4: Launch the Server

Start the Node.js / Express backend server:

```bash
npm run dev
# or
node server/server.js
```

### Step 5: Access the Application

Open your browser and navigate to:

```text
http://localhost:3000
```

---

## Maintenance Schedule

| Maintenance Category | Task Description | Frequency | Responsible Role |
| :--- | :--- | :--- | :--- |
| **Database Backups** | Export full SQL dump of `agriconnect_db` to encrypted remote storage. | Weekly | Database Administrator |
| **Disaster Recovery** | Perform backup restoration tests on a local staging environment. | Monthly | Lead Systems Analyst |
| **Dependency Audits** | Execute `npm audit` checks and update vulnerable package dependencies. | Bi-Weekly | Software Developer |
| **Security Audits** | Review user authentication logs and test input validation defenses. | Monthly | Security Engineer |
| **Health Monitoring** | Continuously monitor server uptime, API endpoint response times, and error logs. | Continuous | System Administrator |

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.