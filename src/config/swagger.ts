import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'TripWiser API Documentation',
    version: '1.0.0',
    description: 'Enterprise MERN Stack REST API for TripWiser Travel & Itinerary Platform powered by Google Gemini AI',
    contact: {
      name: 'TripWiser Engineering Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT Access Token',
      },
    },
  },
  paths: {
    '/api/v1/auth/register': {
      post: {
        summary: 'Register a new user account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstname', 'lastname', 'email', 'password'],
                properties: {
                  firstname: { type: 'string', example: 'John' },
                  lastname: { type: 'string', example: 'Doe' },
                  email: { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: 'Password123' },
                  role: { type: 'string', example: 'USER' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User Registered Successfully' },
          400: { description: 'Validation Error or Email already exists' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        summary: 'Authenticate user & issue tokens',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: 'Password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/v1/ai/generate': {
      post: {
        summary: 'Generate smart AI trip itinerary using Google Gemini 2.5 Flash',
        tags: ['AI Travel Generator'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['days', 'budget'],
                properties: {
                  destination: { type: 'string', example: 'Ella' },
                  days: { type: 'number', example: 3 },
                  budget: { type: 'number', example: 50000 },
                  travelStyle: { type: 'string', example: 'adventure' },
                  tripDate: { type: 'string', example: '2026-11-15' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'AI Trip plan generated with monsoon check' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/v1/weather': {
      get: {
        summary: 'Get 5-day weather forecast or seasonal monsoon predictions',
        tags: ['Weather & Spatial'],
        parameters: [
          { name: 'lat', in: 'query', required: true, schema: { type: 'number' }, example: 6.9271 },
          { name: 'lng', in: 'query', required: true, schema: { type: 'number' }, example: 79.8612 },
          { name: 'date', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Weather forecast with warning alerts' },
        },
      },
    },
    '/api/v1/attraction': {
      get: {
        summary: 'Get nearby attractions within 5km radius via Geoapify',
        tags: ['Weather & Spatial'],
        parameters: [
          { name: 'lat', in: 'query', required: true, schema: { type: 'number' }, example: 6.9271 },
          { name: 'lng', in: 'query', required: true, schema: { type: 'number' }, example: 79.8612 },
        ],
        responses: {
          200: { description: 'List of nearby attractions' },
        },
      },
    },
    '/api/v1/hotel': {
      get: {
        summary: 'Get nearby hotels and hostels within 5km radius via Geoapify',
        tags: ['Weather & Spatial'],
        parameters: [
          { name: 'lat', in: 'query', required: true, schema: { type: 'number' }, example: 6.9271 },
          { name: 'lng', in: 'query', required: true, schema: { type: 'number' }, example: 79.8612 },
        ],
        responses: {
          200: { description: 'List of nearby hotels' },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('📑 Swagger API Docs available at /api-docs');
};
