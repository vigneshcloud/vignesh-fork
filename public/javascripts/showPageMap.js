//const campgrounds = require("../../models/campgrounds");

  // = '<%-process.env.MAPBOX_TOKEN%>';
  mapboxgl.accessToken= 'pk.eyJ1IjoidnZjbG91ZG1hcGJveCIsImEiOiJja3o3ZXEwOXUwMzd1Mm5wYnIzY2d4MzZ3In0.S7ujF1YLiwnXpaMTp2o7UA';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
,setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
)
.addTo(map)
