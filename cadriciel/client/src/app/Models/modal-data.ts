import { ModalData } from './interfaces';

export class Data implements ModalData {
    name: string;
    color: string;
    width: number;
    height: number;
    isDirty: boolean;
    isCreated: boolean;
    constructor() {
        this.name = '';
        this.color = '';
        this.width = 0;
        this.height = 0;
        this.isDirty = false;
        this.isCreated = false;
    }
}
