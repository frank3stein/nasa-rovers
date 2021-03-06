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

// get general rover info
app.get("/rover/:rover", async (req, res) => {
  let { rover } = req.params;
  // make sure our rover is lowercase, it does not matter for the api, but it does for our check below.
  rover = rover.toLowerCase();
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
  try {
    const response = await fetch(
      `${baseUrlRovers + rover}?api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    res.send(response);
  } catch (error) {
    console.error(error);
  }
});

// get the latest photos for the specified rover
app.get("/rover/:rover/latest-photos", async (req, res) => {
  let { rover } = req.params;
  rover = rover.toLowerCase();

  try {
    const response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`
    ).then(res => res.json());

    res.send(response);
  } catch (err) {
    console.error("Error at rover/latest-photos endpoint ", err);
    res
      .status(500)
      .send(`Server error at rover/latest-photos endpoint : ${err}`);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
