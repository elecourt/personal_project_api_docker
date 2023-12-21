const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: "1.0.0",
    title: 'API rest doc',
    description: 'Documentation of the API rest lesson'
  },
  host: 'localhost:9000',
  basePath: "/",
};

const outputFile = './swagger-output.json';
const routes = ['./src/controllers/index.js'];
swaggerAutogen(outputFile, routes, doc);