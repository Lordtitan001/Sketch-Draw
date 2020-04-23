import { injectable } from 'inversify';
import * as mongo from 'mongodb';
import 'reflect-metadata';
import { Draw } from '../../../common/communication/draw';
const URI = 'mongodb+srv://kevin:kevin@cluster0-4tl8u.mongodb.net/test?retryWrites=true&w=majority';
const nomCollection = 'Gallerie de dessins';

@injectable()
export class DrawingService {
    private collection: mongo.Collection<Draw>;
    dataArray: Draw[];
    private dataBase: string;
    constructor() {
        this.dataArray = [];
        this.dataBase = 'dessin';
        this.init();
    }

    async init(): Promise<Draw[]> {
        this.collection = (await mongo.connect(URI)).db(this.dataBase).collection<Draw>(nomCollection);
        return await this.loadFromDataBase();
    }

    async loadFromDataBase(): Promise<Draw[]> {
        this.dataArray = [];
        const promise = new Promise<Draw[]>(async (resolve, reject) => {
            await this.collection.find().forEach((data) => {this.dataArray.push(data); })
                .then(() => { resolve(this.dataArray); });
        });
        return promise;
    }

    async saveToDataBase(data: Draw): Promise<void> {
        return this.collection.insertOne(data)
        .then(async () => { await this.loadFromDataBase(); });
    }

    async deleteOne(toDelete: object): Promise<void> {
        return this.collection.deleteOne(toDelete)
            .then(async () => { await this.loadFromDataBase(); });
    }

    async delete(id: string): Promise<boolean> {
        const toDelete = { _id: new mongo.ObjectId(id) };
        return new Promise<boolean>(async (resolve) => {
            await this.deleteOne(toDelete).then(() => resolve(true)); });
    }
}
