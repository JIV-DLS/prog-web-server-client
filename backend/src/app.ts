import express from 'express';
import { connectToDatabase } from "./services/database.service"
import { gasesRouter } from "./routes/gases.router";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('The sedulous hyena ate the antelope!');
});

connectToDatabase()
    .then(() => {
        app.use("/gases", gasesRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });
