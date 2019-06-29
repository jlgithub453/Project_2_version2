// Create a map object
var myMap = L.map("map-id", {
  center: [39.8283, -98.5795],
  zoom: 4
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// Function to assign color depending on Magnitude
function getColor(m) {
  var colors = ['red', 'darkorange', 'yellow', 'greenyellow', 'green', 'lightblue', 'mediumblue', 'plum', 'darkmagenta'];

  return m === "Buy Back" ? colors[8] :
    m === "Foreclosure Auction" ? colors[7] :
      m === "Full Payoff" ? colors[6] :
        m === "Note Sale - NPL" ? colors[5] :
          m === "Note Sale - PL" ? colors[4] :
            m === "Note Sale - RPL" ? colors[3] :
              m === "REO Sale DIL" ? colors[2] :
                m === "REO Sale FCL" ? colors[1] :
                  colors[0];
};

// Store our API endpoint inside queryUrl
var queryUrl = "../Data/mergeCleanjson.json"

d3.json(queryUrl, function(data) {
  // console.log(data);
  for (var i = 0; i < data.length; i++) {
    // console.log(data[i]);
  //  console.log(data[i]["Days to Liquidate"]);
  if (data[i]["Days to Liquidate"]>0&data[i]["Days to Liquidate"]<1000) {
    L.circle([data[i].latitude,data[i].longitude], {
      fillOpacity: 0.75,
      color: "grey",
      weight: 0.1,
      fillColor: getColor(data[i].MainCategoryDesc),
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to days to liquidate
      radius: data[i]["Days to Liquidate"]*100
    }).bindPopup("<h3>" + data[i].Full_Address+"</h3>").openPopup()
      .addTo(myMap)
    }};
});


var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),


    grades = ["Buy Back","Foreclosure Auction","Full Payoff","Note Sale - NPL","Note Sale - PL","Note Sale - RPL","REO Sale DIL","REO Sale FCL"],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i] ? '&ndash;' + grades[i] + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);

