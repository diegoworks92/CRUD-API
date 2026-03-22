import { v4 as uuidv4 } from 'uuid';

import type { FastifyRequest, FastifyReply } from 'fastify';
import { getProductsDB, updateProductsDB } from '../database/db.js';
import type { Product, CreateProductDTO } from '../models/product.model.js';
import { isValidUuid } from '../utils/validators.js';

export const getProducts = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    console.log(`Request attended to by the Worker: ${process.pid}`);
    const products = await getProductsDB();
    return reply.code(200).send(products);
};

export const createProduct = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const body = request.body as CreateProductDTO;

    const { name, description, price, category, inStock } = body;

    if (
        !name ||
        !description ||
        price === undefined ||
        !category ||
        inStock === undefined
    ) {
        return reply.code(400).send({
            message:
                'All fields are required: name, description, price, category, inStock',
        });
    }

    if (typeof price !== 'number' || price <= 0) {
        return reply.code(400).send({
            message: 'The price must be a positive number greater than 0',
        });
    }
    const products = await getProductsDB();
    const newProduct: Product = {
        id: uuidv4(),
        name,
        description,
        price,
        category,
        inStock,
    };

    products.push(newProduct);
    await updateProductsDB(products);

    return reply.code(201).send(newProduct);
};

export const getProductById = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { productId } = request.params as { productId: string };

    if (!isValidUuid(productId)) {
        return reply
            .code(400)
            .send({ message: `Invalid UUID format: ${productId}` });
    }

    const products = await getProductsDB();
    const product = products.find((p) => p.id === productId);

    if (!product) {
        return reply
            .code(404)
            .send({ message: `Product with ID ${productId} not found` });
    }

    return reply.code(200).send(product);
};

export const updateProduct = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { productId } = request.params as { productId: string };
    const body = request.body as CreateProductDTO;

    if (!isValidUuid(productId)) {
        return reply
            .code(400)
            .send({ message: `Invalid UUID format: ${productId}` });
    }

    const products = await getProductsDB();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
        return reply
            .code(404)
            .send({ message: `Product with ID ${productId} not found` });
    }

    const { name, description, price, category, inStock } = body;

    if (
        !name ||
        !description ||
        price === undefined ||
        !category ||
        inStock === undefined
    ) {
        return reply
            .code(400)
            .send({ message: 'Missing required fields for update' });
    }

    if (typeof price !== 'number' || price <= 0) {
        return reply
            .code(400)
            .send({ message: 'Price must be a positive number' });
    }

    const updatedProduct: Product = {
        id: productId,
        name,
        description,
        price,
        category,
        inStock,
    };

    products[productIndex] = updatedProduct;
    await updateProductsDB(products);

    return reply.code(200).send(updatedProduct);
};

export const deleteProduct = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const { productId } = request.params as { productId: string };

    if (!isValidUuid(productId)) {
        return reply
            .code(400)
            .send({ message: `Invalid UUID format: ${productId}` });
    }

    const products = await getProductsDB();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
        return reply
            .code(404)
            .send({ message: `Product with ID ${productId} not found` });
    }

    products.splice(productIndex, 1);
    await updateProductsDB(products);

    return reply.code(204).send();
};
