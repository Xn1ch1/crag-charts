/**
 * @typedef optionsLine Line options.
 * @property {number} [thickness] Thickness of the line.
 * @property {number} [pointSize] Size of the points.
 * @property {string|null} [color] Line color, can be hex code, pallet name or mode.
 * @property {boolean} [smooth] Applies smooth rounding to the line between points.
 */

import {
    attachCssToHead,
    CragCore,
    CragPallet, createSVGChartArea,
    defaultLineOptions,
    findMaxValue,
    findMinValue, formatLabel,
    HAxis,
    Title,
    ToolTip,
    VAxis
} from './Core.js';

/**
 * @typedef options
 * @property {optionsChart} [chart]
 * @property {primary: {optionsVAxes}, secondary: {optionsVAxes}} [vAxes]
 * @property {Array.<optionsLine>} [lines]
 */

export class CragLine extends CragCore {

    /**
     * @param {array} data
     * @param {options} options
     */
    constructor (data, options = undefined) {
        super();

        attachCssToHead('CragLines.css');

        this.data = {
            labels: data[0],
            series: data.slice(1, data.length),
            seriesOriginal: data.slice(1, data.length),
            max: {
                primary: 0,
            },
            min: {
                primary: 0,
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
            lines: {
                thickness: 3,
                pointSize: 3,
                smooth: true,
                labelVisible: false,
            },
            vAxes: {
                primary: {
                    majorLines: true,
                    minorLines: true,
                    shadowOnZeroLine: false,
                    lineColor: 'auto',
                    format: 'number',
                    currencySymbol: 'GBP',
                    decimalPlaces: 0,
                    min: 'auto'
                },
            },
            trendLine: {
                color: CragPallet.grey,
                thickness: 2,
                name: ''
            }
        };

        /**
         * Lines Options
         */
        this.options.lines.smooth = this.validateOption(options?.lines?.smooth, 'boolean', this.options.lines.smooth);
        this.options.lines.labelVisible = this.validateOption(options?.lines?.labelVisible, 'boolean', this.options.lines.labelVisible);
        if (options?.lines?.thickness > 0 && options?.lines?.thickness < 11) this.options.lines.thickness = options.lines.thickness;
        if (options?.lines?.pointSize > 0 && options?.lines?.pointSize < 51) this.options.lines.pointSize = options.lines.pointSize;

        /**
         * Line Options
         */
        for (let i = 0; i < this.data.series.length; i++) {

            this.options.lines[i] = {... defaultLineOptions};

            /**
             * Line Options
             */
            if (this._isValidColor(options?.lines?.[i]?.color)) this.options.lines[i].color = options.lines?.[i]?.color;
            if (options?.lines?.[i]?.seriesName > 0 && options?.lines?.[i]?.seriesName < 51) this.options.lines[i].seriesName = options.lines?.[i].seriesName;

        }

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
        this.options.vAxes.primary.decimalPlaces = this.validateOption(options?.vAxes?.primary?.decimalPlaces, 'number', this.options.vAxes.primary.decimalPlaces);
        this.options.vAxes.primary.currencySymbol = this.validateOption(options?.vAxes?.primary?.currencySymbol, 'string', this.options.vAxes.primary.currencySymbol);
        this.options.vAxes.primary.majorLines = this.validateOption(options?.vAxes?.primary?.majorLines, 'boolean', this.options.vAxes.primary.majorLines);
        this.options.vAxes.primary.minorLines = this.validateOption(options?.vAxes?.primary?.minorLines, 'boolean', this.options.vAxes.primary.minorLines);
        this.options.vAxes.primary.format = this.validateOption(options?.vAxes?.primary?.format, this.labelFormats, this.options.vAxes.primary.format);
        if (options?.vAxes?.primary?.min === 'auto' || !isNaN(options?.vAxes?.primary?.min)) this.options.vAxes.primary.min = options?.vAxes?.primary?.min;
        this.options.vAxes.primary.cumulative = this.validateOption(options?.vAxes?.primary?.cumulative, 'boolean', this.options.vAxes.primary.cumulative);

        if (options?.trendLine?.thickness > 0 && options?.trendLine?.thickness < 11) this.options.trendLine.thickness = options.trendLine.thickness;
        if (this._isValidColor(options?.trendLine?.color)) this.options.trendLine.color = options.trendLine.color;
        this.options.trendLine.name = this.validateOption(options?.trendLine?.name, 'string', this.options.trendLine.name);

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

        this.chart.parent.append(this.chart.container);
        this.chart.container.append(this.chart.area);

        this.primaryVAxis = new VAxis(this, VAxis.primary);
        this.hAxis = new HAxis(this);
        this.toolTip = new ToolTip(this);
        this.title = new Title(this);
        this.lines = new Lines(this, this.data.series.length)
        this.trendLine = new TrendLine(this, null);

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
        this._cumulateData();
        this._getDataMinMax();

        this.primaryVAxis.update(this.data.min.primary, this.data.max.primary);
        this.hAxis.update();
        this.lines.update(this.data.series, this.primaryVAxis.scale);
        this._colorize();

    }

    _cumulateData() {

        if (!this.options.vAxes.primary.cumulative) {

            for (let i = 0; i < this.data.series.length; i++) {
                this.data.series[i] = this._deepCopyArray(this.data.seriesOriginal)[i];
            }
            return;
        }

        for (let i = 0; i < this.data.series.length; i++) {

            let cumulativeTotal = 0;

            for (let j = 0; j < this.data.series[i].length; j++) {

                cumulativeTotal += this.data.seriesOriginal[i][j];
                this.data.series[i][j] = cumulativeTotal;

            }

        }

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
        this.lines._colorize();
        this.primaryVAxis._colorize();

    }

    _getDataMinMax() {

        this.data.max = {
            primary: findMaxValue(this.data.series),
        };
        this.data.min = {
            primary: findMinValue(this.data.series),
        };

    }

    /**
     * @description Applies a new data set to the chart. Must be full data set.
     * @param {any} data
     */
    update(data) {

        const newData = this._deepCopyArray(data);

        this.data.labels = newData[0];
        this.data.series = newData.slice(1, newData.length);
        this.data.seriesOriginal = newData.slice(1, newData.length);

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

export class TrendLine extends CragCore {

    chart = null;

    /** @type {null|SVGPathElement} */
    line = null;

    /** @type {null|SVGSVGElement} */
    area = null;

    label = null;

    value= 0;
    name = '';

    constructor(chart) {
        super();

        this.chart = chart;

        this.area = createSVGChartArea();
        this._createLabel();
        this._createLine();

        this.thickness = this.chart.options.trendLine.thickness;
        this.color = this.chart.options.trendLine.color;

        this.chart.chart.area.append(this.area);

    }

    _createLabel() {

        this.label = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        this.label.style.color = this._getContrastColor(this.chart.options.color);
        this.label.classList.add('cragVAxisLabel');
        this.label.textContent = this.chart.options.trendLine.name;

        this.area.append(this.label);

    }

    _calcStartEndPoints() {

        const seriesItemWidth = this.area.width.baseVal.value / this.chart.data.labels.length;

        let zeroLine = 0;

        /** Scale is all negative, zero line will be at bottom of container */
        if (this.chart.primaryVAxis.scale.min >= 0) zeroLine = this.area.height.baseVal.value;
        /** Scale is positive to negative, zero line will be a part way through */
        if (this.chart.primaryVAxis.scale.min < 0 && this.chart.primaryVAxis.scale.max > 0) zeroLine = this.area.height.baseVal.value / (this.chart.primaryVAxis.scale.max - this.chart.primaryVAxis.scale.min) * this.chart.primaryVAxis.scale.max;

        let cy;

        if (this.value < 0) {

            cy = (this.area.height.baseVal.value - zeroLine) / (this.chart.primaryVAxis.scale.min - Math.min(0, this.chart.primaryVAxis.scale.max)) * (this.value - Math.min(0, this.chart.primaryVAxis.scale.max));

        } else {

            if (zeroLine === this.area.height.baseVal.value) {

                cy = -this.area.height.baseVal.value / (this.chart.primaryVAxis.scale.max - this.chart.primaryVAxis.scale.min) * (this.value - this.chart.primaryVAxis.scale.min);

            } else {

                cy = -(zeroLine - this.area.height.baseVal.value) / (this.chart.primaryVAxis.scale.min - Math.min(0, this.chart.primaryVAxis.scale.max)) * (this.value - Math.min(0, this.chart.primaryVAxis.scale.max));

            }

        }

        return {
            cy: zeroLine + cy,
            cx: (seriesItemWidth / 2),
            cx2: (seriesItemWidth * (this.chart.data.labels.length - 1)) + (seriesItemWidth / 2)
        }

    }

    _createLine() {

        this.line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.line.setAttribute('fill', 'none');
        this.line.setAttribute('class', 'cragLine');
        this.line.setAttribute('d', 'M 0,0 0,0');

        this.area.append(this.line);

    }

    update(data) {

        if (data === null) {
            this.line.style.opacty = 0;
            return;
        }

        this.line.style.opacty = 1;

        this.value = data;
        this.updateLine();

    }

    updateLine() {

        const position = this._calcStartEndPoints();

        this.line.setAttribute('d', `M ${position.cx},${position.cy} ${position.cx2},${position.cy}`);

        this.label.setAttribute('y', position.cy - 4);
        this.label.setAttribute('x', position.cx + 2);


    }

    set thickness(value) {

        this.line.setAttribute('stroke-width', value.toString());

    }

    set color(color) {

        this.line.setAttribute('stroke', this._resolveColor(color));

    }

}

export class Line extends CragCore {

    #parent = null;

    /** @type {null|SVGPathElement} */
    line = null;

    /** @type {array} */
    points = [[0, 0]];

    dots = {};

    index = 0;

    options = {};
    data = [];

    constructor(parent, data, index = 0) {
        super();

        this.#parent = parent;
        this.index = index;
        this.data = data;

        this._createLine();
        this._createDots();

    }

    _createLine() {

        this.line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.line.setAttribute('fill', 'none');
        this.line.setAttribute('class', 'cragLine');
        this.line.setAttribute('d', 'M0,0');

    }

    update(data, scale) {

        this.data = data;

        this._refactorDots();
        this._positionDots(scale);
        this.updateLine();

    }

    _createDots() {
        for (let i = 0; i < this.data.length; i++) {
            this.dots[i] = new Dot(this, i, this.data[i]);
        }
    }

    _refactorDots() {

        for (let i = 0; i < this.data.length; i++) {

            if (this.dots[i]) {

                /**
                 * Update existing DataPoint at this index with new data
                 */
                this.dots[i].index = i;
                this.dots[i].value = this.data[i];

                this.#parent.chart.toolTip.attach(this.dots[i]);

            } else {

                this.dots[i] = new Dot(this, i, this.data[i]);

                this.dots[i].r = this.pointSize;
                this.dots[i].fill = this.color;

                this.#parent.lineArea.append(this.dots[i].element);
                this.#parent.labelArea.append(this.dots[i].label);

                this.#parent.chart.toolTip.attach(this.dots[i]);

            }

        }

        /**
         * Remove any DataPoints that are beyond the current data set length.
         * This will happen when a new data set is loaded that is smaller than the old data set
         */
        for (let i = Object.values(this.dots).length + 1; i >= this.data.length; i--) {

            if (!this.dots[i]) continue;

            this.dots[i]._destroy();
            this.dots[i] = null;

            delete this.dots[i];

        }

    }

    _positionDots(scale) {

        const seriesItemWidth = this.#parent.lineArea.width.baseVal.value / this.data.length;

        let zeroLine = 0;

        /** Scale is all negative, zero line will be at bottom of container */
        if (scale.min >= 0) zeroLine = this.#parent.lineArea.height.baseVal.value;
        /** Scale is positive to negative, zero line will be a part way through */
        if (scale.min < 0 && scale.max > 0) zeroLine = this.#parent.lineArea.height.baseVal.value / (scale.max - scale.min) * scale.max;

        for (const dot of Object.values(this.dots)) {

            let cy = 0;

            if (dot.value < 0) {

                cy = (this.#parent.lineArea.height.baseVal.value - zeroLine) / (scale.min - Math.min(0, scale.max)) * (dot.value - Math.min(0, scale.max));

            } else {

                if (zeroLine === this.#parent.lineArea.height.baseVal.value) {

                    cy = -this.#parent.lineArea.height.baseVal.value / (scale.max - scale.min) * (dot.value - scale.min);

                } else {

                    cy = -(zeroLine - this.#parent.lineArea.height.baseVal.value) / (scale.min - Math.min(0, scale.max)) * (dot.value - Math.min(0, scale.max));

                }


            }

            dot.cy = zeroLine + cy;
            dot.cx = (seriesItemWidth * dot.index) + (seriesItemWidth / 2);

            if (this.#parent.labelVisible) {

                dot.labelVisible = dot.label.offsetWidth <= seriesItemWidth - 16;

            } else {

                dot.labelVisible = false;

            }

        }

    }

    updateLine() {

        const newPoints = Object.values(this.dots).map((a) => a.element);

        if (newPoints.length === 0) return;

        let smoothing = 0;

        smoothing = this.smooth ? 0.125 : 0;

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

    set thickness(value) {
        this.line.setAttribute('stroke-width', value.toString());
    }
    get thickness() {
        return this.#parent.thickness;
    }

    set smooth(value) {
        this.updateLine();
    }
    get smooth() {
        return this.#parent.smooth;
    }

    set pointSize(value) {
        for (const dot of Object.values(this.dots)) {
            dot.r = value;
        }
    }
    get pointSize() {
        return this.#parent.pointSize;
    }


    set color(value) {

        this.#parent.setIndexColor(this.index, value);


        if (value === CragPallet.auto) {
            this.#parent._colorize();
            return;
        }

        const color = this._getColor(value, this.index);

        this.line.setAttribute('stroke', color);

        for (const dot of Object.values(this.dots)) {

            dot.fill = color;

        }

    }

    get labelVisible() {
        return this.#parent.labelVisible;
    }
    set labelVisible(value) {
        for (const dot of Object.values(this.dots)) {
            dot.labelVisible = value;
        }
    }

    set seriesName(value) {
        this.#parent.setIndexSeriesName(this.index, value);
    }

    get seriesName() {
        return this.#parent.getIndexSeriesName(this.index);
    }

    getIndexDataLabel(index) {
        return this.#parent.getIndexDataLabel(index);
    }

}

export class Lines extends CragCore {

    lines = {};
    count = 0;

    /**
     * @type {null|CragLine|CragCombo} */
    chart = null;

    lineArea = null;
    labelArea = null;

    constructor(chart, count) {
        super();

        this.count = count;
        this.chart = chart;

        this._createArea();
        this._createLabelArea();
        this._createLines();

    }

    _createLines() {

        for (let i = 0; i < this.count; i++) {

            this.lines[i] = new Line(this, this.chart.data.series[i], i);

            this.lines[i].pointSize = this.pointSize;
            this.lines[i].thickness = this.thickness;
            this.lines[i].smooth = this.smooth;

            this.lineArea.append(this.lines[i].line);

            for (const dot of Object.values(this.lines[i].dots)) {

                this.lineArea.append(dot.element);
                this.labelArea.append(dot.label);

            }

        }

    }

    _createArea() {

        this.lineArea = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.lineArea.setAttribute('width', '100%');
        this.lineArea.setAttribute('height', '100%');
        this.lineArea.style.position = 'absolute';
        this.lineArea.style.pointerEvents = 'none';
        this.lineArea.style.left = '0';
        this.lineArea.style.top = '0';

        this.chart.chart.area.append(this.lineArea);

    }

    _createLabelArea() {

        this.labelArea = document.createElement('div');
        this.labelArea.className = 'cragChartSubArea';
        this.labelArea.style.pointerEvents = 'none';
        this.labelArea.style.zIndex = '1';

        this.chart.chart.area.append(this.labelArea);

    }

    _colorize() {

        for (let i = 0; i < this.count; i++) {

            if (this.chart.options.lines[i].color === CragPallet.auto) {

                const color = this._getContrastColor(this.chart.options.chart.color);

                this.lines[i].line.setAttribute('stroke', color);

                for (const dot of Object.values(this.lines[i].dots)) {

                    dot.fill = color;

                }

                continue;
            }

            this.lines[i].color = this.chart.options.lines[i].color;

        }

    }

    update(data, scale) {

        for (let i = 0; i < data.length; i++) {

            this.lines[i].update([...data[i]], scale);

        }

    }

    setIndexColor(index, value) {
        this.chart.options.lines[index].color = value;
    }

    set pointSize(value) {

        this.chart.options.lines.pointSize = value;

        for (let i = 0; i < this.count; i++) {
            this.lines[i].pointSize = value;
        }

    }
    get pointSize() {
        return this.chart.options.lines.pointSize;
    }

    set smooth(value) {

        this.chart.options.lines.smooth = value;

        for (let i = 0; i < this.count; i++) {
            this.lines[i].smooth = value;
        }

    }
    get smooth() {
        return this.chart.options.lines.smooth;
    }

    set thickness(value) {

        this.chart.options.lines.thickness = value;

        for (let i = 0; i < this.count; i++) {
            this.lines[i].thickness = value;
        }

    }
    get thickness() {
        return this.chart.options.lines.thickness;
    }

    set labelVisible(value) {

        this.chart.options.lines.labelVisible = value;

        for (let i = 0; i < this.count; i++) {
            this.lines[i].labelVisible = value;
        }

    }
    get labelVisible() {
        return this.chart.options.lines.labelVisible;
    }

    setIndexSeriesName(index, value) {
        this.chart.options.lines[index].seriesName = value;
    }
    getIndexSeriesName(index) {
        return this.chart.options.lines[index].seriesName;
    }

    getIndexDataLabel(index) {
        return this.chart.data.labels[index];
    }

}

export class Dot {

    /** @type {SVGCircleElement} */
    element = null;

    /** @type {HTMLSpanElement} */
    label = null;

    #value = 0;
    #index = 0;

    /** @type {Line} */
    #parent = null;

    constructor(parent, index, value) {

        this.#index = index;
        this.#value = value;
        this.#parent = parent;

        this._createDot();
        this._createLabel();

        this.cy = 0;
        this.cx = 0;

    }

    _createDot() {

        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        this.element.setAttribute('cx', '100%');
        this.element.setAttribute('cy', '100%');
        this.element.setAttribute('class', 'cragPoint');

    }

    _createLabel() {

        this.label = document.createElement('span');
        this.label.className = 'cragLineLabel';

        this.label.textContent = formatLabel(this.#value);

    }

    _destroy() {

        this.element.style.opacity = '0';
        this.label.style.opacity = '0';

        setTimeout(() => {

            this.element.remove();
            this.label.remove();

        }, 700);

    }

    set r(value) {

        this.element.setAttribute('r', value);

    }

    set cy(value) {

        this.element.setAttribute('cy', `${value}px`);

        if (value - this.label.offsetHeight - 16 < 0) {

            this.label.style.top = `${value + 8}px`;

        } else {

            this.label.style.top = `${value - this.label.offsetHeight - 8}px`;

        }

    }

    set cx(value) {

        this.element.setAttribute('cx', `${value}px`);

        this.label.style.left = `${value - this.label.offsetWidth / 2}px`;

    }

    set fill(value) {

        this.element.style.fill = value;

    }

    /**
     * @param {number} value
     */
    set value(value) {
        this.#value = value;
        this.label.textContent = formatLabel(value);
    }
    get value() {
        return this.#value;
    }

    get name() {
        return this.#parent.getIndexDataLabel(this.index);
    }

    /**
     * @param {number} value
     */
    set index(value) {
        this.#index = value;
    }
    get index() {
        return this.#index;
    }

    set labelVisible(value) {
        this.label.style.opacity = value ? '1' : '0';
    }
    get labelVisible() {
        return this.label.style.opacity === '1';
    }

    get seriesName() {
        return this.#parent.seriesName;
    }

}
