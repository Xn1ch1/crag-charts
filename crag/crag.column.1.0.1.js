class CragColumn {

	constructor (options) {

		this.data = {
			series: options.data,
			max: 0,
			min: 0
		};

		this.options = {
			bar: {
				width: 100,
				color: 'multi',
				rounded: false,
				inset: false,
				stripe: false,
				animated: false,
				onClick: null
			},
			vAxis: {
				label: 'Series',
				lines: true,
				format: 'number',
				min: 0
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
				if (option.color != undefined && pallet.hasOwnProperty(option.color)) {
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
				if (option.color != undefined && pallet.hasOwnProperty(option.color)) {
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

		this.chartContainer.style.backgroundColor = pallet[this.options.chart.color];

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

		return this;

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

		t.vAxis.area.style.width = vAxisWidth + 'px';

		for (const [index, elements] of Object.entries(t.hAxis.elements)) {

			elements.label.style.width = seriesItemWidth + 'px';
			elements.label.style.left = seriesItemWidth * index + 'px';
			elements.label.style.color = getContrastColor(this.options.chart.color);

		}

		t.toolTip.container.style.backgroundColor = getContrastColor(this.options.chart.color);
		t.toolTip.title.style.color = pallet[this.options.chart.color];
		t.toolTip.value.style.color = pallet[this.options.chart.color];
		t.toolTip.label.style.color = pallet[this.options.chart.color];

		for (const [index, elements] of Object.entries(t.chart.elements)) {

			let realInside = true;

			const label = elements.label;
			const value = elements.value;
			const bar = elements.bar;

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

				if (t.options.labels.color === 'match') {
					if (realInside) {
						label.style.color = getContrastColor(pallet.key(index));
					} else {
						label.style.color = getContrastColor(pallet[t.options.chart.color]);
					}
				}

			}

			bar.style.width = barWidth + 'px';
			bar.style.height = barHeight * (value - barMin) + 'px';
			bar.style.left = (seriesItemWidth * index) + (gapWidth / 2) + 'px';

		}

	}

	_addRemoveSeriesElems() {

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
					bar: t._createBar(),
					label: t._createBarLabel(),
				}

				if (t.options.bar.color == 'multi') {
					t.chart.elements[index].bar.style.backgroundColor = pallet.key(index);
				} else {
					t.chart.elements[index].bar.style.backgroundColor = pallet[t.options.bar.color];
				}

				if (t.options.bar.onClick != null) {
					t.chart.elements[index].bar.onclick = function() {
						t.options.bar.onClick(t.chart.elements[index]);
					}
				}

				t.chart.elements[index].bar.addEventListener('mouseover', function() {
					t._showToolTip(index);
					t.chart.barArea.appendChild(this);
				});
				t.chart.elements[index].bar.addEventListener('mouseout', function() {
					t._hideToolTip();
				});

				t.hAxis.elements[index] = {
					text: '',
					label: t._createLabel()
				}

				if (t.chart.elements[index].label != null) {
					t.chart.labelArea.appendChild(t.chart.elements[index].label);
				}

				t.chart.barArea.appendChild(t.chart.elements[index].bar);
				t.hAxis.area.appendChild(t.hAxis.elements[index].label);

			}

		} else if (sE > sL) {
			for (let i = 0; i < sE - sL; i++) {

				const index = i + sL;
				const bar = t.chart.elements[index].bar;
				const barLabel = t.chart.elements[index].label;
				const cragColumnHAxisLabel = t.hAxis.elements[index].label;

				bar.style.left = 'calc(100% + ' + parseInt(bar.style.width.replace('px', '')) * i + 'px)';

				cragColumnHAxisLabel.style.opacity = 0;
				cragColumnHAxisLabel.style.left = '100%';

				if (barLabel != null) {
					barLabel.style.opacity = 0;
					barLabel.style.left = '100%';
				}

				setTimeout(function() {
					bar.remove();
					cragColumnHAxisLabel.remove();
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
			t.hAxis.elements[i].label.textContent = t.data.series[i][0];
			t.hAxis.elements[i].text = t.data.series[i][0];
			if (t.chart.elements[i].label != null) {
				t.chart.elements[i].label.textContent = t.chart.elements[i].text;
				t.hAxis.elements[i].label.textContent = t.data.series[i][0];
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
				major.style.backgroundColor = getContrastColor(this.options.chart.color);
			if (major != null) {
				t.chart.gridArea.appendChild(major);
			}
			t.vAxis.baseLine = major;
		}

		if (t.vAxis.baseValue == null) {
			var label = document.createElement('span');
				label.className = 'cragColumnVAxisLabel';
				label.textContent = '0';
				label.style.bottom = 0 + 'px';
				label.style.color = getContrastColor(this.options.chart.color);
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
					major.style.backgroundColor = getContrastColor(this.options.chart.color);

					if (t.options.chart.minorLines) {
						minor = document.createElement('div');
						minor.className = 'cragColumnAxisLineMinor';
						minor.style.bottom = '100%';
						minor.style.backgroundColor = getContrastColor(this.options.chart.color);
					}
				}

				var label = document.createElement('span');
					label.className = 'cragColumnVAxisLabel';
					label.style.bottom = '100%';
					label.textContent = '0';
					label.style.color = getContrastColor(this.options.chart.color);

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

		for (const [index, elems] of Object.entries(t.vAxis.elements)) {

			let majorLineHeight = (vAxisMajorLineHeight * (parseInt(index) + 1));
			let minorLineHeight = majorLineHeight - vAxisMinorLineHeight;

			elems.label.style.bottom = majorLineHeight + t.hAxis.area.offsetHeight - (elems.label.offsetHeight / 2) + 'px';
			elems.label.textContent = formatLabel((scale.maj * (parseInt(index) + 1)) + scale.min, t.options.vAxis.format, t.data.max);

			if (elems.majorLine != null) {
				elems.majorLine.style.bottom = majorLineHeight - elems.majorLine.offsetHeight + 'px';
			}
			if (elems.minorLine != null) {
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
			if (this.options.labels.color !== 'match') {
				label.style.color = pallet[this.options.labels.color];
			}
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

		const barLeft = parseFloat(this.chart.elements[index].bar.style.left.replace('px', ''));
		const barWidth = this.chart.elements[index].bar.offsetWidth;
		const barHeight = this.chart.elements[index].bar.offsetHeight;

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

		for (const [index, elements] of Object.entries(this.chart.elements)) {
			elements.bar.style.opacity = 0.3;
		}
		this.chart.labelArea.style.opacity = 0.3;

		this.chart.elements[index].bar.style.opacity = 1;

	}

	_hideToolTip() {

		this.toolTip.container.style.opacity = 0;

		for (const [index, elements] of Object.entries(this.chart.elements)) {
			elements.bar.style.opacity = 1;
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

	update(data) {

		if (data.length > 20) {
			data = val.slice(0, 20);
		}

		this.data.series = data;

		this.draw();

	}

	/**
	 * @param {any} value
	 */
	set title(value) {

		let titleExists = true;

		if (this.chart.title == null) {

			titleExists = false;
			this.chart.title = document.createElement('h1');
			this.chart.title.className = 'cragComboTitleText';
			this.chart.title.style.color = getContrastColor(this.options.chart.color);
			this.chart.titleArea.appendChild(this.chart.title);

			this.options.chart.title = value;

		}

		this.title.textContent = this.options.chart.title;

		if (!titleExists) {
			this.draw();
		}


	}

}