# Ecommerce App

A simple e-commerce application built using **Express.js**, **MySQL**, and **Docker**.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Running with Docker](#running-with-docker)
- [Endpoints](#endpoints)
- [License](#license)

## Project Overview

This is a simple e-commerce app built to showcase how to handle product management using a RESTful API with Express.js. The application uses PostgreSQL as the database and Docker to containerize the app and database services.

## Technologies Used

- **Node.js** and **Express.js** for building the REST API.
- **MySQL** as the database to store user and product information.
- **Docker** to containerize the app and make it easy to deploy and run.

## Setup

### Prerequisites

To run this project locally, ensure you have the following installed:

- **Docker** and **Docker Compose** installed on your machine.

  - To install Docker: [Docker installation guide](https://docs.docker.com/get-docker/)
  - To install Docker Compose: [Docker Compose installation guide](https://docs.docker.com/compose/install/)

- **Node.js** and **npm** (for running the app locally without Docker).

### Installing

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app
```

2. **Install dependencies**: If you plan to run the application without Docker:

```bash
npm install
```

3. **Set up MySQL:**

- Ensure MySQL is running (either via Docker or locally).
- The database will be created automatically when the app starts.
- Create a .env file in the root of the project and configure the MySQL connection:

```bash
DB_HOST=db
DB_USER=root
DB_PASSWORD=my-secret-pw
DB_NAME=ecommerce
```

    This file contains the necessary credentials and connection details for MySQL.

## Running with Docker

1. **Build and start the application: With Docker Compose, you can easily start both the app and MySQL database in containers:**

```bash
docker-compose up --build
```

2. **Access the application:**

   - The Express app will be accessible at http://localhost:5000.
   - MySQL will be running in the background inside a Docker container, available on port 3306.

3. **Stop the containers:** To stop the app and database containers:

```bash
docker-compose down
```

## Running Without Docker

If you don't want to use Docker, you can run the application directly on your machine:

1. **Start the server:**

```bash
npm start
```

2. **Access the application: Open your browser and visit http://localhost:5000.**

## Endpoints

1. **Get All Products**
   - **URL:** http://localhost:5000/api/products
   - **Method:** GET
   - **Description:** Fetches all products from the database.
   - **Response:** A list of products in JSON format.
2. **Add a New Product**

- **URL:** /api/products
- **Method:** POST
- **Body**:

```bash
"name": "Product Name",
"description": "Product Description",
"price": 19.99,
"stock": 100
```

- **Description:** Adds a new product to the database.
- **Response:** The newly created product in JSON format.

## License

This project is open-source and available under the MIT License. See LICENSE.txt for details.
