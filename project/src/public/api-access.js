const getImageOfTheDay = async state => {
  const response = await fetch(`http://localhost:3000/apod`).then(res => {
    return res.json();
  });
  return response.image;
};
const getRoversData = async state => {
  const rovers = state.get("rovers");
  // I don't await here and fire off each request and get and array of 3 arrays of 2 promises.
  const mergeRovers = await Promise.all(
    rovers.map(rover => {
      const name = rover.get("name");
      return Promise.all([
        fetch(`http://localhost:3000/rover/${name}`).then(data => data.json()),
        fetch(
          `http://localhost:3000/rover/${name}/latest-photos`
        ).then(images => images.json())
      ]);
    })
  );

  return mergeRovers.map(array => Object.assign(array[0].rover, array[1]));
};

// Instead of requesting it separately, I decided to request it with the rover data in parallel and combine the data and return it.
const getRoverLatestImages = async rover => {
  const latestImages = await fetch(
    `http://localhost:3000/rover/${rover.get("name")}/latest-photos`
  ).then(res => res.json());
  return latestImages;
};

export { getImageOfTheDay, getRoversData, getRoverLatestImages };
