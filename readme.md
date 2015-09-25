# idris-gpx

Convert GPX files to GeoJSON

## Install

```
npm install idris-gpx
```

## Usage

```
var gpx = require('idris-gpx')
```

**.summary(** gpxFile, callback **)**

Get a summary of the GPX file

```
gpx.summary('myGpxFile.gpx', function(summary) {
	console.log(summary)
})
```

Logs 

```
{ 
	distance: '27.868 km',
	climb: '698 m',
	time: '1h 32m 32s',
	points: 1061 
}
```

**.points(** gpxFile, callback **)**

Get a feature collection with all points from the GPX file

```
gpx.points('myGpxFile.gpx', function(collection) {
	// returns a feature collection
})
```

**.lines(** gpxFile, maxLines, callback **)**

Get a feature collection with lines to show your ride on a map. If you have a big GPX file, there might be too many points for the browser to handle. Specify the number of lines with ```maxLines```. 

```
gpx.lines('myGpxFile.gpx', 100, function(collection) {
	// returns a feature collection
})
```

**.oneLine(** gpxFile, maxPoints, callback **)**

Get a GeoJSON ```LineString``` feature with the whole ride. ```maxPoints``` is the number of coordinates in the line. The feature has the properties: ```distance```, ```time``` and ```climb```.

```
gpx.oneLine('myGpxFile.gpx', 100, function(collection) {
	// returns a feature
})
```
