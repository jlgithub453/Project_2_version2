function createMap(mortgage=null) {
  // Define lightmap, outdoorsmap, and satellitemap layers
  let mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
  let accessToken = 'pk.eyJ1Ijoic2FyYWhsZXdrIiwiYSI6ImNqd3NsZ2drMjF2Z2g0NG82ZGtvZHdyNmwifQ.cXwY5IsGq6PhDXkLw4eZ1A';
  let lightmap = L.tileLayer(mapboxUrl, { id: 'mapbox.light', maxZoom: 20, accessToken: accessToken });
  let outdoorsmap = L.tileLayer(mapboxUrl, { id: 'mapbox.run-bike-hike', maxZoom: 20, accessToken: accessToken });
  let satellitemap = L.tileLayer(mapboxUrl, { id: 'mapbox.streets-satellite', maxZoom: 20, accessToken: accessToken });

  // Create our map, giving it the lightmap and earthquakes layers to display upon loading
  var myMap = L.map("map-id", {
    center: [39.8283, -98.5795],
    zoom: 3,
    layers: [lightmap, mortgage]
  });

  // Define a baseMaps object to hold base layers
  var baseMaps = {
    "Grayscle": lightmap,
    "Outdoors": outdoorsmap,
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold overlay layer
  var overlayMaps = {
    "Mortgage": mortgage,
  };

  // Create a layer control
  // Pass in baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create a legend to display information in the bottom right
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      MainCategoryDesc = ["Buy Back", "Foreclosure Auction", "Full Payoff", "Note Sale - NPL", "Note Sale - PL", "Note Sale - RPL", "REO Sale DIL", "REO Sale FCL", "Short Payoff"],
      labels = [];

    div.innerHTML += "<h4 style='margin:4px'>Exit Category</h4>"
    // Loop through density intervals and generate a label for each interval
    for (var i = 0; i < MainCategoryDesc.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(MainCategoryDesc[i] + 1) + '"></i> ' +
        MainCategoryDesc[i] + (MainCategoryDesc[i + 1] ? '&ndash;' + MainCategoryDesc[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
}

// Function to scale the Magnitude 
function markerSize(days) {
  return days * 30000;
};

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

function createFeatures(mortgageData) {
  console.log(mortgageData);

  var i=0;
    // console.log(mortgageData[i]["Days to Liquidate"]);
// for (i=0; i<mortgageData.length; i++){
  var mortgage = mortgageData[i];
  // var mortgage = mortgageData[i];
    // Give each feature a popup describing the information pertinent to it
    // onEachFeature: function (feature, layer) {
    //   // console.log(feature);

    //   layer.bindPopup("<h3 > Days to Liquidate: " + feature["Days to Liquidate"] +
    //     "</h3><hr><h3>Address: " + feature.Full_Address + "</h3>");
    // },
      

     L.circle([mortgage.latitude, mortgage.longitude],
        {
          radius: markerSize(mortgage["Days to Liquidate"]),
          fillColor: "red",
          // getColor(mortgage.MainCategoryDesc)
          fillOpacity: .8,
          color: 'grey',
          weight: .5
        }
        )
        
      }
    
  
  
 

  createMap(L.layerGroup(mortgage));
};



// Perform API call to USGS API to get earthquake data
d3.json("../Data/mergeDatajson.json", createFeatures);
