# Product Management CRUD API - Cluster Scaling

This is a REST API for product management built with Node.js, Fastify, and TypeScript. The project implements horizontal scaling using the Node.js Cluster module and inter-process communication (IPC) to maintain data consistency across workers.

## Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

## Installation

1. Clone the repository.
2. Install dependencies:
   npm install

3. Create a .env file based on .env.example:
   cp .env.example .env

## Available Scripts

### Development Mode (Single Process)

Runs the application in a single process environment using tsx.
npm run start:dev

### Multi-process Mode (Horizontal Scaling)

Runs the application using the Cluster module. It spawns workers equal to the number of available CPU cores minus one.
npm run start:multi

### Production Mode

Compiles the TypeScript code to JavaScript and runs the production build from the dist directory.
npm run start:prod

### Testing

Runs the automated test suite using the native Node.js test runner.
npm test

## API Endpoints

- GET /api/products - Retrieve all products
- GET /api/products/:productId - Retrieve a specific product by ID
- POST /api/products - Create a new product
- PUT /api/products/:productId - Update an existing product
- DELETE /api/products/:productId - Remove a product

## Technical Implementation Details

- Fastify: Used as the web framework for high performance.
- Node Cluster: Implemented to utilize multiple CPU cores.
- IPC Messaging: Used to synchronize the in-memory database between the Primary process and Worker processes.
- Validation: UUID v4 validation and field type checking for all requests.
