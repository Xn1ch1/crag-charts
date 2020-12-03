class CragLine {

	constructor (options) {

		this.data = {
			series: options.data,
			max: 0,
			min: 0
		};

		this.options = {
			line: {
				color: 'indigo',
				width: 4,
				pointSize: 6,
				smooth: true
			},
			vAxis: {
				label: 'Series',
				lines: true,
				format: 'number',
				min: 0
			},
			labels: {
				show: true,
				color: null,
				shadow: false
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
			pointArea: null,
			elements: {}
		}

		this.seriesLine =  {
			line: null,
			points: [[0, 0]]
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
			label: null,
			value: null
		}

		if (this.data.series.length > 20) {
			this.data.series = this.data.series.slice(0, 20);
		}

		if (options != undefined) {

			if (options.labels != undefined) {

				const option = options.labels;

				if (option.show != undefined && typeof option.show === 'undefined') {
					this.options.labels.show = option.show;
				}
				if (option.color != undefined && pallet.hasOwnProperty(option.color)) {
					this.options.labels.color = option.color;
				}
				if (option.shadow != undefined && typeof option.shadow === 'boolean') {
					this.options.labels.shadow = option.shadow;
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
				if (option.width != undefined && option.width >= 1 && option.width < 21) {
					this.options.line.width = option.width;
				}
				if (option.pointSize != undefined && option.pointSize >= 0 && option.pointSize < 16) {
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
		this.title.area = document.createElement('div');
		this.chart.area = document.createElement('div');
		this.chart.gridArea = document.createElement('div');
		this.chart.labelArea = document.createElement('div');
		this.toolTip.container = document.createElement('div');
		this.toolTip.title = document.createElement('h6');
		this.toolTip.value = document.createElement('h6');
		this.toolTip.label = document.createElement('h6');

		this.chart.pointArea = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.seriesLine.line = this._createLine();

		if (this.options.chart.title != null) {
			this.title.title = document.createElement('h1');
			this.title.title.className = 'cragLineTitleText';
			this.title.title.textContent = this.options.chart.title;
			this.title.area.appendChild(this.title.title);
		}

		this.chartContainer.className = 'cragLineChartContainer';
		this.vAxis.area.className = 'cragLineVAxis';
		this.hAxis.area.className = 'cragLineHAxis';
		this.title.area.className = 'cragLineTitle';
		this.chart.area.className = 'cragLineChartArea';
		this.chart.gridArea.className = 'cragLineCharSubArea';
		this.chart.labelArea.className = 'cragLineCharSubArea';
		this.toolTip.container.className = 'cragLineToolTip';
		this.toolTip.title.className = 'cragLineToolTipTitle';
		this.toolTip.value.className = 'cragLineToolTipValue';
		this.toolTip.label.className = 'cragLineToolTipLabel';

		this.toolTip.label.textContent = this.options.vAxis.label;

		this.chart.pointArea.setAttribute('width', '100%');
		this.chart.pointArea.setAttribute('height', '100%');
		this.chart.pointArea.style.position = 'absolute';
		this.chart.pointArea.style.overflow = 'visible';
		this.chart.pointArea.appendChild(this.seriesLine.line);

		this.chart.gridArea.style.pointerEvents = 'none';
		this.chart.gridArea.style.overflow = 'visible';
		this.chart.labelArea.style.pointerEvents = 'none';

		this.chartContainer.style.backgroundColor = pallet[this.options.chart.color];

		this.parent.appendChild(this.chartContainer);
		this.chartContainer.appendChild(this.vAxis.area);
		this.chartContainer.appendChild(this.title.area);
		this.chartContainer.appendChild(this.hAxis.area);
		this.chartContainer.appendChild(this.chart.area);
		this.chart.area.appendChild(this.chart.gridArea);
		this.chart.area.appendChild(this.chart.pointArea);
		this.chart.area.appendChild(this.chart.labelArea);
		this.chart.area.appendChild(this.toolTip.container);
		this.toolTip.container.appendChild(this.toolTip.title);
		this.toolTip.container.appendChild(this.toolTip.value);
		this.toolTip.container.appendChild(this.toolTip.label);

		setTimeout(this.draw.bind(this), 500);

		return this;

	}

	draw() {

		const t = this;

		t._addRemoveSeriesElems();

		let vAxisWidth = t._createVAxis();

		const chartAreaWidth = t.chartContainer.offsetWidth - vAxisWidth;
		const chartAreaHeight = t.chart.area.offsetHeight;
		const seriesItemWidth = chartAreaWidth / t.data.series.length;
		const pointMin = t.options.vAxis.min == 'auto' ? t.vAxis.min : t.options.vAxis.min;
		const pointHeight = chartAreaHeight / (t.vAxis.max - pointMin);

		t.toolTip.container.style.backgroundColor = getContrastColor(this.options.chart.color);
		t.toolTip.title.style.color = pallet[this.options.chart.color];
		t.toolTip.value.style.color = pallet[this.options.chart.color];
		t.toolTip.label.style.color = pallet[this.options.chart.color];

		let seriesLinePoints = [];

		t.vAxis.area.style.width = vAxisWidth + 'px';

		for (const [index, elements] of Object.entries(t.hAxis.elements)) {

			elements.label.style.width = seriesItemWidth + 'px';
			elements.label.style.left = seriesItemWidth * index + 'px';
			elements.label.style.color = getContrastColor(this.options.chart.color);

		}

		for (const [index, elements] of Object.entries(t.chart.elements)) {

			const label = elements.label;
			const value = elements.val;
			const point = elements.point;
			const pointCX = Math.round((seriesItemWidth * index) + (seriesItemWidth / 2));
			const pointCY = pointHeight * (value - pointMin);

			if (t.options.labels.show) {

				if (label.offsetWidth > seriesItemWidth) {
					label.style.opacity = 0;
				} else {
					label.style.opacity = 0.9;
				}

				label.style.left = seriesItemWidth * index + 'px';
				label.style.marginLeft = (seriesItemWidth / 2) + 'px';

				if (pointCY + (t.options.line.pointSize * 4) + label.offsetHeight > chartAreaHeight) {
					label.style.bottom = pointCY - (t.options.line.pointSize * 6) + 'px';
				} else {
					label.style.bottom = pointCY + (t.options.line.pointSize * 4) + 'px';
				}

			}

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
					text: '',
					label: t._createPointLabel(),
					point: t._createPoint()
				}

				t.hAxis.elements[index] = {
					text: '',
					label: t._createLabel()
				}

				if (t.chart.elements[index].label != null) {
					t.chart.labelArea.appendChild(t.chart.elements[index].label);
				}

				t.chart.elements[index].point.addEventListener('mouseover', function() {
					t.chart.elements[index].point.setAttribute('r', t.options.line.pointSize * 2);
					t._showToolTip(index);
				});
				t.chart.elements[index].point.addEventListener('mouseout', function() {
					t.chart.elements[index].point.setAttribute('r', t.options.line.pointSize);
					t._hideToolTip(index);
				});

				t.chart.pointArea.appendChild(t.chart.elements[index].point);
				t.hAxis.area.appendChild(t.hAxis.elements[index].label);

			}

		} else if (sE > sL) {
			for (let i = 0; i < sE - sL; i++) {

				const index = i + sL;
				const point = t.chart.elements[index].point;
				const label = t.chart.elements[index].label;
				const cragLineHAxisLabel = t.hAxis.elements[index].label;

				point.setAttribute('cx', '105%');

				cragLineHAxisLabel.style.opacity = 0;
				cragLineHAxisLabel.style.left = '100%';

				if (label != null) {
					label.style.opacity = 0;
					label.style.left = '100%';
				}

				setTimeout(function() {
					point.remove();
					cragLineHAxisLabel.remove();
					if (label != null) {
						label.remove();
					}
				}, 1000);

				delete t.chart.elements[index];
				delete t.hAxis.elements[index];

			}

		}

		for (let i = 0; i < t.data.series.length; i++) {
			t.chart.elements[i].val = t.data.series[i][1];
			t.chart.elements[i].text = formatLabel(t.data.series[i][1], t.options.vAxis.format, t.data.max);
			t.hAxis.elements[i].label.textContent = t.data.series[i][0], t.options.vAxis.format, t.data.max;
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
				major.className = 'cragLineAxisLineMajor';
				major.style.bottom = 0 + 'px';
				major.style.right = 0 + 'px';
				major.style.backgroundColor = getContrastColor(this.options.chart.color);;
			if (major != null) {
				t.chart.gridArea.appendChild(major);
			}
			t.vAxis.baseLine = major;
		}

		if (t.vAxis.baseValue == null) {
			var label = document.createElement('span');
				label.className = 'cragLineVAxisLabel';
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
					major.className = 'cragLineAxisLineMajor';
					major.style.bottom = '100%';
					major.style.right = 0 + 'px';
					major.style.backgroundColor = getContrastColor(this.options.chart.color);

					if (t.options.chart.minorLines) {
						minor = document.createElement('div');
						minor.className = 'cragLineAxisLineMinor';
						minor.style.bottom = '100%';
						minor.style.backgroundColor = getContrastColor(this.options.chart.color);
					}
				}

				var label = document.createElement('span');
					label.className = 'cragLineVAxisLabel';
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

		t.vAxis.baseValue.textContent = formatLabel(scale.min, t.options.vAxis.format, t.data.max);;
		t.vAxis.baseValue.style.bottom = t.hAxis.area.offsetHeight - (t.vAxis.baseValue.offsetHeight / 2) + 'px';

		const vAxisMajorLineHeight = (t.vAxis.area.offsetHeight - t.hAxis.area.offsetHeight - t.title.area.offsetHeight) * (scale.maj / (scale.max - scale.min));
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

	_createPoint() {

		const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		circle.setAttribute('cx', '100%');
		circle.setAttribute('cy', '100%');
		circle.setAttribute('fill', pallet[this.options.line.color]);
		circle.setAttribute('r', this.options.line.pointSize);
		circle.setAttribute('class', 'cragLinePoint');

		return circle;

	}

	_createLine() {

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('fill', 'none');
		path.setAttribute('stroke', pallet[this.options.line.color]);
		path.setAttribute('stroke-width', this.options.line.width);
		path.setAttribute('class', 'cragLineLine');
		path.setAttribute('d', 'M0,0');

		return path;

	}

	_createLabel() {

		const label = document.createElement('span');
		label.className = 'cragLineHAxisLabel';
		return label;

	}

	_createPointLabel() {

		console.log(this.options);

		if (this.options.labels.position != 'none') {

			const label = document.createElement('span');

			label.className = 'cragLinePointLabel';
			label.style.backgroundColor = pallet[this.options.chart.color];

			console.log(label);

			if (this.options.labels.color != null) {
				label.style.color = pallet[this.options.labels.color];
			} else {
				label.style.color = getContrastColor(this.options.chart.color);
			}

			if (this.options.labels.shadow == true) {
				label.classList.add('cragLinePointLabelShadow');
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

		const pointHeight = parseInt(this.chart.elements[index].point.getAttribute('transform').replace('translate(0, -', '').replace(')', ''));
		const pointLeft = parseInt(this.chart.elements[index].point.getAttribute('cx'));
		const pointSize = this.options.line.pointSize * 2;

		const tipHeight = this.toolTip.container.offsetHeight;
		const tipWidth = this.toolTip.container.offsetWidth;

		let hAlignment = 0;
		let vAlignment = 0;

		if (chartWidth / 2 > pointLeft) {
			if (chartWidth - pointLeft - 8 > tipWidth) {
				hAlignment = 1;
			} else if (pointLeft - 8 > tipWidth) {
				hAlignment = -1;
			} else {
				hAlignment = 0;
			}
		} else {
			if (pointLeft - 8 > tipWidth) {
				hAlignment = -1;
			} else if (chartWidth - pointLeft - 8 > tipWidth) {
				hAlignment = 1;
			} else {
				hAlignment = 0;
			}
		}

		if (hAlignment == 0) {
			if (chartHeight - pointHeight - 8 > tipHeight) {
				vAlignment = 1;
			} else {
				vAlignment = -1;
			}
		} else {
			if (pointHeight < tipHeight) {
				vAlignment = 1;
			} else {
				vAlignment = 0;
			}
		}

		this.toolTip.container.style.opacity = 1;

		if (hAlignment == 1) {
			this.toolTip.container.style.left = pointLeft + 8 + pointSize + 'px';
		} else if (hAlignment == -1) {
			this.toolTip.container.style.left = pointLeft - tipWidth - 8 - pointSize + 'px';
		} else {
			this.toolTip.container.style.left = pointLeft - (tipWidth / 2) - (pointSize / 2) + 'px';
		}

		if (vAlignment == 0) {
			this.toolTip.container.style.bottom = pointHeight - tipHeight + 'px';
		} else if (vAlignment == -1) {
			this.toolTip.container.style.opacity = 0.9;
			this.toolTip.container.style.bottom = chartHeight - tipHeight - 8 + 'px';
		} else {
			this.toolTip.container.style.bottom = 8 + 'px';
		}

		for (const [index, elements] of Object.entries(this.chart.elements)) {
			elements.point.style.opacity = 0.3;
		}
		this.chart.elements[index].point.style.opacity = 1;
		this.seriesLine.line.style.opacity  = 0.3;

	}

	_hideToolTip(index) {

		this.toolTip.container.style.opacity = 0;
		for (const [index, elements] of Object.entries(this.chart.elements)) {
			elements.point.style.opacity = 1;
		}
		this.seriesLine.line.style.opacity  = 1;
		// this.chart.elements[index].point.style.fill = pallet[this.options.line.color];

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

}