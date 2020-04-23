import { Drawing } from '../drawing';

export interface Draw {
    _id: string;
    Draw: Drawing;
    Tags: string[];
}

export interface EmailData {
    to: string;
    data: string;
    extension: string;
    name: string;
}