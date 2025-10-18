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
    console.log(Object.fromEntries(formData.entries()));
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

    playing = true;
    setTimeout(() => { playing = false; }, 2.5 * 1000);
}