const noiseApi = window.modules.noiseApi;


// -------------------------------------------------

// parameters are pulled in from parameters.js


let userOffset = {x: 0, y: 0};
canvas.addEventListener('canvasBeingDragged', (event) => {
    const {x, y} = event.detail.deltaPosition;

    userOffset.x -= x;
    userOffset.y -= y;
})


let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

let noiseA = (() => {
    const simplexGen2D = noiseApi.makeNoise3D();

    return (x, y, z) => {
        let val = simplexGen2D(x, y, z);
        return Math.min(Math.max(val, -1), 1);
    }
})();


let noiseB = (() => {
    const simplexGen2D = noiseApi.makeNoise3D();

    return (x, y, z) => {
        let val = simplexGen2D(x, y, z);
        return Math.min(Math.max(val, -1), 1);
    }
})();


/**
 * Find the value between two values.
 * Useful for smoothing.
 *
 * @param a Number
 * @param b Number
 * @param speed [0, 1]
 */
function lerp(a, b, speed) {
    return a + speed * (b - a);
}


/**
 * Finds the vector between two vectors.
 * The input vectors must match.
 * @param a an array of any length
 * @param b an array of any length
 * @param speed [0, 1]
 */
function arrayLerp(a, b, speed) {
    if (a.length !== b.length)
        throw "The input vector lengths do not match.";

    let result = [];

    for (let i = 0; i < a.length; i++) {
        result.push(lerp(a[i], b[i], speed));
    }

    return result;
}


function getCords(i) {
    i = Math.floor(i / 4);
    let x = i % canvas.width;
    let y = Math.floor(i / canvas.width);

    return {x, y};
}


function transform(zoom) {
    // let frequency = zoom / 100000;
    // let frequency = 20 * zoom / Math.min(newData.height, newData.width);
    // * (newData.height * newData.width)

    zoom *= resolutionCoefficient;

    let set = [];

    for (let i = 1; i < arguments.length; i++) {
        let arg = arguments[i];
        let value = arg / (20 * (zoom));
        set.push(value);
    }

    return set;
}



(() => {
    renderNoise.cGrad = [
        [
            // light color
            Math.random() * 85 + 170,
            Math.random() * 85 + 170,
            Math.random() * 85 + 170
        ], [
            // dark color
            Math.random() * 85,
            Math.random() * 85,
            Math.random() * 85
        ]
    ];

    // coin flip to flip light and dark color
    if (Math.random() > .5) {
        let temp = renderNoise.cGrad[0];
        renderNoise.cGrad[0] = renderNoise.cGrad[1];
        renderNoise.cGrad[1] = temp;
    }
})()

function renderNoise(generateFun) {
    let newData = ctx.createImageData(canvas.width, canvas.height);
    let pixels = newData.data;

    const c1 = renderNoise.cGrad[0];
    const c2 = renderNoise.cGrad[1];

    for (let i = 0; i < newData.data.length; i += 4) {
        let {x, y} = getCords(i);
        let noiseValue = generateFun(x, y);
        let degree = noiseValue / 2 + .5;   // wrap to [0-1]

        let color = arrayLerp(c1, c2, degree);

        pixels[i]       = color[0];
        pixels[i + 1]   = color[1];
        pixels[i + 2]   = color[2];

        pixels[i + 3]   = 255;
    }

    ctx.putImageData(newData, 0, 0);
    imageData = newData;
}


function update() {
    const deltaTime = Date.now() - update.time;
    const deltaTimePercent = Date.now() / update.time;
    update.time += deltaTime;

    let deltaOffset = bubbleRate / 1000 * deltaTime;
    update.bubbleOffset += deltaOffset;

    const adjustOffset = (a, b) => lerp(a, b * panAcceleration, panSmoothing * deltaTimePercent);
    update.offset.x = adjustOffset(update.offset.x, userOffset.x);
    update.offset.y = adjustOffset(update.offset.y, userOffset.y);

    /**
     * Algorithm:
     *  2 layers of noise
     *  Apply transforms individually on each
     *
     *  1st layer value offsets layer2 noise
     *
     *  layer 2 noise value is rendered
     */
    renderNoise((x, y) => {
        let layer1Cords = transform(distortionZoom * zoom, x, y, update.bubbleOffset);
        let layer1Noise = noiseB(layer1Cords[0], layer1Cords[1], layer1Cords[2]) * distortionStrength;

        x += update.offset.x * resolutionCoefficient;
        y += update.offset.y * resolutionCoefficient;

        x += layer1Noise;
        y += layer1Noise;

        let layer2Cords = transform(zoom, x, y, update.bubbleOffset);
        let layer2Noise = noiseA(layer2Cords[0], layer2Cords[1], layer2Cords[2]);

        return layer2Noise;
    });
}
update.offset = {x: 0, y: 0};
update.bubbleOffset = 0;
update.time = Date.now();


console.log(noiseB(1000))


// -------------------------------------------
//               experiments
// -------------------------------------------


function fillCanvasGradient(color) {
    let newData = ctx.createImageData(imageData);
    let pixels = newData.data;

    for (let i = 0; i < newData.data.length; i += 4) {
        let cords = getCords(i);
        let degree = cords.y / imageData.height;

        pixels[i] = degree * color[0];
        pixels[i + 1] = degree * color[1];
        pixels[i + 2] = degree * color[2];
        pixels[i + 3] = 255;
    }

    ctx.putImageData(newData, 0, 0);
    imageData = newData;
}


function fillCanvasCycles(colors) {
    let newData = ctx.createImageData(imageData);
    let colorIndex = 0;

    for (let i = 0; i < newData.data.length; i++) {
        if (i % 4 === 0) {
            newData.data[i] = 255;
            continue;
        }

        let color = colors[colorIndex++ % colors.length]
        newData.data[i] = color;
    }

    ctx.putImageData(newData, 0, 0);
    imageData = newData;
}


// -------------------------------------------

// const targetDetail = 500;
// const aspectRatio = window.innerWidth / window.innerHeight;
//
// canvas.width = targetDetail * aspectRatio;
// canvas.height = targetDetail * aspectRatio;

canvas.width = window.innerWidth * resolutionCoefficient;
canvas.height = window.innerHeight * resolutionCoefficient;

console.log("This is animateJS!");
console.log(`The canvas size is [ ${canvas.width}, ${canvas.height} ]`);

update();
setInterval(update, 0);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * resolutionCoefficient;
    canvas.height = window.innerHeight * resolutionCoefficient;
    update();
}, true);