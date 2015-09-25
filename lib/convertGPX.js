var fs = require('fs')
var xmldoc = require('xmldoc')

module.exports = function(gpxFile, callback) {
	var points = []
	fs.readFile(gpxFile, function(err, file) {
		if(err) { console.log(err) }
		var xml = new xmldoc.XmlDocument(file)
		var trks = []
		for(i=0;i<xml.children.length;i++) {
			if(xml.children[i].name === 'trk') {
				trks.push(xml.children[i])
			}
		}
		var trksegs = []
		for(i=0;i<trks.length;i++) {
			segs = getTrkseg(trks[i])
			for(j=0;j<segs.length;j++) {
				trksegs.push(segs[j])
			}
		}
		var trkpts = []
		for(j=0;j<trksegs.length;j++) {
			for(k=0;k<trksegs[j].children.length;k++) {
				if(trksegs[j].children[k].name === 'trkpt') {
					trkpts.push(trksegs[j].children[k])
				}
			}
		}

		for(i=0;i<trkpts.length;i++) {
			var pt = {
				lat: trkpts[i].attr.lat,
				lon: trkpts[i].attr.lon,
			}
			
			for(j=0;j<trkpts[i].children.length;j++) {
				pt[trkpts[i].children[j].name] = trkpts[i].children[j].val
			}
			points.push(pt)
		}
		callback(points)
	})
	
}

function getTrkseg(trk) {
	var trksegs = []
	for(i=0;i<trk.children.length;i++) {
		if(trk.children[i].name === 'trkseg') {
			trksegs.push(trk.children[i])
		}
	}
	return trksegs
}
