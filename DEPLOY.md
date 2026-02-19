# ☁️ ShopVerse — Cloud Deployment Guide

Follow these 3 simple steps to put your website online permanently.

---

## Step 1: Create a GitHub Repository
1.  Go to [github.com/new](https://github.com/new) and sign in.
2.  Repository Name: `shopverse`
3.  Visibility: **Public** or **Private** (doesn't matter).
4.  Click **Create repository**.

---

## Step 2: Push Your Code
Copy the **URL** of your new repository (it looks like `https://github.com/your-username/shopverse.git`).

Then, run these commands in your VS Code terminal:

```bash
# Replace URL with YOUR repository link
git remote add origin https://github.com/YOUR-USERNAME/shopverse.git

# Push the code to GitHub
git branch -M main
git push -u origin main
```

*(If it asks for a password, use a Personal Access Token or sign in via browser).*

---

## Step 3: Deploy on Render (The Magic Part) 🚀
I have already created a **Deployment Blueprint** (`render.yaml`) for you. This makes deployment automatic.

1.  Go to [dashboard.render.com](https://dashboard.render.com/) and sign up/login.
2.  Click **New +** button → Select **Blueprints**.
3.  Connect your **GitHub** account and select the `shopverse` repository you just created.
4.  Give it a name like `shopverse-live`.
5.  Click **Apply**.

Render will now:
*   Build the Frontend.
*   Build the Backend.
*   Start the Server.
*   **Give you a permanent URL (like `https://shopverse.onrender.com`).**

---

## Step 4: Add Permanent Database (MongoDB Atlas)
Your site is now online, but data will disappear on restart until you do this:

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a Free Cluster.
3.  Click **Connect** → **Drivers** → Copy the **Connection String**.
4.  Go to your Render Dashboard → **Environment** settings.
5.  Add a generic environment variable:
    *   **Key:** `MONGO_URI`
    *   **Value:** `mongodb+srv://...` (your string)

**Done! Your full-stack E-Commerce app is live 24/7.** 🎉
