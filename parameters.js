const resolutionCoefficient = .15;   // temporary performance fix

// default values
let bubbleRate = 150;  // (points / sec)                - [0, 150]
let zoom = 50;                          //              - [.1, 70]
let distortionZoom = 0.5;               //              - [.1, 2]
let distortionStrength = 15;   // maximum pixel offset  - [0, 100]

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