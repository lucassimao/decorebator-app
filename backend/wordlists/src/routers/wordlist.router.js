const express = require("express");
const service = require("../services/wordlist.service");
const multer = require("multer");
const wordRouter = require('./word.router');

// 1 MB
var upload = multer({ limits: { fileSize: 1 * 1024 * 1024, files: 1 } });
const router = express.Router();

router
  .use('/:idWordlist/words', wordRouter)
  .get("/", async (req, res) => {
    const user = req.user;
    const { page = 0 } = req.query;

    const wordlists = await service.list(user, { page });
    res.status(200).send({ wordlists });
  })
  .post("/:id/words/:wordId/images", async (req, res) => {
    const wordlist = await service.addImage(req.params.id, req.params.wordId, req.body);
    if (wordlist) {
      const word = wordlist.words.find(word => word._id == req.params.wordId);
      const newImage = word.images[word.images.length - 1];

      res.set("Link", `/wordlists/${req.params.id}/words/${req.params.wordId}/images/${newImage._id}`);
      res.status(201).send();
    } else {
      res.status(404).end();
    }
  })
//   .post("/:id/words", async (req, res) => {
//     const body = req.body;
//     const idWordlist = req.params.id;

//     const updatedWordlist = await service.addWord(idWordlist, body);
//     if (updatedWordlist) {
//       const newWord = updatedWordlist.words[updatedWordlist.words.length - 1];

//       res.set("Link", `/wordlists/${idWordlist}/words/${newWord._id}`);
//       res.status(204).end();
//     } else {
//       res.status(404).end();
//     }
//   })
  .post("/", upload.single("words"), async (req, res) => {
    let wordlist = req.body;

    if (req.is("multipart/form-data")) {
      const { mimetype, buffer } = req.file;
      wordlist = req.body;

      if (/text\/plain/.test(mimetype)) {
        const text = buffer.toString("utf8");
        wordlist.words = text.split("\n").map(line => {
          name: line.trim();
        });
      }
    }

    wordlist = await service.save(wordlist);

    if (wordlist._id) {
      res.set("Link", `/wordlists/${wordlist._id}`);
      res.status(201).end();
    } else {
      // Unsupported Media Type
      res.status(415).end();
    }
  })
//   .delete("/:id/words/:wordId", async (req, res) => {
//     const dbResponse = await service.deleteWord(req.params.id, req.params.wordId);

//     if (dbResponse.ok === 1 && dbResponse.nModified === 1) {
//       res.status(204).end();
//     } else {
//       res.status(404).end();
//     }
//   })
  .delete("/:id", async (req, res) => {
    const dbResponse = await service.delete(req.params.id);

    if (dbResponse.ok === 1 && dbResponse.deletedCount === 1) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  })
  .patch("/:id", async (req, res) => {
    const updateResult = await service.update(req.params.id, req.body);

    if (updateResult.ok === 1 && updateResult.nModified === 1) {
      res.set("Link", `/wordlists/${req.params.id}`);
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  });

module.exports = router;
