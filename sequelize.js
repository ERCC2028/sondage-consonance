const { Sequelize } = require("sequelize");

/**
 * @type {import("sequelize").Options}
 */
const options = process.env.DATABASE_OPTIONS ? JSON.parse(process.env.DATABASE_OPTIONS) : {
    dialect: "sqlite",
    storage: "database.sqlite"
};

const sequelize = new Sequelize(options);

module.exports = sequelize;