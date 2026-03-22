import { app } from './app.js';

const start = async () => {
    try {
        const PORT = Number(process.env.PORT) || 4000;

        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server running at http://localhost:${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
