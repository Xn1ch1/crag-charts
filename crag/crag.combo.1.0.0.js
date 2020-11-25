class CragCombo {

	constructor (options) {

		this.data = {
			series: options.series,
			max: [0, 0],
			min: [0, 0]
		};

		this.options = {
			bar: {
				width: 100,
				color: 'multi',
				rounded: false,
				inset: false,
				stripe: false,
				animated: false
			},
			line: {
				color: 'darkgrey',
				width: 2,
				pointSize: 4,
				smooth: true
			},
			vAxes: {
				0: {
					label: 'Series 1',
					lines: true,
					format: 'number',
					min: 0
				},
				1: {
					label: 'Series 2',
					lines: false,
					format: 'number',
					min: 0
				}
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
			pointArea: null,
			elements: {}
		}

		this.seriesLine =  {
			line: null,
			points: [[0, 0]]
		}

		this.vAxis = {
			area: [null, null],
			elements: [{}, {}],
			max: [0, 0],
		}

		this.vAxes = {
			0: {
				area: null,
				elements: {},
				baseValue: null,
				baseLine: null,
				max: 0,
				min: 0
			},
			1: {
				area: null,
				elements: {},
				baseValue: null,
				max: 0,
				min: 0
			}
		}

		this.title = {
			area: null,
			title: null
		}

		this.hAxis = {
			area: null,
			elements: {}
		}

		this.toolTip = {
			container: null,
			title: null,
			labels: [null, null],
			values: [null, null]
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

			}


			if (options.labels != undefined) {

				if (options.labels.position != undefined && ['inside', 'outside', 'none'].indexOf(options.labels.position) >= 0) {
					this.options.labels.position = options.labels.position;
				}
				if (options.labels.color != undefined && pallet.hasOwnProperty(options.labels.color)) {
					this.options.labels.color = options.labels.color;
				}

			}

			if (options.line != undefined) {

				const option = options.line;

				if (option.color != undefined && pallet.hasOwnProperty(option.color)) {
					this.options.line.color = option.color;
				}
				if (option.smooth != undefined && typeof option.smooth === 'boolean') {
					this.options.line.smooth = option.smooth;
				}
				if (option.width != undefined && option.width >= 0 && option.width < 51) {
					this.options.line.width = option.width;
				}
				if (option.pointSize != undefined && option.pointSize >= 0 && option.pointSize < 51) {
					this.options.line.pointSize = option.pointSize;
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

			if (options.vAxes != undefined) {
				if (options.vAxes[0] != undefined) {

					const option = options.vAxes[0];

					if (option.label != undefined) {
						this.options.vAxes[0].label = option.label;
					}
					if (option.lines != undefined && typeof option.lines === 'boolean') {
						this.options.vAxes[0].lines = option.lines;
					}
					if (option.format != undefined && ['number', 'decimal', 'time'].indexOf(option.format) >= 0) {
						this.options.vAxes[0].format = option.format;
					}
					if (option.min != undefined && (option.min == 'auto' || !isNaN(option.min))) {
						this.options.vAxes[0].min = option.min;
					}

				}
				if (options.vAxes[1] != undefined) {

					const option = options.vAxes[1];

					if (option.label != undefined) {
						this.options.vAxes[1].label = option.label;
					}
					if (option.lines != undefined && typeof option.lines === 'boolean') {
						this.options.vAxes[1].lines = option.lines;
					}
					if (option.format != undefined && ['number', 'decimal', 'time'].indexOf(option.format) >= 0) {
						this.options.vAxes[1].format = option.format;
					}
					if (option.min != undefined && (option.min == 'auto' || !isNaN(option.min))) {
						this.options.vAxes[1].min = option.min;
					}

				}
			}

		}

	}

	create(e) {

		if (e == undefined) return;

		this.parent = document.getElementById(e);

		this.chartContainer = document.createElement('div');
		this.vAxes[0].area = document.createElement('div');
		this.vAxes[1].area = document.createElement('div');
		this.hAxis.area = document.createElement('div');
		this.title.area = document.createElement('div');
		this.chart.area = document.createElement('div');
		this.chart.gridArea = document.createElement('div');
		this.chart.barArea = document.createElement('div');
		this.chart.labelArea = document.createElement('div');
		this.toolTip.container = document.createElement('div');
		this.toolTip.title = document.createElement('h6');
		this.toolTip.values[0] = document.createElement('h6');
		this.toolTip.values[1] = document.createElement('h6');
		this.toolTip.labels[0] = document.createElement('h6');
		this.toolTip.labels[1] = document.createElement('h6');

		this.chart.pointArea = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.seriesLine.line = this._createLine();

		if (this.options.chart.title != null) {
			this.title.title = document.createElement('h1');
			this.title.title.className = 'cragComboTitleText';
			this.title.title.textContent = this.options.chart.title;
			this.title.area.appendChild(this.title.title);
		}

		this.chartContainer.className = 'cragComboChartContainer';
		this.vAxes[0].area.className = 'cragComboVAxis';
		this.vAxes[1].area.className = 'cragComboVAxis2';
		this.hAxis.area.className = 'cragComboHAxis';
		this.title.area.className = 'cragComboTitle';
		this.chart.area.className = 'cragComboChartArea';
		this.chart.gridArea.className = 'cragComboCharSubArea';
		this.chart.labelArea.className = 'cragComboCharSubArea';
		this.chart.barArea.className = 'cragComboCharSubArea';
		this.toolTip.container.className = 'cragComboToolTip';
		this.toolTip.title.className = 'cragComboToolTipTitle';
		this.toolTip.values[0].className = 'cragComboToolTipValue';
		this.toolTip.values[1].className = 'cragComboToolTipValue';
		this.toolTip.labels[0].className = 'cragComboToolTipLabel';
		this.toolTip.labels[1].className = 'cragComboToolTipLabel';

		this.toolTip.labels[0].textContent = this.options.vAxes[0].label;

		this.chart.pointArea.setAttribute('width', '100%');
		this.chart.pointArea.setAttribute('height', '100%');
		this.chart.pointArea.style.position = 'absolute';
		this.chart.pointArea.appendChild(this.seriesLine.line);

		this.chart.gridArea.style.pointerEvents = 'none';
		this.chart.gridArea.style.overflow = 'visible';
		this.chart.labelArea.style.pointerEvents = 'none';
		this.chart.pointArea.style.pointerEvents = 'none';
		this.toolTip.container.style.backgroundColor = pallet.darkgrey;
		this.chartContainer.style.backgroundColor = pallet[this.options.chart.color];

		this.parent.appendChild(this.chartContainer);
		this.chartContainer.appendChild(this.vAxes[0].area);
		this.chartContainer.appendChild(this.title.area);
		this.chartContainer.appendChild(this.hAxis.area);
		this.chartContainer.appendChild(this.chart.area);
		this.chartContainer.appendChild(this.vAxes[1].area);
		this.chart.area.appendChild(this.chart.gridArea);
		this.chart.area.appendChild(this.chart.barArea);
		this.chart.area.appendChild(this.chart.pointArea);
		this.chart.area.appendChild(this.chart.labelArea);
		this.chart.area.appendChild(this.toolTip.container);
		this.toolTip.container.appendChild(this.toolTip.title);
		this.toolTip.container.appendChild(this.toolTip.labels[0]);
		this.toolTip.container.appendChild(this.toolTip.values[0]);
		this.toolTip.container.appendChild(this.toolTip.labels[1]);
		this.toolTip.container.appendChild(this.toolTip.values[1]);

		setTimeout(this.draw.bind(this), 500);

		return this;

	}

	draw() {

		const t = this;

		t._addRemoveSeriesElems();

		let vAxisWidth = [0, 0]

		vAxisWidth[0] = t._createVAxis(0);
		vAxisWidth[1] = t._createVAxis(1);

		const chartAreaWidth = t.chartContainer.offsetWidth - vAxisWidth[0] - vAxisWidth[1];
		const chartAreaHeight = t.chart.area.offsetHeight;
		const seriesItemWidth = chartAreaWidth / t.data.series.length;
		const barWidth = seriesItemWidth * (t.options.bar.width / 100);
		const gapWidth = seriesItemWidth - barWidth;
		const barMin = t.options.vAxes[0].min == 'auto' ? t.vAxes[0].min : t.options.vAxes[0].min;
		const pointMin = t.options.vAxes[1].min == 'auto' ? t.vAxes[1].min : t.options.vAxes[1].min;
		const barHeight = chartAreaHeight / (t.vAxes[0].max - barMin);
		const pointHeight = chartAreaHeight / (t.vAxes[1].max - pointMin);

		let seriesLinePoints = [];

		t.vAxes[0].area.style.width = vAxisWidth[0] + 'px';
		t.vAxes[1].area.style.width = vAxisWidth[1] + 'px';

		for (const [index, elements] of Object.entries(t.hAxis.elements)) {

			elements.label.style.width = seriesItemWidth + 'px';
			elements.label.style.left = seriesItemWidth * index;
			elements.label.style.color = pallet[getContrastYIQ(this.chartContainer.style.backgroundColor)];

		}

		for (const [index, elements] of Object.entries(t.chart.elements)) {

			let realInside = true;

			const label = elements.label;
			const value = elements.val;
			const secondaryValue = elements.secondaryVal;
			const bar = elements.bar;
			const point = elements.point;
			const pointCX = Math.round((seriesItemWidth * index) + (seriesItemWidth / 2));
			const pointCY = pointHeight * (secondaryValue - pointMin);

			if (t.options.labels.position != 'none') {

				label.style.width = 'auto';

				if (label.offsetWidth > seriesItemWidth) {
					label.style.opacity = 0;
				} else {
					label.style.opacity = 1;
				}

				label.style.left = seriesItemWidth * index;

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
						label.style.color = getContrastYIQ(pallet.key(index));
					} else {
						label.style.color = getContrastYIQ(pallet[t.options.chart.color]);
					}
				}

			}

			bar.style.width = barWidth + 'px';
			bar.style.height = barHeight * (value - barMin) + 'px';
			bar.style.left = (seriesItemWidth * index) + (gapWidth / 2);

			seriesLinePoints.push([pointCX, chartAreaHeight - pointCY]);

			point.setAttribute('cx', pointCX);
			point.setAttribute('transform', 'translate(0, -' + Math.max(pointCY, 0) + ')');

		}

		t._animateLineChange(seriesLinePoints);

	}

	_animateLineChange(newPoints) {

		const t = this;

		let smoothing = 0;
		let i = 0;
		let last = [];

		if (t.options.line.smooth) {
			smoothing = 0.125;
		}

		const line = (pointA, pointB) => {
			const lengthX = pointB[0] - pointA[0]
			const lengthY = pointB[1] - pointA[1]
			return {
				length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
				angle: Math.atan2(lengthY, lengthX)
			}
		}

		const controlPoint = (current, previous, next, reverse) => {
			const p = previous || current
			const n = next || current
			const o = line(p, n)
			const angle = o.angle + (reverse ? Math.PI : 0)
			const length = o.length * smoothing
			const x = current[0] + Math.cos(angle) * length
			const y = current[1] + Math.sin(angle) * length
			return [x, y]
		}

		const bezierCommand = (point, i, a) => {
			const cps = controlPoint(a[i - 1], a[i - 2], point)
			const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
			return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
		}

		const svgPath = (points, command) => {
			const d = points.reduce((acc, point, i, a) => i === 0
				? `M ${point[0]},${point[1]}`
				: `${acc} ${command(point, i, a)}`
			, '')
			return d;
		}

		if (newPoints.length > this.seriesLine.points.length) {

			const d = this.seriesLine.points;
			last = d[d.length - 1];

			for (i = d.length; i < newPoints.length; i++) {
				d.push(last);
			}
			this.seriesLine.line.setAttribute('d', svgPath(d, bezierCommand));

			setTimeout(function() {
				t.seriesLine.line.setAttribute('d', svgPath(newPoints, bezierCommand));
			}, 50);

		} else if (this.seriesLine.points.length > newPoints.length) {

			const d = newPoints.slice();
			last = d[newPoints.length - 1];
			for (i = newPoints.length; i < this.seriesLine.points.length; i++) {
				d[i] = last;
			}
			this.seriesLine.line.setAttribute('d', svgPath(d, bezierCommand));

			setTimeout(function() {
				t.seriesLine.line.setAttribute('d', svgPath(newPoints, bezierCommand));
			}, 800);

		} else {

			setTimeout(function() {
				t.seriesLine.line.setAttribute('d', svgPath(newPoints, bezierCommand));
			}, 50);

		}

		this.seriesLine.points = newPoints;

	}

	_addRemoveSeriesElems() {

		const t = this;
		const sE = ObjectLength(t.chart.elements);
		const sL = this.data.series.length;

		if (sE < sL) {
			for (let i = 0; i < sL - sE; i++) {

				const index = i + sE;

				t.chart.elements[index] = {
					val: 0,
					secondaryVal: 0,
					text: '',
					secondaryText: '',
					bar: t._createBar(),
					label: t._createBarLabel(),
					point: t._createPoint()
				}

				if (t.options.bar.color == 'multi') {
					t.chart.elements[index].bar.style.backgroundColor = pallet.key(index);
				} else {
					t.chart.elements[index].bar.style.backgroundColor = pallet[t.options.bar.color];
				}

				t.chart.elements[index].bar.addEventListener('mouseover', function() {
					t._showToolTip(index);
					t.chart.barArea.appendChild(this);
				});
				t.chart.elements[index].bar.addEventListener('mouseout', function() {
					t._hideToolTip(index);
				});

				t.hAxis.elements[index] = {
					text: '',
					label: t._createLabel()
				}

				if (t.chart.elements[index].label != null) {
					t.chart.labelArea.appendChild(t.chart.elements[index].label);
				}

				t.chart.barArea.appendChild(t.chart.elements[index].bar);
				t.chart.pointArea.appendChild(t.chart.elements[index].point);
				t.hAxis.area.appendChild(t.hAxis.elements[index].label);

			}

		} else if (sE > sL) {
			for (let i = 0; i < sE - sL; i++) {

				const index = i + sL;
				const bar = t.chart.elements[index].bar;
				const point = t.chart.elements[index].point;
				const barLabel = t.chart.elements[index].label;
				const cragComboHAxisLabel = t.hAxis.elements[index].label;

				bar.style.left = 'calc(100% + ' + parseInt(bar.style.width.replace('px', '')) * i + 'px)';

				point.setAttribute('cx', 'calc(105% + ' + parseInt(bar.style.width.replace('px', '')) * i + 'px)');

				cragComboHAxisLabel.style.opacity = 0;
				cragComboHAxisLabel.style.left = '100%';

				if (barLabel != null) {
					barLabel.style.opacity = 0;
					barLabel.style.left = '100%';
				}

				setTimeout(function() {
					bar.remove();
					point.remove();
					cragComboHAxisLabel.remove();
					if (barLabel != null) {
						barLabel.remove();
					}
				}, 1000);

				delete t.chart.elements[index];
				delete t.hAxis.elements[index];

			}

		}

		for (let i = 0; i < t.data.series.length; i++) {
			t.chart.elements[i].secondaryVal = t.data.series[i][2];
			t.chart.elements[i].val = t.data.series[i][1];
			t.chart.elements[i].text = formatLabel(t.data.series[i][1], t.options.vAxes[0].format, t.data.max[0]);
			t.chart.elements[i].secondaryText = formatLabel(t.data.series[i][2], t.options.vAxes[1].format, t.data.max[1]);
			t.hAxis.elements[i].label.textContent = t.data.series[i][0];
			t.hAxis.elements[i].text = t.data.series[i][0];
			if (t.chart.elements[i].label != null) {
				t.chart.elements[i].label.textContent = t.chart.elements[i].text;
				t.hAxis.elements[i].label.textContent = t.data.series[i][0];
			}
		}

	}

	_createVAxis(axis) {

		const t = this;
		const aE = ObjectLength(t.vAxes[axis].elements);

		let scale;
		let vAxisWidth = 0;
		let axisMin = 0;

		t._setMax();

		if (t.options.vAxes[axis].min == 'auto') {
			axisMin = this.data.min[axis];
		} else {
			axisMin = t.options.vAxes[axis].min
		}

		if (t.vAxes[axis].baseLine == null) {
			let major = document.createElement('div');
				major.className = 'cragComboAxisLineMajor';
				major.style.bottom = 0;
				major.style.right = 0;
				major.style.backgroundColor = pallet[getContrastYIQ(this.chartContainer.style.backgroundColor)]
			if (major != null) {
				t.chart.gridArea.appendChild(major);
			}
			t.vAxes[axis].baseLine = major;
		}

		if (t.vAxes[axis].baseValue == null) {
			var label = document.createElement('span');
				label.className = 'cragComboVAxisLabel' + axis;
				label.textContent = '0';
				label.style.bottom = 0;
				label.style.color = pallet[getContrastYIQ(this.chartContainer.style.backgroundColor)];
			t.vAxes[axis].area.appendChild(label);
			t.vAxes[axis].baseValue = label;
		}

		if (t.options.vAxes[axis].format == 'time') {

			let timeRounding;

			if (t.data.max[axis] < 60) {
				timeRounding = 60
			} else if (t.data.max[axis] < 3600) {
				timeRounding = 3600;
			} else if (t.data.max[axis] < 43200) {
				timeRounding = 43200;
			} else {
				timeRounding = 86400;
			}

			scale = calculateScale(axisMin, t.data.max[axis], timeRounding);

		} else {

			scale = calculateScale(axisMin, t.data.max[axis], 10);

		}

		t.vAxes[axis].max = scale.max;
		t.vAxes[axis].min = scale.min;

		if (scale.steps > aE) {

			let x = scale.steps - aE;

			for (let i = 0; i < x; i++) {

				let b = i + aE;
				let major = null;
				let minor = null;

				if (t.options.vAxes[axis].lines) {
					major = document.createElement('div');
					major.className = 'cragComboAxisLineMajor';
					major.style.bottom = '100%';
					major.style.right = 0;
					major.style.backgroundColor = pallet[getContrastYIQ(this.chartContainer.style.backgroundColor)];

					if (t.options.chart.minorLines) {
						minor = document.createElement('div');
						minor.className = 'cragComboAxisLineMinor';
						minor.style.bottom = '100%';
						minor.style.backgroundColor = pallet[getContrastYIQ(this.chartContainer.style.backgroundColor)];
					}
				}

				var label = document.createElement('span');
					label.className = 'cragComboVAxisLabel' + axis;
					label.style.bottom = '100%';
					label.textContent = '0';
					label.style.color = pallet[getContrastYIQ(this.chartContainer.style.backgroundColor)];

				t.vAxes[axis].elements[b] = {
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

				t.vAxes[axis].area.appendChild(label);

			}

		} else if (scale.steps < aE) {

			let x = aE - scale.steps;

			for (let i = 0; i < x; i++) {

				let b = i + scale.steps;

				let major = t.vAxes[axis].elements[b].majorLine;
				let minor = t.vAxes[axis].elements[b].minorLine;
				let label = t.vAxes[axis].elements[b].label;

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

				delete t.vAxes[axis].elements[b];

			}

		}

		t.vAxes[axis].baseValue.textContent = formatLabel(scale.min, t.options.vAxes[axis].format, t.data.max[axis]);;
		t.vAxes[axis].baseValue.style.bottom = t.hAxis.area.offsetHeight - (t.vAxes[axis].baseValue.offsetHeight / 2);

		const vAxisMajorLineHeight = (t.vAxes[axis].area.offsetHeight - t.hAxis.area.offsetHeight - t.title.area.offsetHeight) * (scale.maj / (scale.max - scale.min));
		const vAxisMinorLineHeight = vAxisMajorLineHeight / 2;

		for (const [index, elems] of Object.entries(t.vAxes[axis].elements)) {

			let majorLineHeight = (vAxisMajorLineHeight * (parseInt(index) + 1));
			let minorLineHeight = majorLineHeight - vAxisMinorLineHeight;

			elems.label.style.bottom = majorLineHeight + t.hAxis.area.offsetHeight - (elems.label.offsetHeight / 2);
			elems.label.textContent = formatLabel((scale.maj * (parseInt(index) + 1)) + scale.min, t.options.vAxes[axis].format, t.data.max[axis]);

			if (elems.majorLine != null) {
				elems.majorLine.style.bottom = majorLineHeight - elems.majorLine.offsetHeight;
			}
			if (elems.minorLine != null) {
				elems.minorLine.style.bottom = minorLineHeight - elems.minorLine.offsetHeight;
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

		bar.className = 'cragComboBar';

		if (option.rounded) bar.classList.add('cragComboBarRound');
		if (option.inset) bar.classList.add('cragComboBarInset');
		if (option.striped) bar.classList.add('cragComboBarStriped');
		if (option.animated) bar.classList.add('cragComboBarStripedAnimate');

		return bar;

	}

	_createPoint() {

		const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		circle.setAttribute('cx', '100%');
		circle.setAttribute('cy', '100%');
		circle.setAttribute('fill', pallet[this.options.line.color]);
		circle.setAttribute('r', this.options.line.pointSize);
		circle.setAttribute('class', 'cragComboPoint');

		return circle;

	}

	_createLine() {

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('fill', 'none');
		path.setAttribute('stroke', pallet[this.options.line.color]);
		path.setAttribute('stroke-width', this.options.line.width);
		path.setAttribute('class', 'cragComboLine');
		path.setAttribute('d', 'M0,0');

		return path;

	}

	_createLabel() {

		const label = document.createElement('span');
		label.className = 'cragComboHAxisLabel';
		return label;

	}

	_createBarLabel() {

		if (this.options.labels.position != 'none') {
			const label = document.createElement('span');
			label.className = 'cragComboBarLabel';
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
		this.toolTip.labels[0].textContent = this.options.vAxes[0].label;
		this.toolTip.values[0].textContent = this.chart.elements[index].text;
		this.toolTip.values[0].textContent = this.chart.elements[index].text;

		this.toolTip.labels[1].textContent = this.options.vAxes[1].label;
		this.toolTip.values[1].textContent = formatLabel(this.data.series[index][2], this.options.vAxes[1].format, this.data.max[1]);

		const chartHeight = this.chart.area.offsetHeight;
		const chartWidth = this.chart.area.offsetWidth;

		const barLeft = parseFloat(this.chart.elements[index].bar.style.left.replace('px', ''));
		const barWidth = this.chart.elements[index].bar.offsetWidth;
		const barHeight = this.chart.elements[index].bar.offsetHeight;

		const pointHeight = parseInt(this.chart.elements[index].point.getAttribute('transform').replace('translate(0, -', '').replace(')', ''));

		const tipHeight = this.toolTip.container.offsetHeight;
		const tipWidth = this.toolTip.container.offsetWidth;

		this.chart.elements[index].bar.style.backgroundColor = pallet.darkgrey;

		if (pointHeight < barHeight) {
			this.chart.elements[index].point.style.fill = pallet[getContrastYIQ(this.chart.elements[index].bar.style.backgroundColor)];
		} else {
			this.chart.elements[index].point.style.fill = pallet[getContrastYIQ(this.chartContainer.style.backgroundColor)];
		}

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
			this.toolTip.container.style.left = barLeft + barWidth + 8;
		} else if (hAlignment == -1) {
			this.toolTip.container.style.left = barLeft - tipWidth - 8;
		} else {
			this.toolTip.container.style.left = barLeft + (barWidth / 2) - (tipWidth / 2);
		}

		if (vAlignment == 0) {
			this.toolTip.container.style.bottom = barHeight - tipHeight;
		} else if (vAlignment == -1) {
			this.toolTip.container.style.opacity = 0.9;
			this.toolTip.container.style.bottom = chartHeight - tipHeight - 8;
		} else {
			this.toolTip.container.style.bottom = barHeight + 8;
		}

	}

	_hideToolTip(index) {

		this.toolTip.container.style.opacity = 0;

		if (this.options.bar.color == 'multi') {
			this.chart.elements[index].bar.style.backgroundColor = pallet.key(index);
		} else {
			this.chart.elements[index].bar.style.backgroundColor = pallet[this.options.bar.color];
		}
		this.chart.elements[index].point.style.fill = pallet[this.options.line.color];

	}

	_setMax() {

		this.data.max[0] = 0;
		this.data.max[1] = 0;

		for (let i = 0; i < this.data.series.length; i++) {
			if (this.data.series[i][1] > this.data.max[0]) {
				this.data.max[0] = this.data.series[i][1];
			}
			if (this.data.series[i][2] > this.data.max[1]) {
				this.data.max[1] = this.data.series[i][2];
			}
		}

		this.data.min[0] = this.data.max[0];
		this.data.min[1] = this.data.max[1];

		for (let i = 0; i < this.data.series.length; i++) {
			if (this.data.series[i][1] < this.data.min[0]) {
				this.data.min[0] = this.data.series[i][1];
			}
			if (this.data.series[i][2] < this.data.min[1]) {
				this.data.min[1] = this.data.series[i][2];
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

}