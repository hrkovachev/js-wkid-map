let map = L.map("map").setView([48.563271, 11.259328], 13);
let marker;

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let targetProjection = proj4.defs("EPSG:4326");

// coordinates transformation
//let sourceProjection = proj4.defs("EPSG:7855");

async function fetchProjString(wkid) {
  let response = await fetch(`https://epsg.io/${wkid}.proj4`);
  let data = await response.text();
  return data;
}

// get html elements
const wkidCodeElement = document.getElementById("wkid-code");
const xCoordElement = document.getElementById("x-coord");
const yCoordElement = document.getElementById("y-coord");
const showOnmapBtnElement = document.getElementById("show-on-map-btn");
const changeXYButton = document.getElementById("change-x-y");

//fetchProjString(wkid).then((data) => console.log(data));

// set event handlers
showOnmapBtnElement.addEventListener("click", showOnMapHandler);
document.querySelector('body').addEventListener("keydown", (e) => {
  if (e.key === "Enter"){
    showOnMapHandler()
  }
})

function showOnMapHandler(e) {
  // remove existing marker
  if (marker) {
    map.removeLayer(marker)
  }

  // get html elements

  let wkid = wkidCodeElement.value;

  let xCoord = Number(xCoordElement.value);

  let yCoord = Number(yCoordElement.value);
  // get proj string
  let projString = "";
  fetchProjString(wkid).then((data) => {
    projString = data;
    proj4.defs(wkid, projString);
    let sourceProjection = proj4(wkid);

    console.log(sourceProjection);

    let transformedArr = proj4(sourceProjection, targetProjection, [
      xCoord,
      yCoord,
    ]);

    //314855.053933, 5809038.141697

    console.log(transformedArr);

    map.setView([transformedArr[1], transformedArr[0], 13]);

    marker = L.marker([transformedArr[1], transformedArr[0]]).addTo(map);
  });
}


// add change coords event listener
changeXYButton.addEventListener("click", () => {
  [xCoordElement.value, yCoordElement.value] = [yCoordElement.value, xCoordElement.value]
})