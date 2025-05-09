const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");
const supabase = require("../config/db");


const upload = multer({ dest: "uploads/" });
const uploadMiddleware = upload.single("file");

const uploadFunc = async (req, res) => {

  try {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const { error } = await supabase.from("Pessoas").insert(results);
        fs.unlinkSync(req.file.path);
        if (error) {
          console.error("Erro ao inserir no Supabase:", error);
          return res.status(500).send("Erro ao inserir os dados no banco.");
        }

        return res.send("Dados inseridos!");
      }
      )
  }

  catch (err) {
    console.log(err);
    res.status(500).send("Erro ao processar o arquivo.");
  }


};

module.exports = { uploadFunc, uploadMiddleware };