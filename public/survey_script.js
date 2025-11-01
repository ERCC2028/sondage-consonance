const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const MIN_NOTE = Math.log2(MIN_FREQ);
const MAX_NOTE = Math.log2(MAX_FREQ);
const profile = getProfile();
const freqs = generateFreqsLight();

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
        window.location.href = "/presurvey";
        return {};
    }

    if (!checkProfile(profile)) {
        alert("Veuillez remplir le pré-sondage d'abord.");
        return window.location.href = "/presurvey";
    }

    return profile;
}

function getCounter() {
    return Number(localStorage.getItem("counter")) || 0;
}

function incrementCounter() {
    localStorage.setItem("counter", String(getCounter() + 1));
}

/**
 * @returns {{ left1: number, right1: number, left2: number, right2: number }}
 */
function generateFreqs() {
    const left1 = randomFreq();
    const right1 = randomFreq();
    const left2 = randomFreq();
    const right2 = randomFreq();

    if (
        profile.stereo === 0 &&
        (Math.abs(left1 - right1) < MONO_THRESHOLD ||
            Math.abs(left2 - right2) < MONO_THRESHOLD)
    )
        return generateFreqs();

    return {
        left1,
        right1,
        left2,
        right2
    };
}

function generateFreqsLight() {
    const low = randomFreq();
    const high1 = low * randomRatio();
    const high2 = low * randomRatio();

    if (
        profile.stereo === 0 &&
        (Math.abs(low - high1) < MONO_THRESHOLD ||
            Math.abs(low - high2) < MONO_THRESHOLD)
    )
        return generateFreqsLight();

    const r1 = Math.random() < 0.5;
    const r2 = Math.random() < 0.5;
    
    return {
        left1: r1 ? low : high1,
        right1: r1 ? high1 : low,
        left2: r2 ? low : high2,
        right2: r2 ? high2 : low,
    };
}

/**
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function randomFreq() {
    return 2 ** (Math.random() * (MAX_NOTE - MIN_NOTE) + MIN_NOTE);
}


function randomRatio() {
    return 2 ** Math.random();
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
    playing = true;

    const leftOsc = audioCtx.createOscillator();
    const rightOsc = audioCtx.createOscillator();

    leftOsc.type = "sine";
    rightOsc.type = "sine";
    leftOsc.frequency.value = id === 1 ? freqs.left1 : freqs.left2;
    rightOsc.frequency.value = id === 1 ? freqs.right1 : freqs.right2;

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

    setTimeout(() => playing = false, DURATION * 1000);
}

var clicked = false;

function sendSurveyResponse() {
    if (clicked)
        return;
    clicked = true;

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
        incrementCounter();
        alert("Réponse envoyée avec succès. Une nouvelle comparaison de sons vous sera maintenant présentée. Vous pouvez choisir d'y répondre ou d'arrêter votre participation ici.");
    }).catch(error => {
        console.error("Error:", error);
        alert("Une erreur est survenue lors de l'envoi des données. Veuillez réessayer.");
    }).finally(() => clicked = false);
}