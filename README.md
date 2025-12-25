LocalChefBazaar
LocalChefBazaar — A Marketplace for Local Home-Cooked Meals
Project Purpose
LocalChefBazaar is a full-stack online platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that connects passionate home cooks (chefs) with customers seeking fresh, authentic, homemade meals.

For Customers: Browse daily menus, view chef details, place orders, track deliveries in real-time, leave reviews, and make secure payments.
For Chefs: Upload menus, manage food items, handle incoming orders, and earn income from their cooking.
For Admins: Oversee users, approve role requests (chef/admin), manage platform data, mark fraudulent users, and view analytics.

The platform emphasizes role-based access control, secure authentication, real-time updates, and a pleasant, responsive user experience.
Live URL
https://localchefbazaar.netlify.app

Key Features
Public Features

Animated hero banner with Framer Motion
Dynamic daily meals section (6 cards on homepage)
Meals page with sorting (price asc/desc) and pagination (10 items per page)
Meal details page with reviews, rating, ingredients, and favorite functionality
Customer reviews section
Responsive design (mobile-first)

Authentication (Firebase)

Email/password registration and login
Profile image upload or direct link
Protected routes (redirect to login if unauthenticated)
Persistent login on page reload (no redirect on private routes)

Customer Features

Browse and search meals
Add meals to favorites
Place orders with quantity selection and address input
View order history
Submit, update, and delete reviews
Stripe payment integration (pay only after chef accepts order)

Chef Features

Create, update, and delete meals (with image upload)
View and manage order requests (Cancel / Accept / Deliver)
Real-time order status updates visible to both chef and customer

Admin Features

Manage users (view table, mark as fraud)
Manage role requests (chef/admin) – approve/reject with unique Chef ID generation
Platform statistics dashboard with Recharts (total payments, users, pending/delivered orders)

Additional Features

JWT-based protected API routes
react-hook-form for all forms with validation
Dynamic page titles on every route
Global loading spinner and error page
Toast/SweetAlert notifications for actions
Environment variables for Firebase and MongoDB credentials

Technologies & Stack

Frontend: React.js, React Router DOM, Tailwind CSS 
Backend: Node.js, Express.js
Database: MongoDB (with Mongoose)
Authentication: Firebase Authentication + JWT for API security
Payments: Stripe
Animations: Framer Motion
Charts: Recharts
Form Handling: react-hook-form
HTTP Client: Axios (with interceptors optional)
Deployment: Client – Netlify/Vercel, Server – Render/Railway

NPM Packages Used
Client Side (client/package.json)

react, react-dom
react-router
firebase
axios
gsap
framer-motion
recharts
react-hook-form
sweetalert2 (or react-toastify)
@stripe/stripe-js, @stripe/react-stripe-js
jwt-decode
Tailwind/
Frontend**: React.js 19, React Router DOM, Tailwind CSS (assumed/custom styling)

- **Animations**: Framer Motion, AOS, GSAP
- **Icons**: lucide-react
- **Charts**: Recharts
- **Form Handling**: react-hook-form
- **Notifications**: react-hot-toast, SweetAlert2
- **Data Fetching**: TanStack React Query
- **Loading**: react-loading-skeleton, react-spinners
- **Deployment**: Client – Netlify, Server – Vercel

Server Side (server/package.json)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (native driver)
- **Authentication**: Firebase Authentication + JWT for API security + Firebase Admin SDK
- **Payments**: Stripe

express
mongoose
cors
dotenv
jsonwebtoken
bcryptjs (if password hashing on backend)
stripe
cookie-parser (for httpOnly JWT cookies)
nodemon (dev dependency)

Installation & Setup
Prerequisites

Node.js (v16 or higher)
MongoDB Atlas account
Firebase project
Stripe account

Client Setup
Bashcd client
npm install
npm start
Server Setup
Bashcd server
npm install
npm run dev    # or npm start
Create .env files in both folders with required keys (Firebase config, MongoDB URI, JWT secret, Stripe keys).
Folder Structure Overview
textLocalChefBazaar/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/ (if used)
│   │   └── ...
│   └── public/
└── server/              # Express backend
    ├── routes/
    ├── controllers/
    ├── models/
    └── index.js
Submission Details (For Evaluator)

Admin Credentials
Email: admin@localchefbazaar.com
Password: Admin123!
GitHub Repositories
Client: https://github.com/yourusername/localchefbazaar-client
Server: https://github.com/yourusername/localchefbazaar-server

Thank you for reviewing the project! 🚀
