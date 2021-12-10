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

	columnLabelOption = {
		position: null,
		color: null
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

		this._createColumn(chartOptions);
		this._createColumnLabel(chartOptions);
		this._createAxisLabel(chartOptions);

	}

	_createColumn(chartOptions) {

		this.column = document.createElement('div');

		this.column.className = 'cragColumnBar';

		if (chartOptions.bar.rounded) this.column.classList.add('cragColumnBarRound');
		if (chartOptions.bar.inset) this.column.classList.add('cragColumnBarInset');
		if (chartOptions.bar.striped) this.column.classList.add('cragColumnBarStriped');
		if (chartOptions.bar.animated) this.column.classList.add('cragColumnBarStripedAnimate');

	}

	_createColumnLabel(chartOptions) {

		this.columnLabelOption = chartOptions.labels;

		this.columnLabel = document.createElement('span');
		this.columnLabel.className = 'cragColumnBarLabel';
		this.columnLabel.textContent = formatLabel(this.realValue, chartOptions.vAxis.format, 99999);

	}

	positionColumnLabel(width, zeroLine, positiveSpace, negativeSpace, max, min) {

		this.columnLabel.style.width = 'auto';

		/**
		 * Check to see if label can physically fit in the space required
		 * Set opacity to 0 where it can not
		 */
		if (this.columnLabel.offsetWidth > width) {

			this.columnLabel.style.opacity = '0';

		} else {

			this.columnLabel.style.opacity = '1';

		}

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
			if (position - this.columnLabel.offsetHeight < 0 || this.columnLabelOption.position === 'inside') {

				position += this.columnLabel.offsetHeight;
				this.columnLabelProperties.actualPosition = 'inside'

				/**
				 * One final check to make sure that the label is not bigger than the bar
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
			if (this.columnProperties.height + this.columnLabel.offsetHeight > positiveSpace || this.columnLabelOption.position === 'inside') {

				position -= this.columnLabel.offsetHeight;
				this.columnLabelProperties.actualPosition = 'inside'

				/**
				 * One final check to make sure that the label is not bigger than the bar
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

		this.axisLabel.className = 'cragColumnHAxisLabel';
		this.axisLabel.textContent = this.realName;

	}

	positionAxisLabel(width) {

		this.axisLabel.style.width = `${width}px`;
		this.axisLabel.style.left = `${width * this.index}px`;

	}

	positionColumn(bottom, left, width) {

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
			 * Round number down to compensate for slight gaps above the negative bars
			 */
			this.columnProperties.height = Math.floor(negativeSpace / min * this.value);

			/**
			 * When value is negative, the bottom is the height less the negative space
			 * This will put it just below the zero line. It is then inverted to compensate
			 * for rounded bars TODO: Invert rounding maybe?
			 */
			this.column.style.bottom = `${negativeSpace - this.columnProperties.height}px`;
			this.column.style.transform = 'scaleY(-1)';

		} else {

			/**
			 * Subtract 2 from the height on positive to compensate for the two added in
			 * bottom property. Also reset invert in case bar was previously inverted
			 */
			this.columnProperties.height = positiveSpace / max * this.value - 2;
			this.column.style.transform = 'scaleY(1)';

		}

		this.column.style.height = `${this.columnProperties.height}px`;

	}

	_destroy() {

		this.column.style.left = `calc(100% + ${parseInt(this.column.style.width.replace('px', '')) * this.index}px)`;

		this.axisLabel.style.opacity = '0';
		this.axisLabel.style.left = '100%';

		if (this.columnLabel != null) {

			this.columnLabel.style.opacity = '0';
			this.columnLabel.style.left = '100%';

		}

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
		if (this.columnLabel !== null) this.columnLabel.textContent = value;

	}
	get value () {
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

	set columnColor(color) {

		this.columnProperties.color	= color;
		this.column.style.backgroundColor = color;

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

		this.majorLine.className = 'cragColumnAxisLineMajor';
		this.majorLine.style.bottom = '100%';
		this.majorLine.style.right = '0px';

		this.minorLine = document.createElement('div');

		this.minorLine.className = 'cragColumnAxisLineMinor';
		this.minorLine.style.bottom = '100%';

	}

	_createLabel() {

		this.label = document.createElement('span');

		this.label.className = 'cragColumnVAxisLabel';
		this.label.style.bottom = '100%';
		this.label.textContent = this.realValue;

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

		this.label.textContent = value;

	}

}

class CragColumn {

	constructor (options) {

		this.dataPoints = {};
		this.vAxisLines = {};

		this.data = {
			series: options.data,
			max: 0,
			min: 0
		};

		this.options = {
			bar: {
				width: 90,
				color: 'multi',
				rounded: false,
				inset: false,
				striped: false,
				animated: false,
				onClick: null
			},
			vAxis: {
				label: 'Series',
				lines: true,
				format: 'number',
				min: 'auto'
			},
			labels: {
				position: 'none',
				color: 'auto'
			},
			chart: {
				title: null,
				color: 'white',
				minorLines: true
			}
		}

		this.parent = null;
		this.chartContainer = null;

		this.chart = {
			area: null,
			gridArea: null,
			labelArea: null,
			barArea: null,
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

		if (this.data.series.length > 20) {
			this.data.series = this.data.series.slice(0, 20);
		}

		if (options.bar !== undefined) {

			const option = options.bar;

			if (option.width !== undefined && option.width > 0 && option.width < 101) {
				this.options.bar.width = option.width;
			}
			if (option.color !== undefined && isValidColor(option.color)) {
				this.options.bar.color = option.color;
			}
			if (option.rounded !== undefined && typeof option.rounded === 'boolean') {
				this.options.bar.rounded = option.rounded;
			}
			if (option.inset !== undefined && typeof option.inset === 'boolean') {
				this.options.bar.inset = option.inset;
			}
			if (option.striped !== undefined && typeof option.striped === 'boolean') {
				this.options.bar.striped = option.striped;
			}
			if (option.animated !== undefined && typeof option.animated === 'boolean') {
				this.options.bar.animated = option.animated;
			}
			if (option.onClick !== undefined && typeof option.onClick === 'function') {
				this.options.bar.onClick = option.onClick;
			}

		}

		if (options.labels !== undefined) {

			if (options.labels.position !== undefined && ['inside', 'outside', 'none'].indexOf(options.labels.position) >= 0) {

				this.options.labels.position = options.labels.position;

			}

			if (options.labels.color !== undefined && pallet.hasOwnProperty(options.labels.color)) {

				this.options.labels.color = options.labels.color;

			}

		}

		if (options.chart !== undefined) {

			const option = options.chart;

			if (option.title !== undefined) {
				this.options.chart.title = option.title;
			}
			if (option.color !== undefined && isValidColor(option.color)) {
				this.options.chart.color = option.color;
			}
			if (option.minorLines !== undefined && typeof option.minorLines === 'boolean') {
				this.options.chart.minorLines = option.minorLines;
			}

		}

		if (options.vAxis !== undefined) {

			const option = options.vAxis;

			if (option.label !== undefined) {
				this.options.vAxis.label = option.label;
			}
			if (option.lines !== undefined && typeof option.lines === 'boolean') {
				this.options.vAxis.lines = option.lines;
			}
			if (option.format !== undefined && ['number', 'decimal', 'time'].indexOf(option.format) >= 0) {
				this.options.vAxis.format = option.format;
			}
			if (option.min !== undefined && (option.min === 'auto' || !isNaN(option.min))) {
				this.options.vAxis.min = option.min;
			}

		}

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
		this.chart.barArea = document.createElement('div');
		this.chart.labelArea = document.createElement('div');
		this.toolTip.container = document.createElement('div');
		this.toolTip.title = document.createElement('h6');
		this.toolTip.value = document.createElement('h6');
		this.toolTip.label = document.createElement('h6');

		if (this.options.chart.title != null) {

			this.chart.title = document.createElement('h1');
			this.chart.title.className = 'cragColumnTitleText';
			this.chart.title.textContent = this.options.chart.title;
			this.chart.titleArea.appendChild(this.chart.title);
			this.chart.title.style.color = getContrastColor(this.options.chart.color);

		}

		this.chartContainer.className = 'cragColumnChartContainer';
		this.vAxis.area.className = 'cragColumnVAxis';
		this.hAxis.area.className = 'cragColumnHAxis';
		this.chart.titleArea.className = 'cragColumnTitle';
		this.chart.area.className = 'cragColumnChartArea';
		this.chart.gridArea.className = 'cragColumnCharSubArea';
		this.chart.labelArea.className = 'cragColumnCharSubArea';
		this.chart.barArea.className = 'cragColumnCharSubArea';
		this.toolTip.container.className = 'cragColumnToolTip';
		this.toolTip.title.className = 'cragColumnToolTipTitle';
		this.toolTip.value.className = 'cragColumnToolTipValue';
		this.toolTip.label.className = 'cragColumnToolTipLabel';

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
		this.chart.area.appendChild(this.chart.barArea);
		this.chart.area.appendChild(this.chart.labelArea);
		this.chart.area.appendChild(this.toolTip.container);
		this.toolTip.container.appendChild(this.toolTip.title);
		this.toolTip.container.appendChild(this.toolTip.label);
		this.toolTip.container.appendChild(this.toolTip.value);

		setTimeout(this.draw.bind(this), 500);

		this.applyListeners();

		return this;

	}

	applyListeners() {

		const self = this;

		window.addEventListener('resize', () => self.draw());
	
	}

	draw() {

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
		const columnWidth = seriesItemWidth * (this.options.bar.width / 100);
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
			point.positionColumn(zeroLine, (seriesItemWidth * point.index) + (gapWidth / 2), columnWidth);
			point.positionAxisLabel(seriesItemWidth);
			point.positionColumnLabel(seriesItemWidth, zeroLine, spaceAboveZero, spaceBelowZero, this.vAxis.max, this.vAxis.min)

		}

		for (const line of Object.values(this.vAxisLines)) {

			line.positionMajor(chartAreaHeight);
			line.positionMinor(chartAreaHeight);
			line.positionLabel(chartAreaHeight, this.hAxis.area.offsetHeight);

		}

		this.colorize();

	}

	colorize() {

		/**
		 * Core chart components
		 */
		this.chartContainer.style.backgroundColor = resolveColor(this.options.chart.color);
		if (this.chart.title) this.chart.title.style.color = getContrastColor(this.options.chart.color);

		/**
		 * Tool tip
		 */
		this.toolTip.container.style.backgroundColor = getContrastColor(this.options.chart.color);
		this.toolTip.title.style.color = resolveColor(this.options.chart.color);
		this.toolTip.value.style.color = resolveColor(this.options.chart.color);
		this.toolTip.label.style.color = resolveColor(this.options.chart.color);

		/**
		 * Each of the data point objects
		 */
		for (const point of Object.values(this.dataPoints)) {

			/**
			 * Color in the axis label as a contrast to the background color
			 */
			point.axisLabel.style.color = getContrastColor(this.options.chart.color);

			if (this.options.bar.color === 'multi') {

				point.columnColor = pallet.key(point.index);

			} else if (this.options.bar.color === 'positiveNegative') {
			
				if (point.value < 0) {

					point.columnColor = pallet.red;

				} else {

					point.columnColor = pallet.green;

				}
				
			} else {

				point.columnColor = resolveColor(this.options.bar.color);

			}

			if (this.options.labels.position === 'none') {

				point.columnLabel.style.opacity = '0';
				continue;

			} else {

				point.columnLabel.style.opacity = '1';

			}

			/**
			 * Regardless of settings, if the final position of the column
			 * label was inside the column. The color must be contrast
			 */
			if (point.columnLabelProperties.actualPosition === 'inside') {

				point.columnLabel.style.color = getContrastColor(point.columnProperties.color);

			} else {

				/**
				 * Color in the bar labels based on an outside position
				 */
				if (this.options.labels.color === 'match') {

					point.columnLabel.style.color = point.columnProperties.color;

				} else if (this.options.labels.color === 'auto') {

					point.columnLabel.style.color = getContrastColor(this.options.chart.color);

				} else {

					point.columnLabel.style.color = this.options.labels.color;

				}

			}

		}

		for (const line of Object.values(this.vAxisLines)) {

			line.majorLine.style.backgroundColor = getContrastColor(this.options.chart.color);
			line.minorLine.style.backgroundColor = getContrastColor(this.options.chart.color);

			line.label.style.color = getContrastColor(this.options.chart.color);

			if (line.isZeroPoint) {

				line.majorLine.style.opacity = '1';
				line.majorLine.style.height = '2px';

			} else {

				line.majorLine.style.opacity = '';
				line.majorLine.style.height = '1px';

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

				this.dataPoints[i].columnLabelOption.position = this.options.labels.position;

			} else {

				/**
				 * Create new DataPoint
				 */
				this.dataPoints[i] = new DataPoint(i, this.data.series[i][1], this.data.series[i][0], this.options);

				this.dataPoints[i].column.onmouseover = () => this._showToolTip(this.dataPoints[i]);
				this.dataPoints[i].column.onmouseout = () => this._hideToolTip();
				this.dataPoints[i].column.onclick = () => this.options.bar.onClick(this.dataPoints[i]);

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
			if (point.columnLabel != null) this.chart.labelArea.appendChild(point.columnLabel);

			this.chart.barArea.appendChild(point.column);
			this.hAxis.area.appendChild(point.axisLabel);

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

			} else {

				this.vAxisLines[i] = new VAxisLine(scale.min + (i * scale.maj), i, scale.steps);

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

		this.toolTip.title.textContent = point.name; //this.data.series[index][0];
		this.toolTip.label.textContent = this.options.vAxis.label;
		this.toolTip.value.textContent = point.value; //this.dataPoints[index].value;

		const chartHeight = this.chart.area.offsetHeight;
		const chartWidth = this.chart.area.offsetWidth;

		const barLeft = parseFloat(point.column.style.left.replace('px', ''));
		const barWidth = point.column.offsetWidth;
		const barHeight = point.column.offsetHeight;

		const tipHeight = this.toolTip.container.offsetHeight;
		const tipWidth = this.toolTip.container.offsetWidth;

		let hAlignment = 0;
		let vAlignment = 0;

		if (chartWidth / 2 > barLeft) {

			if (chartWidth - barLeft - barWidth - 8 > tipWidth) {
				hAlignment = 1;
			} else if (barLeft - 8 > tipWidth) {
				hAlignment = -1;
			} else {
				hAlignment = 0;
			}

		} else {

			if (barLeft - 8 > tipWidth) {
				hAlignment = -1;
			} else if (chartWidth - barLeft - barWidth - 8 > tipWidth) {
				hAlignment = 1;
			} else {
				hAlignment = 0;
			}

		}

		if (hAlignment === 0) {

			if (chartHeight - barHeight - 8 > tipHeight) {
				vAlignment = 1;
			} else {
				vAlignment = -1;
			}

		} else {

			if (barHeight < tipHeight) {
				vAlignment = 1;
			} else {
				vAlignment = 0;
			}

		}

		this.toolTip.container.style.opacity = '1';

		if (hAlignment === 1) {
			this.toolTip.container.style.left = barLeft + barWidth + 8 + 'px';
		} else if (hAlignment === -1) {
			this.toolTip.container.style.left = barLeft - tipWidth - 8 + 'px';
		} else {
			this.toolTip.container.style.left = barLeft + (barWidth / 2) - (tipWidth / 2) + 'px';
		}

		if (vAlignment === 0) {
			this.toolTip.container.style.bottom = barHeight - tipHeight + 'px';
		} else if (vAlignment === -1) {
			this.toolTip.container.style.opacity = '0.9';
			this.toolTip.container.style.bottom = chartHeight - tipHeight - 8 + 'px';
		} else {
			this.toolTip.container.style.bottom = barHeight + 8 + 'px';
		}

		this.chart.labelArea.style.opacity = '0.3';

		for (const point of Object.values(this.dataPoints)) {
			point.column.style.opacity = '0.3';
		}

		point.column.style.opacity = '1';

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
	 * @param {any} data
	 */
	update(data) {

		if (data.length > 20) {
			data = val.slice(0, 20);
		}

		this.data.series = data;

		this.draw();

	}

	/**
	 * @description Sets a new title in the chart. Creates the title element if not already present.
	 * @param {string} value
	 */
	set title(value) {

		if (this.chart.title == null) {

			this.chart.title = document.createElement('h1');
			this.chart.title.className = 'cragColumnTitleText';
			this.chart.titleArea.appendChild(this.chart.title);

		}
		
		this.options.chart.title = value;

		this.chart.title.textContent = this.options.chart.title;

		this.draw();

	}

	/**
	 * @param {string} color
	 */
	set chartColor(color) {

		if (isValidColor(color)) this.options.chart.color = color;

		this.colorize();

	}

	set barColor(color) {

		if (isValidColor(color)) this.options.bar.color = color;

		this.colorize();

	}

	set labelPosition(position) {

		if (['inside', 'outside', 'none'].indexOf(position) >= 0) {

			this.options.labels.position = position;

		}

		this.draw();

	}

	set labelColor(color) {

		if (isValidColor(color)) {

			this.options.labels.color = color;

		} else {

			this.options.labels.color = 'auto';

		}

		this.colorize();

	}

}