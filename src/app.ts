import Fastify from 'fastify';
import { productRoutes } from './routes/product.routes.js';
import * as dotenv from 'dotenv';

dotenv.config();

export const app = Fastify({
    logger: false,
});

app.register(productRoutes, { prefix: '/api' });

app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
        error: 'Not Found',
        message: `Route '${request.url}' not found on this server. Try /api/products`,
    });
});

app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    reply.code(500).send({
        error: 'Internal Server Error',
        message:
            'An unexpected error occurred on the server. Please try again later.',
    });
});
