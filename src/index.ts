import Fastify from 'fastify';
import { productRoutes } from './routes/product.routes.js';
import * as dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
    logger: true,
});

fastify.register(productRoutes, { prefix: '/api' });

const start = async () => {
    try {
        const PORT = Number(process.env.PORT) || 4000;

        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server running at http://localhost:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
