import type { Product } from '../models/product.model.js';
import cluster from 'node:cluster';

/* export const productsDB: Product[] = []; */

let masterProducts: Product[] = [];

export const getProductsDB = async (): Promise<Product[]> => {
    if (cluster.isPrimary) return masterProducts;

    return new Promise((resolve) => {
        process.send?.({ type: 'GET_PRODUCTS' });
        process.once('message', (msg: any) => {
            if (msg.type === 'PRODUCTS_LIST') resolve(msg.data);
        });
    });
};

export const updateProductsDB = async (newData: Product[]): Promise<void> => {
    if (cluster.isPrimary) {
        masterProducts = newData;
    } else {
        process.send?.({ type: 'UPDATE_PRODUCTS', data: newData });
    }
};

if (cluster.isPrimary) {
    cluster.on('message', (worker, msg) => {
        if (msg.type === 'GET_PRODUCTS') {
            worker.send({ type: 'PRODUCTS_LIST', data: masterProducts });
        }
        if (msg.type === 'UPDATE_PRODUCTS') {
            masterProducts = msg.data;
        }
    });
}
