/**
 * @typedef optionsChart Chart options.
 * @property {null|string} [title] Title to show above the chart.
 * @property {string} [color] Background color of the chart, can be hex code or pallet name.
 */
/**
 * @typedef optionsVAxes vAxes Options.
 * @property {string} [name] The name of the data series for the vAxis, will be applied to the tool tip.
 * @property {boolean} [majorLines] Enables the horizontal major lines.
 * @property {boolean} [minorLines] Enables the horizontal minor lines.
 * @property {string} [format] Formatting type, must be one of the valid options.
 * @property {string} [formatOption] Additional parameters for the label formatting, see docs for more info.
 * @property {boolean} [showOnPrimary] Shows the secondary axis on the primary.
 * @property {string|number} [min] Sets the minimum value for the vAxis, when omitted, this will be calculated automatically.
 */
/**
 * @typedef optionsColumn Column Options.
 * @property {number} [width] Percentage width of the column relative to the space available. Example, 100 will be a full width columns.
 * @property {string} [color] The color of the bars, either a hex code, an inbuilt pallet name or color mode.
 * @property {boolean} [rounded] Applies rounded corners at the top of the column.
 * @property {boolean} [inset] Applies an inset shadow on the column.
 * @property {boolean} [striped] Applies diagonal striping to the column.
 * @property {boolean} [animated] Animates the stripes for a barber-pole effect.
 * @property {function} [onClick] Callback function when columns are clicked. Passes a DataPoint object to the function.
 * @property {optionsColumnLabels} [labels]
 */
/**
 * @typedef optionsColumnLabels Column label options.
 * @property {'inside','outside','none'} [position] Position of the column labels.
 * @property {string} [color] Color column labels, can be hex code, pallet name or mode.
 */
/**
 * @typedef optionsLine Line options.
 * @property {number} [width] Width of the line.
 * @property {number} [pointSize] Size of the points.
 * @property {string|null} [color] Line color, can be hex code, pallet name or mode.
 * @property {boolean} [smooth] Applies smooth rounding to the line between points.
 */
/**
 * @typedef options
 * @property {optionsChart} [chart]
 * @property {0: {optionsVAxes}, 1: {optionsVAxes}} [vAxes]
 * @property {optionsColumn} [columns]
 * @property {optionsLine} [line]
 */

class DataPoint {

	index = 0;
	realValues = {
		primary: 0,
		secondary: 0
	}
	realName = null;

	/** @type {SVGCircleElement} */
	dot = null;

	/** @type {HTMLDivElement} */
	column = null;

	/** @type {HTMLSpanElement} */
	columnLabel = null;

	/** @type {HTMLSpanElement} */
	axisLabel = null;

	options = {

	}

	columnLabelProperties = {
		actualPosition: null
	}
	columnProperties = {
		height: 0,
		width: 0,
		color: null
	}

	constructor (index, values, name, chartOptions) {

		this.index = index;
		this.primaryValue = values[0];
		this.secondaryValue = values[1];
		this.realName = name;

		this.options = {
			columns: chartOptions.columns,
			line: chartOptions.line,
		};

		this._createColumn();
		this._createDot();
		this._createColumnLabel();
		this._createAxisLabel();

	}

	_createDot() {

		this.dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

		this.dot.setAttribute('cx', '100%');
		this.dot.setAttribute('cy', '100%');

		this.dot.setAttribute('r', this.options.line.pointSize);
		this.dot.setAttribute('class', 'cragComboPoint');

	}

	_createColumn() {

		this.column = document.createElement('div');

		this.column.className = 'cragColumn';

		this._setColumnStyle();

	}

	_createColumnLabel() {

		this.columnLabel = document.createElement('span');
		this.columnLabel.className = 'cragColumnLabel';

	}

	_positionColumnLabel(width, zeroLine, positiveSpace, negativeSpace, max, min) {

		this.columnLabel.style.width = 'auto';
		this.columnLabel.style.width = `${width}px`;
		this.columnLabel.style.left = `${width * this.index}px`;

		if (this.primaryValue < 0) {

			/**
			 * Calculate outside position for label as a negative
			 */
			let position = zeroLine - (negativeSpace / min * this.primaryValue) - this.columnLabel.offsetHeight;

			this.columnLabelProperties.actualPosition = 'outside'

			/**
			 * If label won't fit in the area or the label options are set to inside
			 * add back on the height of the label to put it back within the column
			 */
			if (position - this.columnLabel.offsetHeight < 0 || this.options.columns.labels.position === 'inside') {

				position += this.columnLabel.offsetHeight;
				this.columnLabelProperties.actualPosition = 'inside'

				/**
				 * One final check to make sure that the label is not bigger than the columns
				 * If so mode it back outside
				 */
				if (this.columnProperties.height < this.columnLabel.offsetHeight) {

					position -= this.columnLabel.offsetHeight;
					this.columnLabelProperties.actualPosition = 'outside'

				}

			}

			this.columnLabel.style.bottom = `${position}px`;

		} else {

			/**
			 * Calculate outside position for label as a positive
			 */
			let position = zeroLine + (positiveSpace / max * this.primaryValue);
			this.columnLabelProperties.actualPosition = 'outside'

			/**
			 * If label won't fit in the area or the label options are set to inside
			 * remove the height of the label to put it back within the column
			 */
			if (this.columnProperties.height + this.columnLabel.offsetHeight > positiveSpace || this.options.columns.labels.position === 'inside') {

				position -= this.columnLabel.offsetHeight;
				this.columnLabelProperties.actualPosition = 'inside'

				/**
				 * One final check to make sure that the label is not bigger than the columns
				 * If so mode it back outside
				 */
				if (this.columnProperties.height < this.columnLabel.offsetHeight) {

					position += this.columnLabel.offsetHeight;
					this.columnLabelProperties.actualPosition = 'outside'

				}

			}

			this.columnLabel.style.bottom = `${position}px`;

		}

	}

	_createAxisLabel() {

		this.axisLabel = document.createElement('span');

		this.axisLabel.className = 'cragHAxisLabel';
		this.axisLabel.textContent = this.realName;

	}

	_positionAxisLabel(width) {

		this.axisLabel.style.width = `${width}px`;
		this.axisLabel.style.left = `${width * this.index}px`;

	}

	_positionColumn(bottom, left, width) {

		/**
		 * Only set bottom on positive values as negative columns are done after height
		 */
		if (this.primaryValue >= 0) {

			/**
			 * Adding 2px to cover the height of the zero line on the vAxis
			 */
			this.column.style.bottom = `${bottom + 2}px`;

		}

		this.column.style.left = `${left}px`;
		this.column.style.width = `${width}px`;

	}

	_positionDot(positiveSpace, negativeSpace, max, min, left) {

		/**
		 * Percentage from top to the zero line
		 * (cy attribute is from top of svg container to bottom)
		 */
		const cy = 100 / (positiveSpace + negativeSpace) * positiveSpace;

		if (this.secondaryValue < 0) {

			/**
			 * Percentage from zero line percentage down to negative value
			 */
			const cyPlus = (this.secondaryValue / min) * (100 - cy);

			this.dot.setAttribute('cy', `${cyPlus + cy}%`);

		} else {

			/**
			 * Percentage from zero line percentage back up to positive value
			 */
			const cyMinus = ((this.secondaryValue - Math.max(0, min)) / (max - Math.max(0, min))) * cy;

			this.dot.setAttribute('cy', `${cy - cyMinus}%`);

		}

		this.dot.setAttribute('cx', `${left}px`);

	}

	setColumnHeight(positiveSpace, negativeSpace, max, min) {

		if (this.primaryValue < 0) {

			/**
			 * Round number down to compensate for slight gaps above the negative columns
			 */
			this.columnProperties.height = negativeSpace / min * this.primaryValue;

			/**
			 * When value is negative, the bottom is the height less the negative space
			 * This will put it just below the zero line. It is then inverted to compensate
			 * for rounded columns TODO: Invert rounding maybe?
			 */
			this.column.style.bottom = `${negativeSpace - this.columnProperties.height}px`;
			this.column.style.transform = 'scaleY(-1)';

		} else {

			/**
			 * Subtract 2 from the height on positive to compensate for the two added in
			 * bottom property. Also reset invert in case columns was previously inverted
			 */
			this.columnProperties.height = positiveSpace / (max - Math.max(0, min)) * (this.primaryValue - Math.max(0, min)) - 2;
			this.column.style.transform = 'scaleY(1)';

		}

		this.column.style.height = `${this.columnProperties.height}px`;

	}

	_setColumnStyle() {

		this.column.classList.toggle('cragColumnRound', this.options.columns.rounded);
		this.column.classList.toggle('cragColumnInset', this.options.columns.inset);
		this.column.classList.toggle('cragColumnStriped', this.options.columns.striped);
		this.column.classList.toggle('cragColumnStripedAnimate', this.options.columns.animated);

	}

	_destroy() {

		this.column.style.left = `calc(100% + ${parseInt(this.column.style.width.replace('px', '')) * this.index}px)`;
		this.dot.style.opacity = '0';

		this.axisLabel.style.opacity = '0';
		this.axisLabel.style.left = '100%';

		this.columnLabel.style.opacity = '0';
		this.columnLabel.style.left = '100%';

		setTimeout(() => {

			this.column.remove();
			this.dot.remove();
			this.axisLabel.remove();

			if (this.columnLabel != null) this.columnLabel.remove();

		}, 1000);

	}

	set primaryValue(value) {

		this.realValues.primary = value;

	}
	get primaryValue() {

		return this.realValues.primary;

	}

	set secondaryValue(value) {

		this.realValues.secondary = value;

	}
	get secondaryValue() {

		return this.realValues.secondary;

	}

	/**
	 * @param {array<string>|null} value
	 */
	set name(value) {

		this.realName = value;
		this.axisLabel.textContent = value;

	}

	get name () {
		return this.realName;
	}

	/**
	 * @param {string} color
	 */
	set columnColor(color) {

		this.columnProperties.color	= color;
		this.column.style.backgroundColor = color;

	}

	set columnOptions(value) {

		this.options.columns = value;

		this._setColumnStyle();

	}

}

class Line {

	/** @type {null|SVGPathElement} */
	line = null;

	/** @type {array} */
	points = [[0, 0]];

	/**
	 * @type {optionsLine}
	 */
	options = {};

	constructor(options) {

		this.options = options;

		this._createLine();

	}

	_createLine() {

		this.line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.line.setAttribute('fill', 'none');

		this.line.setAttribute('stroke-width', this.options.width.toString());
		this.line.setAttribute('class', 'cragComboLine');
		this.line.setAttribute('d', 'M0,0');

		return this.line;

	}

	update(newPoints) {

		const smoothing = this.options.smooth ? 0.125 : 0;

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

}

class CragCombo extends CragCore {

	/**
	 * @param {array} data
	 * @param {options} options
	 */
	constructor (data, options = undefined) {
		super();

		this.primaryVAxis = null;
		this.secondaryVAxis = null;

		this.dataPoints = {};

		this.data = {
			series: data,
			max: {
				primary: 0,
				secondary: 0,
			},
			min: {
				primary: 0,
				secondary: 0,
			},
		};

		this.options = {
			/**
			 * @type optionsChart
			 */
			chart: {
				title: null,
				color: 'white',
				minorLines: true
			},
			/**
			 * @type optionsColumn
			 */
			columns: {
				width: 90,
				color: 'multi',
				rounded: false,
				inset: false,
				striped: false,
				animated: false,
				onClick: null,
				labels: {
					position: 'none',
					color: 'auto'
				},
			},
			/**
			 * @type optionsLine
			 */
			line: {
				width: 2,
				pointSize: 4,
				color: null,
				smooth: true
			},
			vAxes: {
				/**
				 * @type optionsVAxes
				 */
				primary: {
					name: 'Series 1',
					majorLines: true,
					minorLines: true,
					format: 'number',
					formatOption: 'GBP',
					min: 'auto'
				},
				/**
				 * @type optionsVAxes
				 */
				secondary: {
					name: 'Series 2',
					majorLines: false,
					minorLines: false,
					showOnPrimary: false,
					format: 'number',
					formatOption: 'GBP',
					min: 'auto'
				}
			}
		}

		/**
		 * Limit chart to 20 bars
		 */
		this.data.series = this.data.series.slice(0, 20);

		/**
		 * Column Options
		 */
		if (options?.columns?.width > 0 && options?.columns?.width < 101) this.options.columns.width = options.columns.width;

		if (this._isValidColor(options?.columns?.color)) this.options.columns.color = options.columns.color;
		if (this._isValidColor(options?.columns?.labels?.color)) this.options.columns.labels.color = options.columns.labels.color;

		this.options.columns.rounded = this.validateOption(options?.columns?.rounded, 'boolean', this.options.columns.rounded);
		this.options.columns.inset = this.validateOption(options?.columns?.inset, 'boolean', this.options.columns.inset);
		this.options.columns.striped = this.validateOption(options?.columns?.striped, 'boolean', this.options.columns.striped);
		this.options.columns.animated = this.validateOption(options?.columns?.animated, 'boolean', this.options.columns.animated);
		this.options.columns.onClick = this.validateOption(options?.columns?.onClick, 'function', this.options.columns.onClick);

		this.options.columns.labels.position = this.validateOption(options?.columns?.labels?.position, this.labelPositions, this.options.columns.labels.position);

		/**
		 * Line Options
		 */
		if (this._isValidColor(options?.line?.color)) this.options.line.color = options.line.color;

		this.options.line.smooth = this.validateOption(options?.line?.smooth, 'boolean', this.options.line.smooth);
		if (options?.line?.width > 0 && options?.line?.width < 101) this.options.line.width = options.line.width;
		if (options?.line?.pointSize > 0 && options?.line?.pointSize < 51) this.options.line.pointSize = options.line.pointSize;

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
		this.options.vAxes.primary.majorLines = this.validateOption(options?.vAxes?.primary?.majorLines, 'boolean', this.options.vAxes.primary.majorLines);
		this.options.vAxes.primary.minorLines = this.validateOption(options?.vAxes?.primary?.minorLines, 'boolean', this.options.vAxes.primary.minorLines);
		this.options.vAxes.primary.format = this.validateOption(options?.vAxes?.primary?.format, this.labelFormats, this.options.vAxes.primary.format);
		if (options?.vAxes?.primary?.min === 'auto' || !isNaN(options?.vAxes?.primary?.min)) this.options.vAxes.primary.min = options?.vAxes?.primary?.min;

		this.options.vAxes.secondary.name = this.validateOption(options?.vAxes?.secondary?.name, 'string', this.options.vAxes.secondary.name);
		this.options.vAxes.secondary.majorLines = this.validateOption(options?.vAxes?.secondary?.majorLines, 'boolean', this.options.vAxes.secondary.majorLines);
		this.options.vAxes.secondary.minorLines = this.validateOption(options?.vAxes?.secondary?.minorLines, 'boolean', this.options.vAxes.secondary.minorLines);
		this.options.vAxes.secondary.showOnPrimary = this.validateOption(options?.vAxes?.secondary?.showOnPrimary, 'boolean', this.options.vAxes.secondary.showOnPrimary);
		this.options.vAxes.secondary.format = this.validateOption(options?.vAxes?.secondary?.format, this.labelFormats, this.options.vAxes.secondary.format);
		if (options?.vAxes?.secondary?.min === 'auto' || !isNaN(options?.vAxes?.secondary?.min)) this.options.vAxes.secondary.min = options?.vAxes?.secondary?.min;

		this.parent = null;
		this.chartContainer = null;

		this.chart = {
			area: null,
			gridArea: null,
			labelArea: null,
			columnArea: null,
			pointArea: null,
			titleArea: null,
			title: null,
			elements: {}
		}

		this.line = null;

		this.hAxis = {
			area: null,
			elements: {}
		}

		this.toolTip = {
			container: null,
			title: null,
			labels: {
				primary: null,
				secondary: null,
			},
			values: {
				primary: null,
				secondary: null,
			},
		}

	}

	create(e) {

		if (e === undefined) return;

		this.parent = document.getElementById(e);


		this.chartContainer = document.createElement('div');
		this.hAxis.area = document.createElement('div');
		this.chart.titleArea = document.createElement('div');
		this.chart.area = document.createElement('div');
		this.chart.columnArea = document.createElement('div');
		this.chart.labelArea = document.createElement('div');
		this.toolTip.container = document.createElement('div');
		this.toolTip.title = document.createElement('h6');
		this.toolTip.values.primary = document.createElement('h6');
		this.toolTip.values.secondary = document.createElement('h6');
		this.toolTip.labels.primary = document.createElement('h6');
		this.toolTip.labels.secondary = document.createElement('h6');

		this.primaryVAxis = new vAxisLines(this.options.vAxes.primary, false);
		this.secondaryVAxis = new vAxisLines(this.options.vAxes.secondary, true);

		if (this.options.chart.title != null) {

			this.chart.title = document.createElement('h1');
			this.chart.title.className = 'cragTitleText';
			this.chart.title.textContent = this.options.chart.title;
			this.chart.titleArea.appendChild(this.chart.title);

		}

		this.chart.pointArea = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

		this.line = new Line(this.options.line);

		this.chartContainer.className = 'cragComboChartContainer';
		this.hAxis.area.className = 'cragComboHAxis';
		this.chart.titleArea.className = 'cragComboTitle';
		this.chart.area.className = 'cragComboChartArea';
		this.toolTip.container.className = 'cragComboToolTip';
		this.toolTip.title.className = 'cragComboToolTipTitle';
		this.toolTip.values.primary.className = 'cragComboToolTipValue';
		this.toolTip.values.secondary.className = 'cragComboToolTipValue';
		this.toolTip.labels.primary.className = 'cragComboToolTipLabel';
		this.toolTip.labels.secondary.className = 'cragComboToolTipLabel';

		this.chart.labelArea.className = 'cragChartSubArea';
		this.chart.columnArea.className = 'cragChartSubArea';

		this.chart.labelArea.style.pointerEvents = 'none';
		this.chart.pointArea.style.pointerEvents = 'none';

		this.chart.pointArea.setAttribute('width', '100%');
		this.chart.pointArea.setAttribute('height', '100%');
		this.chart.pointArea.style.left = '0';
		this.chart.pointArea.style.position = 'absolute';
		this.chart.pointArea.appendChild(this.line.line);

		this.parent.appendChild(this.chartContainer);
		this.chartContainer.appendChild(this.primaryVAxis.axisDiv);
		this.chartContainer.appendChild(this.secondaryVAxis.axisDiv);
		this.chart.area.appendChild(this.primaryVAxis.linesDiv);
		this.chart.area.appendChild(this.secondaryVAxis.linesDiv);
		this.chartContainer.appendChild(this.chart.titleArea);
		this.chartContainer.appendChild(this.hAxis.area);
		this.chartContainer.appendChild(this.chart.area);
		this.chart.area.appendChild(this.chart.columnArea);
		this.chart.area.appendChild(this.chart.pointArea);
		this.chart.area.appendChild(this.chart.labelArea);
		this.chart.area.appendChild(this.toolTip.container);
		this.toolTip.container.appendChild(this.toolTip.title);
		this.toolTip.container.appendChild(this.toolTip.labels.primary);
		this.toolTip.container.appendChild(this.toolTip.values.primary);
		this.toolTip.container.appendChild(this.toolTip.labels.secondary);
		this.toolTip.container.appendChild(this.toolTip.values.secondary);

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

		if (this.options.vAxes.secondary.showOnPrimary) {

			const min = Math.min(this.data.min.primary, this.data.min.secondary);
			const max = Math.max(this.data.max.primary, this.data.max.secondary);

			this.primaryVAxis.update(min, max);
			this.secondaryVAxis.update(min, max);

		} else {

			this.primaryVAxis.update(this.data.min.primary, this.data.max.primary);
			this.secondaryVAxis.update(this.data.min.secondary, this.data.max.secondary);

		}

		/**
		 * Updates data points to match the current data set.
		 */
		this._refactorDataPoints();

		/**
		 * width and height for the chart area that holds the columns
		 */
		const chartAreaWidth = this.chartContainer.offsetWidth - this.primaryVAxis.calculatedWidth - this.secondaryVAxis.calculatedWidth;
		const chartAreaHeight = this.chart.area.offsetHeight;

		/**
		 * Get width of the series items
		 */
		const seriesItemWidth = chartAreaWidth / this.data.series.length;

		/**
		 * Calculate column and column gap width
		 */
		const columnWidth = seriesItemWidth * (this.options.columns.width / 100);
		const gapWidth = seriesItemWidth - columnWidth;

		/**
		 * Get height from bottom of the chart area where the 0 line is
		 */
		const spaceBelowZero = [
			this.primaryVAxis.scale.min >= 0 ? 0 : chartAreaHeight * Math.abs(this.primaryVAxis.scale.min / (this.primaryVAxis.scale.max - this.primaryVAxis.scale.min)),
			this.secondaryVAxis.scale.min >= 0 ? 0 : chartAreaHeight * Math.abs(this.secondaryVAxis.scale.min / (this.secondaryVAxis.scale.max - this.secondaryVAxis.scale.min))
		];

		/**
		 * Calculate pixel space above and below zero line
		 */
		const spaceAboveZero = [
			chartAreaHeight - spaceBelowZero[0],
			chartAreaHeight - spaceBelowZero[1]
		];

		for (const point of Object.values(this.dataPoints)) {

			point.setColumnHeight(spaceAboveZero[0], spaceBelowZero[0], this.primaryVAxis.scale.max, this.primaryVAxis.scale.min);
			point._positionColumn(spaceBelowZero[0], (seriesItemWidth * point.index) + (gapWidth / 2), columnWidth);
			point._positionColumnLabel(seriesItemWidth, spaceBelowZero[0], spaceAboveZero[0], spaceBelowZero[0], this.primaryVAxis.scale.max, this.primaryVAxis.scale.min)

			point._positionAxisLabel(seriesItemWidth);

			point._positionDot(spaceAboveZero[1], spaceBelowZero[1], this.secondaryVAxis.scale.max, this.secondaryVAxis.scale.min, (seriesItemWidth * point.index) + (seriesItemWidth / 2));

		}

		this.line.update(Object.values(this.dataPoints).map((a) => a.dot));

		this._colorize();
		this._showHideElements(seriesItemWidth);

	}

	/**
	 * Applies coloring to the chart
	 * @private
	 */
	_colorize() {

		/**
		 * Core chart components
		 */
		this.chartContainer.style.backgroundColor = this._resolveColor(this.options.chart.color);
		if (this.chart.title) this.chart.title.style.color = this._getContrastColor(this.options.chart.color);

		/**
		 * Tool tip
		 */
		this.toolTip.container.style.backgroundColor = this._getContrastColor(this.options.chart.color);
		this.toolTip.title.style.color = this._resolveColor(this.options.chart.color);

		this.toolTip.values.primary.style.color = this._resolveColor(this.options.chart.color);
		this.toolTip.values.secondary.style.color = this._resolveColor(this.options.chart.color);

		this.toolTip.labels.primary.style.color = this._resolveColor(this.options.chart.color);
		this.toolTip.labels.secondary.style.color = this._resolveColor(this.options.chart.color);

		/**
		 * Columns and column labels
		 */
		for (const dataPoint of Object.values(this.dataPoints)) {

			/**
			 * Color in the axis label as a contrast to the background color
			 */
			dataPoint.axisLabel.style.color = this._getContrastColor(this.options.chart.color);

			/**
			 * Color in the columns
			 */
			if (this.options.columns.color === 'multi') {

				dataPoint.columnColor = this._getColorByMode('multi', dataPoint.index);

			} else if (this.options.columns.color === 'redGreen') {

				dataPoint.columnColor = this._getColorByMode('redGreen', dataPoint.primaryValue);

			} else {

				dataPoint.columnColor = this._getColorByMode('match', this.options.columns.color);

			}

			/**
			 * Color in the dots
			 */
			dataPoint.dot.style.fill = this._getContrastColor(this.options.chart.color);

			/**
			 * Regardless of settings, if the final position of the column
			 * label was inside the column. The color must be contrast
			 */
			if (dataPoint.columnLabelProperties.actualPosition === 'inside') {

				dataPoint.columnLabel.style.color = this._getContrastColor(dataPoint.columnProperties.color);

			} else {

				/**
				 * Color in the columns labels based on an outside position
				 */
				if (this.options.columns.labels.color === 'match') {

					dataPoint.columnLabel.style.color = this._getColorByMode('match', dataPoint.columnProperties.color);

				} else if (this.options.columns.labels.color === 'auto') {

					dataPoint.columnLabel.style.color = this._getContrastColor(this.options.chart.color);

				} else {

					dataPoint.columnLabel.style.color = this._resolveColor(this.options.columns.labels.color);

				}

			}

		}

		this.primaryVAxis.colorize(this._getContrastColor(this.options.chart.color));
		this.secondaryVAxis.colorize(this._getContrastColor(this.options.chart.color));

		this.line.line?.setAttribute('stroke', this._getContrastColor(this.options.chart.color));

	}

	/**
	 * @private
	 */
	_refactorDataPoints() {

		/**
		 * Update the DataPoints with new data, DataPoints will be created where they don't yet exist
		 */
		for (let i = 0; i < this.data.series.length; i++) {

			if (this.dataPoints[i]) {

				/**
				 * Update existing DataPoint at this index with new data
				 */
				this.dataPoints[i].index = i;
				this.dataPoints[i].primaryValue = this.data.series[i][1];
				this.dataPoints[i].secondaryValue = this.data.series[i][2];
				this.dataPoints[i].name = this.data.series[i][0];

				this.dataPoints[i].columnOptions = this.options.columns;
				this.dataPoints[i].lineOptions = this.options.line;

			} else {

				/**
				 * Create new DataPoint
				 */
				this.dataPoints[i] = new DataPoint(i, [this.data.series[i][1], this.data.series[i][2]], this.data.series[i][0], this.options);

				this.dataPoints[i].column.onmouseover = () => this._showToolTip(this.dataPoints[i]);
				this.dataPoints[i].dot.onmouseover = () => this._showToolTip(this.dataPoints[i]);
				this.dataPoints[i].column.onmouseout = () => this._hideToolTip();
				this.dataPoints[i].dot.onmouseout = () => this._hideToolTip();

				/**
				 * Add onclick if set on creation
				 */
				if (this.options.columns.onClick !== null) {
					this.dataPoints[i].column.onclick = () => this.options.columns.onClick(this.dataPoints[i]);
				}

			}

		}

		/**
		 * Remove any DataPoints that are beyond the current data set length.
		 * This will happen when a new data set is loaded that is smaller than the old data set
		 */
		for (let i = Object.values(this.dataPoints).length + 1; i >= this.data.series.length; i--) {

			if (!this.dataPoints[i]) continue;

			this.dataPoints[i]._destroy();
			this.dataPoints[i] = null;

			delete this.dataPoints[i];

		}

		for (const point of Object.values(this.dataPoints)) {

			/**
			 * Append elements to DOM
			 */
			this.chart.columnArea.appendChild(point.column);
			this.chart.pointArea.appendChild(point.dot);
			this.hAxis.area.appendChild(point.axisLabel);
			this.chart.labelArea.appendChild(point.columnLabel);

			/**
			 * Apply formatting to column label
			 */
			point.columnLabel.textContent = this.formatLabel(point.primaryValue, this.options.vAxes.primary.format, this.options.vAxes.primary.formatOption);

		}

	}

	_showHideElements(width) {

		this.primaryVAxis.showHide();
		this.secondaryVAxis.showHide();

		for (const point of Object.values(this.dataPoints)) {

			/**
			 * Check to see if the width of the label is larger than the column width
			 * when the actual position of the label is inside. When it is, set the
			 * display of the label to be none.
			 */
			point.columnLabel.style.width = 'auto';

			const columnWidth = width * (this.options.columns.width / 100);

			if (point.columnLabelProperties.actualPosition === 'inside' && point.columnLabel.offsetWidth > columnWidth) {

				point.columnLabel.style.opacity = '0';

				continue;

			}

			/**
			 * Past this point indicates the width of the label is smaller than the column or
			 * the actual position is outside where it can be checked against the series width.
			 * Note: Series width is columns width + gaps.
			 */

			/**
			 * Check to see if label can physically fit in the space required
			 * Set opacity to 0 where it can not
			 */
			if (point.columnLabel.offsetWidth > width) {

				point.columnLabel.style.opacity = '0';

			} else {

				if (this.options.columns.labels.position === 'none') {

					point.columnLabel.style.opacity = '0';

				} else {

					point.columnLabel.style.width = `${width}px`;
					point.columnLabel.style.opacity = '1';

				}

			}

		}

	}

	_getDataMinMax() {

		this.data.max = {
			primary: Math.max(...this.data.series.map((e) => e[1])),
			secondary: Math.max(...this.data.series.map((e) => e[2]))
		};
		this.data.min = {
			primary: Math.min(...this.data.series.map((e) => e[1])),
			secondary: Math.min(...this.data.series.map((e) => e[2]))
		};

	}

	/**
	 * Shows tool tip for selected point
	 * @param {DataPoint} point
	 * @private
	 */
	_showToolTip(point) {

		this.toolTip.title.textContent = point.name;

		this.toolTip.values.primary.textContent = this.formatLabel(point.realValues.primary, this.options.vAxes.primary.format, this.options.vAxes.primary.formatOption);
		this.toolTip.labels.primary.textContent = this.options.vAxes.primary.name;
		this.toolTip.values.secondary.textContent = this.formatLabel(point.realValues.secondary, this.options.vAxes.secondary.format, this.options.vAxes.secondary.formatOption);
		this.toolTip.labels.secondary.textContent = this.options.vAxes.secondary.name;

		const chartWidth = this.chart.area.offsetWidth;

		const columnLeft = parseFloat(point.column.style.left.replace('px', ''));
		const columnWidth = point.column.offsetWidth;
		const columnHeight = point.column.offsetHeight;

		const tipHeight = this.toolTip.container.offsetHeight;
		const tipWidth = this.toolTip.container.offsetWidth;

		const alignments = [false, true, false];

		if (columnLeft - 8 > tipWidth) alignments[0] = true;
		if (chartWidth - columnLeft - columnWidth - 8 > tipWidth) alignments[2] = true;

		this.toolTip.container.style.opacity = '1';

		/**
		 * If the column is on the left side of screen, see if the tool tip will fit on the left of the column first
		 * Otherwise check to see if it will fit on the right.
		 * If the preferred side can not fit, use the other.
		 * If neither fits, it will default to center over the columns.
		 */
		if (alignments[0] && columnLeft - 8 > tipWidth) {

			this.toolTip.container.style.left = `${columnLeft - tipWidth - 8}px`;

		} else if (alignments[2]) {

			this.toolTip.container.style.left = `${columnLeft + columnWidth + 8}px`;

		} else {

			this.toolTip.container.style.left = `${columnLeft + (columnWidth / 2) - (tipWidth / 2)}px`;
			this.toolTip.container.style.opacity = '0.8';

		}

		for (const point of Object.values(this.dataPoints)) {

			point.column.style.opacity = '0.3';
			point.dot.style.opacity = '0.3';

		}

		this.chart.labelArea.style.opacity = '0.3';
		this.line.line.style.opacity = '0.3';

		point.column.style.opacity = '1';
		point.dot.style.opacity = '1';

		const columnBottom = parseFloat(point.column.style.bottom.replace('px', ''));

		if (point.primaryValue < 0) {

			this.toolTip.container.style.bottom = `${Math.max(0, columnBottom)}px`;

		} else {

			this.toolTip.container.style.bottom = `${Math.max(0, columnBottom + columnHeight - tipHeight)}px`;

		}


	}

	_hideToolTip() {

		this.toolTip.container.style.opacity = '0';

		for (const point of Object.values(this.dataPoints)) {

			point.column.style.opacity = '1';
			point.dot.style.opacity = '1';

		}

		this.chart.labelArea.style.opacity = '1';
		this.line.line.style.opacity = '1';

	}

	update(data) {

		this.data.series = data.slice(0, 20);

		this._draw();

	}

	/**
	 * @description Sets a new title in the chart. Creates the title element if not already present.
	 * @param {string} value
	 */
	set title(value) {

		/**
		 * Create the title element if it doesn't yet exist
		 */
		if (this.chart.title == null) {

			this.chart.title = document.createElement('h1');
			this.chart.title.className = 'cragTitleText';
			this.chart.titleArea.appendChild(this.chart.title);

		}

		/**
		 * Set the text content with the new title
		 */
		this.chart.title.textContent = value;

		/**
		 * Only call redraw when the new or old title text was null
		 * This prevents triggering redraw on each keystroke
		 */
		if (value === '' ^ this.options.chart.title === null) {

			this._draw();

		}

		/**
		 * Set new value to null where new title is blank
		 */
		this.options.chart.title = value === '' ? null : value;

	}
	get title() {

		return this.chart.title?.textContent ?? '';

	}

	set columnsRounded(value) {

		this.options.columns.rounded = this.validateOption(value, 'boolean', this.options.columns.rounded);

		this._draw();

	}

	set columnsInset(value) {

		this.options.columns.inset = this.validateOption(value, 'boolean', this.options.columns.inset);

		this._draw();

	}

	set columnsStriped(value) {

		this.options.columns.striped = this.validateOption(value, 'boolean', this.options.columns.striped);

		this._draw();

	}

	set columnsAnimated(value) {

		this.options.columns.animated = this.validateOption(value, 'boolean', this.options.columns.animated);

		this._draw();

	}

	set columnWidth(value) {

		this.options.columns.width = this.validateOption(value, 'number', this.options.columns.width);

		this._draw();

	}

	/**
	 * Sets new label colors with either a mode or a color value.
	 * @param {CragCore.pallet} color
	 */
	set labelColor(color) {

		if (this._isValidColor(color)) {

			this.options.columns.labels.color = color;

		} else {

			this.options.columns.labels.color = 'auto';

		}

		this._colorize();

	}

	/**
	 * @description Applies a new color or color mode to the columns.
	 * @param {string} color
	 */
	set columnColor(color) {

		if (this._isValidColor(color)) this.options.columns.color = color;

		this._colorize();

	}

	/**
	 * Sets new label positions from one fo the possible.
	 * @param {('inside'|'outside'|'none')} position
	 */
	set labelPosition(position) {

		if (['inside', 'outside', 'none'].indexOf(position) >= 0) {

			this.options.columns.labels.position = position;

			this._draw();

		}

	}

	/**
	 * @description Applies a new background color to the chart.
	 * @param {string} color
	 */
	set chartColor(color) {

		if (this._isValidColor(color)) this.options.chart.color = color;

		this._colorize();

	}

}