Build Full-ECommerce Website By Next.js 15 & MongoDB
	
Framework	    : Next.js 15, React 18

UI	            : Tailwind, Shadcn, Recharts

Database	    : MongoDB, Mongoose

Payment	        : PayPal, Stripe

Deployment	    : Github, Vercel

Authentication	: Auth.js, Google Auth, Magic Link

Others	        : uploadthing, resend, zod, etc

Run Locally
1. Clone repo
    $ git clone https://github.com/QuangDev94/ecommerce-vn.git
    $ cd nextjs-amazona
2. Create Env File
    duplicate .example-env and rename it to .env.local
3. Setup MongoDB
    Cloud MongoDB
        Create database at https://mongodb.com/
        In .env.local file update MONGODB_URI to db url
    OR Local MongoDB
        Install it from https://www.MongoDB.org/download
        In .env.local file update MONGODB_URI to db url
4. Seed Data
    npm run seed
5. Install and Run
    npm install --legacy-peer-deps
    npm run dev
6. Admin Login
    Open http://localhost:3000
    Click Sign In button
    Enter admin email "admin@example.com" and password "123456" and click Sign In
