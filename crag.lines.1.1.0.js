/**
 * @typedef optionsLine Line options.
 * @property {number} [thickness] Thickness of the line.
 * @property {number} [pointSize] Size of the points.
 * @property {string|null} [color] Line color, can be hex code, pallet name or mode.
 * @property {boolean} [smooth] Applies smooth rounding to the line between points.
 */
/**
 * @typedef options
 * @property {optionsChart} [chart]
 * @property {primary: {optionsVAxes}, secondary: {optionsVAxes}} [vAxes]
 * @property {Array.<optionsLine>} [lines]
 */
class CragLine extends CragCore {

	/**
	 * @param {array} data
	 * @param {options} options
	 */
	constructor (data, options = undefined) {
		super();

		this.data = {
			labels: data.slice(0, 20).map((e) => e.slice(0, 1)).flat(),
			series: data.slice(0, 20),
			max: {
				primary: 0,
			},
			min: {
				primary: 0,
			},
		};

		this.options = {
			/**
			 * @type optionsChart
			 */
			chart: {
				title: null,
				color: CragPallet.white
			},
			/**
			 * @type optionsLine
			 */
			line: {
				thickness: 3,
				pointSize: 3,
				color: CragPallet.auto,
				smooth: true
			},
			/**
			 * @type Array.<optionsLine>
			 */
			lines: {
				0: {
					thickness: 3,
					pointSize: 3,
					color: CragPallet.auto,
					smooth: true
				},
				1: {
					thickness: 3,
					pointSize: 3,
					color: CragPallet.auto,
					smooth: true
				},
				2: {
					thickness: 3,
					pointSize: 3,
					color: CragPallet.auto,
					smooth: true
				},
				3: {
					thickness: 3,
					pointSize: 3,
					color: CragPallet.auto,
					smooth: true
				},
				4: {
					thickness: 3,
					pointSize: 3,
					color: CragPallet.auto,
					smooth: true
				},
			},
			vAxes: {
				primary: {
					name: 'Series 1',
					majorLines: true,
					minorLines: true,
					shadowOnZeroLine: false,
					format: 'number',
					currencySymbol: 'GBP',
					decimalPlaces: 0,
					min: 'auto'
				},
			},
		}

		/**
		 * Line Options
		 */
		if (this._isValidColor(options?.line?.color)) this.options.line.color = options.line.color;
		this.options.line.smooth = this.validateOption(options?.line?.smooth, 'boolean', this.options.line.smooth);
		if (options?.line?.thickness > 0 && options?.line?.thickness < 11) this.options.line.thickness = options.line.thickness;
		if (options?.line?.pointSize > 0 && options?.line?.pointSize < 51) this.options.line.pointSize = options.line.pointSize;

		for (let i = 0; i < this.data.series[0].length - 1; i++) {

			if (options?.lines === undefined) continue;

			if (this._isValidColor(options?.lines[i]?.color)) this.options.lines[i].color = options.lines[i].color;
			this.options.lines[i].smooth = this.validateOption(options?.lines[i]?.smooth, 'boolean', this.options.lines[i].smooth);
			if (options?.lines[i]?.thickness > 0 && options?.lines[i]?.thickness < 11) this.options.lines[i].thickness = options.lines[i].thickness;
			if (options?.lines[i]?.pointSize > 0 && options?.lines[i]?.pointSize < 51) this.options.lines[i].pointSize = options.lines[i].pointSize;

		}
		/**
		 * Chart Options
		 */
		this.options.chart.title = this.validateOption(options?.chart?.title, 'string', this.options.chart.title);
		if (this._isValidColor(options?.chart?.color)) this.options.chart.color = options.chart.color;

		/**
		 * vAxes options
		 * 0 = left axis, primary columns
		 * 1 = right axis, secondary points
		 */
		this.options.vAxes.primary.name = this.validateOption(options?.vAxes?.primary?.name, 'string', this.options.vAxes.primary.name);
		this.options.vAxes.primary.decimalPlaces = this.validateOption(options?.vAxes?.primary?.decimalPlaces, 'number', this.options.vAxes.primary.decimalPlaces);
		this.options.vAxes.primary.majorLines = this.validateOption(options?.vAxes?.primary?.majorLines, 'boolean', this.options.vAxes.primary.majorLines);
		this.options.vAxes.primary.minorLines = this.validateOption(options?.vAxes?.primary?.minorLines, 'boolean', this.options.vAxes.primary.minorLines);
		this.options.vAxes.primary.format = this.validateOption(options?.vAxes?.primary?.format, this.labelFormats, this.options.vAxes.primary.format);
		if (options?.vAxes?.primary?.min === 'auto' || !isNaN(options?.vAxes?.primary?.min)) this.options.vAxes.primary.min = options?.vAxes?.primary?.min;

		this.chart = {
			parent: null,
			container: null,
			area: null,
		}

	}

	create(e) {

		if (e === undefined) return;

		this.chart.parent = document.getElementById(e);
		this.chart.container = document.createElement('div');
		this.chart.area = document.createElement('div');

		this.chart.container.className = 'cragLineChartContainer';
		this.chart.area.className = 'cragLineChartArea';

		this.chart.parent.appendChild(this.chart.container);
		this.chart.container.append(this.chart.area);

		this.primaryVAxis = new VAxis(this, VAxis.primary);
		this.hAxis = new HAxis(this);
		this.toolTip = new ToolTip(this);
		this.title = new Title(this);
		this.lines = new Lines(this, this.data.series[0].length - 1)

		setTimeout(this._draw.bind(this), 500);

		this._applyListeners();

		return this;

	}

	/**
	 * Any default listeners to be applied here
	 * @private
	 */
	_applyListeners() {

		const self = this;

		// this.chart.parent.addEventListener('onresize', ()=> self._draw());
		window.addEventListener('resize', () => self._draw());

	}

	/**
	 * Full redraw and _colorize
	 * @private
	 */
	_draw() {

		/**
		 * Updates both vAxis to match the current data set.
		 */
		this._getDataMinMax();

		this.primaryVAxis.update(this.data.min.primary, this.data.max.primary);

		this.hAxis.update();
		this.lines.update();
		this._colorize();

	}

	/**
	 * Applies coloring to the chart
	 * @private
	 */
	_colorize() {

		/**
		 * Core chart components
		 */
		this.chart.container.style.backgroundColor = this._resolveColor(this.options.chart.color);

		this.title._colorize();
		this.hAxis._colorize();
		this.toolTip._colorize();
		this.lines._colorize();
		this.primaryVAxis._colorize();

	}

	_getDataMinMax() {

		this.data.max = {
			primary: Math.max(...this.data.series.map((e) => e.slice(1)).flat()),
		};
		this.data.min = {
			primary: Math.min(...this.data.series.map((e) => e.slice(1)).flat()),
		};

	}

	/**
	 * @description Applies a new data set to the chart. Must be full data set.
	 * @param {any} data
	 */
	update(data) {

		this.data.series = data.slice(0, 20);

		this._draw();

	}

	/**
	 * @description Applies a new background color to the chart.
	 * @param {string} color
	 */
	set color(color) {

		if (this._isValidColor(color)) this.options.chart.color = color;

		this._colorize();

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

		if (this.chart.options.line.color === CragPallet.auto || this.chart.options.line.color === null) {

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

			if (color === CragPallet.auto) color = this._getContrastColor(this.chart.options.chart.color);

		}

		this.line.setAttribute('stroke', this._resolveColor(color));

		for (const dot of Object.values(this.dots)) {

			dot.fill = this._resolveColor(color);

		}

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

			if (this.chart.options.lines[i].color === CragPallet.auto) {

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

		if (value === CragPallet.auto) {

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