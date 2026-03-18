import type { FastifyInstance } from 'fastify';
import {
    getProducts,
    createProduct,
} from '../controllers/product.controller.js';

export const productRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/products', getProducts);

    fastify.post('/products', createProduct);
};
