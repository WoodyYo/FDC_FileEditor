FORMAT = "%A_%t.bmp";

var REGLIST = [/^\d*A/, /^\d*t/, /^\d*./];
function getFormatString(b) {
	var pos = 0;
	var s = FORMAT;
	while((pos = s.search('%')) != -1) {
		var right = s.slice(pos+1, s.length);
		var left = s.slice(0, pos);
		var x = "__";
		for(var i = 0; i < REGLIST.length; i++) {
			pos = right.search(REGLIST[i]);
			if(pos == 0) {
				var match = right.match(REGLIST[i])[0];
				x = getAttr(b, match, i);
				right = right.slice(match.length, right.length);
				break;
			}
		}
		s = left + x + right;
	}
	return s;
}

function getAttr(b, match, type) {
	var d = parseInt(match);  //NaN stands for default
	if(type == 0) { //get index
		if(isNaN(d)) d = 3;
		return b.getIndex(d);
	}
	else if(type == 1) {
		if(isNaN(d)) d = 2;
		return parseInt((b.end_time-b.start_time)*Math.pow(10, d));
	}
	else return "xx";
}