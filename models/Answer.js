const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Answer = sequelize.define("Answer", {
    left1: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    right1: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    left2: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    right2: {
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