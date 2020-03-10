import { getImageOfTheDay, getRoversData } from "./api-access.js";
import { Rovers } from "./Components/Rovers.js";

let store = Immutable.fromJS({
  user: { name: "Student" },
  apod: {},
  rovers: [
    { name: "Curiosity", selected: false },
    { name: "Opportunity", selected: false },
    { name: "Spirit", selected: false }
  ],
  selected: 0
});
let renderCount = 0;
// add our markup to the page
const root = document.getElementById("root");

const updateStore = (state, newState) => {
  store = state.merge(newState);
  render(root, store);
  return store;
};

// Initializing the page, we get the information needed concurrently and update the store only once only after we get everything.
const initialize = async state => {
  const states = await Promise.all([
    getRoversData(state),
    getImageOfTheDay(state)
  ]);
  // Here I merge the result of the api calls into a single state before updating the store
  const newState = state.withMutations(state => {
    Immutable.set(state, "rovers", Immutable.fromJS(states[0]));
    Immutable.set(state, "apod", Immutable.fromJS(states[1]));
  });
  const initializedStore = updateStore(store, newState);
  return initializedStore;
};

const render = async (root, state) => {
  renderCount++;
  console.log("Render count ", renderCount);
  const AppInitiated = App(state);
  root.innerHTML = AppInitiated([Header, Main, Footer]);
};

const isString = x => typeof x === "string";
const componentStitcher = state => (x, y) => {
  // If it is a string, stich it right away, if not stich after the function returns the string.
  // When calling the function, it calls it with the state. So you have the option to call the components with custom arguments and it will still stich them together. If it is not called, it will call by injecting the state into it.
  return (isString(x) ? x : x({ state })) + (isString(y) ? y : y({ state }));
};

const Header = () => `<header></header>`;
const Main = ({ state }) => `<main>
  ${Greeting(state.get("user").get("name"))}
  ${Image(state.get("apod"))}
  <section class="rovers">
  ${Rovers(state.get("rovers"))}
  </section>
  <section id="carousel" class="slideshow-container">
  ${RoverCarousel(state.get("rovers").get(state.get("selected")), 0)}
    
  </section>
  </main>`;

const RoverCarousel = (rover, index) => {
  const latestPhotos = rover.get("latest_photos").get(index);
  return `
  <h2>${rover.get("name")}</h2>
  <img src="${latestPhotos.get("img_src")}"/>
  <p>Date taken: ${latestPhotos.get("earth_date")}</p>`;
};
const Image = image => `<section>
<h3>Put things on the page!</h3>
<p>Here is an example section.</p>
<p>
    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
    but generally help with discoverability of relevant imagery.
</p>
${ImageOfTheDay(image)}
</section>`;

const Footer = () => `<footer></footer>`;

// Stich the whole app together
// We also initiate the componentSticher with the state
const App = state => components => components.reduce(componentStitcher(state));

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  initialize(store);
  // I only add one eventlistener to catch all the clicks and react to it.
  document.getElementById("root").addEventListener("click", event => {
    event.stopPropagation();
    // Since the buttons are created per rover inside rovers Array, the index of the specific button is equal to the index of the rover inside the rovers array.
    const roverButtons = document.querySelectorAll("section.rovers button");
    const roverIndex = Array.prototype.indexOf.call(roverButtons, event.target);
    const state = { selected: roverIndex };
    updateStore(store, state);
  });
});

const Greeting = name => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

const ImageOrVideo = image => {
  if (!image) {
    return;
  }
  if (image.get("media_type") === "video") {
    return `
            <p>See today's featured video <a href="${image.get(
              "url"
            )}">here</a></p>
            <p>${image.get("title")}</p>
            <p>${image.get("explanation")}</p>
        `;
  } else {
    return `
            <img src="${image.get("url")}" height="350px" width="100%" />
            <p>${image.get("explanation")}</p>
        `;
  }
};

const ImageOfTheDay = image => ImageOrVideo(image);
