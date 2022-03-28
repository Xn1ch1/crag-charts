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
 * @property {optionsColumn} [columns]
 * @property {optionsLine} [line]
 */
class CragCombo extends CragCore {

	/**
	 * @param {array} data
	 * @param {options} options
	 */
	constructor (data, options = undefined) {
		super();

		this.data = {
			series: data.slice(0, 20),
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
				color: 'white'
			},
			/**
			 * @type optionsColumn
			 */
			columns: {
				width: 90,
				color: 'multi',
				rounding: 0,
				shadow: 0,
				stripes: false,
				animatedStripes: false,
				onClick: null,
				labels: {
					position: 'none',
					color: 'auto'
				},
				specificBarColor: null,
			},
			/**
			 * @type optionsLine
			 */
			line: {
				thickness: 2,
				pointSize: 4,
				color: 'auto',
				smooth: true
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
				secondary: {
					name: 'Series 2',
					majorLines: false,
					minorLines: false,
					showOnPrimary: false,
					format: 'number',
					currencySymbol: 'GBP',
					decimalPlaces: 0,
					min: 'auto'
				},
			},
		};

		/**
		 * Column Options
		 */
		if (options?.columns?.width > 0 && options?.columns?.width < 101) this.options.columns.width = options.columns.width;

		if (this._isValidColor(options?.columns?.color)) this.options.columns.color = options.columns.color;
		if (this._isValidColor(options?.columns?.labels?.color)) this.options.columns.labels.color = options.columns.labels.color;

		this.options.columns.rounding = this.validateOption(options?.columns?.rounding, 'number', this.options.columns.rounding);
		this.options.columns.shadow = this.validateOption(options?.columns?.inset, 'number', this.options.columns.inset);
		this.options.columns.striped = this.validateOption(options?.columns?.striped, 'boolean', this.options.columns.striped);
		this.options.columns.animated = this.validateOption(options?.columns?.animated, 'boolean', this.options.columns.animated);
		this.options.columns.onClick = this.validateOption(options?.columns?.onClick, 'function', this.options.columns.onClick);

		this.options.columns.labels.position = this.validateOption(options?.columns?.labels?.position, this.labelPositions, this.options.columns.labels.position);

		this.options.columns.specificBarColor = options?.columns?.specificBarColor ?? null;
		
		/**
		 * Line Options
		 */
		if (this._isValidColor(options?.line?.color)) this.options.line.color = options.line.color;

		this.options.line.smooth = this.validateOption(options?.line?.smooth, 'boolean', this.options.line.smooth);
		if (options?.line?.thickness > 0 && options?.line?.thickness < 11) this.options.line.thickness = options.line.thickness;
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
		this.options.vAxes.primary.decimalPlaces = this.validateOption(options?.vAxes?.primary?.decimalPlaces, 'number', this.options.vAxes.primary.decimalPlaces);

		this.options.vAxes.secondary.name = this.validateOption(options?.vAxes?.secondary?.name, 'string', this.options.vAxes.secondary.name);
		this.options.vAxes.secondary.majorLines = this.validateOption(options?.vAxes?.secondary?.majorLines, 'boolean', this.options.vAxes.secondary.majorLines);
		this.options.vAxes.secondary.minorLines = this.validateOption(options?.vAxes?.secondary?.minorLines, 'boolean', this.options.vAxes.secondary.minorLines);
		this.options.vAxes.secondary.showOnPrimary = this.validateOption(options?.vAxes?.secondary?.showOnPrimary, 'boolean', this.options.vAxes.secondary.showOnPrimary);
		this.options.vAxes.secondary.format = this.validateOption(options?.vAxes?.secondary?.format, this.labelFormats, this.options.vAxes.secondary.format);
		if (options?.vAxes?.secondary?.min === 'auto' || !isNaN(options?.vAxes?.secondary?.min)) this.options.vAxes.secondary.min = options?.vAxes?.secondary?.min;
		this.options.vAxes.secondary.decimalPlaces = this.validateOption(options?.vAxes?.secondary?.decimalPlaces, 'number', this.options.vAxes.secondary.decimalPlaces);

		this.chart = {
			parent: null,
			container: null,
			area: null,
		};

	}

	create(e) {

		if (e === undefined) return;

		this.chart.parent = document.getElementById(e);
		this.chart.container = document.createElement('div');
		this.chart.area = document.createElement('div');

		this.chart.container.className = 'cragComboChartContainer';
		this.chart.area.className = 'cragComboChartArea';

		this.chart.parent.appendChild(this.chart.container);
		this.chart.container.append(this.chart.area);

		this.primaryVAxis = new vAxisLines(this, 'primary');
		this.secondaryVAxis = new vAxisLines(this, 'secondary');
		this.hAxis = new HAxis(this);
		this.toolTip = new ToolTip(this);
		this.columns = new Columns(this);
		this.line = new Line(this);
		this.title = new Title(this);

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

		this.primaryVAxis.update(this.data.min.primary, this.data.max.primary);
		this.secondaryVAxis.update(this.data.min.secondary, this.data.max.secondary);
		this.columns.update(this.data.series, this.primaryVAxis.scale);
		this.line.update(this.data.series.map((e) => e[2]), this.secondaryVAxis.scale);
		this.hAxis.update();

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
		this.line._colorize();
		this.primaryVAxis._colorize();
		this.secondaryVAxis._colorize();

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

		if (this.options.vAxes?.secondary?.showOnPrimary) {

			this.data.max = {
				primary: Math.max(...this.data.series.map((e) => e.slice(1)).flat()),
				secondary: Math.max(...this.data.series.map((e) => e.slice(1)).flat()),
			};
			this.data.min = {
				primary: Math.min(...this.data.series.map((e) => e.slice(1)).flat()),
				secondary: Math.min(...this.data.series.map((e) => e.slice(1)).flat()),
			};

		}

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