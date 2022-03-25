class Slice extends CragCore {

	chart = null;

	slice = null;
	label = null;

	name = null;
	value = 0;
	percentage = 0;

	index = 0;

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
		this._createLabel()
		this.colorize();
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

	_positionLabel(keyWidth) {

		const chartAreaWidth = this.chart.chart.parent.offsetWidth - keyWidth - this.chart.chart.leftKey.offsetWidth;
		const chartAreaHeight = this.chart.chart.parent.offsetHeight - this.chart.title.area.offsetHeight - (this.chart.chart.bottomKey.offsetHeight / 1.5);

		const radius = Math.min(chartAreaWidth, chartAreaHeight);

		const mid = ((this.degrees.end / 2) + this.degrees.start / 2) - 90;
		const coords = this._polarToCartesian(mid, (radius / 2) - this.label.offsetWidth);

		this.label.style.top = coords.y + (chartAreaHeight / 2) - (this.label.offsetHeight / 2) +  'px';
		this.label.style.left = coords.x + (chartAreaWidth / 2) - (this.label.offsetWidth / 2) +  'px';

		if (this.percentage < 2) {

			this.label.style.opacity = '0';

		} else {

			this.label.style.opacity = '1';

		}

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

		let d = [
			"M", start.x, start.y,
			"A", outsideRadius, outsideRadius, 0, arcSweep, 0, end.x, end.y,
			"L", endInside.x, endInside.y,
			"A", insideRadius, insideRadius, 0, arcSweep, 1, startInside.x, startInside.y,
			"L", start.x, start.y
		].join(" ");

		return d;
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
		this.chart.sliceDetail.container.style.color = this._getContrastColor(
			this._getColorByMode('multi', this.index + this.chart.options.pie.palletOffset)
		)

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

	colorize() {

		this.slice.setAttribute('fill', this._getColorByMode('multi', this.index + this.chart.options.pie.palletOffset));
		this.slice.setAttribute('stroke',  this._resolveColor(this.chart.options.chart.color));

		this.label.style.color = this._getContrastColor(
			this._getColorByMode('multi', this.index + this.chart.options.pie.palletOffset)
		);

	}

	destroy() {

		this.label.style.opacity = '0';
		this._animate(360, 360, this.degrees.start, this.degrees.end, this.chart.animationSpeed, this.chart.options.pie.hole, 1);

		setTimeout(() => {

			this.label.remove();
			this.slice.remove();

		}, this.chart.animationSpeed + 100);

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
			},
			pie: {
				gap: 0.008,
				hole: 0,
				highToLow: true,
				palletOffset: 0,
			},
			key: {
				show: true,
				position: 'right',
			}
		};

		this.chart = {
			parent: null,
			container: null,
			area: null,
			labelArea: null,
			leftKey: null,
			rightKey: null,
			bottomKey: null,
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
		this.chart.leftKey = document.createElement('div');
		this.chart.rightKey = document.createElement('div');
		this.chart.bottomKey = document.createElement('div');

		this.chart.area.setAttribute('viewBox', '-1 -1 2 2');
		this.chart.area.setAttribute('class', 'cragPieChart');

		this.chart.container.className = 'cragPieChartContainer';
		this.chart.labelArea.className = 'cragPieLabels';
		this.chart.rightKey.className = 'cragPieRightKey';

		this.chart.parent.appendChild(this.chart.container);
		this.chart.container.appendChild(this.chart.labelArea);
		this.chart.container.appendChild(this.chart.area);
		this.chart.container.appendChild(this.chart.leftKey);
		this.chart.container.appendChild(this.chart.rightKey);
		this.chart.container.appendChild(this.chart.bottomKey);

		this.title = new Title(this);

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

	_colorize() {

		this.chart.container.style.backgroundColor = this._resolveColor(this.options.chart.color);
		this.title._colorize();

		for (const element of Object.values(this.elements)) {

			element.slice.colorize();
			element.key.label.style.color = this._getContrastColor(this.options.chart.color);

		}

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

		this._addRemoveSeriesElems();

		let maxKeyLength = 0;

		for (const [_, elements] of Object.entries(this.elements)) {

			elements.key.label.textContent = elements.slice.name;
			elements.key.label.style.opacity = '1';

			elements.key.key.style.top = (28 * _) + (this.chart.rightKey.offsetHeight / 2 - ((28 * ObjectLength(this.elements)) / 2)) + 'px';
			elements.key.key.style.opacity = '1';

			if (elements.key.key.offsetWidth + 8 > maxKeyLength) {

				maxKeyLength = elements.key.key.offsetWidth + 8;

			}

		}

		this.chart.rightKey.style.width = `${maxKeyLength}px`;

		for (const [index, element] of Object.entries(this.elements)) {

			element.key.marker.style.opacity = '1';

			element.key.marker.style.backgroundColor = this._getColorByMode('multi', parseInt(index) + this.options.pie.palletOffset);

			element.slice._animate(
				element.slice.degrees.start,
				element.slice.degrees.end,
				element.slice.degrees.oldStart,
				element.slice.degrees.oldEnd,
				this.animationSpeed,
				this.options.pie.hole,
				1);

			element.slice.degrees.oldEnd = element.slice.degrees.end;
			element.slice.degrees.oldStart = element.slice.degrees.start;

			element.slice._positionLabel(maxKeyLength);

		}

	}

	_addRemoveSeriesElems() {

		const total = this.total;

		let runningTotal = 0;

		/**
		 * Update the DataPoints with new data, DataPoints will be created where they don't yet exist
		 */
		for (let i = 0; i < this.data.length; i++) {

			if (!this.elements[i]) {

				/**
				 * Create new DataPoint
				 */
				this.elements[i] = {
					slice: new Slice(
						this,
						i,
						this.data[i][0],
						this.data[i][1],
						100 / total * this.data[i][1]
					),
					key: this._createKey(),
					// label: this._createLabel(),
				}

			} else {

				this.elements[i].slice.index = i;
				this.elements[i].slice.name = this.data[i][0];
				this.elements[i].slice.value = this.data[i][1];
				this.elements[i].slice.percentage = 100 / total * this.data[i][1];

			}

			this.elements[i].slice.degrees.total = 360 / total * this.data[i][1];
			this.elements[i].slice.degrees.start = 360 / total * runningTotal;
			this.elements[i].slice.degrees.end = 360 / total * (runningTotal + this.data[i][1]);
			this.elements[i].slice.label.textContent = (100 / total * this.data[i][1]).toFixed(0) + '%';

			this.elements[i].key.label.style.color = this._getContrastColor(this.options.chart.color);

			runningTotal += this.data[i][1];

		}

		/**
		 * Remove any DataPoints that are beyond the current data set length.
		 * This will happen when a new data set is loaded that is smaller than the old data set
		 */
		for (let i = Object.values(this.elements).length + 1; i >= this.data.length; i--) {

			if (!this.elements[i]) continue;

			const key = this.elements[i].key;

			this.elements[i].slice.destroy();

			key.key.style.opacity = '0';

			setTimeout(function() {
				key.key.remove();
			}, this.animationSpeed + 75);

			delete this.elements[i];

		}

	}

	_createKey() {

		const parent = document.createElement('div');
		const marker = document.createElement('div');
		const label = document.createElement('span');

		parent.classList.add('cragPieKey');
		marker.classList.add('cragPieKeyMarker');
		label.classList.add('cragPieKeyLabel');

		parent.appendChild(label);
		parent.appendChild(marker);

		this.chart.rightKey.appendChild(parent);

		return {'key': parent, 'marker': marker, 'label': label};

	}

	_sortData() {

		this.data = this.data.sort(sortFunction);

		function sortFunction(a, b) {
			if (a[1] === b[1]) {
				return 0;
			}
			else {
				return (a[1] > b[1]) ? -1 : 1;
			}
		}

	}

	update(data) {

		if (data.length > this.dataLimit) {
			data = data.slice(0, this.dataLimit);
		}

		this.data = data;

		if (this.options.pie.highToLow) {
			this._sortData();
		}

		this._draw();

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

}