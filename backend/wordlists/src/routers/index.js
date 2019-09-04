const Router = require("express").Router;
const wordRouter = require("./word.router");
const wordlistRouter = require("./wordlist.router");
const imageRouter = require("./image.router");

const root = Router();

root
    .use("/wordlists/:idWordlist/words/:idWord/images", imageRouter)
    .use("/wordlists/:idWordlist/words", wordRouter)
    .use("/wordlists", wordlistRouter);

module.exports = root;
