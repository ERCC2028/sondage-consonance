//
const profileStructure = {
    stereo: 2,
    headphones: 2,
    audioEffects: 3,
    environment: 3,
    age: 8,
    hearingIssues: 3,
    musicalTraining: 6,
    musicalSkills: 6,
    musicListening: 6,
    musicStyles: 8
};

const OCTAVA = 30;
const MIN_FREQ = 300;
const MAX_FREQ = 600;
const MIN_NOTE = freqToNote(MIN_FREQ);
const MAX_NOTE = freqToNote(MAX_FREQ);
const DURATION = 2;
const MONO_THRESHOLD = 25;

function checkProfile(profile) {
    if (typeof profile !== "object" || profile === null)
        return false;

    if (Object.keys(profile).length !== Object.keys(profileStructure).length)
        return false;

    for (const key in profileStructure) {
        const value = profile[key];
        const answers = profileStructure[key];
        if (!Number.isInteger(value) || value < 0 || value >= answers)
            return false;
    }

    return true;
}

/**
 * @param {number} freq 
 * @returns {number}
 */
function freqToNote(freq) {
    return Math.round(Math.log2(freq) * OCTAVA);
}

/**
 * @param {number} note
 * @returns {number}
 */
function noteToFreq(note) {
    return 2 ** (note / OCTAVA);
}

if (module)
    module.exports = {
        checkProfile,
        freqToNote,
        noteToFreq,
        OCTAVA,
        MIN_FREQ,
        MAX_FREQ,
        MIN_NOTE,
        MAX_NOTE,
        DURATION,
        MONO_THRESHOLD
    };