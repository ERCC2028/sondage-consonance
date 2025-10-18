const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Answer = sequelize.define("Answer", {
    sound1Left: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    sound1Right: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    sound2Left: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    sound2Right: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    mostConsonant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 2,
        },
    },
    profile: {
        type: DataTypes.JSON,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Answer;