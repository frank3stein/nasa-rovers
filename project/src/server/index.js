require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;
const baseUrlRovers = `https://api.nasa.gov/mars-photos/api/v1/rovers/`;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

// example API call
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.get("/rover/:rover", async (req, res) => {
  const { rover } = req.params;
  // make sure our rover is lowercase, it does not matter for the api, but it does for our check below.
  rover.toLowerCase();
  if (
    !(rover === "curiosity" || rover === "opportunity" || rover === "spirit")
  ) {
    console.error(`The client is requesting the wrong rover: ${rover}`);
    // make sure to check for 400 in the client to respond to the user.
    res
      .status(400)
      .send({ message: `The client is requesting the wrong rover: ${rover}` });
    return;
  }
  console.log(rover);
  try {
    const response = await fetch(
      `${baseUrlRovers + rover}?api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    res.send(response);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
