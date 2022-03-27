class Slice extends CragCore {

	chart = null;

	slice = null;
	label = null;

	keyContainer = null;
	keyLabel = null;
	keyDot = null;

	name = null;
	value = 0;
	percentage = 0;

	index = 0;

	labelPosition = 'inside';

	degrees = {
		total: 0,
		start: 0,
		end: 0,
		oldStart: 360,
		oldEnd: 360
	}

	constructor(chart, index, name, value, percentage) {
		super();

		this.index = index;
		this.chart = chart;
		this.name = name;
		this.value = value;
		this.percentage = percentage;

		this._createSlice();
		this._createLabel();
		this._createKey();
		this._colorize();
		this._addEventListeners();

	}

	_createSlice() {

		this.slice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		const arc = this._describeArc(0, 0, this.chart.options.pie.gap, 1);

		this.slice.classList.add('cragPieSlice');
		this.slice.setAttribute("d", arc);
		this.slice.setAttribute('stroke-width', this.chart.options.pie.gap);

		this.chart.chart.area.insertChildAtIndex(this.slice, 0);

	}

	_createLabel() {

		this.label = document.createElement('span');

		this.label.classList.add('cragPieLabel');
		this.label.style.opacity = '0';
		this.label.textContent = '0';

		this.label.style.top =  this.label.offsetHeight / 2 +  'px';
		this.label.style.left = (this.chart.chart.labelArea.offsetWidth / 2) + (this.label.offsetWidth / 2) +  'px';

		this.chart.chart.labelArea.appendChild(this.label);

	}

	_createKey() {

		this.keyContainer = document.createElement('div');
		this.keyContainer.classList.add('cragPieKey');

		this.keyLabel = document.createElement('span');
		this.keyLabel.classList.add('cragPieKeyLabel');
		this.keyLabel.textContent = this.name;

		this.keyDot = document.createElement('span');
		this.keyDot.classList.add('cragPieKeyMarker');

		this.keyContainer.append(this.keyLabel, this.keyDot);

		this.chart.chart.rightKey.appendChild(this.keyContainer);

	}

	_positionLabel(keyWidth) {

		const chartAreaWidth = this.chart.chart.parent.offsetWidth - Math.max(keyWidth, 30) - 30;
		const chartAreaHeight = this.chart.chart.parent.offsetHeight - this.chart.title.area.offsetHeight - 30;
		const radius = Math.min(chartAreaWidth, chartAreaHeight);

		const labelOffset = this.chart.options.slices.labelPosition === 'inside' ? -this.label.offsetWidth : +this.label.offsetWidth;
		const mid = ((this.degrees.end / 2) + this.degrees.start / 2) - 90;
		const coords = this._polarToCartesian(mid, (radius / 2) + labelOffset);

		const labelLeft = coords.x + (chartAreaWidth / 2) - (this.label.offsetWidth / 2);
		const labelTop = coords.y + (chartAreaHeight / 2) - (this.label.offsetHeight / 2);

		this.label.style.top = `${labelTop}px`;
		this.label.style.left = `${labelLeft}px`;

		this.labelPosition = this.chart.options.slices.labelPosition;

		if (labelLeft + this.label.offsetWidth > chartAreaWidth && this.chart.options.slices.labelPosition === 'outside') {

			/* Position is outside but falls inside the key area, force back to inside */
			const mid = ((this.degrees.end / 2) + this.degrees.start / 2) - 90;
			const coords = this._polarToCartesian(mid, (radius / 2) - this.label.offsetWidth);

			const labelLeft = coords.x + (chartAreaWidth / 2) - (this.label.offsetWidth / 2);
			const labelTop = coords.y + (chartAreaHeight / 2) - (this.label.offsetHeight / 2);

			this.label.style.top = `${labelTop}px`;
			this.label.style.left = `${labelLeft}px`;

			this.labelPosition = 'inside'

		}

		if (this.percentage < 2 || this.chart.options.slices.labelPosition === 'none') {

			this.label.style.opacity = '0';

		} else {

			this.label.style.opacity = '1';

		}

		this._colorize();

	}

	_addEventListeners() {

		this.slice.onmouseover = () => this._showDetail();
		this.slice.onmouseout = () => this._hideDetail();

	}

	_polarToCartesian(angleInDegrees, radius) {

		let angleInRadians = (angleInDegrees) * Math.PI / 180.0;

		return {
			x: (radius * Math.cos(angleInRadians)),
			y: (radius * Math.sin(angleInRadians))
		};
	}

	_describeArc(startAngle, endAngle, insideRadius, outsideRadius) {

		let start = this._polarToCartesian(endAngle, outsideRadius);
		let end = this._polarToCartesian(startAngle, outsideRadius);
		let startInside = this._polarToCartesian(endAngle, insideRadius);
		let endInside = this._polarToCartesian(startAngle, insideRadius);

		let arcSweep = endAngle - startAngle <= 180 ? 0 : 1;

		return [
			"M", start.x, start.y,
			"A", outsideRadius, outsideRadius, 0, arcSweep, 0, end.x, end.y,
			"L", endInside.x, endInside.y,
			"A", insideRadius, insideRadius, 0, arcSweep, 1, startInside.x, startInside.y,
			"L", start.x, start.y
		].join(" ");

	}

	_easeInOutSin(t) {

		return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;

	}

	_animate(startNew, endNew, startCurrent, endCurrent, duration, inner, outer) {

		let self = this;

		startNew -= 90;
		endNew -= 90;
		startCurrent -= 90;
		endCurrent -= 90;

		let startTime = performance.now();

		function doAnimationStep() {

			let progressEase = self._easeInOutSin(Math.min((performance.now() - startTime) / duration, 1));

			let startStep = startCurrent + progressEase * (startNew - startCurrent);
			let endStep = endCurrent + progressEase * (endNew - endCurrent);

			let arc = self._describeArc(startStep, endStep, inner, outer);

			self.slice.setAttribute('d', arc);

			if (progressEase < 1) requestAnimationFrame(doAnimationStep);

		}

		requestAnimationFrame(doAnimationStep);

	}

	_showDetail() {

		for (const element of Object.values(this.chart.elements)) {

			element.slice.label.style.opacity = '0';

		}

		this.chart.sliceDetail.title.style.fontSize = Math.max(18, this.chart.chart.labelArea.offsetHeight / 16) + 'px';
		this.chart.sliceDetail.label.style.fontSize = Math.max(14, this.chart.chart.labelArea.offsetHeight / 26) + 'px';
		this.chart.sliceDetail.value.style.fontSize = Math.max(14, this.chart.chart.labelArea.offsetHeight / 26) + 'px';

		this.chart.sliceDetail.title.textContent = this.name;
		this.chart.sliceDetail.label.textContent = this.percentage.toFixed(2) + '%';
		this.chart.sliceDetail.value.textContent = this.formatLabel(
			this.value,
			this.chart.options.slices.format,
			this.chart.options.slices.currencySymbol,
			this.chart.options.slices.decimalPlaces
		);

		this.chart.sliceDetail.container.style.opacity = '1';

		this.chart.sliceDetail.container.style.color = this._getContrastColor(this.slice.getAttribute('fill'));

		this.chart.chart.area.appendChild(this.slice);

		this._animate(
			0.001,
			360,
			this.degrees.oldStart,
			this.degrees.oldEnd,
			this.chart.animationSpeed / 2,
			0,
			1);

		this.slice.classList.add('cragPieSliceHover');
		this.slice.style.transform = 'scale(1.05)';


	}

	_hideDetail() {

		this.chart.sliceDetail.container.style.opacity = '0';

		for (const element of Object.values(this.chart.elements)) {

			element.slice.label.style.opacity = '1';

		}

		this._animate(this.degrees.start, this.degrees.end, 0.001, 360, this.chart.animationSpeed / 2, this.chart.options.pie.hole, 1);

		this.slice.style.transform = 'scale(1)';
		this.slice.classList.remove('cragPieSliceHover');

	}

	_colorize() {

		if (this.chart.options.slices.colors == null) {

			this.slice.setAttribute('fill', this._getColorByMode('multi', this.index + this.chart.options.pie.palletOffset));

		} else {

			this.slice.setAttribute('fill', this._resolveColor( this.chart.options.slices.colors[this.index]));

		}

		this.slice.setAttribute('stroke',  this._resolveColor(this.chart.options.chart.color));

		if (this.labelPosition === 'outside') {

			this.label.style.color = this._getContrastColor(this.chart.options.chart.color);

		} else {

			this.label.style.color = this._getContrastColor(this.slice.getAttribute('fill'));

		}

		this.keyLabel.style.color = this._getContrastColor(this.chart.options.chart.color);

	}

	destroy() {

		this.keyContainer.style.opacity = '0';
		this.label.style.opacity = '0';

		this._animate(360, 360, this.degrees.start, this.degrees.end, this.chart.animationSpeed, this.chart.options.pie.hole, 1);

		setTimeout(() => {

			this.keyContainer.remove();
			this.label.remove();
			this.slice.remove();

		}, this.chart.animationSpeed + 100);

	}

}
class Slices extends CragCore {

	chart;
	slices = {};

	constructor(chart) {

		super();

		this.chart = chart;
		this.update()

	}


	update() {

		const total = this.chart.total;

		let runningTotal = 0;

		/**
		 * Update the DataPoints with new data, DataPoints will be created where they don't yet exist
		 */
		for (let i = 0; i < this.chart.data.length; i++) {

			if (!this.slices[i]) {

				/**
				 * Create new DataPoint
				 */
				this.slices[i] = new Slice(
						this.chart,
						i,
						this.chart.data[i][0],
						this.chart.data[i][1],
						100 / total * this.chart.data[i][1]
					);

			} else {

				this.slices[i].index = i;
				this.slices[i].name = this.chart.data[i][0];
				this.slices[i].value = this.chart.data[i][1];
				this.slices[i].percentage = 100 / total * this.chart.data[i][1];

			}

			this.slices[i].degrees.total = 360 / total * this.chart.data[i][1];
			this.slices[i].degrees.start = 360 / total * runningTotal;
			this.slices[i].degrees.end = 360 / total * (runningTotal + this.chart.data[i][1]);

			if (this.chart.options.slices.showValues) {

				this.slices[i].label.textContent = this.formatLabel(
					this.slices[i].value,
					this.chart.options.slices.format,
					this.chart.options.slices.currencySymbol,
					this.chart.options.slices.decimalPlaces
				);

			} else {

				this.slices[i].label.textContent = (100 / total * this.chart.data[i][1]).toFixed(0) + '%';

			}

			runningTotal += this.chart.data[i][1];

		}

		/**
		 * Remove any DataPoints that are beyond the current data set length.
		 * This will happen when a new data set is loaded that is smaller than the old data set
		 */
		for (let i = Object.values(this.slices).length + 1; i >= this.chart.data.length; i--) {

			if (!this.slices[i]) continue;

			this.slices[i].destroy();
			delete this.slices[i];

		}

	}

	draw() {

		let maxKeyLength = 0;

		for (const [_, slice] of Object.entries(this.slices)) {

			slice.keyLabel.textContent = this.chart.data[_][0];
			slice.keyLabel.style.opacity = '1';

			slice.keyContainer.style.top = (28 * _) + (this.chart.chart.rightKey.offsetHeight / 2 - ((28 * ObjectLength(this.slices)) / 2)) + 'px';
			slice.keyContainer.style.opacity = '1';

			if (slice.keyContainer.offsetWidth + 8 > maxKeyLength) {

				maxKeyLength = slice.keyContainer.offsetWidth + 8;

			}

			slice.keyDot.style.backgroundColor = slice.slice.getAttribute('fill');

		}

		this.chart.chart.rightKey.style.width = `${maxKeyLength}px`;

		for (const slice of Object.values(this.slices)) {

			slice._animate(
				slice.degrees.start,
				slice.degrees.end,
				slice.degrees.oldStart,
				slice.degrees.oldEnd,
				this.chart.animationSpeed,
				this.chart.options.pie.hole,
				1);

			slice.degrees.oldEnd = slice.degrees.end;
			slice.degrees.oldStart = slice.degrees.start;

			slice._positionLabel(maxKeyLength);

		}


	}

	_colorize() {

		for (const slice of Object.values(this.slices)) {

			slice._colorize();

		}

	}

}
class CragPie extends CragCore {

	constructor (data, options) {
		super();

		this.data = data;

		this.options = {
			chart: {
				title: null,
				color: 'white',
			},
			slices: {
				colors: null,
				format: 'number',
				decimalPlaces: 0,
				currencySymbol: 'GBP',
				labelPosition: 'inside',
			},
			pie: {
				gap: 0.008,
				hole: 0,
				highToLow: true,
				palletOffset: 0,
			},
			key: {
				show: true
			}
		};

		this.chart = {
			parent: null,
			container: null,
			area: null,
			labelArea: null,
			rightKey: null,
		};

		this.elements = {}

		this.sliceDetail = {
			container: null,
			title: null,
			label: null,
			value: null
		};

		this.dataLimit = 12;
		this.animationSpeed = 400;

		/* CHART */
		this.options.chart.title = this.validateOption(options?.chart?.title, 'string', this.options.chart.title);
		if (this._isValidColor(options?.chart?.color)) this.options.chart.color = options.chart.color;

		/* PIE */
		this.options.pie.hole = this.validateOption(options?.pie?.hole, 'number', this.options.pie.hole);
		this.options.pie.palletOffset = this.validateOption(options?.pie?.palletOffset, 'number', this.options.pie.palletOffset);
		this.options.pie.highToLow = this.validateOption(options?.pie?.highToLow, 'boolean', this.options.pie.highToLow);

		/* SLICES */
		this.options.slices.format = this.validateOption(options?.slices?.format, this.labelFormats, this.options.slices.format);
		this.options.slices.decimalPlaces = this.validateOption(options?.slices?.decimalPlaces, 'number', this.options.slices.decimalPlaces);
		this.options.slices.showValues = this.validateOption(options?.slices?.showValues, 'boolean', this.options.slices.showValues);
		this.options.slices.labelPosition = this.validateOption(options?.slices?.labelPosition, this.labelPositions, this.options.slices.labelPosition);
		this.options.slices.colors = this.validateOption(options?.slices?.colors, 'object', this.options.slices.colors);

		/* KEY */
		this.options.key.show = this.validateOption(options?.key?.show, 'boolean', this.options.key.show);

		// Apply data sort before truncating
		if (this.options.pie.highToLow) this._sortData();
		if (this.data.length > this.dataLimit) this.data = this.data.slice(0, this.dataLimit);

	}

	create(e) {

		if (e === undefined) return;

		this.chart.parent = document.getElementById(e);
		this.chart.container = document.createElement('div');
		this.chart.area = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

		this.chart.labelArea = document.createElement('div');
		this.chart.rightKey = document.createElement('div');

		this.chart.area.setAttribute('viewBox', '-1 -1 2 2');
		this.chart.area.setAttribute('class', 'cragPieChart');

		this.chart.container.className = 'cragPieChartContainer';
		this.chart.labelArea.className = 'cragPieLabels';
		this.chart.rightKey.className = 'cragPieRightKey';

		this.chart.parent.appendChild(this.chart.container);
		this.chart.container.appendChild(this.chart.labelArea);
		this.chart.container.appendChild(this.chart.area);
		this.chart.container.appendChild(this.chart.rightKey);

		this.title = new Title(this);
		this.slices = new Slices(this);

		this._createSliceDetail();
		this._applyListeners();

		setTimeout(() => {

			this._draw();
			this._colorize();

		}, this.animationSpeed);

		return this;

	}

	_createSliceDetail() {

		this.sliceDetail.container = document.createElement('div');
		this.sliceDetail.title = document.createElement('h6');
		this.sliceDetail.value = document.createElement('h6');
		this.sliceDetail.label = document.createElement('h6');

		this.sliceDetail.container.className = 'cragPieSliceDetail';
		this.sliceDetail.title.className = 'cragPieSliceDetailTitle';
		this.sliceDetail.value.className = 'cragPieSliceDetailValue';
		this.sliceDetail.label.className = 'cragPieSliceDetailLabel';

		this.chart.labelArea.appendChild(this.sliceDetail.container);
		this.sliceDetail.container.appendChild(this.sliceDetail.title);
		this.sliceDetail.container.appendChild(this.sliceDetail.label);
		this.sliceDetail.container.appendChild(this.sliceDetail.value);

	}

	/**
	 * Any default listeners to be applied here
	 * @private
	 */
	_applyListeners() {

		window.addEventListener('resize', () => {
			setTimeout(() => {
				this._draw();
			}, this.animationSpeed);
		});

	}

	_draw() {

		this.slices.update();
		this.slices.draw();

	}

	_colorize() {

		this.chart.container.style.backgroundColor = this._resolveColor(this.options.chart.color);
		this.title._colorize();
		this.slices._colorize();

	}

	_sortData() {

		this.data.sort((a, b) => {
			return b[1] - a[1];
		});

	}

	get total() {

		let value = 0;

		for (let i = 0; i < this.data.length; i++) {
			value += this.data[i][1];
		}

		return value;

	}

	/**
	 * @param {any} value
	 */
	set color(value) {

		if (this._isValidColor(value)) this.options.chart.color = value;

		this._colorize();

	}

	update(data) {

		this.data = data;

		if (this.options.pie.highToLow) this._sortData();

		if (data.length > this.dataLimit) this.data = data.slice(0, this.dataLimit);

		this._draw();

	}

}