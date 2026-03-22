import cluster from 'node:cluster';
import os from 'node:os';
import { app } from './app.js';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

const numCPUs = os.availableParallelism() - 1;

if (cluster.isPrimary) {
    console.log(`Primary Process ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        console.log(`Worker ${process.pid} listening on port ${PORT}`);
    });
}
