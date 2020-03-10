export const Rovers = rovers => {
  const roversArray = rovers.map(rover => {
    return `<article>
    <button>${rover.get("name")}</button>
      <ul>
          <li>Landing Date: ${rover.get("landing_date")}</li>
          <li>Launch Date: ${rover.get("launch_date")}</li>
          <li>Status : ${rover.get("status")}</li>
      </ul>
    </article>`;
  });

  const stringConcat = (x, y) => x + y;
  // turn our array elements to a concatanated string
  return roversArray.reduce(stringConcat);
};
