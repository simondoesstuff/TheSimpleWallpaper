const noiseApi = window.modules.noiseApi;


// -------------------------------------------------


const bubbleRate = 150;  // (points / sec)
const resolutionCoefficient = .15;   // temporary performance fix
const zoom = 50;
const distortionZoom = .3 * zoom;
const distortionStrength = 15;   // maximum pixel offset


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

let noiseA = (() => {
    // const simplexGen2D = noiseApi.makeNoise3D();
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
        set.push(arg / (20 * (zoom)));
    }

    return set;
}


function renderNoise(getTransforms) {
    let newData = ctx.createImageData(canvas.width, canvas.height);
    let pixels = newData.data;

    let c = [
        180, 10, 150
        // Math.random() * 200,
        // Math.random() * 200,
        // Math.random() * 200
    ];

    for (let i = 0; i < newData.data.length; i += 4) {
        let cords = getCords(i);
        let transformedCords = getTransforms(cords.x, cords.y);
        let noiseValue = noiseA(transformedCords[0], transformedCords[1], transformedCords[2]);
        let degree = noiseValue / 2 + .5;   // wrap to [0-1]

        pixels[i] = c[0] * degree;
        pixels[i + 1] = c[1] * degree;
        pixels[i + 2] = c[2] * degree;
        pixels[i + 3] = 255;
    }

    ctx.putImageData(newData, 0, 0);
    imageData = newData;
}


function update() {
    let deltaTime = Date.now() - update.time;
    update.time += deltaTime;

    let deltaOffset = bubbleRate / 1000 * deltaTime;
    update.bubbleOffset += deltaOffset;

    renderNoise((x, y) => {
        x += update.userOffset.x;
        y += update.userOffset.y;

        let distortionTransformedCords = transform(distortionZoom, x, y, update.bubbleOffset);
        let distortion = noiseB(distortionTransformedCords[0], distortionTransformedCords[1], distortionTransformedCords[2]) * distortionStrength;

        x += distortion;
        y += distortion;

        return transform(zoom, x, y, update.bubbleOffset);
    });
}
update.userOffset = {x: 0, y: 0};
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