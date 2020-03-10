const getImageOfTheDay = async state => {
  const response = await fetch(`http://localhost:3000/apod`).then(res => {
    return res.json();
  });

  console.log("Response image: ", response.image);
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

  console.log(mergeRovers);
  return mergeRovers.map(array => Object.assign(array[0].rover, array[1]));
  // const result = mergeRovers.map(async array => {
  //   const [roverData, latestPhotos] = await Promise.all([array[0], array[1]]);
  //   // console.log("roverData", roverData.rover);
  //   const rover = Object.assign(roverData.rover, latestPhotos);
  //   console.log(rover);
  //   return rover;
  // });
  // console.log(result);
  // return result;
  // console.log("Merge Rovers :", mergeRovers);
  // return mergeRovers;
};

// Instead of requesting it separately, I decided to request it with the rover data in parallel and combine the data and return it.
const getRoverLatestImages = async rover => {
  const latestImages = await fetch(
    `http://localhost:3000/rover/${rover.get("name")}/latest-photos`
  ).then(res => res.json());
  return latestImages;
};

export { getImageOfTheDay, getRoversData, getRoverLatestImages };
