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
		red: '#f44336',
		pink: '#ec407a',
		purple: '#ba68c8',
		deepPurple: '#7e57c2',
		indigo: '#5c6bc0',
		blue: '#2196f3',
		lightBlue: '#03a9f4',
		cyan: '#00bcd4',
		teal: '#009688',
		green: '#4caf50',
		lightGreen: '#8bc34a',
		lime: '#cddc39',
		yellow: '#ffeb3b',
		amber: '#ffc107',
		orange: '#ff9800',
		deepOrange: '#ff5722',
		brown: '#8d6e63',
		grey: '#9e9e9e',
		blueGrey: '#607d8b',
		darkBlueGrey: '#192841',
		black: '#000000',
		almostBlack: '#222222',
		charcoal: '#333333',
		darkgrey: '#555555',
		lightgrey: '#DDDDDD',
		white: '#FFFFFF',
	}

	modes = ['auto', 'match', 'multi', 'redGreen'];

	/**
	 * Resolves a color value, from either a hex code, pallet name or mode.
	 * @param {string} value Pallet id, hex code or color mode.
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
		 * Check to see if the value is a valid hex code color.
		 */
		if (this._isValidHexColor(value)) return value;

		/**
		 * Default to white
		 */
		return '#FFFFFF';

	}

	/**
	 * Resolves a color value, from either a hex code, pallet name or mode.
	 * @param {string} value Pallet id, hex code or color mode.
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

		return this._isValidHexColor(value);

	}

	_getColorByMode(mode, value) {

		if (value === undefined) throw "Value needs to be set for mode to function correctly";

		if (mode === 'redGreen') {

			if (value < 0) return this.pallet.red;

			return this.pallet.green;

		}

		if (mode === 'multi') return Object.values(this.pallet)[value];

		if (mode === 'match') return this._resolveColor(value);

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

		case (base === 3600):

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

		case (base === 42300):

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

	const seconds = time % 60;
	const minuets = ((time - seconds) / 60) % 60;
	const hours = ((((time - seconds) / 60) % 60) - minuets) / 60;

	if (hours > 0) {

		return `${(time < 0 ? '-' : '')}${pad(hours)}:${pad(minuets)}:${pad(seconds)}`;

	} else {

		return `${(time < 0 ? '-' : '')}${pad(minuets)}:${pad(seconds)}`;

	}

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

}

class vAxisLines extends CragCore {

	chart = null;

	axisDiv = null;
	linesDiv = null;

	calculatedWidth = 0;

	/** @type {'primary'|'secondary'} */
	axis = 'primary';

	/** @type {{VAxisLine}} */
	lines = {}

	scale = {
		min: 0,
		max: 0,
		steps: 0,
		maj: 0,
	}

	constructor(chart, axis = 'primary') {
		super();

		this.chart = chart;
		this.axis = axis;

		this._create();
		this.showHide();

	}

	_create() {

		this.axisDiv = document.createElement('div');
		this.axisDiv.className = 'cragVAxisPrimary';

		if (this.axis === 'secondary') this.axisDiv.className = 'cragVAxisSecondary';

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

			line.labelText = this.formatLabel(line.value, this.chart.options.vAxes[this.axis].format, this.chart.options.vAxes[this.axis].currencySymbol, this.chart.options.vAxes[this.axis].decimalPlaces);

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

		min = this.chart.options.vAxes[this.axis].min === 'auto' ? min : this.chart.options.vAxes[this.axis].min;

		if (this.chart.options.vAxes[this.axis].format === 'time') {

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

			line.majorLine.style.display = this.chart.options?.vAxes[this.axis]?.majorLines || (line.isZeroPoint && this.axis === 'primary') ? '' : 'none';
			line.minorLine.style.display = this.chart.options?.vAxes[this.axis]?.minorLines ? '' : 'none';

		}

		if (this.axis === 'secondary' && this.chart.options.vAxes.secondary.showOnPrimary) {

			this.axisDiv.style.display = 'none';
			this.linesDiv.style.display = 'none';

		} else {

			this.axisDiv.style.display = '';
			this.linesDiv.style.display = '';

		}

	}

	set majorLines(value) {

		this.chart.options.vAxes[this.axis].majorLines = value;
		this.showHide();

	}

	set minorLines(value) {

		this.chart.options.vAxes[this.axis].minorLines = value;
		this.showHide();

	}

	set format(value) {

		this.chart.options.vAxes[this.axis].format = value;
		this.chart._draw();

	}

	set decimals(value) {

		this.chart.options.vAxes[this.axis].decimalPlaces = value;
		this.chart._draw();

	}

	set currencySymbol(value) {

		this.chart.options.vAxes[this.axis].currencySymbol = value;
		this.chart._draw();

	}

	set minimum(value) {

		this.chart.options.vAxes[this.axis].min = value;
		this.chart._draw()

	}

	set shadowOnZeroLine(value) {

		/**
		 * Primary only attribute
		 */
		if (this.axis === 'secondary') return;

		this.chart.options.vAxes.primary.shadowOnZeroLine = value;
		this._colorize();

	}

	set showOnPrimary(value) {

		/**
		 * Secondary only attribute
		 */
		if (this.axis === 'primary') return;

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
		for (let i = 0; i < this.chart.data.series.length; i++) {

			if (this.labels[i]) {

				/**
				 * Update existing label at this index with new data
				 */
				this.labels[i].textContent = this.chart.data.series[i][0];

			} else {

				/**
				 * Create new label
				 */
				this.labels[i] = document.createElement('span');

				this.labels[i].className = 'cragHAxisLabel';
				this.labels[i].style.color = this._getContrastColor(this.chart.options.chart.color);
				this.labels[i].textContent = this.chart.data.series[i][0];

				this.area.append(this.labels[i]);

			}

		}

		/**
		 * Remove any labels that are beyond the current data set length.
		 * This will happen when a new data set is loaded that is smaller than the old data set
		 */
		for (let i = Object.values(this.labels).length + 1; i >= this.chart.data.series.length; i--) {

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

			label.style.left = `${axisWidth / this.chart.data.series.length * index}px`;
			label.style.width = `${axisWidth / this.chart.data.series.length}px`;

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
	title = null;
	primaryLabel = null;
	primaryValue = null;

	secondaryLabel = null;
	secondaryValue = null;

	constructor(chart) {
		super();

		this.chart = chart;

		this._create();
		this._colorize();

	}

	_create() {

		this.container = document.createElement('div');
		this.title = document.createElement('h6');

		this.primaryLabel = document.createElement('h6');
		this.primaryValue = document.createElement('h6');

		this.secondaryLabel = document.createElement('h6');
		this.secondaryValue = document.createElement('h6');

		this.container.className = 'cragToolTip';
		this.title.className = 'cragToolTipTitle';

		this.primaryLabel.className = 'cragToolTipLabel';
		this.primaryValue.className = 'cragToolTipValue';

		this.secondaryLabel.className = 'cragToolTipLabel';
		this.secondaryValue.className = 'cragToolTipValue';

		document.body.appendChild(this.container);

		this.container.append(
			this.title,
			this.primaryLabel,
			this.primaryValue,
			this.secondaryLabel,
			this.secondaryValue,
		);

	}

	_colorize() {

		this.container.style.backgroundColor = this._getContrastColor(this.chart.options.chart.color);

		this.title.style.color = this._resolveColor(this.chart.options.chart.color);
		this.primaryLabel.style.color = this._resolveColor(this.chart.options.chart.color);
		this.primaryValue.style.color = this._resolveColor(this.chart.options.chart.color);
		this.secondaryLabel.style.color = this._resolveColor(this.chart.options.chart.color);
		this.secondaryValue.style.color = this._resolveColor(this.chart.options.chart.color);

	}

	_position(index, element) {

		const elementRect = element.getBoundingClientRect();

		const chartWidth = window.innerWidth;
		const columnWidth = element.offsetWidth;
		const tipWidth = this.container.offsetWidth;

		const alignments = [false, true, false];

		if (elementRect.left - 8 > tipWidth) alignments[0] = true;
		if (chartWidth - elementRect.left - columnWidth - 8 > tipWidth) alignments[2] = true;

		this.container.style.opacity = '1';

		/**
		 * If the column is on the left side of screen, see if the tool tip will fit on the left of the column first
		 * Otherwise check to see if it will fit on the right.
		 * If the preferred side can not fit, use the other.
		 * If neither fits, it will default to center over the columns.
		 */
		if (alignments[0] && elementRect.left - 8 > tipWidth) {

			this.container.style.left = `${elementRect.left - tipWidth - 8}px`;

		} else if (alignments[2]) {

			this.container.style.left = `${elementRect.left + columnWidth + 8}px`;

		} else {

			this.container.style.left = `${elementRect.left + (columnWidth / 2) - (tipWidth / 2)}px`;
			this.container.style.opacity = '0.8';

		}

		if (this.chart.data.series[index][1] < 0) {

			this.container.style.top = `${Math.max(0, elementRect.bottom)}px`;

		} else {

			this.container.style.top = `${Math.max(0, elementRect.top)}px`;

		}

	}

	show(index, caller) {

		this.title.textContent = this.chart.data.series[index][0];

		this.primaryLabel.textContent = this.chart.options.vAxes.primary.name;
		this.primaryValue.textContent = this.formatLabel(
			this.chart.data.series[index][1],
			this.chart.options.vAxes.primary.format,
			this.chart.options.vAxes.primary.currencySymbol,
			this.chart.options.vAxes.primary.decimalPlaces
		);

		if (this.chart.data.series[index][2]) {
			this.secondaryLabel.textContent = this.chart.options.vAxes.secondary?.name;
			this.secondaryValue.textContent = this.formatLabel(
				this.chart.data.series[index][2],
				this.chart.options.vAxes?.secondary?.format,
				this.chart.options.vAxes?.secondary?.currencySymbol,
				this.chart.options.vAxes?.secondary?.decimalPlaces
			);
		} else {
			this.secondaryLabel.textContent = '';
			this.secondaryValue.textContent = '';
		}

		if (this.secondaryLabel.textContent === '') {

			this.secondaryLabel.style.display = 'none';
			this.secondaryValue.style.display = 'none';

		} else {

			this.secondaryLabel.style.display = '';
			this.secondaryValue.style.display = '';

		}

		this.container.style.opacity = '1';

		this._position(index, caller);

	}

	hide() {

		this.container.style.opacity = '0';

	}

}

class Column extends CragCore {

	index = 0;
	columnValue = 0;

	/** @type {HTMLDivElement} */
	column = null;

	/** @type {HTMLSpanElement} */
	label = null;

	calculatedHeight = 0;
	calculatedBottom = 0;
	calculatedLeft = 0;
	calculatedWidth = 0;
	calculatedColor = null;
	calculatedLabelPosition = 'none';

	constructor (index, value) {
		super();

		this.index = index;
		this.columnValue = value;

		this._createColumn();
		this._createLabel();

	}

	_createColumn() {

		this.column = document.createElement('div');
		this.column.className = 'cragColumn';

	}

	_createLabel() {

		this.label = document.createElement('span');
		this.label.className = 'cragColumnLabel';

	}

	_destroy() {

		this.column.style.left = `calc(100% + ${parseInt(this.column.style.width.replace('px', '')) * this.index}px)`;

		this.label.style.opacity = '0';
		this.label.style.left = '100%';

		setTimeout(() => {

			this.column.remove();

			if (this.label != null) this.label.remove();

		}, 700);

	}

	/**
	 * @param {number} value
	 */
	set value(value) {

		this.columnValue = value;

	}
	get value() {
		return this.columnValue;
	}

	set color(value) {
		this.calculatedColor = value;
		this.column.style.backgroundColor = value;
	}
	get color() {
		return this.calculatedColor;
	}

	set height(value) {
		this.calculatedHeight = value;
		this.column.style.height = `${value}px`;
	}
	get height() {
		return this.calculatedHeight;
	}

	set width(value) {
		this.calculatedWidth = value;
		this.column.style.width = `${value}px`;
	}
	get width() {
		return this.calculatedWidth;
	}

	set left(value) {
		this.calculatedLeft = value;
		this.column.style.left = `${value}px`;
	}
	get left() {
		return this.calculatedLeft;
	}

	set bottom(value) {
		this.calculatedBottom = value;
		this.column.style.bottom = `${value}px`;
	}
	get bottom() {
		return this.calculatedBottom;
	}

	set rounding(value) {

		if (value) {

			if (this.value < 0) {

				this.column.style.borderRadius = `0 0 ${value}px ${value}px`;

			} else {

				this.column.style.borderRadius = `${value}px ${value}px 0 0`;

			}

		} else {

			this.column.style.borderRadius = '0';

		}

	}

	set shadow(value) {

		if (value !== 0) {

			const shadowType = value < 0 ? 'inset ' : '';
			const verticalModifier = (value > 0 && this.value > 0) || (value < 0 && this.value < 0) ? '-' : '';
			const verticalDirection = Math.abs(value);
			const spread = Math.abs(value) * 2.5;

			this.column.style.boxShadow = `${shadowType}0 ${verticalModifier}${verticalDirection}px ${spread}px 0 rgba(0, 0, 0, 0.35)`;

		} else {

			this.column.style.boxShadow = 'none';

		}

	}

	set stripes(hasStripes) {
		this.column.classList.toggle('cragColumnStriped', hasStripes);
	}

	set animatedStripes(hasAnimatedStripes) {
		this.column.classList.toggle('cragColumnStripedAnimate', hasAnimatedStripes);
	}

	set labelPosition(value) {
		this.calculatedLabelPosition = value;
	}
	get labelPosition() {
		return this.calculatedLabelPosition;
	}

	set labelText(value) {

		this.label.textContent = value;

	}

	_calculateLabelPosition(preferredPosition, maxHeight) {

		if (preferredPosition === 'none') return this.labelPosition = 'none';

		if (
			(preferredPosition === 'inside' && this.height > this.label.offsetHeight) ||
			(this.value < 0 && this.bottom < this.label.offsetHeight) ||
			(this.value > 0 && maxHeight - this.height - this.bottom < this.label.offsetHeight)
		) return this.labelPosition = 'inside';

		this.labelPosition = 'outside';

	}

	_moveLabel() {

		if (this.labelPosition === 'none') return this.label.style.opacity = '0';

		this.label.style.opacity = '1';

		if (this.labelPosition === 'inside') {

			if (this.value < 0) {

				this.label.style.bottom = `${this.bottom}px`;

			} else {

				this.label.style.bottom = `${this.bottom + this.height - this.label.offsetHeight}px`;

			}

			return;

		}

		if (this.value < 0) {

			this.label.style.bottom = `${this.bottom - this.label.offsetHeight}px`;

		} else {

			this.label.style.bottom = `${this.bottom + this.height}px`;

		}

	}

	_colorLabel(color, backgroundColor) {

		if (this.labelPosition === 'inside') {

			this.label.style.color = this._getContrastColor(this.color);

		} else {

			if (color === 'match') {

				this.label.style.color = this.color;

			} else if (color === 'auto') {

				this.label.style.color = this._getContrastColor(backgroundColor);

			} else {

				this.label.style.color = this._resolveColor(color);

			}

		}

	}

	setLabelPosition(preferredPosition, maxHeight) {

		this.label.style.left = `${this.left}px`;
		this.label.style.width = `${this.width}px`;

		this._calculateLabelPosition(preferredPosition, maxHeight);
		this._moveLabel();

	}

	setLabelColor(color, backgroundColor) {
		this._colorLabel(color, backgroundColor);
	}

}

class Columns extends CragCore {

	/** @type {HTMLDivElement} */
	columnArea = null;
	/** @type {HTMLDivElement} */
	labelArea = null;

	columns = {}

	chart = null;

	constructor(chart) {
		super();

		this.chart = chart;
		this._createAreas();

	}

	_createAreas() {

		this.columnArea = document.createElement('div');
		this.labelArea = document.createElement('div');

		this.labelArea.className = 'cragChartSubArea';
		this.columnArea.className = 'cragChartSubArea';

		this.labelArea.style.pointerEvents = 'none';

		this.chart.chart.area.append(this.columnArea, this.labelArea);

	}

	update() {

		this._refactorColumns();
		this._setColumnDimensions();
		this._applyColumnColors();
		this._applyColumnStyles();
		this._populateLabels();
		this._positionLabels();
		this._colorLabels();

	}

	_refactorColumns() {

		/**
		 * Update the DataPoints with new data, DataPoints will be created where they don't yet exist
		 */
		for (let i = 0; i < this.chart.data.series.length; i++) {

			if (this.columns[i]) {

				/**
				 * Update existing DataPoint at this index with new data
				 */
				this.columns[i].index = i;
				this.columns[i].value = this.chart.data.series[i][1];

				this.columns[i].columnOptions = this.chart.options.columns;

			} else {

				/**
				 * Create new DataPoint
				 */
				this.columns[i] = new Column(i, this.chart.data.series[i][1], this.chart.options.vAxes.primary.format, this.chart.options.vAxes.primary.currencySymbol, this.chart.options.vAxes.primary.decimalPlaces);

				this.labelArea.appendChild(this.columns[i].label);
				this.columnArea.appendChild(this.columns[i].column);

				this.columns[i].column.onmouseover = () => {
					this.chart.toolTip.show(i, this.columns[i].column);
					this._focusOne(i);
				}

				this.columns[i].column.onmouseout = () => {
					this.chart.toolTip.hide();
					this._clearFocus();
				}

				/**
				 * Add onclick if set on creation
				 */
				if (this.chart.options.columns.onClick !== null) {

					this.columns[i].column.onclick = () => this.chart.options.columns.onClick(this.columns[i]);

				}

			}

		}

		/**
		 * Remove any DataPoints that are beyond the current data set length.
		 * This will happen when a new data set is loaded that is smaller than the old data set
		 */
		for (let i = Object.values(this.columns).length + 1; i >= this.chart.data.series.length; i--) {

			if (!this.columns[i]) continue;

			this.columns[i]._destroy();
			this.columns[i] = null;

			delete this.columns[i];

		}

	}

	_positionLabels() {

		for (const column of Object.values(this.columns)) {

			column.setLabelPosition(this.chart.options.columns.labels.position, this.columnArea.offsetHeight);

		}

	}

	_populateLabels() {

		for (const column of Object.values(this.columns)) {

			column.labelText = this.formatLabel(column.value, this.chart.options.vAxes.primary.format, this.chart.options.vAxes.primary.currencySymbol, this.chart.options.vAxes.primary.decimalPlaces);

		}

	}

	_colorLabels() {

		for (const column of Object.values(this.columns)) {

			column.setLabelColor(this.chart.options.columns.labels.color, this.chart.options.chart.color);

		}

	}

	_focusOne(index) {

		for (const column of Object.values(this.columns)) {

			if (column.index === index) continue;

			column.column.style.opacity = '0.2';

		}

	}

	_clearFocus() {

		for (const column of Object.values(this.columns)) {

			column.column.style.opacity = '1';

		}

	}

	_setColumnDimensions() {

		let zeroLine = 0;

		/** Scale is positive to negative, zero line will be a part way through */
		if (this.chart.primaryVAxis.scale.min < 0 && this.chart.primaryVAxis.scale.max > 0) zeroLine = this.columnArea.offsetHeight / (this.chart.primaryVAxis.scale.max - this.chart.primaryVAxis.scale.min) * this.chart.primaryVAxis.scale.max;

		for (const column of Object.values(this.columns)) {

			if (column.value < 0) {

				/** Negative space / smallest number on scale / * columns value */
				column.height = (this.columnArea.offsetHeight - zeroLine) / (this.chart.primaryVAxis.scale.min - Math.min(0, this.chart.primaryVAxis.scale.max)) * (column.value - Math.min(0, this.chart.primaryVAxis.scale.max));

				/** Negative space - column height */
				column.bottom = this.columnArea.offsetHeight - zeroLine - column.height;

			} else {

				/** Chart height - Negative space */
				if (zeroLine === 0) {

					column.bottom = 0;
					/** Positive space / smallest number on scale / * columns value */
					column.height = (this.columnArea.offsetHeight - zeroLine) / (this.chart.primaryVAxis.scale.max - this.chart.primaryVAxis.scale.min) * (column.value - this.chart.primaryVAxis.scale.min);

				} else {

					column.bottom = this.columnArea.offsetHeight - zeroLine;
					/** Positive space / smallest number on scale / * columns value */
					column.height = zeroLine / this.chart.primaryVAxis.scale.max * column.value;

				}

			}

			const columnWidthSpace = (this.chart.chart.container.offsetWidth - this.chart.primaryVAxis.calculatedWidth - (this.chart?.secondaryVAxis?.calculatedWidth ?? 0)) / this.chart.data.series.length;
			const columnWidth = columnWidthSpace * (this.chart.options.columns.width / 100);

			/** Series width space * column width option % */
			column.width = columnWidth;

			/** Series width space * column index (start at 0) + half of remaining space of series width */
			column.left = columnWidthSpace * column.index + ((columnWidthSpace - columnWidth) / 2);

		}

	}

	_applyColumnColors() {

		for (const column of Object.values(this.columns)) {

			if (this.chart.options.columns.color === 'multi') {

				column.color = this._getColorByMode('multi', column.index);

			} else if (this.chart.options.columns.color === 'redGreen') {

				column.color = this._getColorByMode('redGreen', column.value);

			} else {

				column.color = this._getColorByMode('match', this.chart.options.columns.color);

			}

		}

	}

	_applyColumnStyles() {

		for (const column of Object.values(this.columns)) {

			column.rounding = this.chart.options.columns.rounding;
			column.shadow = this.chart.options.columns.shadow;
			column.stripes = this.chart.options.columns.stripes;
			column.animatedStripes = this.chart.options.columns.animatedStripes;

		}

	}

	set width(value) {

		this.chart.options.columns.width = this.validateOption(value, 'number', this.chart.options.columns.width);
		this._setColumnDimensions();

	}

	set color(value) {

		if (this.chart.options.columns.color === value) return;
		if (!this._isValidColor(value)) return;

		this.chart.options.columns.color = value;

		this._applyColumnColors();
		this._colorLabels();

	}

	set rounding(value) {

		if (this.chart.options.columns.rounding === value) return;

		this.chart.options.columns.rounding = value;
		this._applyColumnStyles();

	}

	set shadow(value) {

		if (this.chart.options.columns.shadow === value) return;

		this.chart.options.columns.shadow = value;
		this._applyColumnStyles();

	}

	set stripes(hasStripes) {

		if (this.chart.options.columns.stripes === hasStripes) return;

		this.chart.options.columns.stripes = hasStripes;
		this._applyColumnStyles();

	}

	set animatedStripes(hasAnimatedStripes) {

		if (this.chart.options.columns.animatedStripes === hasAnimatedStripes) return;

		this.chart.options.columns.animatedStripes = hasAnimatedStripes;
		this._applyColumnStyles();

	}

	set labelColor(value) {

		if (!this._isValidColor(value)) return;

		this.chart.options.columns.labels.color = value;
		this._colorLabels();

	}

	set labelPosition(value) {

		if (!['inside', 'outside', 'none'].includes(value)) return;

		this.chart.options.columns.labels.position = value;
		this._positionLabels();
		this._colorLabels();

	}

}

class Dot {

	dot = null;
	value = 0;
	index = 0;

	constructor(index, value) {

		this.index = index;
		this.value = value;

		this._createDot();

	}

	_createDot() {

		this.dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

		this.dot.setAttribute('cx', '100%');
		this.dot.setAttribute('cy', '100%');
		this.dot.setAttribute('class', 'cragPoint');

	}

	_destroy() {

		this.dot.style.opacity = '0';

		setTimeout(() => {

			this.dot.remove();

		}, 700);

	}

	set r(value) {

		this.dot.setAttribute('r', value);

	}

	set cy(value) {

		this.dot.setAttribute('cy', `${value}px`);

	}

	set cx(value) {

		this.dot.setAttribute('cx', `${value}px`);

	}

	set fill(value) {

		this.dot.style.fill = value;

	}

}

class Lines extends CragCore {

	colors = ['blue', 'green', 'purple', 'deepOrange', 'blueGrey'];
	lines = {}
	count = 0;
	chart = null;

	constructor(chart, count) {
		super();

		this.count = count;
		this.chart = chart;

		for (let i = 0; i < count; i++) {

			this.lines[i] = new Line(chart, i);

			this.setThickness(i, chart.options.lines[i].thickness);
			this.setPointSize(i, chart.options.lines[i].pointSize);
			this.setSmooth(i, chart.options.lines[i].smooth);

		}

	}

	_colorize() {

		for (let i = 0; i < this.count; i++) {

			if (this.chart.options.lines[i].color === 'auto') {

				this.lines[i].color = this.colors[i];

			} else {

				this.lines[i].color = this.chart.options.lines[i].color;

			}

		}

	}

	update() {

		for (let i = 0; i < this.count; i++) {

			this.lines[i].update(this.chart.data.series.map((e) => e[i + 1]), this.chart.primaryVAxis.scale)
			this.setPointSize(i, this.chart.options.lines[i].pointSize);

		}

	}

	setColor(index, value) {

		this.chart.options.lines[index].color = value;

		if (value === 'auto') {

			this.lines[index].color = this._resolveColor(this.colors[index]);

		} else {

			this.lines[index].color = value;

		}

	}

	setThickness(index, value) {

		this.chart.options.lines[index].thickness = value;
		this.lines[index].thickness = value;

	}

	setPointSize(index, value) {

		this.chart.options.lines[index].pointSize = value;
		this.lines[index].pointSize = value;

	}

	setSmooth(index, value) {

		this.chart.options.lines[index].smooth = value;
		this.lines[index].smooth = value;

	}

}

class Line extends CragCore {

	chart = null;

	/** @type {null|SVGPathElement} */
	line = null;

	/** @type {array} */
	points = [[0, 0]];

	dots = {};

	index = -1;

	/** @type {null|SVGSVGElement} */
	area = null;

	constructor(chart, index = -1) {
		super();

		this.chart = chart;
		this.index = index;

		this._createArea();
		this._createLine();
		this._colorize();

	}

	_createArea() {

		this.area = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.area.setAttribute('width', '100%');
		this.area.setAttribute('height', '100%');
		this.area.style.position = 'absolute';
		this.area.style.pointerEvents = 'none';
		this.area.style.left = '0';
		this.area.style.top = '0';

		this.chart.chart.area.append(this.area);

	}

	_createLine() {

		this.line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.line.setAttribute('fill', 'none');
		this.line.setAttribute('class', 'cragLine');
		this.line.setAttribute('d', 'M0,0');

		if (this.index === -1) {

			this.thickness = this.chart.options.line.thickness.toString();

		}


		this.area.append(this.line);

	}

	update(data, scale) {

		this._refactorDots(data);
		this._positionDots(scale);
		this.updateLine();

	}

	_refactorDots(data) {

		for (let i = 0; i < data.length; i++) {

			if (this.dots[i]) {

				/**
				 * Update existing DataPoint at this index with new data
				 */
				this.dots[i].index = i;
				this.dots[i].value = data[i];

			} else {

				this.dots[i] = new Dot(i, data[i]);

				if (this.index === -1) {

					this.dots[i].r = this.chart.options.line.pointSize;
					this.dots[i].fill = this._getContrastColor(this.chart.options.chart.color);

				}

				this.area.append(this.dots[i].dot);

			}

		}

		/**
		 * Remove any DataPoints that are beyond the current data set length.
		 * This will happen when a new data set is loaded that is smaller than the old data set
		 */
		for (let i = Object.values(this.dots).length + 1; i >= data.length; i--) {

			if (!this.dots[i]) continue;

			this.dots[i]._destroy();
			this.dots[i] = null;

			delete this.dots[i];

		}

	}

	_positionDots(scale) {

		const seriesItemWidth = this.area.width.baseVal.value / this.chart.data.series.length;

		let zeroLine = 0;

		/** Scale is all negative, zero line will be at bottom of container */
		if (scale.min >= 0) zeroLine = this.area.height.baseVal.value;
		/** Scale is positive to negative, zero line will be a part way through */
		if (scale.min < 0 && scale.max > 0) zeroLine = this.area.height.baseVal.value / (scale.max - scale.min) * scale.max;

		for (const dot of Object.values(this.dots)) {

			let cy = 0;

			if (dot.value < 0) {

				cy = (this.area.height.baseVal.value - zeroLine) / (scale.min - Math.min(0, scale.max)) * (dot.value - Math.min(0, scale.max));

			} else {

				if (zeroLine === this.area.height.baseVal.value) {

					cy = -this.area.height.baseVal.value / (scale.max - scale.min) * (dot.value - scale.min);

				} else {

					cy = -(zeroLine - this.area.height.baseVal.value) / (scale.min - Math.min(0, scale.max)) * (dot.value - Math.min(0, scale.max));

				}


			}

			dot.cy = zeroLine + cy;
			dot.cx = (seriesItemWidth * dot.index) + (seriesItemWidth / 2);

		}


	}

	updateLine() {

		const newPoints = Object.values(this.dots).map((a) => a.dot);

		if (newPoints.length === 0) return;

		let smoothing = 0;

		if (this.index === -1) {

			smoothing = this.chart.options.line.smooth ? 0.125 : 0;

		} else {

			smoothing = this.chart.options.lines[this.index].smooth ? 0.125 : 0;

		}

		const line = (pointA, pointB) => {

			const lengthX = pointB[0] - pointA[0]
			const lengthY = pointB[1] - pointA[1]

			return {
				length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
				angle: Math.atan2(lengthY, lengthX)
			}

		}

		const controlPoint = (current, previous, next, reverse) => {

			const p = previous || current;
			const n = next || current;
			const o = line(p, n);
			const angle = o.angle + (reverse ? Math.PI : 0);
			const length = o.length * smoothing;
			const x = current[0] + Math.cos(angle) * length;
			const y = current[1] + Math.sin(angle) * length;

			return [x, y];

		}

		const bezierCommand = (point, i, a) => {

			const cps = controlPoint(a[i - 1], a[i - 2], point);
			const cpe = controlPoint(point, a[i - 1], a[i + 1], true);

			return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;

		}

		const svgPath = (points, command) => {

			return points.reduce((acc, point, i, a) => i === 0
					? `M ${point[0]},${point[1]}`
					: `${acc} ${command(point, i, a)}`
				, '');

		}

		/**
		 * Add in new entries into points where there are more new points than
		 * the exists set of points.
		 * New points added cause an instant re-draw bypassing the animation, to
		 * overcome this new points are placed in the same location as
		 * the last existing point so when the re-draw happens, it looks like nothing changed
		 */
		if (Object.values(newPoints).length > this.points.length) {

			const lastExistingPoint = this.points[this.points.length - 1];

			for (let p = this.points.length; p < Object.values(newPoints).length; p++) {

				this.points.push(lastExistingPoint);

			}

			const path = svgPath(
				this.points,
				bezierCommand
			);

			/**
			 * Set new line path with extra points, then move into place with animation
			 */
			this.line.setAttribute('d', path);

			this.points = newPoints.map((a) => [a.cx.baseVal.value, a.cy.baseVal.value]);

			setTimeout(() => {

				const path = svgPath(
					this.points,
					bezierCommand
				);

				this.line.setAttribute('d', path);

			}, 10);

		} else if (Object.values(newPoints).length < this.points.length) {

			/**
			 * When there are more existing points than there are new points,
			 * points after the last new point will be moved into the same position
			 * as the last new point. After the animation is complete, these will then
			 * be removed causing an instant redraw, which won't be noticed
			 */
			const temporaryPoints = newPoints.map((a) => [a.cx.baseVal.value, a.cy.baseVal.value]);
			const lastTemporaryPoint = temporaryPoints[temporaryPoints.length - 1];

			for (let p = temporaryPoints.length; p < this.points.length; p++) {

				temporaryPoints.push(lastTemporaryPoint);

			}

			const path = svgPath(
				temporaryPoints,
				bezierCommand
			);

			this.line.setAttribute('d', path);

			setTimeout(() => {

				this.points = newPoints.map((a) => [a.cx.baseVal.value, a.cy.baseVal.value]);

				const path = svgPath(
					this.points,
					bezierCommand
				);

				this.line.setAttribute('d', path);

			}, 750);

		} else {

			/**
			 * Same number of points as last time, no redraw needed
			 */

			this.points = newPoints.map((a) => [a.cx.baseVal.value, a.cy.baseVal.value]);

			const path = svgPath(
				this.points,
				bezierCommand
			);

			this.line.setAttribute('d', path);

		}

	}

	_colorize() {

		if (this.index !== -1) return;

		if (this.chart.options.line.color === 'auto' || this.chart.options.line.color === null) {

			this.color = this._getContrastColor(this.chart.options.chart.color);

		} else {

			this.color = this._resolveColor(this.chart.options.line.color);

		}

	}

	set thickness(value) {

		if (this.index === -1) {

			this.chart.options.line.thickness = value;

		}

		this.line.setAttribute('stroke-width', value.toString());

	}

	set smooth(value) {

		if (this.index === -1) {

			this.chart.options.line.smooth = value;

		}

		this.updateLine();

	}

	set pointSize(value) {

		if (this.index === -1) {

			this.chart.options.line.pointSize = value;

		}

		for (const dot of Object.values(this.dots)) {

			dot.r = value;

		}

	}

	set color(color) {

		if (this.index === -1) {

			if (color === 'auto') color = this._getContrastColor(this.chart.options.chart.color);

		}

		this.line.setAttribute('stroke', this._resolveColor(color));

		for (const dot of Object.values(this.dots)) {

			dot.fill = this._resolveColor(color);

		}

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