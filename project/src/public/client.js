let store = Immutable.fromJS({
  user: { name: "Student" },
  apod: {},
  rovers: [{ name: "Curiosity" }, { name: "Opportunity" }, { name: "Spirit" }]
});
let renderCount = 0;
let apiCall = 0;

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (state, newState) => {
  store = state.merge(newState);
  render(root, store);
};

const getRoversData = async state => {
  const rovers = state.get("rovers");
  let newRovers = Immutable.List([]);
  const mergeRovers = await Promise.all(
    rovers.map(async rover => {
      const name = rover.get("name");
      const data = await fetch(
        `http://localhost:3000/rover/${name}`
      ).then(data => data.json());
      // console.log("data ", data);
      rover = rover.merge(data.rover);
      return rover;
      // console.log(state.get("rovers"));
    })
  );
  newRovers = newRovers.concat(mergeRovers);
  console.log(newRovers);
  return state.merge({ rovers: newRovers });
  // updateStore(state, { rovers: newRovers });
};

// Initializing the page, we get the information needed concurrently and update the store only once only after we get everything.
const initialize = async state => {
  const states = await Promise.all([
    getRoversData(state),
    getImageOfTheDay(state)
  ]);
  state = states[0].merge(states[1]);
  updateStore(store, state);
};

const render = async (root, state) => {
  renderCount++;
  console.log("Render count ", renderCount);
  root.innerHTML = App(state);
};

// create content
const App = state => {
  // let { rovers, apod } = state;
  //   console.log(state.get("user").get("name"));
  return `
        <header></header>
        <main>
            ${Greeting(state.get("user").get("name"))}
            <section>
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
                ${ImageOfTheDay(state.get("apod"))}
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  // getRoversData(store);
  initialize(store);
  // render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
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

// const TodaysImage = image => {
//   if (store) {
//   }
// };

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
// const ImageOfTheDay = today => photoDate => {};

// Example of a pure function that renders infomation requested from the backend
// TODO: Since we grab image of the day in initialize, we can remove the grabbing from here.
// const ImageOfTheDay = async image => {
//   const today = new Date().getDate();
//   const apodDate = new Date(image.get("date")).getDate();
//   if (image.size === 0) {
//     image = await getImageOfTheDay(store);
//     console.log(image);
//     return ImageOrVideo(image);
//   } else if (today === apodDate) {
//     return ImageOrVideo(image);
//   } else {
//     console.log("Else has run");
//     state = await getImageOfTheDay(store);
//     return ImageOrVideo(image);
//   }
// };

const ImageOfTheDay = image => {
  return ImageOrVideo(image);
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = async state => {
  let apod = state.get("apod");
  // if (apiCall > 0) {
  //   // Safeguard for development, since Nasa api is limited by the hour.
  //   console.log("ApiCall Stopped at", apiCall);
  //   return;
  // }
  // if (apod.size === 0) {
  const response = await fetch(`http://localhost:3000/apod`).then(res => {
    apiCall++;
    return res.json();
  });
  console.log("Api Call: ", apiCall);
  // console.log(response.image);
  apod = apod.merge(response.image);
  // console.log(apod);
  // updateStore(state, { apod });
  // console.log("Store apod ", store.get("apod"));
  return state.merge({ apod });
  // return response.image;
};
