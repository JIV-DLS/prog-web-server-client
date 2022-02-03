// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Gas from "../models/gas";

// Global Config
export const gasesRouter = express.Router();

gasesRouter.use(express.json());

// GET
gasesRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const gases = [];
        if(collections){
            const gases_collections = await collections.gases?.find({}).toArray();
            if (gases_collections){
                for (let i = 0; i < gases_collections.length; i++) {
                    gases.push(gases_collections[i] as Gas)
                }
            }

        }
        res.status(200).send(gases);

    } catch (error) {
        res.status(500).send(error);
    }
});

gasesRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {

        const query = { _id: new ObjectId(id) };
        const gas = (await collections?.gases?.findOne(query)) as Gas;

        if (gas) {
            res.status(200).send(gas);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

// POST
gasesRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newGas = req.body as Gas;
        const result = await collections?.gases?.insertOne(newGas);

        result
            ? res.status(201).send(`Successfully created a new gase with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new gase.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

// PUT
gasesRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedGame: Gas = req.body as Gas;
        const query = { _id: new ObjectId(id) };

        const result = await collections?.gases?.updateOne(query, { $set: updatedGame });

        result
            ? res.status(200).send(`Successfully updated gas with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

// DELETE
gasesRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections?.gases?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed gas with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove gas with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Game with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send();
    }
});
