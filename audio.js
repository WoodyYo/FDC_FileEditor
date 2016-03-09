var audio;
var playing = false;
var audio_timer;
var timer_obj;
var button;

function clickPlay() {
	if(playing == false) {
		button.innerHTML = 'STOP';
		audio.play();
		timerUpdate();
		playing = true;
	}
	else {
		button.innerHTML = 'PLAY';
		audio.pause();
		clearTimeout(timer_obj);
		playing = false;
	}
}

function playAtTime(time) {
	audio.currentTime = time;
	playing = false;
	clickPlay();
}

function initAudio() {
	audio = document.getElementById('myaudio');
	audio_timer = document.getElementById('audio-timer');
	button = document.getElementById('play-btn');
	audio.addEventListener('canplaythrough', function() {
		initCanvas('mycanvas', parseInt(this.duration));
	});
}

function timerUpdate() {
	audio_timer.innerHTML = secToText(parseInt(audio.currentTime));
	drawCurTime(audio.currentTime);
	timer_obj = setTimeout(timerUpdate, 100);
}