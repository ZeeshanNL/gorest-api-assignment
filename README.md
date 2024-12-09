# E2E Tests for CRUD User Operations with GoREST API (v2)

This repository contains end-to-end (E2E) test scenarios for the CRUD (Create, Read, Update, Delete) user operations using the GoREST API (v2). The tests leverage Jest as the testing framework and Supertest for HTTP assertions, ensuring comprehensive API testing with HTTP Bearer Token authentication.

# Key Features:

- API Testing: Detailed scenarios for CRUD operations.
- Framework: Built using Jest and Supertest for efficient and scalable API testing.
- Reusable and Maintainable: Modular test structure for easy updates and enhancements.
- CI/CD Integration: Automated tests configured to run via GitHub Actions.
- Documentation: Includes a clear README with setup and execution instructions.

## Prerequisites

- Node.js (^18.16.0)
- npm (^9.5.1)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Available Scripts

### Running Tests

Run tests:
```bash
npm run test
```

Format code with Prettier:
```bash
npm run prettify
```

### Print response on shell 

```js
console.log(reponse);
console.log(reponse.body);
console.log(response.status);
```



## Development Requirements

- TypeScript
- Prettier

