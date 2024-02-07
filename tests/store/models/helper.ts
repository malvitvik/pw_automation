import {Columns} from "./columns";

export function getKeys(obj: {} ) {
    return Object.keys(obj).filter((v) => !isNaN(Number(v)));
}

export function getValues(obj: {} ) {
    return Object.values(obj).filter((v) => isNaN(Number(v)));
}

export function randomInt(max:number) {
    return Math.floor(Math.random() * max);
}