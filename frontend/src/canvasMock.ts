import { $ } from "./utils";
import {src} from './mock'

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.width = 720;
canvas.height = 720;

$('#root')[0].appendChild(canvas);
let count = 0;


const getTextWH = (text: string): [number, number] => {



    return [0, 0]
}

const image = document.createElement('img');
image.src = src;

export const renderCanvasMock = () => {
    if (!context) return null;
    context?.clearRect(0, 0, canvas.width, canvas.height);
    if (count >= 100) {
        count = 0;
    }

 
    count++;
    context.fillStyle = '#000';
    context.fillRect(0, 0,canvas.width,canvas.height);
    const size = context.measureText('' + count)
    context.font = "48px serif";
    context.fillStyle='#fff'
    context.fillText('' + count, canvas.width / 2 - size.width, canvas.height / 2,)
    if(count %2) {
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
    }
    return canvas
}

