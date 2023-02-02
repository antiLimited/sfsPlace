import { model, Schema } from "mongoose"
import * as joi from "joi";
import { Logger } from "tslog";

export interface IMapPosition {
    x: number
    y: number
}

export interface IMapPart {
    name: string,
    position: IMapPosition,
    scale: number,
    rotation: number,
    owner: string,
    placeTime: number,
    texture: string,
    identifier: string
}

export const mapPositionSchema = new Schema<IMapPosition>({
    x: { type: Number, required: true },
    y: { type: Number, required: true }
}, { _id : false });

export const partSchema = new Schema<IMapPart>({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    texture: { type: String, required: true },
    position: { type: mapPositionSchema, required: true },
    rotation: { type: Number, required: true },
    scale: { type: Number, required: true },
    placeTime: { type: Number, required: true },
    identifier: { type: String, required: true }
});


export const placePartRequestSchema = joi.object(({
    partName: joi.string().required(),
    partPosition: joi.object().required(),
    scale: joi.number().required(),
    rotation: joi.number().required(),
    texture: joi.string().required()
}))

export const MapPart = model<IMapPart>('MapPart', partSchema);


export default class MapManager {

    private static log: Logger<String> = new Logger();

    constructor(){
        
    }

    static getParts(){
        return this.parts;
    }

    static async addPart(part: IMapPart){
        this.parts.push(part);

        let mapPart = new MapPart({
            name: part.name,
            position: part.position,
            owner: part.owner,
            placeTime: part.placeTime,
            scale: part.scale,
            rotation: part.rotation,
            texture: part.texture,
            identifier: part.identifier
        });

        mapPart.save();

        this.log.info("Added new part to map");
    }

    // Syncs parts from the mongo database -> server memory
    static async syncPartList(){
        let parts = await MapPart.find({ }, {_id :0, __v:0});

        this.parts = parts;

        this.log.info("Downloaded part list from database");
    }

    private static parts: Array<IMapPart> = new Array();
}