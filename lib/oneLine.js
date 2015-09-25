module.exports = function(coll, sum) {
	var coords = []
	for(i=0;i<coll.features.length;i++) {
		var f = coll.features[i]
		if(i === 0) {
			coords.push(f.geometry.coordinates[0])
			coords.push(f.geometry.coordinates[1])
		} else {
			coords.push(f.geometry.coordinates[1])
		}
	}
	var feat = {
		type: 'Feature',
		properties: {
			distance: sum.distance,
			time: sum.time,
			climb: sum.climb
		},
		geometry: {
			type: 'LineString',
			coordinates: coords
		}
	}
	return feat
}
