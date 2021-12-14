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
 * @property {string} [format] Formatting type, must be one of the valid options.
 * @property {string} [formatOption] Additional parameters for the label formatting, see docs for more info.
 * @property {string|number} [min] Sets the minimum value for the vAxis, when omitted, this will be calculated automatically.
 */
/**
 * @typedef optionsColumn Column Options.
 * @property {number} [width] Percentage width of the column relative to the space available. Example, 100 will be a full width bar.
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
 * @typedef options
 * @property {optionsChart} [chart]
 * @property {optionsVAxis} [vAxis]
 * @property {optionsColumn} [columns]
 */

class DataPoint {

	index = 0;
	realValue = 0;
	realName = null;

	/** @type {HTMLDivElement} */
	column = null;

	/** @type {HTMLSpanElement} */
	columnLabel = null;

	/** @type {HTMLSpanElement} */
	axisLabel = null;

	/**
	 * @type {optionsColumn}
	 */
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

	constructor (index, value, name, chartOptions) {

		this.index = index;
		this.realValue = value;
		this.realName = name;

		this.options = chartOptions.columns;

		this._createColumn();
		this._createColumnLabel();
		this._createAxisLabel();

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

		if (this.value < 0) {

			/**
			 * Calculate outside position for label as a negative
			 */
			let position = zeroLine - (negativeSpace / min * this.value) - this.columnLabel.offsetHeight;

			this.columnLabelProperties.actualPosition = 'outside'

			/**
			 * If label won't fit in the area or the label options are set to inside
			 * add back on the height of the label to put it back within the column
			 */
			if (position - this.columnLabel.offsetHeight < 0 || this.options.labels.position === 'inside') {

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
			let position = zeroLine + (positiveSpace / max * this.value);
			this.columnLabelProperties.actualPosition = 'outside'

			/**
			 * If label won't fit in the area or the label options are set to inside
			 * remove the height of the label to put it back within the column
			 */
			if (this.columnProperties.height + this.columnLabel.offsetHeight > positiveSpace || this.options.labels.position === 'inside') {

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
		if (this.value >= 0) {

			/**
			 * Adding 2px to cover the height of the zero line on the vAxis
			 */
			this.column.style.bottom = `${bottom + 2}px`;

		}

		this.column.style.left = `${left}px`;
		this.column.style.width = `${width}px`;

	}

	setColumnHeight(positiveSpace, negativeSpace, max, min) {

		if (this.value < 0) {

			/**
			 * Round number down to compensate for slight gaps above the negative columns
			 */
			this.columnProperties.height = Math.floor(negativeSpace / min * this.value);

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
			this.columnProperties.height = positiveSpace / max * this.value - 2;
			this.column.style.transform = 'scaleY(1)';

		}

		this.column.style.height = `${this.columnProperties.height}px`;

	}

	_setColumnStyle() {

		this.column.classList.toggle('cragColumnRound', this.options.rounded);
		this.column.classList.toggle('cragColumnInset', this.options.inset);
		this.column.classList.toggle('cragColumnStriped', this.options.striped);
		this.column.classList.toggle('cragColumnStripedAnimate', this.options.animated);

	}

	_destroy() {

		this.column.style.left = `calc(100% + ${parseInt(this.column.style.width.replace('px', '')) * this.index}px)`;

		this.axisLabel.style.opacity = '0';
		this.axisLabel.style.left = '100%';

		this.columnLabel.style.opacity = '0';
		this.columnLabel.style.left = '100%';

		setTimeout(() => {

			this.column.remove();
			this.axisLabel.remove();

			if (this.columnLabel != null) this.columnLabel.remove();
			
		}, 1000);

	}

	/**
	 * @param {number} value
	 */
	 set value(value) {

		this.realValue = value;

		if (this.columnLabel !== null) this.columnLabel.textContent = value.toString();

	}

	get value() {
		return this.realValue;
	}
	
	/**
	 * @param {string|null} value
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

		this.options = value;

		this._setColumnStyle();

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

	/**
	 * @type {optionsVAxis}
	 */
	axisProperties = {
		format: 'number',
		majorLines: true,
		minorLines: true,
	}

	constructor(value, step, ofSteps, options) {

		this.realValue = value;
		this.step = step;
		this.ofSteps = ofSteps;

		this.axisProperties = options;

		this._createLines();
		this._createLabel();

	}

	_createLines() {

		this.majorLine = document.createElement('div');

		this.majorLine.className = 'cragAxisLineMajor';
		this.majorLine.style.bottom = '100%';
		this.majorLine.style.right = '0px';

		this.minorLine = document.createElement('div');

		this.minorLine.className = 'cragAxisLineMinor';
		this.minorLine.style.bottom = '100%';

	}

	_createLabel() {

		this.label = document.createElement('span');

		this.label.className = 'cragVAxisLabel';
		this.label.style.bottom = '100%';

	}

	positionMajor(space) {

		this.majorLine.style.bottom = `${space / this.ofSteps * this.step}px`;

	}

	positionMinor(space) {

		if (this.step === this.ofSteps) {

			this.minorLine.style.opacity = '0';

		} else {

			this.minorLine.style.opacity = '';

		}

		this.minorLine.style.bottom = `${(space / this.ofSteps * this.step) + (space / this.ofSteps / 2)}px`;

	}

	positionLabel(space, hAxisOffset) {

		this.label.style.bottom = `${space / this.ofSteps * this.step + hAxisOffset - (this.label.offsetHeight / 2)}px`;

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

class CragColumn extends CragCore {

	/**
	 * @param {array} data
	 * @param {options} options
	 */
	constructor (data, options = undefined) {
		super();

		this.dataPoints = {};
		this.vAxisLines = {};

		this.data = {
			series: data,
			max: 0,
			min: 0
		};

		/**
		 * @type options
		 */
		this.options = {
			chart: {
				title: null,
				color: 'white'
			},
			vAxis: {
				name: 'Series',
				majorLines: true,
				minorLines: true,
				format: 'number',
				formatOption: 'GBP',
				min: 'auto'
			},
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
			}
		}

		this.parent = null;
		this.chartContainer = null;

		this.chart = {
			area: null,
			gridArea: null,
			labelArea: null,
			columnArea: null,
			titleArea: null,
			title: null,
			elements: {}
		}

		this.vAxis = {
			area: null,
			elements: {},
			baseValue: null,
			baseLine: null,
			max: 0,
			min: 0,
			calculatedWidth: 0,
		}

		this.hAxis = {
			area: null,
			elements: {}
		}

		this.toolTip = {
			container: null,
			title: null,
			label: null,
			value: null
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
		 * Chart Options
		 */
		this.options.chart.title = this.validateOption(options?.chart?.title, 'string', this.options.chart.title);
		if (this._isValidColor(options?.chart?.color)) this.options.chart.color = options.chart.color;

		/**
		 * vAxis options
		 */
		this.options.vAxis.name = this.validateOption(options?.vAxis?.name, 'string', this.options.vAxis.name);
		this.options.vAxis.majorLines = this.validateOption(options?.vAxis?.majorLines, 'boolean', this.options.vAxis.majorLines);
		this.options.vAxis.minorLines = this.validateOption(options?.vAxis?.minorLines, 'boolean', this.options.vAxis.minorLines);
		this.options.vAxis.format = this.validateOption(options?.vAxis?.format, this.labelFormats, this.options.vAxis.format);

		if (options?.vAxis?.min === 'auto' || !isNaN(options?.vAxis?.min)) this.options.vAxis.min = options.vAxis.min;

	}

	create(e) {

		if (e === undefined) return;

		this.parent = document.getElementById(e);

		this.chartContainer = document.createElement('div');
		this.vAxis.area = document.createElement('div');
		this.hAxis.area = document.createElement('div');
		this.chart.titleArea = document.createElement('div');
		this.chart.area = document.createElement('div');
		this.chart.gridArea = document.createElement('div');
		this.chart.columnArea = document.createElement('div');
		this.chart.labelArea = document.createElement('div');
		this.toolTip.container = document.createElement('div');
		this.toolTip.title = document.createElement('h6');
		this.toolTip.value = document.createElement('h6');
		this.toolTip.label = document.createElement('h6');

		if (this.options.chart.title != null) {

			this.chart.title = document.createElement('h1');
			this.chart.title.className = 'cragTitleText';
			this.chart.title.textContent = this.options.chart.title;
			this.chart.titleArea.appendChild(this.chart.title);
			this.chart.title.style.color = this._getContrastColor(this.options.chart.color);

		}

		this.chartContainer.className = 'cragColumnChartContainer';
		this.vAxis.area.className = 'cragColumnVAxis';
		this.hAxis.area.className = 'cragColumnHAxis';
		this.chart.titleArea.className = 'cragColumnTitle';
		this.chart.area.className = 'cragColumnChartArea';

		this.chart.gridArea.className = 'cragChartSubArea';
		this.chart.labelArea.className = 'cragChartSubArea';
		this.chart.columnArea.className = 'cragChartSubArea';

		this.toolTip.container.className = 'cragToolTip';
		this.toolTip.title.className = 'cragToolTipTitle';
		this.toolTip.value.className = 'cragToolTipValue';
		this.toolTip.label.className = 'cragToolTipLabel';

		this.toolTip.label.textContent = this.options.vAxis.label;

		this.chart.gridArea.style.pointerEvents = 'none';
		this.chart.gridArea.style.overflow = 'visible';
		this.chart.labelArea.style.pointerEvents = 'none';

		this.parent.appendChild(this.chartContainer);
		this.chartContainer.appendChild(this.vAxis.area);
		this.chartContainer.appendChild(this.chart.titleArea);
		this.chartContainer.appendChild(this.hAxis.area);
		this.chartContainer.appendChild(this.chart.area);
		this.chart.area.appendChild(this.chart.gridArea);
		this.chart.area.appendChild(this.chart.columnArea);
		this.chart.area.appendChild(this.chart.labelArea);
		this.chart.area.appendChild(this.toolTip.container);
		this.toolTip.container.appendChild(this.toolTip.title);
		this.toolTip.container.appendChild(this.toolTip.label);
		this.toolTip.container.appendChild(this.toolTip.value);

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
		 * Updates vAxis to match the current data set.
		 */
		this._refactorVAxisLines();

		/**
		 * Updates data points to match the current data set.
		 */
		this._refactorDataPoints();

		/**
		 * width and height for the chart area that holds the columns
		 */
		const chartAreaWidth = this.chartContainer.offsetWidth - this.vAxis.calculatedWidth;
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
		const zeroLine = this.vAxis.min >= 0 ? 0 : chartAreaHeight * Math.abs(this.vAxis.min / (this.vAxis.max - this.vAxis.min));

		/**
		 * Calculate pixel space above and below zero line
		 */
		const spaceAboveZero = chartAreaHeight - zeroLine;
		const spaceBelowZero = zeroLine;

		for (const point of Object.values(this.dataPoints)) {

			point.setColumnHeight(spaceAboveZero, spaceBelowZero, this.vAxis.max, this.vAxis.min);
			point._positionColumn(zeroLine, (seriesItemWidth * point.index) + (gapWidth / 2), columnWidth);
			point._positionColumnLabel(seriesItemWidth, zeroLine, spaceAboveZero, spaceBelowZero, this.vAxis.max, this.vAxis.min)

			point._positionAxisLabel(seriesItemWidth);

		}

		for (const line of Object.values(this.vAxisLines)) {

			line.positionMajor(chartAreaHeight);
			line.positionMinor(chartAreaHeight);
			line.positionLabel(chartAreaHeight, this.hAxis.area.offsetHeight);

		}

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
		this.toolTip.value.style.color = this._resolveColor(this.options.chart.color);
		this.toolTip.label.style.color = this._resolveColor(this.options.chart.color);

		/**
		 * Columns and column labels
		 */
		for (const point of Object.values(this.dataPoints)) {

			/**
			 * Color in the axis label as a contrast to the background color
			 */
			point.axisLabel.style.color = this._getContrastColor(this.options.chart.color);

			/**
			 * Color in the columns
			 */
			if (this.options.columns.color === 'multi') {

				point.columnColor = this._getColorByMode('multi', point.index);

			} else if (this.options.columns.color === 'redGreen') {

				point.columnColor = this._getColorByMode('redGreen', point.value);
				
			} else {

				point.columnColor = this._getColorByMode('match', this.options.columns.color);

			}

			/**
			 * Regardless of settings, if the final position of the column
			 * label was inside the column. The color must be contrast
			 */
			if (point.columnLabelProperties.actualPosition === 'inside') {

				point.columnLabel.style.color = this._getContrastColor(point.columnProperties.color);

			} else {

				/**
				 * Color in the columns labels based on an outside position
				 */
				if (this.options.columns.labels.color === 'match') {

					point.columnLabel.style.color = this._getColorByMode('match', point.columnProperties.color);

				} else if (this.options.columns.labels.color === 'auto') {

					point.columnLabel.style.color = this._getContrastColor(this.options.chart.color);

				} else {

					point.columnLabel.style.color = this._resolveColor(this.options.columns.labels.color);

				}

			}

		}

		/**
		 * vAxis Elements
		 */
		for (const line of Object.values(this.vAxisLines)) {

			line.majorLine.style.backgroundColor = this._getContrastColor(this.options.chart.color);
			line.minorLine.style.backgroundColor = this._getContrastColor(this.options.chart.color);

			line.label.style.color = this._getContrastColor(this.options.chart.color);

			if (line.isZeroPoint) {

				line.majorLine.style.opacity = '0.9';
				line.majorLine.style.height = '2px';

			} else {

				line.majorLine.style.opacity = '';
				line.majorLine.style.height = '1px';

			}

		}

	}

	_showHideElements(width) {

	
		/**
		 * vAxis Elements
		 */
		for (const line of Object.values(this.vAxisLines)) {

			line.majorLine.style.display = this.options.vAxis.majorLines ? '' : 'none';
			line.minorLine.style.display = this.options.vAxis.minorLines ? '' : 'none';

		}

		for (const point of Object.values(this.dataPoints)) {

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

					point.columnLabel.style.opacity = '1';

				}

			}

		}

	}

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
				this.dataPoints[i].value = this.data.series[i][1];
				this.dataPoints[i].name = this.data.series[i][0];

				this.dataPoints[i].columnOptions = this.options.columns;

			} else {

				/**
				 * Create new DataPoint
				 */
				this.dataPoints[i] = new DataPoint(i, this.data.series[i][1], this.data.series[i][0], this.options);

				this.dataPoints[i].column.onmouseover = () => this._showToolTip(this.dataPoints[i]);
				this.dataPoints[i].column.onmouseout = () => this._hideToolTip();

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
			this.hAxis.area.appendChild(point.axisLabel);
			this.chart.labelArea.appendChild(point.columnLabel);

			/**
			 * Apply formatting to column label
			 */
			point.columnLabel.textContent = this.formatLabel(point.value, this.options.vAxis.format, this.options.vAxis.formatOption);

		}

	}

	_refactorVAxisLines() {

		this._getDataMinMax();

		const min = this.options.vAxis.min === 'auto' ? this.data.min : this.options.vAxis.min;
		const scale = this._calculateAxisScale(min);

		/**
		 * Set the vAxis min and max based on the calculated scale
		 */
		this.vAxis.min = scale.min;
		this.vAxis.max = scale.max;

		for (let i = 0; i <= scale.steps; i++) {

			if (this.vAxisLines[i]) {

				this.vAxisLines[i].value = scale.min + (i * scale.maj);
				this.vAxisLines[i].step = i;
				this.vAxisLines[i].ofSteps = scale.steps;
				this.vAxisLines[i].max = scale.max;

				this.vAxisLines[i].axisProperties = this.options.vAxis;

			} else {

				this.vAxisLines[i] = new VAxisLine(scale.min + (i * scale.maj), i, scale.steps, scale.max, this.options.vAxis);

			}

			/**
			 * Determine which of the lines is the zero point.
			 * Zero point is either the bottom line or the middle line where the
			 * scale goes from negative to positive
			 */
			this.vAxisLines[i].isZeroPoint = (i === 0 && scale.min >= 0) || (i > 0 && this.vAxisLines[i].realValue === 0);

		}

		/**
		 * Remove any VAxisLines that are beyond the current scale length.
		 * This will happen when a new data set is loaded that has a different scale
		 */
		for (let i = Object.values(this.vAxisLines).length + 1; i > scale.steps; i--) {

			if (!this.vAxisLines[i]) continue;

			this.vAxisLines[i]._destroy();
			this.vAxisLines[i] = null;

			delete this.vAxisLines[i];

		}

		/**
		 * Reset the calculated width of the vAxis ready for new labels
		 */
		let vAxisCalculatedWidth = 0;

		for (const line of Object.values(this.vAxisLines)) {

			/**
			 * Append elements to DOM
			 */
			this.chart.gridArea.appendChild(line.majorLine);
			this.chart.gridArea.appendChild(line.minorLine);

			this.vAxis.area.appendChild(line.label);

			line.labelText = this.formatLabel(line.value, this.options.vAxis.format, this.options.vAxis.formatOption);

			if (line.label.offsetWidth > vAxisCalculatedWidth) vAxisCalculatedWidth = line.label.offsetWidth;
			
		}

		/**
		 * Set the new vAxis are width
		 */
		this.vAxis.area.style.width = `${vAxisCalculatedWidth}px`;

		this.vAxis.calculatedWidth = vAxisCalculatedWidth;

	}

	/**
	 * Sets the min and max of the vAxis based on the min and max value in the data set
	 * @param min The minimum value for the vAxis
	 * @return {{min: number, max: number, maj: number, steps: number}}
	 * @private
	 */
	_calculateAxisScale(min) {

		if (this.options.vAxis.format === 'time') {

			/**
			 * Time scales will be rounded based on the largest value in the data set
			 * The scales are seconds, minutes, hours then days
			 */

			let timeRounding;

			if (this.data.max < 60) {
				timeRounding = 60
			} else if (this.data.max < 3600) {
				timeRounding = 3600;
			} else if (this.data.max < 43200) {
				timeRounding = 43200;
			} else {
				timeRounding = 86400;
			}

			return calculateScale(min, this.data.max, timeRounding);

		} else {

			return calculateScale(min, this.data.max, 10);

		}


	}

	/**
	 * Shows tool tip for selected point
	 * @param {DataPoint} point
	 * @private
	 */
	_showToolTip(point) {

		this.toolTip.title.textContent = point.name;
		this.toolTip.label.textContent = this.options.vAxis.name;
		this.toolTip.value.textContent = this.formatLabel(point.value, this.options.vAxis.format, this.options.vAxis.formatOption);

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
		 * If neither fits, it will default to center over the bar.
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

		}

		this.chart.labelArea.style.opacity = '0.3';
		point.column.style.opacity = '1';

		const columnBottom = parseFloat(point.column.style.bottom.replace('px', ''));

		if (point.value < 0) {

			this.toolTip.container.style.bottom = `${Math.max(0, columnBottom)}px`;

		} else {

			this.toolTip.container.style.bottom = `${Math.max(0, columnBottom + columnHeight - tipHeight)}px`;

		}


	}

	_hideToolTip() {

		this.toolTip.container.style.opacity = '0';

		for (const point of Object.values(this.dataPoints)) {

			point.column.style.opacity = '1';

		}

		this.chart.labelArea.style.opacity = '1';

	}

	_getDataMinMax() {

		this.data.max = 0;

		for (let i = 0; i < this.data.series.length; i++) {
			if (this.data.series[i][1] > this.data.max) {
				this.data.max = this.data.series[i][1];
			}
		}

		this.data.min = this.data.max;

		for (let i = 0; i < this.data.series.length; i++) {
			if (this.data.series[i][1] < this.data.min) {
				this.data.min = this.data.series[i][1];
			}
		}

	}

	/**
	 * @description Applies a new data set to the chart. Must be full data set.
	 * @param {any} data
	 */
	set newData(data) {

		if (data.length > 20) {
			data = val.slice(0, 20);
		}

		this.data.series = data;

		this._draw();

	}

	/**
	 * @description Sets a new title in the chart. Creates the title element if not already present.
	 * @param {string} value
	 */
	set title(value) {

		if (this.chart.title == null) {

			this.chart.title = document.createElement('h1');
			this.chart.title.className = 'cragTitleText';
			this.chart.titleArea.appendChild(this.chart.title);

		}
		
		this.options.chart.title = value;

		this.chart.title.textContent = this.options.chart.title;

		this._draw();

	}
	get title() {

		return this.chart.title?.textContent ?? '';

	}

	/**
	 * @description Applies a new background color to the chart.
	 * @param {string} color
	 */
	set chartColor(color) {

		if (this._isValidColor(color)) this.options.chart.color = color;

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
	 * Sets new label colors with either a mode or a color value.
	 * @param {('multi'|'match'|'redGreen')|string} color
	 */
	set labelColor(color) {

		if (this._isValidColor(color)) {

			this.options.columns.labels.color = color;

		} else {

			this.options.columns.labels.color = 'auto';

		}

		this._colorize();

	}

	set majorLinesVisible(value) {

		this.options.vAxis.majorLines = this.validateOption(value, 'boolean', this.options.vAxis.majorLines);

		this._draw();

	}

	set minorLinesVisible(value) {

		this.options.vAxis.minorLines = this.validateOption(value, 'boolean', this.options.vAxis.minorLines);

		this._draw();

	}

	/**
	 * Sets new label colors with either a mode or a color value.
	 * @param {string} format
	 * @param {string|undefined} formatOption
	 */
	setAxisFormat(format, formatOption = undefined) {

		this.options.vAxis.format = this.validateOption(format, this.labelFormats, this.options.vAxis.format);
		this.options.vAxis.formatOption = formatOption ?? null;

		this._draw();

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
	
}