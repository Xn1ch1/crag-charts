
let progressTotal = 200;
let progressCurrent = randomInt(0, progressTotal);
let progressTarget = randomInt(0, progressTotal);

function includeNav() {

	var elmnt, file, xhttp;
	elmnt = document.getElementById('nav');
	file = elmnt.getAttribute("w3-include-html");

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
		if (this.status == 200) {

			elmnt.innerHTML = this.responseText;

			var path = window.location.pathname;
			var page = path.split("/").pop().replace('.html', '');

			if (page == '') {
				page = 'index'
			}

			document.getElementsByClassName('nav-'+page)[0].classList.add('nav-active');

		}
		if (this.status == 404) {elmnt.innerHTML = 'Page not found.';}
		}
	}

	xhttp.open("GET", file, true);
	xhttp.send();

}

window.onload = function() {
	includeNav();
}
function disableBtn(btn) {
	const b = btn;
	btn.disabled = true;
	setTimeout(function() {
		b.disabled = false;
	}, 800);
}
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomDec(min, max) {
	return (Math.floor(Math.random() * max) + 1) / 5;
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
function randomFractionalDataSeries() {

	let series = [];

	const length = randomInt(5, 20);
	const min1 = randomDec(100, 10000);
	const max1 = randomDec(min1, min1 * randomInt(2, 10));
	const min2 = randomDec(10, 3600);
	const max2 = randomDec(min2, min2 * randomInt(2, 10));

	for (var i = 0; i < length; i++) {
		series.push([makeid(2), randomDec(min1, max1), randomDec(min2, max2)]);
	}
	return series;
}