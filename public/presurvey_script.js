const TOTAL_QUESTIONS = 10;
const CALIBRATION_DURATION = 3;

function onLoad() {
    const form = document.getElementById("form");
    const savedProfile = localStorage.getItem("profile");
    if (!savedProfile)
        return;
    const profile = JSON.parse(savedProfile);
    for (const key in profile) {
        const value = profile[key];
        const radio = form.querySelector(`input[type="radio"][name="${key}"][value="${value}"]`);
        if (radio)
            radio.checked = true;
    }
}

function saveProfile() {
    const form = document.getElementById("form");
    const formData = new FormData(form);
    const profile = {};
    let answerCounter = 0;

    for (let [key, value] of formData.entries()) {
        profile[key] = parseInt(value);
        answerCounter++;
    }

    if (answerCounter !== TOTAL_QUESTIONS) {
        alert("Veuillez répondre à toutes les questions.");
        return;
    }

    localStorage.setItem("profile", JSON.stringify(profile));
    window.location.href = "/survey";
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var playing = false;

function playCalibrationSound() {
    if (playing)
        return;
    playing = true;

    const leftOsc = audioCtx.createOscillator();
    const rightOsc = audioCtx.createOscillator();

    leftOsc.type = rightOsc.type = "sine";
    leftOsc.frequency.value = 440;
    rightOsc.frequency.value = 441;

    const leftPanner = audioCtx.createStereoPanner();
    const rightPanner = audioCtx.createStereoPanner();
    leftPanner.pan.value = -1;
    rightPanner.pan.value = 1;

    leftOsc.connect(leftPanner).connect(audioCtx.destination);
    rightOsc.connect(rightPanner).connect(audioCtx.destination);

    leftOsc.start();
    rightOsc.start();

    leftOsc.stop(audioCtx.currentTime + CALIBRATION_DURATION);
    rightOsc.stop(audioCtx.currentTime + CALIBRATION_DURATION);

    setTimeout(() => { playing = false; }, CALIBRATION_DURATION * 1000);
}

function playStableSound() {
    if (playing)
        return;
    playing = true;

    const osc = audioCtx.createOscillator();

    osc.type = "sine";
    osc.frequency.value = 440;

    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + CALIBRATION_DURATION);

    setTimeout(() => { playing = false; }, CALIBRATION_DURATION * 1000);
}

function playRegularPulses() {
    if (playing)
        return;
    playing = true;
    const leftOsc = audioCtx.createOscillator();
    const rightOsc = audioCtx.createOscillator();

    leftOsc.type = rightOsc.type = "sine";
    leftOsc.frequency.value = 440;
    rightOsc.frequency.value = 441;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5;

    leftOsc.connect(gainNode).connect(audioCtx.destination);
    rightOsc.connect(gainNode).connect(audioCtx.destination);

    leftOsc.start();
    rightOsc.start();

    leftOsc.stop(audioCtx.currentTime + CALIBRATION_DURATION);
    rightOsc.stop(audioCtx.currentTime + CALIBRATION_DURATION);

    setTimeout(() => { playing = false; }, CALIBRATION_DURATION * 1000);
}