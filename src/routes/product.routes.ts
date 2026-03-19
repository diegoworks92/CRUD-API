import type { FastifyInstance } from 'fastify';
import {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller.js';

export const productRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/products', getProducts);

    fastify.post('/products', createProduct);

    fastify.get('/products/:productId', getProductById);

    fastify.put('/products/:productId', updateProduct);

    fastify.delete('/products/:productId', deleteProduct);
};
