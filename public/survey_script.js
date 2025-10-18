const MIN_BASE_FREQ = 300;
const MAX_BASE_FREQ = 600;
const MIN_INTERVAL = -1;
const MAX_INTERVAL = 1;
const DURATION = 2;
const MONO_THRESHOLD = 25;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const profile = getProfile();
const freqs = generateFreqs();

/**
 * 
 * @returns {{ [key: string]: number }}
 */
function getProfile() {
    let profile = localStorage.getItem("profile");

    try {
        profile = JSON.parse(profile);
    } catch (err) {
        alert("Veuillez remplir le pré-sondage d'abord.");
        return window.location.href = "/presurvey";
    }

    if (!checkProfile(profile)) {
        alert("Veuillez remplir le pré-sondage d'abord. #");
        return window.location.href = "/presurvey";
    }
    
    return profile;
}

/**
 * @returns {{ sound1: [number, number], sound2: [number, number] }}
 */
function generateFreqs() {
    const baseFreq1 = randomNumber(MIN_BASE_FREQ, MAX_BASE_FREQ);
    const ratio1 = 2 ** randomNumber(MIN_INTERVAL, MAX_INTERVAL);
    const freq1 = baseFreq1 * ratio1;

    const baseFreq2 = randomNumber(MIN_BASE_FREQ, MAX_BASE_FREQ);
    const ratio2 = 2 ** randomNumber(MIN_INTERVAL, MAX_INTERVAL);
    const freq2 = baseFreq2 * ratio2;

    if (profile.stereo === 0 && (Math.abs(baseFreq1 - freq1) < MONO_THRESHOLD || Math.abs(baseFreq2 - freq2) < MONO_THRESHOLD))
        return generateFreqs();

    return {
        sound1: Math.random() < 0.5 ? [baseFreq1, freq1] : [freq1, baseFreq1],
        sound2: Math.random() < 0.5 ? [baseFreq2, freq2] : [freq2, baseFreq2],
    };
}

/**
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

var playing = false;

/**
 * @param {1 | 2} id 
 * @param {number} rightFreq 
 * @param {number} [duration=2] 
 */
function playSound(id) {
    if (playing)
        return;

    const soundFreqs = freqs["sound" + id];

    const leftOsc = audioCtx.createOscillator();
    const rightOsc = audioCtx.createOscillator();

    leftOsc.type = "sine";
    rightOsc.type = "sine";
    leftOsc.frequency.value = soundFreqs[0];
    rightOsc.frequency.value = soundFreqs[1];

    const leftPanner = audioCtx.createStereoPanner();
    const rightPanner = audioCtx.createStereoPanner();
    leftPanner.pan.value = -1;
    rightPanner.pan.value = 1;

    leftOsc.connect(leftPanner).connect(audioCtx.destination);
    rightOsc.connect(rightPanner).connect(audioCtx.destination);

    leftOsc.start();
    rightOsc.start();

    leftOsc.stop(audioCtx.currentTime + DURATION);
    rightOsc.stop(audioCtx.currentTime + DURATION);

    playing = true;
    setTimeout(() => { playing = false; }, DURATION * 1000);
}

function sendSurveyResponse() {
    const selected = document.querySelector('input[name="consonant"]:checked');

    if (!selected) {
        alert("Veuillez sélectionner une réponse.");
        return;
    }

    const mostConsonant = parseInt(selected.value);

    fetch("/survey", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...freqs,
            mostConsonant,
            profile,
        })
    }).then(response => {
        if (!response.ok)
            throw response.json();
        window.location.reload();
    }).catch(error => {
        console.error("Error:", error);
        alert("Une erreur est survenue lors de l'envoi des données. Veuillez réessayer.");
    });
}