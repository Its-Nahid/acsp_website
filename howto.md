# ACSP Deployment Guide: Vercel + MongoDB Atlas

This guide explains how to deploy the **Animal Care Service Platform (ACSP)** to the web so it's accessible to anyone (including your university professors) as a live website.

## 1. Move Database to MongoDB Atlas (Cloud)

Since Vercel cannot connect to your local computer (MongoDB Compass), you must move your database to the cloud using **MongoDB Atlas**.

1.  **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2.  **Onboarding ("Getting to know your project")**:
    - **Goal**: Select "Build a new application" or "Learning".
    - **Type of App**: Select "Web Application".
    - **Language**: Select "JavaScript / Node.js".
    - **Data Types**: Select **"Customer / user profile data"**, **"Sales / transactions"** (for donations), and **"Catalog / inventory"** (for animal listings).
    - **Architecture**: Select "Traditional (e.g. monolith, microservices)" (since you are using Express).
    - **Primary Goal**: Select "Build a prototype" or "Learning".
3.  **Create a Cluster**:
    - Choose the "FREE" tier (M0).
    - **Cloud Provider**: Select **AWS** (it usually has the most free regions available).
    - **Region**: Select **Mumbai (ap-south-1)** or **Singapore (ap-southeast-1)** for the best speed in Bangladesh.
    - **Cluster Name**: You can name it **`ACSP-Cluster`** or just leave it as the default `Cluster0`.
4.  **Database Access**: Create a database user with a **Username** and **Password**. Write these down!
5.  **Network Access**: Click "Network Access" and select **"Allow Access from Anywhere"** (0.0.0.0/0). This is required for Vercel.
6.  **Get Connection String**:
    - Click "Database" -> "Connect" -> "Drivers".
    - Copy the connection string (looks like `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`).
    - Replace `<password>` with your actual password.
7.  **Import Data (Optional)**: You can use MongoDB Compass to connect to this new Atlas URL and copy your local data there.

---

## 2. Prepare the Project for Vercel

Vercel needs a `vercel.json` file in the **root directory** to understand how to run your Express backend.

### Create `vercel.json` in the root:

Create a file named `vercel.json` in your project's main folder with this content:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "Backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "Frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/uploads/(.*)",
      "dest": "Backend/uploads/$1"
    },
    {
      "src": "/(signup|login|report|api|adoptions|ngo|volunteer|success|fail|cancel)(.*)",
      "dest": "Backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "Frontend/$1"
    }
  ]
}
```

---

## 3. Backend Code Adjustments

In `Backend/server.js`, Vercel doesn't "run" the server with `app.listen` in the same way. It treats it as a serverless function.

1.  **Export the app**: At the very bottom of `Backend/server.js`, add:
    ```javascript
    module.exports = app;
    ```
2.  **Conditional Listen**: Wrap your `app.listen` so it only runs locally:
    ```javascript
    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
    ```

---

## 4. Deploying to Vercel

1.  **Push to GitHub**: Upload your entire project to a private or public GitHub repository.
2.  **Connect to Vercel**:
    - Go to [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **"Add New"** -> **"Project"**.
    - Import your GitHub repository.
3.  **Environment Variables**:
    - Before clicking "Deploy", open the **Environment Variables** section.
    - Add the following keys from your `.env` file:
      - `MONGODB_URI`: (Your MongoDB Atlas string from Step 1)
      - `JWT_SECRET`: (Any random long string)
      - `GROQ_API_KEY`: (Your Groq API key)
      - `STORE_ID`: (SSLCommerz ID)
      - `STORE_PASSWORD`: (SSLCommerz Password)
      - `NODE_ENV`: `production`
4.  **Click Deploy!**

---

## 5. Important Notes

- **File Uploads**: Vercel's filesystem is **read-only** in production. This means photos uploaded via `multer` to the `uploads/` folder will NOT persist or show up after a few minutes.
  - **Fix**: For a university project, this is usually okay for a demo. But for a real site, you would need to use a service like **Cloudinary** or **AWS S3** to store images.
- **API URL**: In your Frontend JS files (like `script.js`), make sure your fetch calls use relative paths (e.g., `/signup` instead of `http://localhost:5000/signup`) so they work on the live site.

### Troubleshooting

If the site shows an "Internal Server Error", check the **Logs** tab in your Vercel project dashboard to see exactly what went wrong.
