module.exports = function(points) {
	var ptFeatures = []
	for(i=0;i<points.length;i++) {
		var keys = [];
		for(var k in points[i]) keys.push(k)
		var props = {}
		for(j=0;j<keys.length;j++) {
			var key = keys[j]
			if(key !== 'lat' && key !== 'lon') {
				props[key] = points[i][key]
			}
		}
		props.id = i
		var feat = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [+points[i].lon, +points[i].lat]
			},
			properties: props
		}
		ptFeatures.push(feat)
	}
	return ptFeatures
}
