const resolutionCoefficient = .15;   // temporary performance fix
// controls panning the canvas
const panSmoothing = .06;       // decelerates the pan.             - [0, 1]
const panAcceleration = 1.8;    // move x for each actual pixel

// default values
let bubbleRate = 20;  // (points / sec)                 - [0, 150]
let zoom = 28;                          //              - [.1, 70]
let distortionZoom = 1.5;               //              - [.1, 2]
let distortionStrength = 50;   // maximum pixel offset  - [0, 100]

(() => {
    let eBubbleRate = document.getElementById('bubbleRate');
    let eZoom = document.getElementById('zoom');
    let eDistortionZoom = document.getElementById('distortionZoom');
    let eDistortionStrength = document.getElementById('distortionStrength');

    eBubbleRate.value = bubbleRate;
    eZoom.value = zoom;
    eDistortionZoom.value = distortionZoom;
    eDistortionStrength.value = distortionStrength;

    eBubbleRate.addEventListener('change', () => bubbleRate = eBubbleRate.value);
    eZoom.addEventListener('change', () => zoom = eZoom.value);
    eDistortionZoom.addEventListener('change', () => distortionZoom = eDistortionZoom.value);
    eDistortionStrength.addEventListener('change', () => distortionStrength = eDistortionStrength.value);
})();