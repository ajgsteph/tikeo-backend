import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';

export const registry = new OpenAPIRegistry();

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Tikeo API',
      version: '1.0.0',
      description: 'API de prise de rendez-vous — tikeo.pro',
    },
    servers: [
      { url: 'http://localhost:3000/api', description: 'Développement' },
      { url: 'https://tikeo-backend-bg8m.onrender.com/api',     description: 'Production' },
    ],
  });
}
