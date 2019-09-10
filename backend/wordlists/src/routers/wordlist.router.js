const express = require("express");
const service = require("../services/wordlist.service");
const multer = require("multer");

// 1 MB
var upload = multer({ limits: { fileSize: 1 * 1024 * 1024, files: 1 } });
const router = express.Router();

router
  .get("/", async (req, res) => {
    const user = req.user;
    const { page = 0 } = req.query;

    const wordlists = await service.list({ page },user);
    res.status(200).send({ wordlists });
  })
  .get("/:id", async (req, res) => {
    const wordlist = await service.get(req.params.id,req.user);
    if (wordlist)
        res.status(200).send(wordlist);
    else
        res.sendStatus(404);
  })  
  .post("/", express.json(), upload.single("words"), async (req, res) => {
    let wordlist = req.body;

    if (req.is("multipart/form-data")) {
      const { mimetype, buffer } = req.file;
      wordlist = req.body;

      if (/text\/plain/.test(mimetype)) {
        const text = buffer.toString("utf8");
        wordlist.words = text.split("\n").map(line => {
          return { name: line.trim() }
        });
      }
    }

    wordlist = await service.save(wordlist,req.user);

    if (wordlist._id) {
      res.set("Link", `/wordlists/${wordlist._id}`);
      res.status(201).end();
    } else {
      // Unsupported Media Type
      res.status(415).end();
    }
  })
  .delete("/:id", async (req, res) => {
    const dbResponse = await service.delete(req.params.id,req.user);

    if (dbResponse.ok === 1 && dbResponse.deletedCount === 1) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  })
  .patch("/:id", express.json(), async (req, res) => {
    const updateResult = await service.update(req.params.id, req.body,req.user);

    if (updateResult.ok === 1 && updateResult.nModified === 1) {
      res.set("Link", `/wordlists/${req.params.id}`);
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  });

module.exports = router;
