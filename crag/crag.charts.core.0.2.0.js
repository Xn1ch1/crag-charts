// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.

const pallet = {
	red: '#f44336',
	pink: '#ec407a',
	purple: '#ba68c8',
	deeppurple: '#7e57c2',
	indigo: '#5c6bc0',
	blue: '#2196f3',
	lightblue: '#03a9f4',
	cyan: '#00bcd4',
	teal: '#009688',
	green: '#4caf50',
	lightgreen: '#8bc34a',
	lime: '#cddc39',
	yellow: '#ffeb3b',
	amber: '#ffc107',
	orange: '#ff9800',
	deeporange: '#ff5722',
	brown: '#8d6e63',
	grey: '#9e9e9e',
	bluegrey: '#607d8b',
	darkbluegrey: '#192841',
	black: '#000000',
	almostblack: '#222222',
	charcoal: '#333333',
	darkgrey: '#555555',
	lightgrey: '#DDDDDD',
	white: '#FFFFFF',
	multi: null,
	match: null,
	key: function(n) {
		return this[Object.keys(this)[n]];
	}
};

function validColor(col) {
	return pallet.hasOwnProperty(col);
}

function formatLabel(value, type = 'number', max = 0) {

	let label;

	switch(type) {
		case 'decimal':
			label = value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
			break;
		case 'time':
			label = sToTime(value, max);
			break;
		case 'currency':
			label = value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency'});
			break;
		default:
			label = value.toLocaleString(undefined, {maximumFractionDigits: 0});
			break;
	}

	return label;

}

function calculateScale(min, max, base) {

	let pMin = 0;
	let pMax = 0;
	let xMin = 0;
	let xMax = 0;
	let xMaj = 0;
	let power = 0;
	let factor = 0;
	let scalar = 0.2;
	let xSteps = 0;

	if (min == max) {
		min--;
	}

	if (min == 0) {
		pMin = 0;
	} else if (min > 0) {
		pMin = Math.max(0, min - (max - min) / 100).toFixed(5);
	} else {
		pMin = (min - (max-min) / 100).toFixed(5);
	}
	if (max == 0) {
		if (min == 0) {
			pMax = 1;
		} else {
			pMax = 0;
		}
	} else if (max < 0) {
		pMax = Math.min(max + (max - min) / 100).toFixed(5);
	} else {
		pMax = (max + (max - min) / 100).toFixed(5);
	}

	power = (Math.log(pMax - pMin) / Math.log(base)).toFixed(5);
	factor = (Math.pow(base, (power - Math.floor(power)))).toFixed(5);

	switch (true) {
		case (base == 10):
			switch (true) {
				case (factor < 2.5):
					scalar = 0.2;
					break;
				case (factor < 5):
					scalar = 0.5;
					break;
				case (factor < 10):
					scalar = 1;
					break;
				default:
					scalar = 2;
					break;
			}
			break;
		case (base == 60):
			switch (true) {
				case (factor < 2.5):
					scalar = 0.5;
					break;
				case (factor < 10):
					scalar = 1;
					break;
				case (factor < 100):
					scalar = 10;
					break;
				case (factor < 1000):
					scalar = 100;
					break;
				case (factor < 10000):
					scalar = 1000;
					break;
				default:
					scalar = 10000;
					break;
			}
			break;
		case (base == 3600):
			switch (true) {
				case (factor < 1.25):
					scalar = 0.25;
					break;
				case (factor < 2.5):
					scalar = 1;
					break;
				case (factor < 10):
					scalar = 2;
					break;
				case (factor < 100):
					scalar = 60;
					break;
				case (factor < 1000):
					scalar = 120;
					break;
				case (factor < 10000):
					scalar = 600;
					break;
				default:
					scalar = 600;
					break;
			}
			break;
		case (base == 42300):
			switch (true) {
				case (factor < 1.25):
					scalar = 0.25;
					break;
				case (factor < 2.5):
					scalar = 1;
					break;
				case (factor < 10):
					scalar = 2;
					break;
				case (factor < 100):
					scalar = 60;
					break;
				case (factor < 1000):
					scalar = 120;
					break;
				case (factor < 10000):
					scalar = 600;
					break;
				default:
					scalar = 600;
					break;
			}
			break;
		default:
			switch (true) {
				case (factor < 1.25):
					scalar = 0.25;
					break;
				case (factor < 2.5):
					scalar = 1;
					break;
				case (factor < 10):
					scalar = 2;
					break;
				case (factor < 100):
					scalar = 120;
					break;
				case (factor < 1000):
					scalar = 300;
					break;
				case (factor < 10000):
					scalar = 1800;
					break;
				default:
					scalar = 7200;
					break;
			}
			break;
	}

	xMaj = scalar * Math.pow(base, Math.floor(power));
	xMin = xMaj * Math.floor(pMin / xMaj);
	xMax = xMaj * (Math.floor(pMax / xMaj) + 1);
	xSteps = Math.round((xMax - xMin) / xMaj);

	return {'min': xMin, 'max': xMax, 'maj': xMaj, 'steps': xSteps};

}

function sToTime(s, max) {

	function pad(n, z) {
		let out = '';
		let split = n.toString().split('.');
		z = z || 2;

		out = ('00' + split[0]).slice(-z);

		if (split.length > 1) {
			out = out + '.' + split[1];
		}

		return out;

	}

	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;

	if (hrs > 0 || max > 3600) {

		return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);

	} else {

		return pad(mins) + ':' + pad(secs);

	}

}

function ObjectLength(object) {
	var length = 0;
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			++length;
		}
	}
	return length;
}

function getContrastYIQ(color){

	if (pallet.hasOwnProperty(color)) {
		color = pallet[color];
	}

	let r, g, b;

	if (color.includes('rgb')) {

		color = color.replace('rgb(', '').replace(')', '');

		r = color.split(',')[0].trim();
		g = color.split(',')[1].trim();
		b = color.split(',')[2].trim();

	} else {

		color = color.replace("#", "");

		r = parseInt(color.substr(0,2),16);
		g = parseInt(color.substr(2,2),16);
		b = parseInt(color.substr(4,2),16);

	}

	let yiq = ((r*299)+(g*587)+(b*114))/1000;

	return (yiq >= 128) ? 'darkgrey' : 'white';

}

function getContrastColor(color) {

	if (pallet.hasOwnProperty(color)) {
		color = pallet[color];
	}

	let r, g, b;

	if (color.includes('rgb')) {

		color = color.replace('rgb(', '').replace(')', '');

		r = color.split(',')[0].trim();
		g = color.split(',')[1].trim();
		b = color.split(',')[2].trim();

	} else {

		color = color.replace("#", "");

		r = parseInt(color.substr(0,2),16);
		g = parseInt(color.substr(2,2),16);
		b = parseInt(color.substr(4,2),16);

	}

	let yiq = ((r*299)+(g*587)+(b*114))/1000;

	return (yiq >= 140) ? pallet.charcoal : pallet.white;

}
Element.prototype.insertChildAtIndex = function(child, index) {
  if (!index) index = 0
  if (index >= this.children.length) {
    this.appendChild(child)
  } else {
    this.insertBefore(child, this.children[index])
  }
}