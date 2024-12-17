
<div align="center">
  <h1>Comprehensive Project Overview</h1>
</div>

---

# Kidz Bazar E-commerce
 
## Introduction

## Project Overview
Kidz Bazar E-commerce is an e-commerce platform designed for a seamless shopping experience for kids' products. The platform allows users to browse a variety of products, manage their shopping cart, and make secure payments. It provides a dynamic, user-friendly interface built with modern technologies for a smooth and engaging experience.

The Kidz Bazar E-commerce project leverages Next.js for a fast and scalable frontend, Express for a flexible backend, Prisma for database management, and PostgreSQL for a reliable database solution. Key features include product listings, a shopping cart system, user authentication, and secure payment processing.
## Features
- User Authentication: Secure login and registration using JWT-based authentication.
- Product Listings: Browse products categorized by type, age, and more.
- Product Details: Detailed product pages with images, descriptions, pricing, and availability.
- Shopping Cart: Add products to the cart, update quantities, and proceed to checkout.
- Payment Integration: Secure payment processing through integrated gateways.
- User Profiles: Users can manage their profiles and view past orders.
- Admin Dashboard: Admins can add, update, and manage products, and view order history.

## Technology Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Express, Node.js
- Database: PostgreSQL, Prisma ORM
- Authentication: JWT, bcrypt for secure user authentication
- Payment Integration: Aamarpay or Stripe for payment processing
- Hosting: Vercel for frontend hosting, Vercel & superbase for backend

## Installation Guideline

Instructions on how to install, configure, and get the project running locally.

### Prerequisites

- Node.js (v14 or higher)
- npm, yarn, or bun (package managers)
- PostgreSQL (local or cloud instance)

### Installation Steps

1. Clone the repository:

- Frontend git clone
```bash
git clone https://github.com/ashiqee/e-frontend-assignment-09
cd e-frontend-assignment-09
```
- Backend git clone
```bash
git https://github.com/ashiqee/e-backend-assignment-09
cd e-backend-assignment-09
```
2. Install dependencies:
```bash
npm install
# or
yarn install

```


### Configuration

1. Create a `.env` file in the root directory of the project.
2. Add necessary configuration variables in the `.env` file.
   Example:
   ```bash
    NODE_ENV = development
    PORT=5000
    DATABASE_URL = 
    BCRYPT_SALT_ROUNDS=12
    DEFAULT_PASSWORD=

    JWT_ACCESS_SECRET =
    JWT_ACCESS_EXPIRES_IN=10d
    JWT_REFRESH_SECRET =
    JWT_REFRESH_EXPIRES_IN=365d

    STORE_ID = ""
    SIGNETURE_KEY = ""
    PAYMENT_URL="https://sandbox.aamarpay.com/jsonpost.php"
    PAYMENT_VERIFY_URL="https://sandbox.aamarpay.com/api/v1/trxcheck/request.php"
   ```


## L2Batch-3-assignment-9
#### Submission : (Please check my submissions:)


- Frontend Live Link: [Live Website](https://kidzbazar.vercel.app/)
- Backend Live Link: [Backend Link](https://kidzabazar-backend.vercel.app/)
- GitHub Repository URL (Frontend): https://github.com/ashiqee/e-frontend-assignment-09
- GitHub Repository URL (Backend): https://github.com/ashiqee/e-backend-assignment-09


- Admin Role
```bash
useremail: admin@gmail.com  
password: 123456
```
- Vendor Role
```bash
useremail: vendor@gmail.com  
password: 123456
```
- Customer Role
```bash
useremail: customer@gmail.com  
password: 123456
```
