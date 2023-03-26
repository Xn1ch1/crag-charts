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

		this.primaryVAxis = new vAxisLines(this, 'primary');
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