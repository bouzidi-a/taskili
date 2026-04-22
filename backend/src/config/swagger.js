const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Taskili API",
      version: "1.0.0",
      description: "REST API for Taskili — a freelancing platform",
    },
    servers: [{ url: "http://localhost:4000", description: "Development" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"], // ← reads JSDoc from route files
};

module.exports = swaggerJsdoc(options);
