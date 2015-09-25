var distance = require('turf-distance')
var moment = require('moment')
module.exports = function(points) {
	var nbPoints = 0
	var climb = 0
	var dist = 0
	var t = moment(points[points.length - 1].time)._d.valueOf() - moment(points[0].time)._d.valueOf() 
	var d = new Date(t)
	var time = d.getHours() - 1 + 'h ' + d.getMinutes() + 'm ' + d.getSeconds() + 's'
	for(i=0;i<points.length;i++) {
		nbPoints = nbPoints + 1
		if(i !== 0 && points[i].ele !== undefined) {
			var prev = points[i - 1]
			var curr = points[i]
			dist =  dist + getDistance(prev,curr)
			var prevEle = prev.ele
			var ele = curr.ele
			if(ele > prevEle) {
				climb = climb + (ele - prevEle)
			}
		}
	}
	return {
		distance: Math.floor(dist * 1000) / 1000 + ' km',
		climb: climb + ' m',
		time: time,
		points: nbPoints
	}
} 

function getDistance(prev, curr) {
	var point1 = {
		"type": "Feature",
		"properties": {},
		"geometry": {
		  "type": "Point",
		  "coordinates": [prev.lon, prev.lat]
		}
	}
	var point2 = {
		"type": "Feature",
		"properties": {},
		"geometry": {
		  "type": "Point",
		  "coordinates": [curr.lon, curr.lat]
		}
	}
	var units = 'kilometers'
	return distance(point1, point2, units)
}
