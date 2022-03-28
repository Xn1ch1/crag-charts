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
				color: 'white'
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

		this.options.columns.specificBarColor = options?.columns?.specificBarColor;

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

		this.primaryVAxis = new vAxisLines(this, 'primary');
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