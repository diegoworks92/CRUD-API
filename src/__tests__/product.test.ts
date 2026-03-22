import { test, describe } from 'node:test';
import assert from 'node:assert';
import { app } from '../app.js';

describe('Product API - Complete Scenario', () => {
    let createdId: string;

    test('1. Get all products (should be empty initially)', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/products',
        });

        assert.strictEqual(response.statusCode, 200);
        assert.deepStrictEqual(JSON.parse(response.payload), []);
    });

    test('2. Create a new product', async () => {
        const newProduct = {
            name: 'Classical Acoustic Guitar',
            description: 'Solid cedar top with nylon strings for a warm tone',
            price: 250,
            category: 'strings',
            inStock: true,
        };

        const response = await app.inject({
            method: 'POST',
            url: '/api/products',
            payload: newProduct,
        });

        const body = JSON.parse(response.payload);
        createdId = body.id;

        assert.strictEqual(response.statusCode, 201);
        assert.strictEqual(body.name, newProduct.name);
        assert.ok(body.id, 'Should have an id');
    });

    test('3. Get the created product by ID', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/api/products/${createdId}`,
        });

        const body = JSON.parse(response.payload);
        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.id, createdId);
    });

    test('4. Update the product', async () => {
        const updatedData = {
            name: 'Electronic Drum Pad',
            description: 'Portable rubber pad with 10 different sound presets',
            price: 120,
            category: 'percussion',
            inStock: false,
        };

        const response = await app.inject({
            method: 'PUT',
            url: `/api/products/${createdId}`,
            payload: updatedData,
        });

        const body = JSON.parse(response.payload);
        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.name, 'Electronic Drum Pad');
        assert.strictEqual(body.price, 120);
    });

    test('5. Delete the product and verify it is gone', async () => {
        const deleteRes = await app.inject({
            method: 'DELETE',
            url: `/api/products/${createdId}`,
        });
        assert.strictEqual(deleteRes.statusCode, 204);
        const getRes = await app.inject({
            method: 'GET',
            url: `/api/products/${createdId}`,
        });
        assert.strictEqual(getRes.statusCode, 404);
    });
});
