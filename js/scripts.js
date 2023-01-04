let map = L.map("map").setView([48.563271, 11.259328], 13);

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
const showOnmapBtnElement = document.getElementById("show-on-map-btn");

//fetchProjString(wkid).then((data) => console.log(data));

// set event handlers
showOnmapBtnElement.addEventListener("click", () => {
  // get html elements
  const wkidCodeElement = document.getElementById("wkid-code");
  let wkid = wkidCodeElement.value;
  const xCoordElement = document.getElementById("x-coord");
  let xCoord = Number(xCoordElement.value);
  const yCoordElement = document.getElementById("y-coord");
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

    let marker = L.marker([transformedArr[1], transformedArr[0]]).addTo(map);
  });
});
