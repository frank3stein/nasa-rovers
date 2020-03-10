export const Rovers = (rovers, roverClick) => {
  const roversArray = rovers.map((rover, index) => {
    // To get the html elements as string, we use a parent element so we can get its innerHTML.
    // const outerDiv = document.createElement("div");
    // const article = document.createElement("article");
    // outerDiv.appendChild(article);
    // const button = document.createElement("button");
    // button.addEventListener("click", () => {
    //   roverClick(rovers, index);
    // });
    // button.innerHTML = `${rover.get("name")}`;
    // const ul = document.createElement("ul");
    // article.appendChild(button);
    // article.appendChild(ul);
    // ul.innerHTML = `<li>Landing Date: ${rover.get("landing_date")}</li>
    // <li>Launch Date: ${rover.get("launch_date")}</li>
    // <li>Status : ${rover.get("status")}</li>`;
    return `<article>
    <button onclick="${roverClick}">${rover.get("name")}</button>
      <ul>
          <li>Landing Date: ${rover.get("landing_date")}</li>
          <li>Launch Date: ${rover.get("launch_date")}</li>
          <li>Status : ${rover.get("status")}</li>
      </ul>
    </article>`;
    // return outerDiv.innerHTML;
  });

  const stringConcat = (x, y) => x + y;
  // turn our array elements to a concatanated string
  return roversArray.reduce(stringConcat);
};
