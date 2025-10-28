const profileStructure = {
    stereo: 3,
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

const MIN_FREQ = 200;
const MAX_FREQ = 1000;
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

if (module)
    module.exports = {
        checkProfile,
        MIN_FREQ,
        MAX_FREQ,
        DURATION,
        MONO_THRESHOLD
    };