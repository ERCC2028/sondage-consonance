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

function checkProfile(profile) {
    if (typeof profile !== "object" || profile === null)
        return false;

    if (Object.keys(profile).length !== Object.keys(profileStructure).length)
        return false;

    for (const key in profileStructure) {
        const value = profile[key];
        const answers = profileStructure[key];
        if (!Number.isInteger(value) || value < 0 || value >= answers) {
            console.log(profile, key, value, answers);
            return false;
        }
    }

    return true;
}

if (module)
    module.exports = checkProfile;