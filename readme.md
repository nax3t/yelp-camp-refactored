# YelpCamp

### Refactored by Ian Schoonover

## Google Maps Node-Geocoder Instructions:

- Uninstall geocoder and replace with node-geocoder
	- `npm uninstall geocoder ; npm i -S node-geocoder`
- Replace `var geocoder = require('geocoder');` in your /routes/campgrounds.js file with the following code:

```js
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'YOUR_API_KEY',
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
```

- Replace 'YOUR_API_KEY' with your API key after enabling the geocoder API in your [google developer console](https://console.developers.google.com/apis/library)
	- Search for geocoder, select the Geocoder API and click the ENABLE button
- Create a key, set http restrictions on it (for your development and production urls)
- Export the API key with [dotenv](https://www.npmjs.com/package/dotenv) and include it in your /routes/campgrounds.js file
- Update the POST and PUT routes with the following code:

```js
geocoder.geocode(req.body.location, function (err, data) {
  if (err || !data.length) {
    req.flash('error', 'Invalid address');
    return res.redirect('back');
  }
  var lat = data[0].latitude;
  var lng = data[0].longitude;
  var location = data[0].formattedAddress;
```

### Resources
View the official [node-geocoder documentation](https://www.npmjs.com/package/node-geocoder)