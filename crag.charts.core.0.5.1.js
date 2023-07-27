class CragPallet {
	static red = '#f44336';
	static pink = '#ec407a';
	static purple = '#ba68c8';
	static deepPurple = '#7e57c2';
	static indigo = '#5c6bc0';
	static blue = '#2196f3';
	static lightBlue = '#03a9f4';
	static cyan = '#00bcd4';
	static teal = '#009688';
	static green = '#4caf50';
	static lightGreen = '#8bc34a';
	static lime = '#cddc39';
	static yellow = '#ffeb3b';
	static amber = '#ffc107';
	static orange = '#ff9800';
	static deepOrange = '#ff5722';
	static brown = '#8d6e63';
	static grey = '#9e9e9e';
	static blueGrey = '#607d8b';
	static darkBlueGrey = '#192841';
	static black = '#000000';
	static almostBlack = '#222222';
	static charcoal = '#333333';
	static darkGrey = '#555555';
	static lightGrey = '#DDDDDD';
	static white = '#FFFFFF';
	static transparent = 'transparent';

	static warm = {
		softPeach: '#EEDDD0',
		peach: '#FFDCC2',
		melon: '#FFD0A9',
		cantaloupe: '#FFC48C',
		honey: '#FFB46B',
		tangerine: '#FFA24D',
		orange: '#FF9031',
		carrot: '#FF831C',
		pumpkin: '#FF7410',
		marigold: '#FF6400',
		amber: '#FF5A00',
		cinnamon: '#FF4D00',
		terracotta: '#FF3F00',
		rust: '#FF3100',
		brick: '#FF2200',
		tomato: '#FF1600',
		chili: '#FF0A00',
		fireEngineRed: '#FF0000',
		cherryRed: '#FF0013',
		darkCherry: '#B30000',
	}

	static cool = {
		mintyAqua: '#80ffdb',
		turquoiseHaze: '#7af1dd',
		coastalBlue: '#74e4df',
		tranquilSky: '#6ed7e1',
		sereneAzure: '#68cae3',
		icyCerulean: '#62bde5',
		crystalBlue: '#5cb0e7',
		azureWaters: '#56a3e9',
		dreamyCobalt: '#5096eb',
		electricBlue: '#4a89ed',
		brilliantSapphire: '#448cf0',
		vividSkyBlue: '#3e8fef',
		clearRoyalBlue: '#3888ee',
		deepOceanBlue: '#327fec',
		intenseIndigo: '#2c72ea',
		lapisLazuli: '#2665e8',
		richNavyBlue: '#2058e6',
		darkSapphire: '#1a4be4',
		twilightBlue: '#144ee2',
		midnightBlue: '#0e41e0',
	}

	static auto = '1';
	static match = '2';
	static multi = '3';
	static redGreen = '4';
	static warmGradient = '5';
	static coolGradient = '6';
	static dynamicWarmGradient = '7';
	static dynamicCoolGradient = '8';

}
/**
 * @typedef optionsChart Chart options.
 * @property {null|string} [title] Title to show above the chart.
 * @property {string} [color] Background color of the chart, can be hex code or pallet name.
 */
/**
 * @typedef optionsVAxis vAxis Options.
 * @property {string} [name] The name of the data series for the vAxis, will be applied to the tool tip.
 * @property {boolean} [majorLines] Enables the horizontal major lines.
 * @property {boolean} [minorLines] Enables the horizontal minor lines.
 * @property {boolean} [shadowOnZeroLine] Enables a drop shadow on the primary major zero line.
 * @property {string} [format] Formatting type, must be one of the valid options.
 * @property {string} [currencySymbol] Optional currency format.
 * @property {number} [decimalPlaces] Number of decimal places for decimal formats.
 * @property {string|number} [min] Sets the minimum value for the vAxis, when omitted, this will be calculated automatically.
 */
class CragCore {

	pallet = {
		red: CragPallet.red,
		pink: CragPallet.pink,
		purple: CragPallet.purple,
		deepPurple: CragPallet.deepPurple,
		indigo: CragPallet.indigo,
		blue: CragPallet.blue,
		lightBlue: CragPallet.lightBlue,
		cyan: CragPallet.cyan,
		teal: CragPallet.teal,
		green: CragPallet.green,
		lightGreen: CragPallet.lightGreen,
		lime: CragPallet.lime,
		yellow: CragPallet.yellow,
		amber: CragPallet.amber,
		orange: CragPallet.orange,
		deepOrange: CragPallet.deepOrange,
		brown: CragPallet.brown,
		grey: CragPallet.grey,
		blueGrey: CragPallet.blueGrey,
		darkBlueGrey: CragPallet.darkBlueGrey,
		black: CragPallet.black,
		almostBlack: CragPallet.almostBlack,
		charcoal: CragPallet.charcoal,
		darkGrey: CragPallet.darkGrey,
		lightGrey: CragPallet.lightGrey,
		white: CragPallet.white,
		cool: {
			mintyAqua: CragPallet.cool.mintyAqua,
			turquoiseHaze: CragPallet.cool.turquoiseHaze,
			coastalBlue: CragPallet.cool.coastalBlue,
			tranquilSky: CragPallet.cool.tranquilSky,
			sereneAzure: CragPallet.cool.sereneAzure,
			icyCerulean: CragPallet.cool.icyCerulean,
			crystalBlue: CragPallet.cool.crystalBlue,
			azureWaters: CragPallet.cool.azureWaters,
			dreamyCobalt: CragPallet.cool.dreamyCobalt,
			electricBlue: CragPallet.cool.electricBlue,
			brilliantSapphire: CragPallet.cool.brilliantSapphire,
			vividSkyBlue: CragPallet.cool.vividSkyBlue,
			clearRoyalBlue: CragPallet.cool.clearRoyalBlue,
			deepOceanBlue: CragPallet.cool.deepOceanBlue,
			intenseIndigo: CragPallet.cool.intenseIndigo,
			lapisLazuli: CragPallet.cool.lapisLazuli,
			richNavyBlue: CragPallet.cool.richNavyBlue,
			darkSapphire: CragPallet.cool.darkSapphire,
			twilightBlue: CragPallet.cool.twilightBlue,
			midnightBlue: CragPallet.cool.midnightBlue,
		},
		warm: {
			softPeach: CragPallet.warm.softPeach,
			peach: CragPallet.warm.peach,
			melon: CragPallet.warm.melon,
			cantaloupe: CragPallet.warm.cantaloupe,
			honey: CragPallet.warm.honey,
			tangerine: CragPallet.warm.tangerine,
			orange: CragPallet.warm.orange,
			carrot: CragPallet.warm.carrot,
			pumpkin: CragPallet.warm.pumpkin,
			marigold: CragPallet.warm.marigold,
			amber: CragPallet.warm.amber,
			cinnamon: CragPallet.warm.cinnamon,
			terracotta: CragPallet.warm.terracotta,
			rust: CragPallet.warm.rust,
			brick: CragPallet.warm.brick,
			tomato: CragPallet.warm.tomato,
			chili: CragPallet.warm.chili,
			fireEngineRed: CragPallet.warm.fireEngineRed,
			cherryRed: CragPallet.warm.cherryRed,
			darkCherry: CragPallet.warm.darkCherry,
		}
	}

	modes = [
		CragPallet.auto,
		CragPallet.match,
		CragPallet.multi,
		CragPallet.redGreen,
		CragPallet.warmGradient,
		CragPallet.coolGradient,
		CragPallet.dynamicWarmGradient,
		CragPallet.dynamicCoolGradient,
	];

	_colorByIndex(index) {

		const colorKeys = Object.keys(this.pallet);
		const numColors = colorKeys.length;
		const colorIndex = (index % numColors + numColors) % numColors;

		return colorKeys[colorIndex];

	}

	/**
	 * Resolves a color value, from either a hex code, pallet name or mode.
	 * @param {string|int} value Pallet id, hex code or color mode.
	 * @return {string} Returns hex code. Or returns mode name if valid mode provided
	 */
	_resolveColor(value) {

		/**
		 * Check to see if value is one of the acceptable modes
		 */
		if (this.modes.includes(value)) return value;

		/**
		 * Check to see if value is name of color from pallet
		 */
		if (this.pallet.hasOwnProperty(value)) return this.pallet[value];

		/**
		 * Value is one of the nested pallets, for example 'cool.aquaHaze'
		 */
		if (value && value.includes('.')) {

			const properties = value.split('.');

			if (this.pallet.hasOwnProperty(properties[0]) && this.pallet[properties[0]].hasOwnProperty(properties[1])) {

				return this.pallet[properties[0]][properties[1]];

			}

		}

		/**
		 * Check to see if the value is a valid hex code color.
		 */
		if (this._isValidHexColor(value)) return value;

		/**
		 * Convert rgba or rgb to hex and return
		 */
		if (this._isValidRGBColor(value)) return this._rgbToHex(value);

		/**
		 * Default to white
		 */
		return CragPallet.white;

	}

	/**
	 * Resolves a color value, from either a hex code, pallet name or mode.
	 * @param {string|int} value Pallet id, hex code or color mode.
	 * @return {boolean} True if value is pallet name, hex code or mode
	 */
	_isValidColor(value) {

		/**
		 * Check to see if value is one of the acceptable modes
		 */
		if (this.modes.includes(value)) return true;

		/**
		 * Check to see if value is name of color from pallet
		 */
		if (this.pallet.hasOwnProperty(value)) return true;

		/**
		 * Value is one of the nested pallets, for example 'cool.aquaHaze'
		 */
		if (value && value.includes('.')) {

			const properties = value.split('.');

			return this.pallet.hasOwnProperty(properties[0]) && this.pallet[properties[0]].hasOwnProperty(properties[1]);

		}

		/**
		 * Check to see if value is correct rgb/a color
		 */
		if (this._isValidRGBColor(value)) return true;

		return this._isValidHexColor(value);

	}

	_getColorByMode(mode, value, value2 = 0) {

		if (value === undefined) throw "Value needs to be set for mode to function correctly";

		if (mode === CragPallet.redGreen) {

			if (value < 0) return this.pallet.red;

			return this.pallet.green;

		}

		if (mode === CragPallet.dynamicWarmGradient) {

			const intervalSize = 100 / Object.values(CragPallet.warm).length;
			const index = Math.min(Math.floor(((value2 / value) * 100) / intervalSize), Object.values(CragPallet.warm).length - 1);

			return Object.values(CragPallet.warm)[index];

		}

		if (mode === CragPallet.dynamicCoolGradient) {

			const intervalSize = 100 / Object.values(CragPallet.cool).length;
			const index = Math.min(Math.floor(((value2 / value) * 100) / intervalSize), Object.values(CragPallet.cool).length - 1);

			return Object.values(CragPallet.cool)[index];

		}

		if (mode === CragPallet.warmGradient) return Object.values(CragPallet.warm)[value];
		if (mode === CragPallet.coolGradient) return Object.values(CragPallet.cool)[value];
		if (mode === CragPallet.multi) return Object.values(this.pallet)[value];
		if (mode === CragPallet.match) return this._resolveColor(value);

		return null;

	}

	_isValidRGBColor(rgbaCode) {

		return this._rgbToHex(rgbaCode) !== null;

	}

	/**
	 *
	 * @param rgbaCode
	 * @returns {string|null}
	 * @private
	 */
	_rgbToHex(rgbaCode) {

		function componentToHex(c) {

			const hex = Number(c).toString(16);

			return hex.length === 1 ? "0" + hex : hex;

		}

		if (typeof rgbaCode === 'string' && rgbaCode.includes('rgb')) {

			rgbaCode = rgbaCode.replace('rgb(', '').replace('rgba(', '').replace(')', '');

			const r = componentToHex(rgbaCode.split(',')[0].trim());
			const g = componentToHex(rgbaCode.split(',')[1].trim());
			const b = componentToHex(rgbaCode.split(',')[2].trim());

			if (this._isValidHexColor(`#${r}${g}${b}`)) return `#${r}${g}${b}`

		}

		return null;

	}

	_isValidHexColor(hexCode) {

		return /^#[0-9A-F]{6}$/i.test(hexCode);

	}

	_getContrastColor(color) {

		color = this._resolveColor(color);

		if (color === false) return '#000000';

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

		let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

		return (yiq >= 140) ? this.pallet.charcoal : this.pallet.white;

	}

	labelFormats = ['number', 'time', 'currency', 'decimal'];
	labelPositions = ['none', 'inside', 'outside'];

	/**
	 * Converts a number value into a specified formatted string. Will default to number with no decimal places where not specified.
	 * @param {number} value Numerical value to be formatted. In case of time, this will be seconds.
	 * @param {string} type Type of formatting to apply, either 'decimal', 'time', 'currency' or default of 'number'
	 * @param {string|null} currencySymbol Additional options to be passed to formatter. To be used for currency formatting; pass along the code, eg 'GBP'
	 * @param {number} decimalPlaces Number of decimal places for decimal formats.
	 * @return {string} Returns formatted string
	 */
	formatLabel(value, type = 'number', currencySymbol = 'GBP', decimalPlaces = 0) {

		switch(type) {

			case 'decimal':
				return value.toLocaleString(undefined, {minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces});

			case 'time':
				return sToTime(value);

			case 'currency':
				return new Intl.NumberFormat('en-GB',
					{ style: 'currency', currency: currencySymbol, minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces}
				).format(value);

			default:
				return value.toLocaleString(undefined, {minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces});

		}

	}

	_isValidFormat(format) {

		return this.labelFormats.includes(format);

	}

	/**
	 * Validates an input option to make sure it conforms to the required type. If an array is passed
	 * as type, function will check to see if value is in the array.
	 * @param {any} value Value to validate
	 * @param {any} type String type name or array to check value exists within.
	 * @param {any} defaultValue Default to be returned when the value does not conform to required type
	 * @returns {any} Returns the value if it is a valid type, otherwise the default value
	 */
	validateOption(value, type, defaultValue) {

		/**
		 * If the type object is an array, check to see if the value
		 * exists in the array, otherwise return the default.
		 */
		if (Array.isArray(type)) {

			if (type.includes(value)) return value;

			return defaultValue

		}

		if (typeof value === type) return value;

		return defaultValue

	}

}

/**
 * Converts a number value into a specified formatted string. Will default to number with no decimal places where not specified.
 * @param {number} value Numerical value to be formatted. In case of time, this will be seconds.
 * @param {string} type Type of formatting to apply, either 'decimal', 'time', 'currency' or default of 'number'
 * @param {string|null} currencySymbol Additional options to be passed to formatter. To be used for currency formatting; pass along the code, eg 'GBP'
 * @param {number} decimalPlaces Number of decimal places for decimal formats
 * @return {string} Returns formatted string
 */
function formatLabel(value, type = 'number', currencySymbol = 'GBP', decimalPlaces = 0) {

	switch(type) {

		case 'decimal':
			return value.toLocaleString(undefined, {minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces});

		case 'time':
			return sToTime(value);

		case 'currency':
			return new Intl.NumberFormat('en-GB',
				{ style: 'currency', currency: currencySymbol }
			).format(value);

		default:
			return value.toLocaleString(undefined, {maximumFractionDigits: decimalPlaces});

	}

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

	if (min === max) min--;

	if (min === 0) {

		pMin = 0;

	} else if (min > 0) {

		pMin = Math.max(0, min - (max - min) / 100)

	} else {

		pMin = min - (max-min) / 100;

	}

	if (max === 0) {

		if (min === 0) {

			pMax = 1;

		} else {

			pMax = 0;

		}

	} else if (max < 0) {

		pMax = Math.min(max + (max - min) / 100).toFixed(5);

	} else {

		pMax = Number(max + (max - min) / 100).toFixed(5);

	}

	power = Math.log(pMax - pMin) / Math.log(base);
	factor = Math.pow(base, (power - Math.floor(power)));

	switch (true) {

		case (base === 10):

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

		case (base === 60):

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

		case (base === 3600 || base === 42300):

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
	xMin = pMin === 0 ? 0 : xMaj * Math.floor(pMin / xMaj);
	xMax = xMaj * (Math.floor(pMax / xMaj) + 1);
	xSteps = Math.round((xMax - xMin) / xMaj);

	return {'min': xMin, 'max': xMax, 'maj': xMaj, 'steps': xSteps};

}

function sToTime(time) {

	function pad(n, z) {

		n = Math.abs(n);
		let out = '';
		const split = n.toString().split('.');

		z = z || 2;

		out = (`00${split[0]}`).slice(-z);

		if (split.length > 1) out = `${out}.${split[1]}`;

		return out;

	}

	const hours = Math.floor(time / 3600); // Convert seconds to hours
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = time % 60;

	return `${(time < 0 ? '-' : '')}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

}

function ObjectLength(object) {

	let length = 0;

	for (const key in object) {

		if (object.hasOwnProperty(key)) {

			++length;

		}

	}

	return length;

}

Element.prototype.insertChildAtIndex = function(child, index) {

	if (!index) index = 0;

	if (index >= this.children.length) {

		this.appendChild(child)

	} else {

		this.insertBefore(child, this.children[index])

	}

};

function createSVGChartArea() {

	const area = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	area.setAttribute('width', '100%');
	area.setAttribute('height', '100%');
	area.style.position = 'absolute';
	area.style.pointerEvents = 'none';
	area.style.left = '0';
	area.style.top = '0';

	return area;

}

class VAxis extends CragCore {

	static primary = 0;
	static secondary = 1;

	chart = null;

	axisDiv = null;
	linesDiv = null;

	calculatedWidth = 0;

	/** @type {number} */
	axis = VAxis.primary;

	/** @type {{VAxisLine}} */
	lines = {};

	scale = {
		min: 0,
		max: 0,
		steps: 0,
		maj: 0,
	};

	axisName = 'primary';

	constructor(chart, axis = VAxis.primary) {
		super();

		this.chart = chart;
		this.axis = axis;

		if (this.axis === VAxis.secondary) this.axisName = 'secondary';

		this._create();
		this.showHide();

	}

	_create() {

		this.axisDiv = document.createElement('div');
		this.axisDiv.className = 'cragVAxisPrimary';

		if (this.axis === VAxis.secondary) this.axisDiv.className = 'cragVAxisSecondary';

		this.linesDiv = document.createElement('div');
		this.linesDiv.className = 'cragChartSubArea';

		this.chart.chart.container.append(this.axisDiv);
		this.chart.chart.area.append(this.linesDiv);

	}

	update(min, max) {

		this._calculateAxisScale(min, max);
		this.showHide();

		/**
		 * Reset the calculated width of the vAxis ready for new labels
		 */
		this.calculatedWidth = 0;

		for (let i = 0; i <= this.scale.steps; i++) {

			if (this.lines[i]) {

				this.lines[i].value = this.scale.min + (i * this.scale.maj);
				this.lines[i].step = i;
				this.lines[i].ofSteps = this.scale.steps;
				this.lines[i].max = this.scale.max;

			} else {

				this.lines[i] = new VAxisLine(this.scale.min + (i * this.scale.maj), i, this.scale.steps, this.scale.max);

			}

			/**
			 * Determine which of the lines is the zero point.
			 * Zero point can be only of the following
			 * 1. First line (from bottom) where scale starts at 0 or greater (positive only scale)
			 * 2. Any line after the first where the real value = 0 (positive and negative scale)
			 * 3. Last line where scale max is less than 0 (negative only scale)
			 */
			this.lines[i].isZeroPoint = (i === 0 && this.scale.min >= 0) || (i > 0 && this.lines[i].realValue === 0) || (i === this.scale.steps && this.scale.max < 0);

		}

		/**
		 * Remove any VAxisLines that are beyond the current scale length.
		 * This will happen when a new data set is loaded that has a different scale
		 */
		for (let i = Object.values(this.lines).length + 1; i > this.scale.steps; i--) {

			if (!this.lines[i]) continue;

			this.lines[i]._destroy();
			this.lines[i] = null;

			delete this.lines[i];

		}

		let i = 0;

		for (const line of Object.values(this.lines)) {

			/**
			 * Append elements to DOM
			 */
			this.linesDiv.append(line.majorLine, line.minorLine);
			this.axisDiv.appendChild(line.label);

			line.labelText = this.formatLabel(line.value, this.chart.options.vAxes[this.axisName].format, this.chart.options.vAxes[this.axisName].currencySymbol, this.chart.options.vAxes[this.axisName].decimalPlaces);

			if (line.label.offsetWidth > this.calculatedWidth) this.calculatedWidth = line.label.offsetWidth;

			line.positionMajor(this.linesDiv.offsetHeight);
			line.positionMinor(this.linesDiv.offsetHeight);
			line.positionLabel(this.axisDiv.offsetHeight);

		}

		/**
		 * Set the new vAxis are width
		 */
		this.axisDiv.style.width = `${this.calculatedWidth}px`;

		this.showHide();

	}

	/**
	 * Sets the min and max of the vAxis based on the min and max value in the data set
	 * @return {{min: number, max: number, maj: number, steps: number}}
	 * @private
	 */
	_calculateAxisScale(min, max) {

		min = this.chart.options.vAxes[this.axisName].min === 'auto' ? min : this.chart.options.vAxes[this.axisName].min;

		if (this.chart.options.vAxes[this.axisName].format === 'time') {

			/**
			 * Time scales will be rounded based on the largest value in the data set
			 * The scales are seconds, minutes, hours then days
			 */

			let timeRounding;

			if (max < 60) {
				timeRounding = 60
			} else if (max < 3600) {
				timeRounding = 3600;
			} else if (max < 43200) {
				timeRounding = 43200;
			} else {
				timeRounding = 86400;
			}

			this.scale = calculateScale(min, max, timeRounding);

		} else {

			this.scale = calculateScale(min, max, 10);

		}

	}

	_colorize() {

		const color = this._getContrastColor(this.chart.options.chart.color);

		for (const line of Object.values(this.lines)) {

			line.majorLine.style.backgroundColor = color;
			line.minorLine.style.backgroundColor = color;
			line.label.style.color = color;

			if (line.isZeroPoint) {

				line.majorLine.style.opacity = '0.9';
				line.majorLine.style.height = '2px';
				line.majorLine.style.zIndex = '2';

				if (this.chart.options.vAxes.primary.shadowOnZeroLine) {

					line.majorLine.style.boxShadow = 'rgb(0 0 0 / 35%) 0px 0px 4px 2px';

				} else {

					line.majorLine.style.boxShadow = 'none';

				}

			} else {

				line.majorLine.style.opacity = '';
				line.majorLine.style.height = '1px';
				line.majorLine.style.zIndex = '0';
				line.majorLine.style.boxShadow = 'none';

			}

		}

	}

	showHide() {

		for (const line of Object.values(this.lines)) {

			line.majorLine.style.display = this.chart.options?.vAxes[this.axisName]?.majorLines || (line.isZeroPoint && this.axis === VAxis.primary) ? '' : 'none';
			line.minorLine.style.display = this.chart.options?.vAxes[this.axisName]?.minorLines ? '' : 'none';

		}

		if (this.axis === VAxis.secondary && this.chart.options.vAxes.secondary.showOnPrimary) {

			this.axisDiv.style.display = 'none';
			this.linesDiv.style.display = 'none';

		} else {

			this.axisDiv.style.display = '';
			this.linesDiv.style.display = '';

		}

	}

	set majorLines(value) {

		this.chart.options.vAxes[this.axisName].majorLines = value;
		this.showHide();

	}

	set minorLines(value) {

		this.chart.options.vAxes[this.axisName].minorLines = value;
		this.showHide();

	}

	set format(value) {

		this.chart.options.vAxes[this.axisName].format = value;
		this.chart._draw();

	}

	set decimals(value) {

		this.chart.options.vAxes[this.axisName].decimalPlaces = value;
		this.chart._draw();

	}

	set currencySymbol(value) {

		this.chart.options.vAxes[this.axisName].currencySymbol = value;
		this.chart._draw();

	}

	set minimum(value) {

		this.chart.options.vAxes[this.axisName].min = value;
		this.chart._draw()

	}

	set shadowOnZeroLine(value) {

		/**
		 * Primary only attribute
		 */
		if (this.axis === VAxis.secondary) return;

		this.chart.options.vAxes.primary.shadowOnZeroLine = value;
		this._colorize();

	}

	set showOnPrimary(value) {

		/**
		 * Secondary only attribute
		 */
		if (this.axis === VAxis.primary) return;

		this.chart.options.vAxes.secondary.showOnPrimary = value;
		this.chart._draw();

	}


}

class VAxisLine {

	/** @param {HTMLDivElement} */
	majorLine = null;

	/** @param {HTMLDivElement} */
	minorLine = null;

	/** @param {HTMLSpanElement} */
	label = null;

	realValue = 0;
	step = 0;
	ofSteps = 0;
	max;

	isZeroPoint = false;

	constructor(value, step, ofSteps) {

		this.realValue = value;
		this.step = step;
		this.ofSteps = ofSteps;

		this._createLines();
		this._createLabel();

	}

	_createLines() {

		this.majorLine = document.createElement('div');

		this.majorLine.className = 'cragAxisLineMajor';
		this.majorLine.style.bottom = '100%';
		this.majorLine.style.right = '0';

		this.minorLine = document.createElement('div');

		this.minorLine.className = 'cragAxisLineMinor';

		this.minorLine.style.bottom = '100%';
		this.minorLine.style.pointerEvents = 'none';
		this.minorLine.style.overflow = 'visible';

	}

	_createLabel() {

		this.label = document.createElement('span');

		this.label.className = 'cragVAxisLabel';
		this.label.style.bottom = '100%';

	}

	positionMajor(space) {

		this.majorLine.style.bottom = `${Math.min(space - 2, space / this.ofSteps * this.step)}px`;

	}

	positionMinor(space) {

		if (this.step === this.ofSteps) {

			this.minorLine.style.opacity = '0';

		} else {

			this.minorLine.style.opacity = '';

		}

		this.minorLine.style.bottom = `${(space / this.ofSteps * this.step) + (space / this.ofSteps / 2)}px`;

	}

	positionLabel(space) {

		this.label.style.bottom = `${space / this.ofSteps * this.step - (this.label.offsetHeight / 2)}px`;

	}

	_destroy() {

		this.label.style.opacity = '0';
		this.label.style.bottom = '100%';

		this.majorLine.style.opacity = '0';
		this.majorLine.style.bottom = '100%';

		this.minorLine.style.opacity = '0';
		this.minorLine.style.bottom = '100%';

		setTimeout(() => {

			this.label.remove();
			this.majorLine.remove();
			this.minorLine.remove();

		}, 700);

	}

	set value(value) {
		this.realValue = value;
	}
	get value() {
		return this.realValue;
	}

	set labelText(text) {
		this.label.textContent = text;
	}

}
class HAxis extends CragCore {

	chart = null;

	data = [];
	area = null;
	labels = {};

	constructor(chart) {
		super();

		this.chart = chart;

		this._create();

	}

	_create() {

		this.area = document.createElement('div');
		this.area.className  = 'cragHAxis';

		this.chart.chart.container.append(this.area);

	}

	_refactor() {

		/**
		 * Update the labels with new data, labels will be created where they don't yet exist
		 */
		for (let i = 0; i < this.chart.data.labels.length; i++) {

			if (this.labels[i]) {

				/**
				 * Update existing label at this index with new data
				 */
				this.labels[i].textContent = this.chart.data.labels[i];

			} else {

				/**
				 * Create new label
				 */
				this.labels[i] = document.createElement('span');

				this.labels[i].className = 'cragHAxisLabel';
				this.labels[i].style.color = this._getContrastColor(this.chart.options.chart.color);
				this.labels[i].textContent = this.chart.data.labels[i];

				this.area.append(this.labels[i]);

			}

		}

		/**
		 * Remove any labels that are beyond the current data set length.
		 * This will happen when a new data set is loaded that is smaller than the old data set
		 */
		for (let i = Object.values(this.labels).length + 1; i >= this.chart.data.labels.length; i--) {

			if (!this.labels[i]) continue;

			const element = this.labels[i];

			element.style.opacity = '0';
			element.style.left = '100%';

			this.labels[i] = null;

			setTimeout(() => {

				element.remove();

			}, 700);

		}

	}

	update() {

		this._refactor();
		this._position();
		this._colorize();

	}

	_position() {

		const axisWidth = this.chart.chart.container.offsetWidth - (this.chart.primaryVAxis?.calculatedWidth ?? 0) - (this.chart.secondaryVAxis?.calculatedWidth ?? 0);

		for (const [index, label] of Object.entries(this.labels)) {

			if (!label) continue;

			label.style.left = `${axisWidth / this.chart.data.labels.length * index}px`;
			label.style.width = `${axisWidth / this.chart.data.labels.length}px`;

		}

	}

	_colorize() {

		for (const label of Object.values(this.labels)) {

			if (!label) continue;

			label.style.color = this._getContrastColor(this.chart.options.chart.color);

		}

	}

}

class ToolTip extends CragCore {

	chart = null;

	container = null;

	label = null;
	value = null;

	constructor(chart) {
		super();

		this.chart = chart;

		this._create();

	}

	_create() {

		this.container = document.createElement('div');

		this.label = document.createElement('h6');
		this.value = document.createElement('h6');

		this.container.className = 'cragToolTip';

		this.label.className = 'cragToolTipLabel';
		this.value.className = 'cragToolTipValue';

		document.body.appendChild(this.container);

		this.container.append(
			this.label,
			this.value,
		);

	}

	_position(event) {

		if (event.clientX < window.innerWidth / 2) {

			this.container.style.left = `${event.clientX + 8}px`;

		} else {

			this.container.style.left = `${event.clientX - this.container.offsetWidth - 8}px`;

		}

		this.container.style.top = `${event.clientY + 2}px`;

	}

	attach(object) {

		object.element.onmouseover = (e) => {
			this.chart.toolTip.show(e, object.name, object.value, !object?.labelVisible);
		}
		object.element.onmousemove = (e) => this.chart.toolTip._position(e);
		object.element.onmouseout = () => {
			this.chart.toolTip.hide();
		}

	}

	show(event, label, value, showValue = true) {

		if (showValue) {
			this.value.style.display = '';
		} else {
			this.value.style.display = 'none';
		}

		this.label.textContent = label;
		this.value.textContent = this.formatLabel(
			value,
			this.chart.options.vAxes.primary.format,
			this.chart.options.vAxes.primary.currencySymbol,
			this.chart.options.vAxes.primary.decimalPlaces
		);

		this.container.style.opacity = '1';

		this._position(event);

	}

	hide() {

		this.container.style.opacity = '0';

	}

}

class Title extends CragCore {

	chart = null;

	area = null;
	title = null;

	constructor(chart) {
		super();

		this.chart = chart;
		this._create();

	}

	_create() {

		this.area = document.createElement('div');
		this.title = document.createElement('h1');

		this.area.className = 'cragTitle';
		this.title.className = 'cragTitleText';

		this.title.textContent = this.chart.options.chart.title;

		this.area.appendChild(this.title);
		this.chart.chart.container.append(this.area);

	}

	_colorize() {

		this.title.style.color = this._getContrastColor(this.chart.options.chart.color);

	}

	/**
	 * @description Sets a new title in the chart. Creates the title element if not already present.
	 * @param {string} value
	 */
	set text(value) {

		this.title.textContent = value;

		/**
		 * Only call redraw when the new or old title text was null
		 * This prevents triggering redraw on each keystroke
		 */
		if (value === '' ^ this.chart.options.chart.title === null) {

			this.chart._draw();

		}

		/**
		 * Set new value to null where new title is blank
		 */
		this.chart.options.chart.title = value === '' ? null : value;

	}
	get title() {
		return this.title?.textContent ?? '';
	}

}

function findMaxValue(data) {
	let maxValue = Number.MIN_SAFE_INTEGER;

	function traverseArray(arr) {
		for (let i = 0; i < arr.length; i++) {
			if (Array.isArray(arr[i])) {
				traverseArray(arr[i]);
			} else {
				maxValue = Math.max(maxValue, arr[i]);
			}
		}
	}

	if (Array.isArray(data)) {
		traverseArray(data);
	} else {
		// If it's a single array of numbers
		if (Array.isArray(data[0])) {
			// Flatten the array of arrays and find the max
			const flattenedArray = data.flat();
			maxValue = Math.max(...flattenedArray);
		} else {
			maxValue = Math.max(...data);
		}
	}

	return maxValue;
}

function findMinValue(data) {

	let minValue = Number.MAX_SAFE_INTEGER;

	function traverseArray(arr) {
		for (let i = 0; i < arr.length; i++) {
			if (Array.isArray(arr[i])) {
				traverseArray(arr[i]);
			} else {
				minValue = Math.min(minValue, arr[i]);
			}
		}
	}

	if (Array.isArray(data)) {
		traverseArray(data);
	} else {
		// If it's a single array of numbers
		if (Array.isArray(data[0])) {
			// Flatten the array of arrays and find the min
			const flattenedArray = data.flat();
			minValue = Math.min(...flattenedArray);
		} else {
			minValue = Math.min(...data);
		}
	}

	return minValue;
}

/**
 * @type optionsLine
 */
const defaultLineOptions = {
	thickness: 3,
	pointSize: 3,
	color: CragPallet.auto,
	smooth: true,
	labelVisible: true,
	name: 'Series',
};