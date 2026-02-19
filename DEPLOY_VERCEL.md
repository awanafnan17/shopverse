# ☁️ ShopVerse — Zero-Cost Deployment Guide (Vercel)

Since Render requires a credit card, we will use **Vercel**. It is **Free forever**, faster, and **requires NO credit card**.

---

## Step 1: Create a GitHub Repository (If not already done)
1.  Go to [github.com/new](https://github.com/new).
2.  Name: `shopverse`
3.  Click **Create repository**.
4.  Run these commands in your VS Code terminal to push your code:

```bash
# Initialize Repo (if you haven't)
git init
git add .
git commit -m "Ready for Vercel"

# Connect to GitHub (Replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/shopverse.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy on Vercel
1.  Go to [vercel.com](https://vercel.com/) and Sign Up with **GitHub**.
2.  Click **"Add New..."** → **"Project"**.
3.  Import the `shopverse` repository.
4.  **Configure Project:**
    *   **Framework Preset:** Select `Create React App` or `Vite` (it usually auto-detects).
    *   **Root Directory:** Leave as `./` (Root).
5.  **Environment Variables:** (Expand the section)
    *   Add `MONGO_URI` = `mongodb+srv://...` (Your Atlas String)
    *   Add `JWT_SECRET` = `any_secret_key`
6.  Click **Deploy**.

---

## Step 3: MongoDB Atlas (Still Required)
You still need a permanent database.
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a FREE cluster.
3.  Get the Connection String and add it to Vercel Environment Variables.

**That's it! Your site will be online at something like `shopverse.vercel.app`.** 🚀
