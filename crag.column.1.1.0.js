/**
 * @typedef optionsColumn Column Options.
 * @property {number} [width] Percentage width of the column relative to the space available. Example, 100 will be a full width columns.
 * @property {string} [color] The color of the bars, either a hex code, an inbuilt pallet name or color mode.
 * @property {number} [rounding] Applies rounded corners at the top of the column.
 * @property {number} [shadow] Applies an inset or outset shadow on the column.
 * @property {boolean} [stripes] Applies diagonal striping to the column.
 * @property {boolean} [animatedStripes] Animates the stripes for a barber-pole effect.
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
 * @property {primary: optionsVAxis, secondary: optionsVAxis} [vAxes]
 * @property {optionsColumn} [columns]
 */
class CragColumn extends CragCore {

	/**
	 * @param {array} data
	 * @param {options} options
	 */
	constructor (data, options = undefined) {
		super();

		this.data = {
			series: data.slice(0, 20),
			max: 0,
			min: 0
		};

		/**
		 * @type {{columns: optionsColumn, vAxes: {primary: optionsVAxis}, chart: optionsChart}}
		 */
		this.options = {
			chart: {
				title: null,
				color: CragPallet.white
			},
			vAxes: {
				primary: {
					name: 'Series',
					majorLines: true,
					minorLines: true,
					shadowOnZeroLine: false,
					format: 'number',
					currencySymbol: 'GBP',
					decimalPlaces: 0,
					min: 'auto'
				},
			},
			columns: {
				width: 90,
				color: CragPallet.multi,
				rounding: 0,
				shadow: 0,
				stripes: false,
				animatedStripes: false,
				onClick: null,
				labels: {
					position: 'none',
					color: CragPallet.auto,
				},
				specificBarColor: null,
			}
		}

		this.chart = {
			parent: null,
			container: null,
			area: null
		}

		/**
		 * Column Options
		 */
		if (options?.columns?.width > 0 && options?.columns?.width < 101) this.options.columns.width = options.columns.width;

		if (this._isValidColor(options?.columns?.color)) this.options.columns.color = options.columns.color;
		if (this._isValidColor(options?.columns?.labels?.color)) this.options.columns.labels.color = options.columns.labels.color;

		this.options.columns.rounding = this.validateOption(options?.columns?.rounding, 'number', this.options.columns.rounding);
		this.options.columns.shadow = this.validateOption(options?.columns?.shadow, 'number', this.options.columns.shadow);
		this.options.columns.stripes = this.validateOption(options?.columns?.stripes, 'boolean', this.options.columns.stripes);
		this.options.columns.animatedStripes = this.validateOption(options?.columns?.animatedStripes, 'boolean', this.options.columns.animatedStripes);
		this.options.columns.onClick = this.validateOption(options?.columns?.onClick, 'function', this.options.columns.onClick);

		this.options.columns.labels.position = this.validateOption(options?.columns?.labels?.position, this.labelPositions, this.options.columns.labels.position);

		this.options.columns.specificBarColor = options?.columns?.specificBarColor ?? null;

		/**
		 * Chart Options
		 */
		this.options.chart.title = this.validateOption(options?.chart?.title, 'string', this.options.chart.title);
		if (this._isValidColor(options?.chart?.color)) this.options.chart.color = options.chart.color;

		/**
		 * Primary vAxes options
		 */
		this.options.vAxes.primary.name = this.validateOption(options?.vAxes?.primary?.name, 'string', this.options.vAxes.primary.name);
		this.options.vAxes.primary.majorLines = this.validateOption(options?.vAxes?.primary?.majorLines, 'boolean', this.options.vAxes.primary.majorLines);
		this.options.vAxes.primary.minorLines = this.validateOption(options?.vAxes?.primary?.minorLines, 'boolean', this.options.vAxes.primary.minorLines);
		this.options.vAxes.primary.format = this.validateOption(options?.vAxes?.primary?.format, this.labelFormats, this.options.vAxes.primary.format);
		this.options.vAxes.primary.decimalPlaces = this.validateOption(options?.vAxes?.primary?.decimalPlaces, 'number', this.options.vAxes.primary.decimalPlaces);

		if (options?.vAxes?.primary?.min === 'auto' || !isNaN(options?.vAxes?.primary?.min)) this.options.vAxes.primary.min = options.vAxes.primary.min;

	}

	create(e) {

		if (e === undefined) return;

		this.chart.parent = document.getElementById(e);
		this.chart.container = document.createElement('div');
		this.chart.area = document.createElement('div');

		this.chart.container.className = 'cragColumnChartContainer';
		this.chart.area.className = 'cragColumnChartArea';

		this.chart.parent.appendChild(this.chart.container);
		this.chart.container.append(this.chart.area);

		this.primaryVAxis = new VAxis(this, VAxis.primary);
		this.columns = new Columns(this);
		this.hAxis = new HAxis(this);
		this.toolTip = new ToolTip(this);
		this.title = new Title(this);

		setTimeout(this._draw.bind(this), 250);

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

		/**
		 * Axis updates should always ben first, these provide scale for the data sets.
		 */

		this.primaryVAxis.update(this.data.min, this.data.max);
		this.hAxis.update();
		this.columns.update(this.data.series, this.primaryVAxis.scale);

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
		this.columns._colorLabels();
		this.toolTip._colorize();
		this.primaryVAxis._colorize();

	}

	_getDataMinMax() {

		this.data.max = Math.max(...this.data.series.map((e) => e[1]));
		this.data.min = Math.min(...this.data.series.map((e) => e[1]));

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

			if (color === CragPallet.match) {

				this.label.style.color = this.color;

			} else if (color === CragPallet.auto) {

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

	columns = {};

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

			if (this.chart.options.columns.color === CragPallet.multi) {

				column.color = this._getColorByMode(CragPallet.multi, column.index);

			} else if (this.chart.options.columns.color === CragPallet.redGreen) {

				column.color = this._getColorByMode(CragPallet.redGreen, column.value);

			} else {

				column.color = this._getColorByMode(CragPallet.match, this.chart.options.columns.color);

			}

		}

		if (this.chart.options.columns.specificBarColor !== null) {

			const bar = Number(this.chart.options.columns.specificBarColor[0]);
			const color = this.chart.options.columns.specificBarColor[1];

			if (bar in this.columns) this.columns[bar].color = this._getColorByMode(CragPallet.match, color);

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

	set specificColumnColor(value) {

		this.chart.options.columns.specificBarColor = value;

		this._applyColumnColors();
		this._colorLabels();

	}

}
