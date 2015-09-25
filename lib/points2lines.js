var distance = require('turf-distance')
var toPointFeatures = require('./points2feats')

module.exports = function(points, maxPoints) {
	var ptsFeats = toPointFeatures(points)
	var noDuplicates = removeDuplicates(ptsFeats)
	var withDist = addDist(noDuplicates)
	var totalDist = withDist[withDist.length - 1].properties.dist
	if(withDist.length > maxPoints) {
		var segDist = (totalDist / maxPoints) * 1000
	} else {
		var segDist = (totalDist / withDist.length) * 1000
	}
	var withSegs = addSegment(withDist, segDist)
	var segments = createSegments(withSegs, segDist)
	var segmentsMinMax = findMinMax(withSegs, segments)
	var segPoints = calcSegPoint(segmentsMinMax, withSegs, segDist)
	var lines = toLines(segPoints, segDist)
	return lines
}

function toLines(geojson, segInMeters) {
	var newGeojson = {
		"type": "FeatureCollection",
    	"features": []
	}
	for(i=0;i<geojson.features.length;i++) {
		if(i != 0) {
			var prev = geojson.features[i - 1];
			var feat = geojson.features[i];
			newGeojson.features.push({
				"type": "Feature",
				"geometry": {
					"type": "LineString",
					"coordinates": [prev.geometry.coordinates, feat.geometry.coordinates]
				},
				"properties": {
					"id": feat.properties.id,
					"dist": Math.floor(feat.properties.dist) / 1000,
					"pcElev": Math.floor((feat.properties.elev - prev.properties.elev) * 100 / segInMeters * 1000) / 1000,
					"elev": feat.properties.elev
				}
			
			})
		}
	}
	return newGeojson;
}

function calcSegPoint(segments, features, segInMeters) {
	var geojson = {
		"type": "FeatureCollection",
    	"features": []
	}
	for(i=0;i<segments.length;i++) {
		if(i == 0) {
			geojson.features.push({
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates" : [
						features[0].geometry.coordinates[0],
						features[0].geometry.coordinates[1]
					]
				},
				"properties": {
					"id": 0,
					"dist": 0,
					"elev": features[0].properties.ele
				}								
			})
		} else {
			var nextPt; 
			var prevPt;
			for(j=0;j<features.length;j++) {
				var feat = features[j];
				if(feat.properties.id == segments[i].minPt) {
					nextPt = feat;
				}
				if(feat.properties.id == segments[i-1].maxPt) {
					prevPt = feat;
				}
			}
			var point = {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates" : [
						(+prevPt.geometry.coordinates[0] + +nextPt.geometry.coordinates[0]) / 2,
						(+prevPt.geometry.coordinates[1] + +nextPt.geometry.coordinates[1]) / 2,
					]
				},
				"properties" : {
					"id": segments[i].seg,
					"dist": segments[i].seg * segInMeters,
					"elev": (+prevPt.properties.ele + +nextPt.properties.ele) / 2
				}
			}
			geojson.features.push(point)
		}
	}
	return geojson
}

function findMinMax(features, segments) {
	for(i=0;i<features.length;i++) {
		var feat = features[i];
		for(j=0;j<segments.length;j++) {
			if(feat.properties.seg == segments[j].seg) {
				if(segments[j].maxPt == null) { segments[j].maxPt =  feat.properties.id; }
				if(segments[j].minPt == null) { segments[j].minPt =  feat.properties.id; }
				if(segments[j].maxPt < feat.properties.id) { segments[j].maxPt = feat.properties.id; }
				if(segments[j].minPt > feat.properties.id) { segments[j].minPt = feat.properties.id; }
			}
		}
	}
	return segments;
}

function createSegments(features, meters) {
	var maxDist = features[features.length - 1].properties.seg;
	var segs = [];
	for(i=0;i<maxDist + 1;i++) {
		segs.push({seg: i, maxPt: null, minPt: null})
	}
	return segs;
}

function addSegment(features, meters) {
	for(i=0;i<features.length;i++) {
		var feature = features[i];
		feature.properties.seg = Math.floor(feature.properties.dist * (1000/meters));
	}
	return features;
}

function addDist(features) {
	var feats = [];
	var totalDist = 0;
	for(i=0;i<features.length;i++) {
		var f = features[i];
		if(i != 0) {
			var prevI = i - 1;
			var p = features[prevI];
			var d = distance(f,p,'kilometers');
			totalDist = totalDist + d;
			f.properties.dist = totalDist;
			feats.push(f)
		}
	}
	return feats;
}

function removeDuplicates(features) {
	var feats = [];
	for(i=0;i<features.length;i++) {
		var f = features[i];
		if(i != 0) {
			var prevI = i - 1;
			var p = features[prevI];
			if(f.geometry.coordinates != p.geometry.coordinates) {
				feats.push(f);
			}
		}
	}
	return feats
}
