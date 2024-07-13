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
            labels: [...data[0]],
            series: [...data.slice(1, data.length)],
            seriesOriginal: [...data.slice(1, data.length)],
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
            chart: {
                color: CragPallet.white,
                locale: 'en-GB',
            },
            title: {
                text: null,
                color: CragPallet.auto
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
                    color: CragPallet.auto
                },
                specificBarColor: null,
            },
            lines: {
                thickness: 3,
                pointSize: 3,
                smooth: true,
                labelVisible: false,
                0: {
                    color: CragPallet.auto,
                    seriesName: null,
                }
            },
            vAxes: {
                primary: {
                    name: null,
                    majorLines: true,
                    minorLines: true,
                    shadowOnZeroLine: false,
                    lineColor: 'auto',
                    format: 'number',
                    currencySymbol: 'GBP',
                    decimalPlaces: 0,
                    min: 'auto',
                    cumulative: false
                },
                secondary: {
                    name: null,
                    majorLines: false,
                    minorLines: false,
                    showOnPrimary: false,
                    lineColor: 'auto',
                    format: 'number',
                    currencySymbol: 'GBP',
                    decimalPlaces: 0,
                    min: 'auto',
                    cumulative: false
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
        this.options.columns.shadow = this.validateOption(options?.columns?.shadow, 'number', this.options.columns.shadow);
        this.options.columns.striped = this.validateOption(options?.columns?.striped, 'boolean', this.options.columns.striped);
        this.options.columns.animated = this.validateOption(options?.columns?.animated, 'boolean', this.options.columns.animated);
        this.options.columns.onClick = this.validateOption(options?.columns?.onClick, 'function', this.options.columns.onClick);

        this.options.columns.labels.position = this.validateOption(options?.columns?.labels?.position, this.labelPositions, this.options.columns.labels.position);

        this.options.columns.specificBarColor = options?.columns?.specificBarColor ?? null;

        /**
         * Line Options
         */
        if (this._isValidColor(options?.lines[0]?.color)) this.options.lines[0].color = options.lines[0].color;
        this.options.lines[0].labelVisible = this.validateOption(options?.lines[0]?.labelVisible, 'boolean', this.options.lines[0].labelVisible);

        this.options.lines.smooth = this.validateOption(options?.lines.smooth, 'boolean', this.options.lines.smooth);
        if (options?.lines.thickness > 0 && options?.lines.thickness < 11) this.options.lines.thickness = options.lines.thickness;
        if (options?.lines.pointSize > 0 && options?.lines.pointSize < 51) this.options.lines.pointSize = options.lines.pointSize;

        /**
         * Chart Options
         */
        if (this._isValidColor(options?.chart?.color)) this.options.chart.color = options.chart.color;
        this.options.chart.locale = this.validateOption(options?.chart?.locale, 'string', this.options.chart.locale);

        /**
         * Title
         */
        this.options.title.text = this.validateOption(options?.title?.text, 'string', this.options.title.text);
        if (this._isValidColor(options?.title?.color)) this.options.chart.title.color = options.title.color;

        /**
         * vAxes options
         * 0 = left axis, primary columns
         * 1 = right axis, secondary points
         */
        this.options.vAxes.primary.name = this.validateOption(options?.vAxes?.primary?.name, 'string', this.options.vAxes.primary.name);
        this.options.vAxes.primary.currencySymbol = this.validateOption(options?.vAxes?.primary?.currencySymbol, 'string', this.options.vAxes.primary.currencySymbol);
        this.options.vAxes.primary.majorLines = this.validateOption(options?.vAxes?.primary?.majorLines, 'boolean', this.options.vAxes.primary.majorLines);
        this.options.vAxes.primary.minorLines = this.validateOption(options?.vAxes?.primary?.minorLines, 'boolean', this.options.vAxes.primary.minorLines);
        this.options.vAxes.primary.format = this.validateOption(options?.vAxes?.primary?.format, this.labelFormats, this.options.vAxes.primary.format);
        if (options?.vAxes?.primary?.min === 'auto' || !isNaN(options?.vAxes?.primary?.min)) this.options.vAxes.primary.min = options?.vAxes?.primary?.min;
        this.options.vAxes.primary.decimalPlaces = this.validateOption(options?.vAxes?.primary?.decimalPlaces, 'number', this.options.vAxes.primary.decimalPlaces);
        this.options.vAxes.primary.cumulative = this.validateOption(options?.vAxes?.primary?.cumulative, 'boolean', this.options.vAxes.primary.cumulative);

        this.options.vAxes.secondary.name = this.validateOption(options?.vAxes?.secondary?.name, 'string', this.options.vAxes.secondary.name);
        this.options.vAxes.secondary.currencySymbol = this.validateOption(options?.vAxes?.secondary?.currencySymbol, 'string', this.options.vAxes.secondary.currencySymbol);
        this.options.vAxes.secondary.majorLines = this.validateOption(options?.vAxes?.secondary?.majorLines, 'boolean', this.options.vAxes.secondary.majorLines);
        this.options.vAxes.secondary.minorLines = this.validateOption(options?.vAxes?.secondary?.minorLines, 'boolean', this.options.vAxes.secondary.minorLines);
        this.options.vAxes.secondary.showOnPrimary = this.validateOption(options?.vAxes?.secondary?.showOnPrimary, 'boolean', this.options.vAxes.secondary.showOnPrimary);
        this.options.vAxes.secondary.format = this.validateOption(options?.vAxes?.secondary?.format, this.labelFormats, this.options.vAxes.secondary.format);
        if (options?.vAxes?.secondary?.min === 'auto' || !isNaN(options?.vAxes?.secondary?.min)) this.options.vAxes.secondary.min = options?.vAxes?.secondary?.min;
        this.options.vAxes.secondary.decimalPlaces = this.validateOption(options?.vAxes?.secondary?.decimalPlaces, 'number', this.options.vAxes.secondary.decimalPlaces);
        this.options.vAxes.secondary.cumulative = this.validateOption(options?.vAxes?.secondary?.cumulative, 'boolean', this.options.vAxes.secondary.cumulative);

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

        this.primaryVAxis = new VAxis(this, VAxis.primary);
        this.secondaryVAxis = new VAxis(this, VAxis.secondary);
        this.hAxis = new HAxis(this);
        this.toolTip = new ToolTip(this);
        this.columns = new Columns(this, this.data.series[0]);
        this.lines = new Lines(this, 1);
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

        window.addEventListener('resize', () => this._draw());

    }

    /**
     * Full redraw and _colorize
     * @private
     */
    _draw() {

        /**
         * Updates both vAxis to match the current data set.
         */
        this._cumulate();
        this._getDataMinMax();

        this.primaryVAxis.update(this.data.min.primary, this.data.max.primary);
        this.secondaryVAxis.update(this.data.min.secondary, this.data.max.secondary);
        this.columns.update(this.data.series[0], this.primaryVAxis.scale);
        this.lines.update([this.data.series[1]], this.secondaryVAxis.scale, this.options.vAxes.secondary.cumulative);
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
        this.lines._colorize();
        this.primaryVAxis._colorize();
        this.secondaryVAxis._colorize();

    }

    _cumulate() {

        this.data.series[0] = this._deepCopyArray(this.data.seriesOriginal)[0];
        this.data.series[1] = this._deepCopyArray(this.data.seriesOriginal)[1];

        if (this.options.vAxes.primary.cumulative) {

            let cumulativeTotal = 0;
            for (let i = 0; i < this.data.series[0].length; i++) {
                cumulativeTotal += this.data.seriesOriginal[0][i];
                this.data.series[0][i] = cumulativeTotal;
            }

        }

        if (this.options.vAxes.secondary.cumulative) {

            let cumulativeTotal = 0;
            for (let i = 0; i < this.data.series[1].length; i++) {
                cumulativeTotal += this.data.seriesOriginal[1][i];
                this.data.series[1][i] = cumulativeTotal;
            }

        }

    }

    _getDataMinMax() {

        this.data.max = {
            primary: findMaxValue(this.data.series[0]),
            secondary: findMaxValue(this.data.series[1])
        };
        this.data.min = {
            primary: findMinValue(this.data.series[0]),
            secondary: findMinValue(this.data.series[1])
        };

        if (this.options.vAxes?.secondary?.showOnPrimary) {

            this.data.max = {
                primary: findMaxValue(this.data.series),
                secondary: findMaxValue(this.data.series)
            };
            this.data.min = {
                primary: findMinValue(this.data.series),
                secondary: findMinValue(this.data.series)
            };

        }

    }

    /**
     * @description Applies a new data set to the chart. Must be full data set.
     * @param {any} data
     */
    update(data) {

        const newData = this._deepCopyArray(data)

        this.data.labels = newData[0];
        this.data.series = newData.slice(1, newData.length);
        this.data.seriesOriginal = newData.slice(1, newData.length);

        this._draw();

    }

    /**
     * @description Applies a new background color to the chart.
     * @description Applies a new background color to the chart.
     * @param {string} color
     */
    set color(color) {

        if (this._isValidColor(color)) this.options.chart.color = color;

        this._colorize();

    }

}