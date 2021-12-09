class DataPoint {

	index = 0;
	realValue = 0;
	realName = null;
	
	column = null;
	columnLabel = null;
	axisLabel = null;

	constructor (index, value, name, chartOptions) {

		this.index = index;
		this.realValue = value;
		this.realName = name;

		this._createColumn(chartOptions);
		this._createColummLabel(chartOptions);
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

	_createColummLabel(chartOptions) {
		
		if (chartOptions.labels.position != 'none') {

			this.columnLabel = document.createElement('span');
			this.columnLabel.className = 'cragColumnBarLabel';
			this.columnLabel.textContent = formatLabel(this.realValue, chartOptions.vAxis.format, 99999);

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

		this.column.style.bottom = `${bottom}px`;
		this.column.style.left = `${left}px`;
		this.column.style.width = `${width}px`;

	}

	setColumnHeight(height) {

		this.column.style.height = `${height}px`;

		if (this.value < 0) {

			this.column.style.transform = 'scaleY(-1)';

		} else {

			this.column.style.transform = 'scaleY(1)';

		}

	}

	_destroy() {

		this.column.style.left = `calc(100% + ${parseInt(this.column.style.width.replace('px', '')) * this.index}px)`;

		this.axisLabel.style.opacity = 0;
		this.axisLabel.style.left = '100%';

		if (this.columnLabel != null) {

			this.columnLabel.style.opacity = 0;
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
	 * @param {string} value
	 */
	set name(value) {

		this.realName = value;
		this.axisLabel.textContent = value;

	}
	get name () {
		return this.realName;
	}

} 
class CragColumn {

	constructor (options) {

		this.dataPoints = {};

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
				color: 'match'
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
			max: 0,
		}

		this.vAxis = {
			area: null,
			elements: {},
			baseValue: null,
			baseLine: null,
			max: 0,
			min: 0
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

		if (options != undefined) {

			if (options.bar != undefined) {

				const option = options.bar;

				if (option.width != undefined && option.width > 0 && option.width < 101) {
					this.options.bar.width = option.width;
				}
				if (option.color != undefined && isValidColor(option.color)) {
					this.options.bar.color = option.color;
				}
				if (option.rounded != undefined && typeof option.rounded === 'boolean') {
					this.options.bar.rounded = option.rounded;
				}
				if (option.inset != undefined && typeof option.inset === 'boolean') {
					this.options.bar.inset = option.inset;
				}
				if (option.striped != undefined && typeof option.striped === 'boolean') {
					this.options.bar.striped = option.striped;
				}
				if (option.animated != undefined && typeof option.animated === 'boolean') {
					this.options.bar.animated = option.animated;
				}
				if (option.onClick != undefined && typeof option.onClick === 'function') {
					this.options.bar.onClick = option.onClick;
				}

			}


			if (options.labels != undefined) {

				if (options.labels.position != undefined && ['inside', 'outside', 'none'].indexOf(options.labels.position) >= 0) {
					this.options.labels.position = options.labels.position;
				}
				if (options.labels.color != undefined && pallet.hasOwnProperty(options.labels.color)) {
					this.options.labels.color = options.labels.color;
				}

			}

			if (options.chart != undefined) {

				const option = options.chart;

				if (option.title != undefined) {
					this.options.chart.title = option.title;
				}
				if (option.color != undefined && isValidColor(option.color)) {
					this.options.chart.color = option.color;
				}
				if (option.minorLines != undefined && typeof option.minorLines === 'boolean') {
					this.options.chart.minorLines = option.minorLines;
				}

			}

			if (options.vAxis != undefined) {

				const option = options.vAxis;

				if (option.label != undefined) {
					this.options.vAxis.label = option.label;
				}
				if (option.lines != undefined && typeof option.lines === 'boolean') {
					this.options.vAxis.lines = option.lines;
				}
				if (option.format != undefined && ['number', 'decimal', 'time'].indexOf(option.format) >= 0) {
					this.options.vAxis.format = option.format;
				}
				if (option.min != undefined && (option.min == 'auto' || !isNaN(option.min))) {
					this.options.vAxis.min = option.min;
				}

			}

		}

	}

	create(e) {

		if (e == undefined) return;

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

		const t = this;

		t._addRemoveSeriesElems();

		const vAxisWidth = t._createVAxis();

		const chartAreaWidth = t.chartContainer.offsetWidth - vAxisWidth;
		const chartAreaHeight = t.chart.area.offsetHeight;
		const seriesItemWidth = chartAreaWidth / t.data.series.length;
		const barWidth = seriesItemWidth * (t.options.bar.width / 100);
		const gapWidth = seriesItemWidth - barWidth;
		const barMin = t.options.vAxis.min == 'auto' ? t.vAxis.min : t.options.vAxis.min;
		const barHeight = chartAreaHeight / (t.vAxis.max - barMin);

		const zeroLine = t.vAxis.min >= 0 ? 0 : chartAreaHeight * Math.abs(t.vAxis.min / (t.vAxis.max - t.vAxis.min));

		const spaceAboveZero = chartAreaHeight - zeroLine;

		t.vAxis.area.style.width = vAxisWidth + 'px';

		for (const point of Object.values(this.dataPoints)) {

			point.positionAxisLabel(seriesItemWidth);
			point.positionColumn(zeroLine, (seriesItemWidth * point.index) + (gapWidth / 2), barWidth);
			
			if (point.value < 0) {
		
				/**
				 * Negative bars, invert the bar on the bottom of the element so it points down
				 */
				point.setColumnHeight((point.value / barMin) * zeroLine);

			} else {

				point.setColumnHeight((1 - (this.vAxis.max - point.value) / (this.vAxis.max - Math.max(this.vAxis.min, 0))) * spaceAboveZero);
							
			}

		}

		for (const [index, elements] of Object.entries(t.chart.elements)) {

			let realInside = true;

			const label = elements.label;
			const value = elements.value;

			if (t.options.labels.position != 'none') {

				label.style.width = 'auto';

				if (label.offsetWidth > seriesItemWidth) {
					label.style.opacity = 0;
				} else {
					label.style.opacity = 1;
				}

				label.style.left = seriesItemWidth * index + 'px';

				if (t.options.labels.position == 'inside') {
				
					if (barHeight * value < label.offsetHeight) {
				
						realInside = false;
				
					}
				
				} else if (chartAreaHeight - (barHeight * value) >= label.offsetHeight) {
				
					realInside = false;
				
				}

				if (realInside) {

					label.style.width = 'auto';
					label.style.bottom = barHeight * value - label.offsetHeight;

					if (label.offsetWidth > barWidth) {
				
						label.style.opacity = 0;
				
					} else {
				
						label.style.width = seriesItemWidth + 'px';
				
					}

				} else {

					label.style.bottom = barHeight * value;
					label.style.width = seriesItemWidth + 'px';
				
				}

			}


		}

		this.colorize();

	}

	colorize() {

		this.toolTip.container.style.backgroundColor = getContrastColor(this.options.chart.color);
		this.toolTip.title.style.color = resolveColor(this.options.chart.color);
		this.toolTip.value.style.color = resolveColor(this.options.chart.color);
		this.toolTip.label.style.color = resolveColor(this.options.chart.color);

		for (const point of Object.values(this.dataPoints)) {

			point.axisLabel.style.color = getContrastColor(this.options.chart.color);

			console.log(this.options.bar.color);
			if (this.options.bar.color == 'multi') {

				point.column.style.backgroundColor = pallet.key(point.index);

			} else if (this.options.bar.color == 'positiveNeagative') {
			
				if (point.value < 0) {

					point.column.style.backgroundColor = pallet.red;

				} else {
					
					point.column.style.backgroundColor = pallet.green;

				}
				
			} else {

				point.column.style.backgroundColor = resolveColor(this.options.bar.color);

			}

		}


		for (const [index, elems] of Object.entries(this.vAxis.elements)) {

			elems.label.style.color = getContrastColor(this.options.chart.color);

			if (elems.majorLine != null) {

				elems.majorLine.style.backgroundColor = getContrastColor(this.options.chart.color);
			
			}

			if (elems.minorLine != null) {

				elems.minorLine.style.backgroundColor = getContrastColor(this.options.chart.color);

			}

		}


		for (const [index, elements] of Object.entries(this.chart.elements)) {

			// if (!elements.bar.label) continue;
			if (this.options.labels.color === 'match') {

				// let realInside = true;
				
				// if (this.options.labels.position == 'inside' && barHeight * value < label.offsetHeight) realInside = false;	
				// if (chartAreaHeight - (barHeight * value) >= label.offsetHeight) realInside = false;			

				// if (realInside) {

					// elements.bar.label.style.color = getContrastColor(this.options.chart.color);

				// } else {

				// 	label.style.color = getContrastColor(resolveColor(this.options.chart.color));

				// }
			
			}

		}

		this.chartContainer.style.backgroundColor = resolveColor(this.options.chart.color);
		this.chart.title.style.color = getContrastColor(this.options.chart.color);

	}

	_addRemoveSeriesElems() {

		/**
		 * Update the DataPoints with new data, DataPoints will be created where they dont yet exist
		 */
		for (let i = 0; i < this.data.series.length; i++) {

			if (this.dataPoints[i]) {

				/**
				 * Update existing DataPoint at this index with new data
				 */
				this.dataPoints[i].index = i;
				this.dataPoints[i].value = this.data.series[i][1];
				this.dataPoints[i].name = this.data.series[i][0];

			} else {

				/**
				 * Create new DataPoint
				 */
				this.dataPoints[i] = new DataPoint(i, this.data.series[i][1], this.data.series[i][0], this.options);

			}

		}

		/**
		 * Remove any DataPoints that are beyond the current data set length.
		 * This will happen when a new data set is loaded that is smaller in length than the old data set
		 */
		for (let i = Object.values(this.dataPoints).length + 1; i >= this.data.series.length; i--) {

			if (!this.dataPoints[i]) continue;

			this.dataPoints[i]._destroy();
			this.dataPoints[i] = null;

			delete this.dataPoints[i];

		}

		/**
		 * Add in event listeners & insert into DOM
		 */
		for (const point of Object.values(this.dataPoints)) {
			
			point.column.onmouseover = () => {
			
				this._showToolTip(point.index);
				
				/**
				 * Reinsert the column into the column area, this will force it to the top of the other elements.
				 */
				this.chart.barArea.appendChild(point.column);
			
			}
			point.column.onmouseout = () => {

				this._hideToolTip();

			}

			point.column.onclick = () => this.options.bar.onClick(point);

			/**
			 * Append elements to DOM
			 */
			if (point.columnLabel != null) this.chart.labelArea.appendChild(point.columnLabel);
			this.chart.barArea.appendChild(point.column);
			this.hAxis.area.appendChild(point.axisLabel);

		}
		

		const t = this;
		const sE = ObjectLength(t.chart.elements);
		const sL = this.data.series.length;

		if (sE < sL) {

			for (let i = 0; i < sL - sE; i++) {

				const index = i + sE;

				t.chart.elements[index] = {
					value: 0,
					text: '',
					name: '',
					label: t._createBarLabel(),
				}
				if (t.chart.elements[index].label != null) {
					t.chart.labelArea.appendChild(t.chart.elements[index].label);
				}

			}

		} else if (sE > sL) {
			
			for (let i = 0; i < sE - sL; i++) {

				const index = i + sL;
				const barLabel = t.chart.elements[index].label;

				if (barLabel != null) {
					barLabel.style.opacity = 0;
					barLabel.style.left = '100%';
				}

				setTimeout(function() {
					if (barLabel != null) {
						barLabel.remove();
					}
				}, 1000);

				delete t.chart.elements[index];
				delete t.hAxis.elements[index];

			}

		}

		for (let i = 0; i < t.data.series.length; i++) {
			
			t.chart.elements[i].name = t.data.series[i][0];
			t.chart.elements[i].value = t.data.series[i][1];
			t.chart.elements[i].text = formatLabel(t.data.series[i][1], t.options.vAxis.format, t.data.max);
			
			if (t.chart.elements[i].label != null) {
			
				t.chart.elements[i].label.textContent = t.chart.elements[i].text;
			
			}

		}

	}

	_createVAxis() {

		const t = this;
		const aE = ObjectLength(t.vAxis.elements);

		let scale;
		let vAxisWidth = 0;
		let axisMin = 0;

		t._setMax();

		if (t.options.vAxis.min == 'auto') {
			axisMin = this.data.min;
		} else {
			axisMin = t.options.vAxis.min
		}

		if (t.vAxis.baseLine == null) {

			let major = document.createElement('div');
				major.className = 'cragColumnAxisLineMajor';
				major.style.bottom = 0 + 'px';
				major.style.right = 0 + 'px';
				// major.style.backgroundColor = getContrastColor(this.options.chart.color);
				
			if (major != null) t.chart.gridArea.appendChild(major);
		
			t.vAxis.baseLine = major;
		}

		if (t.vAxis.baseValue == null) {

			var label = document.createElement('span');
				label.className = 'cragColumnVAxisLabel';
				label.textContent = '0';
				label.style.bottom = 0 + 'px';
				// label.style.color = getContrastColor(this.options.chart.color);
			t.vAxis.area.appendChild(label);
			t.vAxis.baseValue = label;
		
		}

		if (t.options.vAxis.format == 'time') {

			let timeRounding;

			if (t.data.max < 60) {
				timeRounding = 60
			} else if (t.data.max < 3600) {
				timeRounding = 3600;
			} else if (t.data.max < 43200) {
				timeRounding = 43200;
			} else {
				timeRounding = 86400;
			}

			scale = calculateScale(axisMin, t.data.max, timeRounding);

		} else {

			scale = calculateScale(axisMin, t.data.max, 10);

		}

		t.vAxis.max = scale.max;
		t.vAxis.min = scale.min;

		if (scale.steps > aE) {

			let x = scale.steps - aE;

			for (let i = 0; i < x; i++) {

				let b = i + aE;
				let major = null;
				let minor = null;

				if (t.options.vAxis.lines) {

					major = document.createElement('div');
					major.className = 'cragColumnAxisLineMajor';
					major.style.bottom = '100%';
					major.style.right = 0 + 'px';
					// major.style.backgroundColor = getContrastColor(this.options.chart.color);

					if (t.options.chart.minorLines) {
						minor = document.createElement('div');
						minor.className = 'cragColumnAxisLineMinor';
						minor.style.bottom = '100%';
						// minor.style.backgroundColor = getContrastColor(this.options.chart.color);
					}
				}

				var label = document.createElement('span');
					label.className = 'cragColumnVAxisLabel';
					label.style.bottom = '100%';
					label.textContent = '0';
					// label.style.color = getContrastColor(this.options.chart.color);

				t.vAxis.elements[b] = {
					majorLine: major,
					minorLine: minor,
					label: label
				};

				if (major != null) {
					t.chart.gridArea.appendChild(major);
				}
				if (minor != null) {
					t.chart.gridArea.appendChild(minor);
				}

				t.vAxis.area.appendChild(label);

			}

		} else if (scale.steps < aE) {

			let x = aE - scale.steps;

			for (let i = 0; i < x; i++) {

				let b = i + scale.steps;

				let major = t.vAxis.elements[b].majorLine;
				let minor = t.vAxis.elements[b].minorLine;
				let label = t.vAxis.elements[b].label;

				label.style.opacity = 0;
				label.style.bottom = '100%';

				if (major != null) {
					major.style.opacity = 0;
					major.style.bottom = '100%';
				}

				if (minor != null) {
					minor.style.opacity = 0;
					minor.style.bottom = '100%';
				}

				setTimeout(function() {
					label.remove();
					if (major != null) {
						major.remove();
					}
					if (minor != null) {
						minor.remove();
					}
				}, 700);

				delete t.vAxis.elements[b];

			}

		}

		t.vAxis.baseValue.textContent = formatLabel(scale.min, t.options.vAxis.format, t.data.max);
		t.vAxis.baseValue.style.bottom = t.hAxis.area.offsetHeight - (t.vAxis.baseValue.offsetHeight / 2) + 'px';

		const vAxisMajorLineHeight = (t.vAxis.area.offsetHeight - t.hAxis.area.offsetHeight - t.chart.titleArea.offsetHeight) * (scale.maj / (scale.max - scale.min));
		const vAxisMinorLineHeight = vAxisMajorLineHeight / 2;

		if (t.vAxis.min >= 0) {

			t.vAxis.baseLine.style.opacity = "1";
			t.vAxis.baseLine.style.height = "2px";
	
		} else {
	
			t.vAxis.baseLine.style.opacity = "";
			t.vAxis.baseLine.style.height = "";
	
		}

		for (const [index, elems] of Object.entries(t.vAxis.elements)) {

			let majorLineHeight = (vAxisMajorLineHeight * (parseInt(index) + 1));
			let minorLineHeight = majorLineHeight - vAxisMinorLineHeight;

			// elems.label.style.color = getContrastColor(this.options.chart.color);
			elems.label.style.bottom = majorLineHeight + t.hAxis.area.offsetHeight - (elems.label.offsetHeight / 2) + 'px';
			elems.label.textContent = formatLabel((scale.maj * (parseInt(index) + 1)) + scale.min, t.options.vAxis.format, t.data.max);

			if (elems.majorLine != null) {

				// elems.majorLine.style.backgroundColor = getContrastColor(this.options.chart.color);
				elems.majorLine.style.bottom = majorLineHeight - elems.majorLine.offsetHeight + 'px';

				if ((scale.maj * (parseInt(index) + 1) + scale.min) == 0) {

					elems.majorLine.style.height = "2px";
					elems.majorLine.style.opacity = "1";

				} else {

					elems.majorLine.style.height = "";
					elems.majorLine.style.opacity = "";

				}
			
			}

			if (elems.minorLine != null) {

				// elems.minorLine.style.backgroundColor = getContrastColor(this.options.chart.color);
				elems.minorLine.style.bottom = minorLineHeight - elems.minorLine.offsetHeight + 'px';

			}

			if (elems.label.offsetWidth > vAxisWidth) {

				vAxisWidth = elems.label.offsetWidth;

			}

		}

		return vAxisWidth + 2;

	}

	_createBar() {

		const bar = document.createElement('div');
		const option = this.options.bar;

		bar.className = 'cragColumnBar';

		if (option.rounded) bar.classList.add('cragColumnBarRound');
		if (option.inset) bar.classList.add('cragColumnBarInset');
		if (option.striped) bar.classList.add('cragColumnBarStriped');
		if (option.animated) bar.classList.add('cragColumnBarStripedAnimate');

		return bar;

	}

	_createLabel() {

		const label = document.createElement('span');
		label.className = 'cragColumnHAxisLabel';
		return label;

	}

	_createBarLabel() {

		if (this.options.labels.position != 'none') {
			const label = document.createElement('span');
			label.className = 'cragColumnBarLabel';
			// if (this.options.labels.color !== 'match') {
			// 	label.style.color = pallet[this.options.labels.color];
			// }
			return label;
		} else {
			return null;
		}

	}

	_showToolTip(index) {

		this.toolTip.title.textContent = this.data.series[index][0];
		this.toolTip.label.textContent = this.options.vAxis.label;
		this.toolTip.value.textContent = this.chart.elements[index].text;

		const chartHeight = this.chart.area.offsetHeight;
		const chartWidth = this.chart.area.offsetWidth;

		const barLeft = parseFloat(this.dataPoints[index].column.style.left.replace('px', ''));
		const barWidth = this.dataPoints[index].column.offsetWidth;
		const barHeight = this.dataPoints[index].column.offsetHeight;

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

		if (hAlignment == 0) {
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

		this.toolTip.container.style.opacity = 1;

		if (hAlignment == 1) {
			this.toolTip.container.style.left = barLeft + barWidth + 8 + 'px';
		} else if (hAlignment == -1) {
			this.toolTip.container.style.left = barLeft - tipWidth - 8 + 'px';
		} else {
			this.toolTip.container.style.left = barLeft + (barWidth / 2) - (tipWidth / 2) + 'px';
		}

		if (vAlignment == 0) {
			this.toolTip.container.style.bottom = barHeight - tipHeight + 'px';
		} else if (vAlignment == -1) {
			this.toolTip.container.style.opacity = 0.9;
			this.toolTip.container.style.bottom = chartHeight - tipHeight - 8 + 'px';
		} else {
			this.toolTip.container.style.bottom = barHeight + 8 + 'px';
		}

		this.chart.labelArea.style.opacity = 0.3;

		for (const point of Object.values(this.dataPoints)) {
			point.column.style.opacity = 0.3;
		}
		this.dataPoints[index].column.style.opacity = 1;

	}

	_hideToolTip() {

		this.toolTip.container.style.opacity = 0;

		for (const point of Object.values(this.dataPoints)) {
			point.column.style.opacity = 1;
		}

		this.chart.labelArea.style.opacity = 1;

	}

	_setMax() {

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
			this.chart.title.className = 'cragComboTitleText';
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

		this.draw();

	}

}