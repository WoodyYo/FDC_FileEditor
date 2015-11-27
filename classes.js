function ImageBlock(img, start_time) {
	this.img = img;
	this.start_time = start_time;
	this.tmp_start = start_time;
	this.end_time= start_time;
	this.tmp_end = start_time;
}
var err = 0.3; // 0.3 second
START=-1, END=1, MIDLE=2, NO_OVERLAP=0;
ImageBlock.prototype.checkOverlap = function(t) {
	if(Math.abs(t-this.start_time) < err) return START;
	else if(Math.abs(t-this.end_time) < err) return END;
	else if(t > this.start_time && t < this.end_time) return MIDLE;
	else return NO_OVERLAP;
}

function BlockList() {
	this.a = [];
	this.selected_l = 0;
	this.selected_r = 0;
}
BlockList.prototype.push = function(b) {
	this.a.push(b);
	this.selectSingle(this.a.length-1);
	return this.a.length-1;
}
BlockList.prototype.del = function(index) {
	tmp = this.a.splice(0, index);
	this.a.splice(0, 1);
	this.a = tmp.concat(this.a);
}
BlockList.prototype.get = function(i) {
	return this.a[i];
}
BlockList.prototype.selectSingle = function(i) {
	this.selected_l = i;
	this.selected_r = i+1;
}
BlockList.prototype.select = function(i) {
	if(this.selected_r > 0) {
		if(i >= this.selected_l && i < this.selected_r) return;
		if(i == this.selected_r) this.selected_r++;
		else if(i == this.selected_l-1) this.selected_l--;
		else this.selectSingle(i);
	}
	else this.selectSingle(i);
}
BlockList.prototype.find = function(t) {
	for(var i = 0; i < this.a.length; i++) {
		var state = this.a[i].checkOverlap(t);
		if(state != NO_OVERLAP) {
			return {index: i, state: state};
		}
	}
	return {index: -1}; //not found
}
BlockList.prototype.getSelected = function() {
	var a = [];
	for(var i = this.selected_l; i < this.selected_r; i++) {
		a.push(this.a[i]);
	}
	return a;
}
BlockList.prototype.getUnSelected = function() {
	var a = [];
	for(var i = 0; i < this.selected_l; i++) a.push(this.a[i]);
	for(var i = this.selected_r; i < this.a.length; i++) a.push(this.a[i]);
	return a;
}
BlockList.prototype.clearSelected = function() {
	this.selected_r = this.selected_l = 0;
}
BlockList.prototype.acceptTmp = function() {
	var a = this.getSelected();
	for(var i = 0; i < a.length; i++) {
		a[i].start_time = a[i].tmp_start;
		a[i].end_time = a[i].tmp_end;
	}
}
BlockList.prototype.sort = function() {
	this.a.sort(function(x, y) {
		return x.start_time - y.start_time;
	});
}
function within(tar, a, b) {
	if(tar < a) return false;
	if(tar > b) return false;
	return true;
}
BlockList.prototype.checkOverlap = function() {
	//check if the selected blocks overlap with unselected, using tmp infos.
	var selected = this.getSelected();
	var unselected = this.getUnSelected();
	for(var j = 0; j < selected.length; j++) {
		if(selected[j].tmp_start < 0) return true;
		for(var i = 0; i < unselected.length; i++) {	
			if(within(unselected[i].start_time, selected[j].tmp_start, selected[j].tmp_end)) return true;
			if(within(unselected[i].end_time, selected[j].tmp_start, selected[j].tmp_end)) return true;
			if(within(selected[j].tmp_start, unselected[i].start_time, unselected[i].end_time)) return true;
		}
	}
	return false;
}
