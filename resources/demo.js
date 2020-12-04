let progressTotal = 200;
let progressCurrent = randomInt(0, progressTotal);
let progressTarget = randomInt(0, progressTotal);

window.onload = function() {
	includeNav();
}

function includeNav() {

	if (document.getElementById('nav')) {

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

	let menuButton = document.createElement('img');

	menuButton.src = 'resources/icons/menu.svg';
	menuButton.id = 'menu-button';

	menuButton.addEventListener('click', function() {
		let nav = document.getElementById('nav');

		if (nav.style.display == 'none' || nav.style.display == '') {
			nav.style.display = 'block';
		} else {
			nav.style.display = 'none';
		}
	})

	document.body.appendChild(menuButton);
	window.onresize = function() {
		nav.style.display = '';
	}

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
function randomId(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
function dataGenerator(maxLen = 20, count = 1, decimal = false) {

	let data = [];
	let minMaxes = [];
	let factor = randomInt(3, 9);

	const length = randomInt(5, maxLen);

	for (var i = 0; i < count; i++) {

		let x = randomInt(10, 1000);

		minMaxes[i] = [x, randomInt(x, Math.max(x, 1) * randomInt(2, 10))];

	}

	for (var i = 0; i < length; i++) {

		let series = [randomId(2)];

		for (var j = 0; j < count; j++) {

			let x = randomInt(minMaxes[j][0], minMaxes[j][1]);

			if (decimal) x = x / factor;

			series.push(x);

		}

		data.push(series);

	}

	return data;

}