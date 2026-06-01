// ============================================
// FILE: seed.js
// PURPOSE: Database seed script — creates sample data for testing.
//          Run once to populate database with users, blogs, and comments.
// HOW TO RUN: node seed.js (from backend folder)
// WARNING: This will DELETE all existing data and create fresh data.
// ============================================

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Blog = require('./models/Blog');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB Connected\n');

  // ============================================
  // STEP 0: Clear existing data
  // ============================================
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Blog.deleteMany({});
  console.log('Database cleared.\n');

  // ============================================
  // STEP 1: Create Users (plain text passwords)
  // ============================================
  console.log('Creating users...\n');

  const admin = await User.create({
    name: 'Ankita',
    email: 'admin@gmail.com',
    password: 'ankita',
    role: 'admin'
  });
  console.log('  Admin created: Ankita (admin@gmail.com / ankita)');

  const ayush = await User.create({
    name: 'Ayush',
    email: 'ayush@gmail.com',
    password: 'aayush',
    role: 'user'
  });
  console.log('  User created: Ayush (ayush@gmail.com / aayush)');

  const monika = await User.create({
    name: 'Monika',
    email: 'monika@gmail.com',
    password: 'monika',
    role: 'user'
  });
  console.log('  User created: Monika (monika@gmail.com / monika)');

  const ami = await User.create({
    name: 'Ami',
    email: 'ami@gmail.com',
    password: 'ami',
    role: 'user'
  });
  console.log('  User created: Ami (ami@gmail.com / ami)\n');

  // ============================================
  // STEP 2: Create 5 Student Blogs (all pending)
  // ============================================
  console.log('Creating blogs...\n');

  const blog1 = await Blog.create({
    title: 'Understanding React.js Components and Hooks — A Complete Beginner Guide',
    content: `React.js is the most popular JavaScript library for building user interfaces. Created by Facebook in 2013, React has changed the way developers build modern web applications. In this blog, we will learn about React components and Hooks in detail.

What is React.js?

React is a frontend JavaScript library used to build reusable UI components. Instead of building one giant HTML page, React lets you break your interface into small, independent pieces called components. Each component handles its own logic and rendering.

React uses a virtual DOM (Document Object Model) which makes it extremely fast. When state changes in your application, React creates a lightweight copy of the real DOM, compares it with the previous version, and only updates the parts that actually changed. This process is called reconciliation.

What are Components?

Components are the building blocks of any React application. Think of them as custom HTML elements that you create. There are two types of components:

1. Functional Components — Modern way using JavaScript functions
2. Class Components — Older way using ES6 classes (rarely used now)

Here is a simple functional component:

function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

You can use this component anywhere in your app like this:

<Welcome name="Ayush" />

Understanding JSX

JSX stands for JavaScript XML. It looks like HTML but it is actually JavaScript. JSX makes it easy to write UI code.

const element = <h1 className="title">Hello World</h1>;

Behind the scenes, JSX gets converted to React.createElement() calls. The className attribute is used instead of class because class is a reserved keyword in JavaScript.

What is useState Hook?

useState is a React Hook that lets you add state to functional components. State is data that can change over time — like form inputs, counters, or toggles.

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click Me
      </button>
    </div>
  );
}

Here, count is the state variable and setCount is the function to update it. useState(0) initializes the count to 0.

What is useEffect Hook?

useEffect lets you perform side effects in functional components. Side effects include data fetching, subscriptions, or manually changing the DOM.

import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user._id}>{user.name}</li>
      ))}
    </ul>
  );
}

The empty array [] at the end means this effect runs only once when the component mounts.

What is useRef Hook?

useRef returns a mutable ref object that persists across re-renders. It is commonly used to access DOM elements directly.

function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

Unlike useState, changing a ref does NOT cause a re-render.

Props vs State

Props are data passed from parent to child components. They are read-only — a child component cannot modify its props.

State is data managed within a component. It can be changed using setState or useState.

Props flow down. State lives inside. This is the fundamental data flow in React.

Key Takeaways

1. React components are reusable UI building blocks
2. useState manages dynamic data in components
3. useEffect handles side effects like API calls
4. JSX is JavaScript that looks like HTML
5. Props pass data down, state manages data inside

React is the foundation of modern web development. Master components and hooks, and you can build anything!`,
    author: ayush._id,
    status: 'pending'
  });
  console.log('Blog 1 created: React.js (by Ayush)');

  const blog2 = await Blog.create({
    title: 'Building REST APIs with Node.js and Express.js — From Zero to Hero',
    content: `Node.js and Express.js together form the backbone of modern backend development. If you want to build APIs, web servers, or full-stack applications, this combination is essential to learn.

What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows you to run JavaScript outside the browser — on your server, your computer, or anywhere.

Key features of Node.js:
- Single-threaded but non-blocking: Handles thousands of requests simultaneously
- NPM (Node Package Manager): Access to over 2 million packages
- Event-driven architecture: Perfect for real-time applications
- Cross-platform: Works on Windows, macOS, and Linux

What is Express.js?

Express.js is a minimal and flexible web framework for Node.js. It simplifies the process of building web servers and APIs.

Here is a basic Express server:

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

Understanding HTTP Methods

REST APIs use HTTP methods to define what action to perform:

GET — Retrieve data from the server
POST — Send new data to the server
PUT — Update existing data
DELETE — Remove data

Here is how to create a complete CRUD API:

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// POST create new user
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  users[index] = req.body;
  res.json(users[index]);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  users = users.filter(u => u.id !== req.params.id);
  res.json({ message: 'User deleted' });
});

Middleware — The Heart of Express

Middleware functions have access to the request, response, and next function. They can modify the request, send a response, or pass control to the next middleware.

// Built-in middleware to parse JSON
app.use(express.json());

// CORS middleware
const cors = require('cors');
app.use(cors());

// Custom logging middleware
app.use((req, res, next) => {
  console.log(req.method + ' ' + req.url);
  next();
});

Router — Organizing Your Routes

As your app grows, putting all routes in one file becomes messy. Express Router lets you organize routes into separate files:

const router = express.Router();
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
module.exports = router;

Error Handling

Always handle errors properly in your API:

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

Environment Variables

Never hardcode sensitive data like database URLs or API keys. Use environment variables:

PORT=5000
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=mysecretkey

Key Takeaways

1. Node.js runs JavaScript on the server
2. Express.js simplifies building web servers and APIs
3. REST APIs use GET, POST, PUT, DELETE methods
4. Middleware processes requests before they reach route handlers
5. Always use environment variables for sensitive data`,
    author: monika._id,
    status: 'pending'
  });
  console.log('Blog 2 created: Node.js & Express.js (by Monika)');

  const blog3 = await Blog.create({
    title: 'MongoDB and Mongoose — Complete Database Guide for MERN Stack',
    content: `Every application needs a database to store data. In the MERN stack, we use MongoDB as our database and Mongoose as the tool to interact with it.

What is MongoDB?

MongoDB is a NoSQL database that stores data in flexible, JSON-like documents called BSON. Unlike traditional SQL databases that use tables and rows, MongoDB uses collections and documents.

Why MongoDB for MERN Stack?

1. JSON-native: Data format matches JavaScript objects perfectly
2. Flexible schema: Easy to change data structure
3. Scalable: Handles millions of documents efficiently
4. Cloud-ready: MongoDB Atlas offers free cloud hosting
5. Mongoose ORM: Makes working with MongoDB extremely easy

What is Mongoose?

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema definitions, data validation, query building, and middleware.

Defining a Schema

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

Creating a Model

const User = mongoose.model('User', userSchema);

CRUD Operations with Mongoose

CREATE — Adding Documents

const user = await User.create({
  name: 'Ayush',
  email: 'ayush@example.com',
  password: 'hashedpassword123'
});

READ — Fetching Documents

const allUsers = await User.find();
const user = await User.findById(userId);
const user = await User.findOne({ email: 'ayush@example.com' });
const users = await User.find().sort({ createdAt: -1 });

UPDATE — Modifying Documents

const user = await User.findByIdAndUpdate(
  userId,
  { name: 'New Name' },
  { new: true }
);

DELETE — Removing Documents

await User.findByIdAndDelete(userId);

Query Operators

await Blog.find({ views: { $gt: 100 } });
await Blog.find({ status: { $in: ['pending', 'approved'] } });
await User.find({ name: { $regex: 'ay', $options: 'i' } });

Relationships with References

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const blog = await Blog.findById(blogId).populate('author');

Connecting to MongoDB

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Connection Error:', err));

Key Takeaways

1. MongoDB stores data as JSON-like documents
2. Mongoose provides schema, validation, and query methods
3. CRUD operations: create, find, findByIdAndUpdate, findByIdAndDelete
4. Use populate() to reference documents from other collections
5. Always add validation to your schemas`,
    author: ami._id,
    status: 'pending'
  });
  console.log('Blog 3 created: MongoDB & Mongoose (by Ami)');

  const blog4 = await Blog.create({
    title: 'JWT Authentication in MERN Stack — How Login Systems Actually Work',
    content: `Every web application needs a way to identify users. JWT authentication is the industry standard for securing APIs.

What is JWT?

JWT stands for JSON Web Token. It is a compact token that contains:
- Header: Token type and algorithm
- Payload: User data (ID, role)
- Signature: Verification

A JWT looks like this:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTFiMmMzZDRlNSJ9.signature

How JWT Works

Step 1: User logs in with email and password
Step 2: Server verifies credentials and creates JWT
Step 3: Client stores token in localStorage
Step 4: Client sends token with every request
Step 5: Server verifies token before processing

Creating a Token

const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

JWT Middleware

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

Key Takeaways

1. JWT is stateless authentication
2. Token contains user info
3. Server verifies token on each request
4. Store token in localStorage`,
    author: ayush._id,
    status: 'pending'
  });
  console.log('Blog 4 created: JWT Authentication (by Ayush)');

  const blog5 = await Blog.create({
    title: 'Building a Blog Approval System — How Content Moderation Works',
    content: `In any content platform, quality control is essential. A blog approval system ensures that only reviewed and approved content reaches the audience.

Why Do We Need Blog Approval?

Without moderation:
- Spam content floods the platform
- Low-quality posts appear
- Harmful content goes live
- Platform loses credibility

How the Approval System Works

1. User writes a blog and submits it
2. Blog enters "pending" status
3. Admin reviews the blog
4. Admin approves or rejects it
5. Approved blogs become visible publicly

Database Schema

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

Creating a Blog

const createBlog = async (req, res) => {
  const blog = await Blog.create({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id,
    status: 'pending'
  });
  res.status(201).json(blog);
};

Fetching Approved Blogs

const getApprovedBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: 'approved' })
    .populate('author', 'name')
    .sort({ createdAt: -1 });
  res.json(blogs);
};

Admin Approve/Reject

const updateBlogStatus = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(blog);
};

Key Takeaways

1. Three-state system: pending, approved, rejected
2. Blogs default to pending
3. Only approved blogs visible publicly
4. Only admins can change status`,
    author: monika._id,
    status: 'pending'
  });
  console.log('Blog 5 created: Blog Approval System (by Monika)\n');

  // ============================================
  // STEP 3: Admin reviews blogs
  // ============================================
  console.log('Admin reviewing blogs...\n');

  blog1.status = 'approved';
  await blog1.save();
  console.log('  Blog 1 (React.js) -> APPROVED');

  blog2.status = 'approved';
  await blog2.save();
  console.log('  Blog 2 (Node.js) -> APPROVED');

  blog3.status = 'approved';
  await blog3.save();
  console.log('  Blog 3 (MongoDB) -> APPROVED');

  blog4.status = 'rejected';
  await blog4.save();
  console.log('  Blog 4 (JWT) -> REJECTED (content too short)');

  // Blog 5 stays pending
  console.log('  Blog 5 (Approval System) -> PENDING (still under review)\n');

  // ============================================
  // STEP 4: Admin creates own blog & approves
  // ============================================
  const blog6 = await Blog.create({
    title: 'Welcome to Our MERN Blog Platform — A Guide for New Users',
    content: `Welcome to our blog platform! This is a community-driven platform where students and developers can share their knowledge about web development and technology.

About This Platform

This platform is built using the MERN stack — MongoDB, Express.js, React.js, and Node.js. It features a complete blog approval system where users can submit blogs and administrators review them before publication.

How to Get Started

Step 1: Create an Account
Click the Register button in the navigation bar. Fill in your name, email, and password.

Step 2: Login
After registration, login with your credentials to access your dashboard.

Step 3: Write Your First Blog
From your dashboard, click "Create New Blog". Write a meaningful title and detailed content.

Step 4: Wait for Approval
Our admin team reviews every submission. You can check your blog status from your dashboard.

Step 5: Engage with the Community
Once approved, your blog appears on the home page. Other users can read and comment.

Platform Rules

1. Write original content — Plagiarism is not allowed
2. Be respectful in comments
3. Use proper formatting
4. Stay on topic
5. No spam

Blog Topics We Welcome

- Web Development (React, Node, Express, MongoDB)
- Programming Languages (JavaScript, Python)
- Database Management
- API Development
- Authentication and Security
- Career Advice for Developers

How the Approval System Works

Pending: Your blog is waiting for review. Only you can see it.

Approved: Your blog is now visible on the home page.

Rejected: Your blog did not meet guidelines. Check dashboard for status.

Tips for Getting Approved

1. Write detailed content (at least 300 words)
2. Use proper headings and structure
3. Include code examples
4. Proofread for errors
5. Add practical examples

We look forward to reading your contributions. Happy blogging!`,
    author: admin._id,
    status: 'approved'
  });
  console.log('Blog 6 created by Admin -> APPROVED\n');

  // ============================================
  // STEP 5: Add Comments (to both Blog embedded and Comment model)
  // ============================================
  console.log('Adding comments...\n');

  // Helper function to add a comment to blog's embedded comments array
  const addCommentToBlog = async (blog, blogTitle, commenter, text) => {
    blog.comments.push({
      user: commenter._id,
      text,
      createdAt: new Date()
    });
    await blog.save();
  };

  // Blog 1 comments (React.js by Ayush)
  await addCommentToBlog(blog1, 'Blog 1', monika, 'This is the best React explanation I have read! The useState and useEffect examples are so clear. I finally understand hooks now. Thank you Ayush!');
  await addCommentToBlog(blog1, 'Blog 1', ami, 'I was always confused about props vs state but this blog cleared it up perfectly. The code examples are easy to follow. Great work!');
  await addCommentToBlog(blog1, 'Blog 1', admin, 'Very well written blog Ayush! The step-by-step approach makes it easy for beginners to understand. Keep writing more content like this.');
  console.log('  Blog 1: 3 comments added (Monika, Ami, Ankita)');

  // Blog 2 comments (Node.js by Monika)
  await addCommentToBlog(blog2, 'Blog 2', ayush, 'Monika this is amazing! The CRUD API examples are so practical. I used your middleware code in my own project and it worked perfectly. Thanks for sharing!');
  await addCommentToBlog(blog2, 'Blog 2', ami, 'I always wondered how Express Router works. Your explanation with the separate files example made it so clear. This is exactly what I needed!');
  await addCommentToBlog(blog2, 'Blog 2', admin, 'Excellent blog Monika! Very detailed and well-structured. The error handling section is especially important for beginners. Great job!');
  console.log('  Blog 2: 3 comments added (Ayush, Ami, Ankita)');

  // Blog 3 comments (MongoDB by Ami)
  await addCommentToBlog(blog3, 'Blog 3', ayush, 'Ami your MongoDB guide is super helpful! The comparison between SQL and MongoDB documents made it so easy to understand. I finally get how NoSQL works!');
  await addCommentToBlog(blog3, 'Blog 3', monika, 'I love how you explained populate(). I was struggling with referencing users in my blog schema and this solved my problem. Thank you so much!');
  await addCommentToBlog(blog3, 'Blog 3', admin, 'Very comprehensive guide Ami! The query operators section is really useful. This will help many students who are new to databases. Well done!');
  console.log('  Blog 3: 3 comments added (Ayush, Monika, Ankita)');

  // Blog 4 comments (JWT by Ayush - rejected)
  await addCommentToBlog(blog4, 'Blog 4', monika, 'Ayush I think this blog needs more details. Can you add the bcrypt password hashing part? That is really important for understanding authentication.');
  await addCommentToBlog(blog4, 'Blog 4', ami, 'The content is good but too short. Please add more code examples and explain the frontend part also. Looking forward to the updated version!');
  console.log('  Blog 4: 2 comments added (Monika, Ami)');

  // Blog 5 comments (Approval System by Monika - pending)
  await addCommentToBlog(blog5, 'Blog 5', ayush, 'Monika this is exactly what I needed! I was trying to build an approval system for my project. Your schema design is clean and easy to understand.');
  await addCommentToBlog(blog5, 'Blog 5', ami, 'Great topic choice! Can you also add how to show status badges on the user dashboard? That would make this blog more complete.');
  console.log('  Blog 5: 2 comments added (Ayush, Ami)');

  // Blog 6 comments (Admin Welcome blog)
  await addCommentToBlog(blog6, 'Blog 6', ayush, 'Thank you Ankita for this welcome guide! The platform rules are clear and the approval process is well explained. Looking forward to contributing more blogs!');
  await addCommentToBlog(blog6, 'Blog 6', monika, 'This is a great introduction for new users. The step-by-step guide makes it easy to understand how the platform works. Thank you for setting this up!');
  await addCommentToBlog(blog6, 'Blog 6', ami, 'I appreciate the tips for getting blogs approved. The rules are fair and the topics list gives us good direction. This platform is going to be very helpful for learning!');
  console.log('  Blog 6: 3 comments added (Ayush, Monika, Ami)');

  // ============================================
  // STEP 6: Final Summary
  // ============================================
  console.log('\n========================================');
  console.log('  SEED COMPLETE!');
  console.log('========================================\n');

  const allBlogs = await Blog.find().populate('author', 'name');
  console.log('Final Blog Status:');
  allBlogs.forEach((b, i) => {
    console.log('  ' + (i+1) + '. ' + b.status.toUpperCase().padEnd(10) + ' | ' + b.author.name.padEnd(8) + ' | ' + b.title.substring(0, 50) + '...');
    console.log('              Comments: ' + b.comments.length + ' (in embedded)');
  });
  // Total embedded comments across all blogs
  const totalEmbeddedComments = allBlogs.reduce((sum, b) => sum + b.comments.length, 0);
  console.log('Total embedded comments: ' + totalEmbeddedComments);

  console.log('\n========================================');
  console.log('  CREDENTIALS');
  console.log('========================================\n');
  console.log('  Role   | Name    | Email              | Password');
  console.log('  -------|---------|--------------------|---------');
  console.log('  Admin  | Ankita  | admin@gmail.com    | ankita');
  console.log('  User   | Ayush   | ayush@gmail.com    | aayush');
  console.log('  User   | Monika  | monika@gmail.com   | monika');
  console.log('  User   | Ami     | ami@gmail.com      | ami');

  console.log('\nOpen http://localhost:5173 to see the result!');

  mongoose.connection.close();
}).catch(err => {
  console.error('Error:', err.message);
  mongoose.connection.close();
});
