
const canvas = document.getElementById('canvasId');
const ctx = canvas.getContext('2d');

const offscreenCanvas = document.createElement('canvas'); //invisible canvas, used for saving final drawings
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
const offscreenCtx = offscreenCanvas.getContext('2d');

canvas.style.backgroundColor = 'white';

/*
the canvas is frequently deleted to show the previews in real time
*/

let currentTool = null; 
let isDrawing = false; 
let startX, startY; 
let currentColor = 'black';
let lineWidth = 3; 
let shapes = [];

const lineWidthSlider = document.getElementById('lineWidth');
lineWidthSlider.addEventListener('input', (e) => {
    lineWidth = e.target.value;
});

const colorButoane = document.querySelectorAll('.color-btn');
const colorPicker = document.getElementById('colorPicker');

colorButoane.forEach(button => {
    button.addEventListener('click', () => {
        currentColor = button.dataset.color;
    })
});

colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

/**
 * sets current tool
 * @param {String} tool 
 */
function setTool(tool) {
    currentTool = tool;
    canvas.style.cursor = 'crosshair';
}

const elipsaBtn = document.getElementById('elipsa');
const cercBtn = document.getElementById('cerc');
const dreptunghiBtn = document.getElementById('dreptunghi');
const linieBtn = document.getElementById('linie');

elipsaBtn.addEventListener('click', () => {
    setTool('elipsa');
});

cercBtn.addEventListener('click', () => {
    setTool('cerc');
});

dreptunghiBtn.addEventListener('click', () => {
    setTool('dreptunghi');
});

linieBtn.addEventListener('click', () => {
    setTool('linie');
});

canvas.addEventListener('mousedown', (e) => {
    if (currentTool === 'elipsa' || currentTool === 'cerc' ||
        currentTool === 'dreptunghi' || currentTool === 'linie') {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const currentX = e.offsetX; 
        const currentY = e.offsetY;
        ctx.lineWidth = lineWidth;



        if (currentTool === 'elipsa') {
            const razaX = Math.abs(currentX - startX) / 2; 
            const razaY = Math.abs(currentY - startY) / 2; 

            const centruX = (currentX + startX) / 2;
            const centruY = (currentY + startY) / 2;

            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(offscreenCanvas, 0, 0);

            ctx.beginPath(); 
            ctx.ellipse(centruX, centruY, razaX, razaY, 0, 0, 2 * Math.PI);
            ctx.strokeStyle = currentColor;
            ctx.stroke();
        }
        else if (currentTool === 'cerc') {
            const raza = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(offscreenCanvas, 0, 0);


            ctx.beginPath();
            ctx.arc(startX, startY, raza, 0, 2 * Math.PI); 
            ctx.strokeStyle = currentColor;
            ctx.stroke();

        }
        else if (currentTool === 'dreptunghi') {
            const rectX = currentX - startX;
            const rectY = currentY - startY;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(offscreenCanvas, 0, 0);


            ctx.beginPath();
            ctx.rect(startX, startY, rectX, rectY);
            ctx.strokeStyle = currentColor;
            ctx.stroke();

        }
        else if (currentTool === 'linie') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(offscreenCanvas, 0, 0);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = currentColor;
            ctx.stroke();
        }
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        const currentX = e.offsetX; 
        const currentY = e.offsetY;
        offscreenCtx.lineWidth = lineWidth;



        if (currentTool === 'elipsa') {
            const razaX = Math.abs(currentX - startX) / 2;
            const razaY = Math.abs(currentY - startY) / 2;

            const centruX = (currentX + startX) / 2;
            const centruY = (currentY + startY) / 2;


            offscreenCtx.beginPath();
            offscreenCtx.ellipse(centruX, centruY, razaX, razaY, 0, 0, 2 * Math.PI);
            offscreenCtx.strokeStyle = currentColor;
            offscreenCtx.stroke();

        }
        else if (currentTool === 'cerc') {
            const raza = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));

            offscreenCtx.beginPath();
            offscreenCtx.arc(startX, startY, raza, 0, 2 * Math.PI);
            offscreenCtx.strokeStyle = currentColor;
            offscreenCtx.stroke();
        }
        else if (currentTool === 'dreptunghi') {
            const rectX = currentX - startX;
            const rectY = currentY - startY;


            offscreenCtx.beginPath();
            offscreenCtx.rect(startX, startY, rectX, rectY);
            offscreenCtx.strokeStyle = currentColor;
            offscreenCtx.stroke();

        }
        else if (currentTool === 'linie') {
            offscreenCtx.beginPath();
            offscreenCtx.moveTo(startX, startY);
            offscreenCtx.lineTo(currentX, currentY);
            offscreenCtx.strokeStyle = currentColor;
            offscreenCtx.stroke();
        }

        const newShape = {
            type: currentTool,
            x: startX,
            y: startY,
            razaX: Math.abs(currentX - startX) / 2,//elipse
            razaY: Math.abs(currentY - startY) / 2,
            razaCerc: Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)), //circle
            width: Math.abs(currentX - startX), //rectangle
            height: Math.abs(currentY - startY),
            x2: currentX, //lines
            y2: currentY,
            color: currentColor,
            lineWidth: lineWidth
        }

        shapes.push(newShape);



        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvas, 0, 0);

        isDrawing = false;
    }


});


const backgroundBtn = document.getElementById('backgroundBtn');
backgroundBtn.addEventListener('click', () => {
    canvas.style.backgroundColor = currentColor;
});

const exportRasterBtn = document.getElementById('exportRaster');
exportRasterBtn.addEventListener('click', () => {
    ctx.fillStyle = canvas.style.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    ctx.drawImage(offscreenCanvas, 0, 0); 

    const dataUrl = canvas.toDataURL('image/png'); 
    const a = document.createElement('a');
    a.href = dataUrl; 
    a.download = 'image.png';
    a.click(); 
});

const exportVectorialBtn = document.getElementById('exportVector');
exportVectorialBtn.addEventListener('click', () => {

    const svgNS = "http://www.w3.org/2000/svg"; 
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute('width', canvas.width); 
    svg.setAttribute('height', canvas.height);

    const background = document.createElementNS(svgNS, "rect");
    background.setAttribute('width', canvas.width);
    background.setAttribute('height', canvas.height);
    background.setAttribute('fill', canvas.style.backgroundColor);
    svg.appendChild(background);


    shapes.forEach(shape => {
        let element;

        if (shape.type === 'elipsa') {
            element = document.createElementNS(svgNS, 'ellipse');
            element.setAttribute('rx', shape.razaX);
            element.setAttribute('ry', shape.razaY);
            element.setAttribute('cx', (shape.x + shape.x2) / 2);
            element.setAttribute('cy', (shape.y + shape.y2) / 2);
        }
        else if (shape.type === 'cerc') {
            element = document.createElementNS(svgNS, 'circle');
            element.setAttribute('r', shape.razaCerc);
            element.setAttribute('cx', (shape.x + shape.x2) / 2);
            element.setAttribute('cy', (shape.y + shape.y2) / 2);

        }
        else if (shape.type === 'dreptunghi') {
            element = document.createElementNS(svgNS, 'rect');
            element.setAttribute('x', Math.min(shape.x, shape.x2));
            element.setAttribute('y', Math.min(shape.y, shape.y2));
            element.setAttribute('width', shape.width);
            element.setAttribute('height', shape.height);
        }
        else if (shape.type === 'linie') {
            element = document.createElementNS(svgNS, 'line');
            element.setAttribute('x1', shape.x);
            element.setAttribute('y1', shape.y);
            element.setAttribute('x2', shape.x2);
            element.setAttribute('y2', shape.y2);
        }

        element.setAttribute('stroke', shape.color);
        element.setAttribute('stroke-width', shape.lineWidth);
        element.setAttribute('fill', 'transparent'); 
        svg.appendChild(element);
    });

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const a = document.createElement("a");
    a.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
    a.download = "image.svg";
    a.click();
});



const clearBtn = document.getElementById('clear-btn');
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    canvas.style.backgroundColor = 'white';
    shapes = []
});


