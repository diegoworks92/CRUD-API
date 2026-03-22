import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';
import { app } from './app.js';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const numCPUs = os.availableParallelism() - 1;

if (cluster.isPrimary) {
    console.log(`Primary Load Balancer running on port ${PORT}`);

    const workerPorts: number[] = [];
    let currentWorker = 0;

    for (let i = 0; i < numCPUs; i++) {
        const workerPort = PORT + 1 + i;
        workerPorts.push(workerPort);
        cluster.fork({ WORKER_PORT: workerPort });
    }

    const server = http.createServer((req, res) => {
        const targetPort = workerPorts[currentWorker];
        currentWorker = (currentWorker + 1) % workerPorts.length;

        const proxyReq = http.request(
            {
                host: 'localhost',
                port: targetPort,
                path: req.url,
                method: req.method,
                headers: req.headers,
            },
            (proxyRes) => {
                res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
                proxyRes.pipe(res);
            }
        );

        req.pipe(proxyReq);

        proxyReq.on('error', () => {
            res.writeHead(502);
            res.end('Worker connection error');
        });
    });

    server.listen(PORT);

    cluster.on('exit', () => {
        cluster.fork();
    });
} else {
    const workerPort = Number(process.env.WORKER_PORT);

    app.listen({ port: workerPort, host: '0.0.0.0' }, (err) => {
        if (err) {
            process.exit(1);
        }
        console.log(`Worker ${process.pid} listening on port ${workerPort}`);
    });
}
