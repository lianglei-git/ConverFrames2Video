import { $ } from "./utils";

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

$('#root')[0].appendChild(canvas);
let count = 0;


const getTextWH = (text: string): [number, number] => {



    return [0, 0]
}

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
    return canvas
}

