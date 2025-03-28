# Collections Management Test Project

This project is a test assignment for evaluating your skills in building a collections management system using Next.js, TypeScript, Prisma, and Tailwind CSS.

## Project Overview

The application allows users to create and manage product collections. All new collections must go through a review process before being published to the main collections list.

## Technical Stack

- Next.js 15.1.2
- TypeScript 5.7.2
- Prisma 6.2.1
- Tailwind CSS 3.4.17
- Sonner 1.7.1 (for toast notifications)
- Next-Auth 5.0.0-beta.25
- Zod (for form validation)
- React Hook Form

## Getting Started

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

> **Note:** The database is already set up with the schema and sample data. The `.env` file with the database connection URL is already provided. You can start working on the project right away after installing dependencies.

> **Important:** You will need to generate fake products using Faker.js to populate your database. You are allowed to modify the database schema and structure however you choose, as long as you are able to complete the core functionality: assigning products to collections, creating and managing collections, and ensuring all new collections go through the review process.

> **Note:** Faker.js is not included in the project dependencies. You'll need to install it:
> ```bash
> npm install @faker-js/faker --save-dev
> ```

## Assignment Requirements

Your task is to complete the collections management system with the following features:

### 1. Collections Creation

- Create a form to submit new collections
- Allow selection of products from the catalog
- Upload images for collection thumbnails and banners
- Submit collections for review

### 2. Collections Review

- Display collections pending review
- Allow administrators to approve or reject collections
- Provide feedback for rejected collections
- Move approved collections to the main collections list

### 3. Collections Management

- View and filter collections
- Edit existing collections
- Delete collections
- Reorder products within collections

### 4. Product Selection

- Browse and search products
- Select multiple products for a collection
- Reorder selected products

## Implementation Guidelines

- Use server actions for data mutations
- Implement proper form validation with Zod
- Use Suspense boundaries for loading states
- Ensure the UI is responsive and user-friendly
- Add toast notifications for user feedback
- Follow TypeScript best practices
- Write clean, maintainable code with comments
- Feel free to modify the database schema as needed to achieve the requirements
- Generate realistic product data using Faker.js

## Evaluation Criteria

Your submission will be evaluated based on:

1. Functionality - Does it work as expected?
2. Code quality - Is the code clean, organized, and maintainable?
3. UI/UX - Is the interface intuitive and responsive?
4. Error handling - Are errors properly handled and communicated to the user?
5. Performance - Is the application optimized for performance?

## Submission

When you've completed the assignment, please:

1. Email Deepak (deepak@materialzz.com) with your GitHub repository URL
2. Provide a README with instructions on how to run the application
3. Include any notes or explanations about your implementation decisions

Good luck!
#   C o l l e c t i o n - M a n a g e m e n t  
 #   C o l l e c t i o n - T e s t  
 