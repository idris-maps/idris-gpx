var convert = require('./lib/convertGPX')
var summary = require('./lib/summary')
var toPointFeatures = require('./lib/points2feats')
var toLineFeatures = require('./lib/points2lines')
var oneLine = require('./lib/oneLine')

exports.convert = function(gpxFile, callback) {
	convert(gpxFile, function(points) {
		callback(points)
	})	
}

exports.summary = function(gpxFile, callback) {
	convert(gpxFile, function(points) {
		callback(summary(points))
	})	
}

exports.points = function(gpxFile, callback) {
	convert(gpxFile, function(points) {
		callback({type: 'FeatureCollection', features: toPointFeatures(points)})
	})
}

exports.lines = function(gpxFile, maxPoints, callback) {
	convert(gpxFile, function(points) {
		callback(toLineFeatures(points, maxPoints))
	})
}

exports.oneLine = function(gpxFile, maxPoints, callback) {
	convert(gpxFile, function(points) {
		var sum = summary(points)
		var coll = toLineFeatures(points, maxPoints)
		callback(oneLine(coll, sum))
	})
}
