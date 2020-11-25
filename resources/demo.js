
let progressTotal = 200;
let progressCurrent = randomInt(0, progressTotal);
let progressTarget = randomInt(0, progressTotal);

function includeHTML() {
	var z, i, elmnt, file, xhttp;
	z = document.getElementsByTagName("*");
	for (i = 0; i < z.length; i++) {
	  elmnt = z[i];
	  file = elmnt.getAttribute("w3-include-html");
	  if (file) {
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		  if (this.readyState == 4) {
			if (this.status == 200) {elmnt.innerHTML = this.responseText;}
			if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
			elmnt.removeAttribute("w3-include-html");
			includeHTML();
		  }
		}
		xhttp.open("GET", file, true);
		xhttp.send();
		return;
	  }
	}
  }

window.onload = function() {
	includeHTML();
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function makeid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
function randomDataSeries() {

	let series = [];

	const length = randomInt(5, 20);
	const min1 = randomInt(10, 1000);
	const max1 = randomInt(min1, Math.max(min1, 1) * randomInt(2, 10));
	const min2 = randomInt(1, 360);
	const max2 = randomInt(min2, Math.max(min2, 1) * randomInt(2, 10));

	for (var i = 0; i < length; i++) {
		series.push([makeid(2), randomInt(min1, max1), randomInt(min2, max2)]);
	}
	return series;
}
function plusC(x) {
	if (x == 0) {
		progressCurrent = progressTotal;
	} else if (x == 1) {
		progressCurrent++;
	} else if (x == 2) {
		progressCurrent += randomInt(1, progressTotal / 10);
	}
	progressChart.current = progressCurrent;
}
function minusC(x) {
	if (x == 0) {
		progressCurrent = 0;
	} else if (x == 1) {
		progressCurrent--;
	} else if (x == 2) {
		progressCurrent -= randomInt(1, progressTotal / 10);
	}
	progressChart.current = progressCurrent;
}
function c() {
	progressCurrent = randomInt(0, progressTotal);
	progressChart.current = progressCurrent;
}
function plusT(x) {
	if (x == 0) {
		progressTarget = progressTotal;
	} else if (x == 1) {
		progressTarget++;
	} else if (x == 2) {
		progressTarget += randomInt(1, progressTotal / 10);
	}
	progressChart.target = progressTarget;
}
function minusT(x) {
	if (x == 0) {
		progressTarget = 0;
	} else if (x == 1) {
		progressTarget--;
	} else if (x == 2) {
		progressTarget -= randomInt(1, progressTotal / 10);
	}
	progressChart.target = progressTarget;
}
function t() {
	progressTarget = randomInt(0, progressTotal);
	progressChart.target = progressTarget;
}