# 🚀 ShopVerse — Local Setup Guide

Follow these steps to set up and run the ShopVerse E-Commerce platform on your local machine. This guide is designed for beginners.

---

## 1. Prerequisites
Before you begin, make sure you have the following installed:

*   **Node.js (v18 or higher):** [Download from nodejs.org](https://nodejs.org/)
    *   *Check by running:* `node -v` in your terminal.
*   **VS Market/Code Editor:** [Download VS Code](https://code.visualstudio.com/)

---

## 2. Setting Up the Project

### Step 1: Install Dependencies
Open your terminal (Command Prompt, PowerShell, or VS Code Terminal) in the project root directory and run:

```bash
# This command will install dependencies for both the Backend and Frontend at once
npm run install-all
```

---

## 3. Configuration (Environment Variables)

The project comes with default configurations, but you should verify these files exist:

1.  **Backend Config (.env):** Go to the `server` folder. You should see a file named `.env`.
    *   `JWT_SECRET`: A secret key for security (already set).
    *   `STRIPE_SECRET_KEY`: Use `sk_test_placeholder` for testing.
2.  **Frontend Config (.env):** Go to the `client` folder. You should see a file named `.env`.
    *   `VITE_API_URL`: Set to `http://localhost:5000/api` for local development.

---

## 4. Running the Application

You can run both the Backend and Frontend with just one command from the **root directory**:

```bash
# Start both Backend and Frontend together
npm run dev
```

### What happens now?
*   **Backend:** Starts at [http://localhost:5000](http://localhost:5000)
*   **Frontend:** Starts at [http://localhost:5173](http://localhost:5173)
*   **Database:** If you don't have MongoDB installed, the system will automatically start a **"Memory MongoDB"**.
    *   *Note: In Memory DB means data is deleted when you turn off the server.*

---

## 5. Seed Data (Pre-filled Products)
On the first run, the system will automatically populate the database with:
*   5 Categories (Electronics, Clothing, etc.)
*   10 Sample Products
*   2 Test Accounts

### Test Credentials:
| Account Type | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@shopverse.com` | `admin123` |
| **Test User** | `user@shopverse.com` | `user123` |

---

## 6. Accessing the Platform
1.  Open your browser and go to: [http://localhost:5173](http://localhost:5173)
2.  Login with the credentials above to test the Admin Dashboard or place orders.

---

## Troubleshooting
*   **"npm is not recognized":** Install Node.js from the link in Step 1.
*   **Port 5000 or 5173 in use:** Close any other running terminal or restart your PC.
*   **Products not showing:** Refresh the page once the terminal says "Seeded Successfully".

---