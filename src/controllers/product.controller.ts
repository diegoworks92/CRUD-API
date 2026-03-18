import { v4 as uuidv4 } from 'uuid';

import type { FastifyRequest, FastifyReply } from 'fastify';
import { productsDB } from '../database/db.js';

import type { Product, CreateProductDTO } from '../models/product.model.js';

export const getProducts = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    return reply.code(200).send(productsDB);
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

    const newProduct: Product = {
        id: uuidv4(),
        name,
        description,
        price,
        category,
        inStock,
    };

    productsDB.push(newProduct);

    return reply.code(201).send(newProduct);
};
