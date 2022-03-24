class CragPie extends CragCore {

	constructor (data, options) {
		super();

		this.data = data;

		this.options = {
			chart: {
				title: null,
				color: 'white',
			},
			wedges: {
				colors: null,
			},
			pie: {
				gap: 0.008,
				hole: 0,
				highToLow: true,
				palletOffset: 0,
			},
			key: {
				show: true,
				position: 'right',
			}
		};

		this.chart = {
			parent: null,
			container: null,
			area: null,
			titleArea: null,
			labelArea: null,
			leftKey: null,
			rightKey: null,
			bottomKey: null,
			title: null,
			elements: {}
		};

		this.toolTip = {
			container: null,
			title: null,
			label: null,
			value: null
		};

		this.dataLimit = 12;
		this.animationSpeed = 400;

		this.keyHoverActive = false;
		this.keyHoverDelay = null;
		this.stoppedOn = null;
		this.showingWedge = null;
		this.toolTipVisible = false;

		this.options.chart.title = this.validateOption(options?.chart?.title, 'string', this.options.chart.title);
		if (this._isValidColor(options?.chart?.color)) this.options.chart.color = options.chart.color;

		this.options.pie.hole = this.validateOption(options?.pie?.hole, 'number', this.options.pie.hole);
		this.options.pie.palletOffset = this.validateOption(options?.pie?.palletOffset, 'number', this.options.pie.palletOffset);
		this.options.pie.highToLow = this.validateOption(options?.pie?.highToLow, 'boolean', this.options.pie.highToLow);

		// Apply data sort before truncating
		if (this.options.pie.highToLow) this._sortData();
		if (this.data.length > this.dataLimit) this.data = this.data.slice(0, this.dataLimit);

	}

	create(e) {

		if (e == undefined) return;

		this.chart.parent = document.getElementById(e);

		this.chart.container = document.createElement('div');
		this.chart.area = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.chart.labelArea = document.createElement('div');
		this.chart.leftKey = document.createElement('div');
		this.chart.rightKey = document.createElement('div');
		this.chart.bottomKey = document.createElement('div');
		this.toolTip.container = document.createElement('div');
		this.toolTip.title = document.createElement('h6');
		this.toolTip.value = document.createElement('h6');
		this.toolTip.label = document.createElement('h6');

		this.chart.area.setAttribute('viewBox', '-1 -1 2 2');

		// Hide Tooltip on mousemove in document
		document.addEventListener('mousemove', () => {

			if (this.showingWedge !== null) {

				clearTimeout(this.stoppedMoving);
				this._hideToolTip(this.showingWedge);
				this.toolTipVisible = false;

			}

			clearTimeout(this.stoppedMoving);

			this.stoppedMoving = setTimeout(() => {

				if (this.stoppedOn != null) {

					this._showToolTip(this.stoppedOn);
					this.toolTipVisible = true;

				}

			}, 400);

		});

		this.chart.area.setAttribute('class', 'cragPieChart');
		this.chart.container.className = 'cragPieChartContainer';
		this.chart.labelArea.className = 'cragPieLabels';
		this.chart.leftKey.className = 'cragPieLeftKey';
		this.chart.rightKey.className = 'cragPieRightKey';
		this.chart.bottomKey.className = 'cragPieBottomKey';
		this.toolTip.container.className = 'cragPieToolTip';
		this.toolTip.title.className = 'cragPieToolTipTitle';
		this.toolTip.value.className = 'cragPieToolTipValue';
		this.toolTip.label.className = 'cragPieToolTipLabel';

		this.chart.parent.appendChild(this.chart.container);
		this.chart.container.appendChild(this.chart.labelArea);
		this.chart.container.appendChild(this.chart.area);
		this.chart.container.appendChild(this.chart.leftKey);
		this.chart.container.appendChild(this.chart.rightKey);
		this.chart.container.appendChild(this.chart.bottomKey);

		this.chart.labelArea.appendChild(this.toolTip.container);
		this.toolTip.container.appendChild(this.toolTip.title);
		this.toolTip.container.appendChild(this.toolTip.label);
		this.toolTip.container.appendChild(this.toolTip.value);

		this.title = new Title(this);

		setTimeout(this.draw.bind(this), 500);

		return this;

	}

	draw() {

		this._addRemoveSeriesElems();

		let maxKeyLen = 0;
		let maxLabelLen = 0;
		let cumulativeValue = 0;

		this.chart.container.style.backgroundColor = this._resolveColor(this.options.chart.color);

		if (this.options.pie.hole == '0') {

			this.toolTip.title.style.color = this._resolveColor(this.options.chart.color);
			this.toolTip.value.style.color = this._resolveColor(this.options.chart.color);
			this.toolTip.label.style.color = this._resolveColor(this.options.chart.color);

		} else {

			this.toolTip.title.style.color = this._getContrastColor(this.options.chart.color);
			this.toolTip.value.style.color = this._getContrastColor(this.options.chart.color);
			this.toolTip.label.style.color = this._getContrastColor(this.options.chart.color);

		}

		for (const [_, elements] of Object.entries(this.chart.elements)) {

			elements.key.label.textContent = elements.name;
			elements.key.label.style.opacity = 1;

			elements.key.key.style.top = (28 * _) + (this.chart.leftKey.offsetHeight / 2 - ((28 * ObjectLength(this.chart.elements)) / 2)) + 'px';
			elements.key.key.style.opacity = '1';

			if (elements.key.key.offsetWidth > maxKeyLen) {
				maxKeyLen = elements.key.key.offsetWidth;
			}

			if (elements.label.offsetWidth > maxLabelLen) {
				maxLabelLen = elements.label.offsetWidth;
			}

		}

		this.chart.rightKey.style.width = maxKeyLen + 8 + 'px';
		let chartAreaWidth = this.chart.container.offsetWidth - maxKeyLen - 16 - this.chart.leftKey.offsetWidth;
		let chartAreaHeight = this.chart.container.offsetHeight - this.title.area.offsetHeight - this.chart.bottomKey.offsetHeight;

		const radius = Math.min(chartAreaHeight, chartAreaWidth);

		// setTimeout(function() {

		for (const [_, element] of Object.entries(this.chart.elements)) {

			element.wedge.setAttribute('fill', this._getColorByMode('multi', parseInt(_) + this.options.pie.palletOffset));
			element.wedge.setAttribute('stroke',  this._resolveColor(this.options.chart.color));

			element.key.marker.style.opacity = 1;

			element.key.marker.style.backgroundColor = this._getColorByMode('multi', parseInt(_) + this.options.pie.palletOffset);

			this._animateSector(
				element.degrees.start,
				element.degrees.end,
				element.degrees.oldStart,
				element.degrees.oldEnd,
				element.wedge,
				this.animationSpeed,
				this.options.pie.hole,
				1);

			element.degrees.oldEnd = element.degrees.end;
			element.degrees.oldStart = element.degrees.start;

			cumulativeValue += element.val;

			const mid = ((element.degrees.end / 2) + element.degrees.start / 2) - 90;
			const coords = this._polarToCartesian(mid, (radius / 2) - (maxLabelLen));

			element.label.style.top = coords.y + (chartAreaHeight / 2) - (element.label.offsetHeight / 2) +  'px';
			element.label.style.left = coords.x + (chartAreaWidth / 2) - (element.label.offsetWidth / 2) +  'px';

			element.label.style.color = this._resolveColor(this.options.chart.color);

			if (element.percentage < 2) {
				element.label.style.opacity = '0';
			} else {
				element.label.style.opacity = '1';
			}

		}

		// }.bind(this), 0);

	}

	_addRemoveSeriesElems() {

		const total = this.total;
		const self = this;
		const sE = ObjectLength(this.chart.elements);
		const sL = this.data.length;

		let sum = 0;

		if (sE < sL) {
			for (let i = 0; i < sL - sE; i++) {

				const index = i + sE;

				this.chart.elements[index] = {
					val: 0,
					text: '',
					name: '',
					percentage: 0,
					wedge: this._createWedge(),
					key: this._createKey(),
					label: this._createLabel(),
					degrees: {
						total: 0,
						start: 0,
						end: 0,
						oldStart: 360,
						oldEnd: 360
					}
				}

				const wedge = this.chart.elements[index].wedge;
				const key = this.chart.elements[index].key;

				wedge.addEventListener('mouseover', function() {
					self.stoppedOn = index;
				});
				wedge.addEventListener('mouseout', function() {
					self.stoppedOn = null;
				});
				key.key.addEventListener('mouseover', function() {
					clearTimeout(self.keyHoverDelay);
					self.keyHoverActive = false;
					self.keyHoverDelay = setTimeout(function() {
						self.keyHoverActive = true;
						self._showToolTip(index);
					}, 250);
				});
				key.key.addEventListener('mouseout', function() {
					if (self.keyHoverActive) {
						self._hideToolTip(index);
					}
					clearTimeout(self.keyHoverDelay);
					self.keyHoverActive = false;
				});

			}

		} else if (sE > sL) {
			for (let i = 0; i < sE - sL; i++) {

				const index = i + sL;
				const degrees = this.chart.elements[index].degrees;
				const wedge = this.chart.elements[index].wedge;
				const label = this.chart.elements[index].label;
				const key = this.chart.elements[index].key;

				setTimeout(function() {
					this._animateSector(360, 360, degrees.start, degrees.end, wedge, this.animationSpeed, this.options.pie.hole, 1);
				}.bind(this), 50);

				key.key.style.opacity = '0';

				label.style.opacity = '0';

				setTimeout(function() {
					wedge.remove();
					key.key.remove();
					label.remove();
				}, this.animationSpeed + 50);

				delete this.chart.elements[index];

			}

		}

		for (const [index, element] of Object.entries(this.chart.elements)) {

			element.name = this.data[index][0];
			element.val = this.data[index][1];
			element.text = formatLabel(this.data[index][1]);

			element.degrees.total = 360 / total * element.val;
			element.degrees.start = 360 / total * sum;
			element.degrees.end = 360 / total * (sum + element.val);

			element.label.textContent = (100 / total * element.val).toFixed(0) + '%';

			element.key.label.style.color = this._getContrastColor(this.options.chart.color);

			element.percentage = 100 / total * element.val;

			sum += element.val;

		}
	}

	_polarToCartesian(angleInDegrees, radius) {

		let angleInRadians = (angleInDegrees) * Math.PI / 180.0;

		return {
			x: (radius * Math.cos(angleInRadians)),
			y: (radius * Math.sin(angleInRadians))
		};
	}

	_describeArc(startAngle, endAngle, insideRadius, outsideRadius) {

		let start = this._polarToCartesian(endAngle, outsideRadius);
		let end = this._polarToCartesian(startAngle, outsideRadius);
		let startInside = this._polarToCartesian(endAngle, insideRadius);
		let endInside = this._polarToCartesian(startAngle, insideRadius);

		let arcSweep = endAngle - startAngle <= 180 ? 0 : 1;

		let d = [
			"M", start.x, start.y,
			"A", outsideRadius, outsideRadius, 0, arcSweep, 0, end.x, end.y,
			"L", endInside.x, endInside.y,
			"A", insideRadius, insideRadius, 0, arcSweep, 1, startInside.x, startInside.y,
			"L", start.x, start.y
		].join(" ");

		return d;
	}

	_easeInOutSin(t) {
		return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
	}

	_animateSector(startNew, endNew, startCurrent, endCurrent, element, duration, inner, outer) {

		let self = this;

		startNew -= 90;
		endNew -= 90;
		startCurrent -= 90;
		endCurrent -= 90;

		let startTime = performance.now();

		function doAnimationStep() {

			let progressEase = self._easeInOutSin(Math.min((performance.now() - startTime) / duration, 1));
			let startStep = startCurrent + progressEase * (startNew - startCurrent);
			let endStep = endCurrent + progressEase * (endNew - endCurrent);

			let arc = self._describeArc(startStep, endStep, inner, outer);

			element.setAttribute('d', arc);

			if (progressEase < 1) requestAnimationFrame(doAnimationStep);

		}

		requestAnimationFrame(doAnimationStep);

	}

	_createLabel() {

		const label = document.createElement('span');

		label.classList.add('cragPieLabel');
		label.style.opacity = '0';
		label.textContent = '0';

		label.style.top =  label.offsetHeight / 2 +  'px';
		label.style.left = (this.chart.labelArea.offsetWidth / 2) + (label.offsetWidth / 2) +  'px';

		this.chart.labelArea.appendChild(label);

		return label;

	}

	_createWedge() {

		const wedge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		const arc = this._describeArc(0, 0, this.options.pie.gap, 1);

		wedge.classList = 'cragPieWedge';
		wedge.setAttribute("d", arc);
		wedge.setAttribute('stroke-width', this.options.pie.gap);

		this.chart.area.insertChildAtIndex(wedge, 0);

		return wedge;

	}

	_createKey() {

		const parent = document.createElement('div');
		const marker = document.createElement('div');
		const label = document.createElement('span');

		parent.classList.add('cragPieKey');
		marker.classList.add('cragPieKeyMarker');
		label.classList.add('cragPieKeyLabel');

		parent.appendChild(label);
		parent.appendChild(marker);

		this.chart.rightKey.appendChild(parent);

		return {'key': parent, 'marker': marker, 'label': label};

	}

	_showToolTip(i) {

		for (const [index, element] of Object.entries(this.chart.elements)) {

			element.wedge.style.opacity = '0.3';
			element.key.key.style.opacity = '0.1';
			element.label.style.opacity = '0';

			if (index == i) {

				element.key.key.style.opacity = '1';
				element.wedge.style.opacity = '0.8';
				element.label.style.opacity = '0';

				this.toolTip.title.textContent = element.name;
				this.toolTip.label.textContent = element.percentage.toFixed(2) + '%';
				this.toolTip.value.textContent = element.text;
				this.toolTip.container.style.opacity = '1';

				this.chart.area.appendChild(element.wedge);

				this._animateSector(
					0.001,
					360,
					element.degrees.oldStart,
					element.degrees.oldEnd,
					element.wedge,
					this.animationSpeed / 2,
					0,
					1);

				this.showingWedge = i;

				setTimeout(function() {

					element.wedge.classList.add('cragPieWedgeHover');

					if (this.options.pie.hole === 0) element.wedge.style.transform = 'scale(1.05)';


				}.bind(this), 0);

			}

		}

	}

	_hideToolTip(i) {

		this.toolTip.container.style.opacity = 0;

		this.showingWedge = null;

		for (const [index, element] of Object.entries(this.chart.elements)) {

			element.wedge.style.opacity = '1';
			element.key.key.style.opacity = '1';

			if (element.percentage < 2) {
				element.label.style.opacity = '0';
			} else {
				element.label.style.opacity = '1';
			}

			if (index == i) {

				element.wedge.classList.remove('cragPieWedgeHover');

				if (this.options.pie.hole == 0) element.wedge.style.transform = 'scale(1)';

				element.label.style.background = '';

				this._animateSector(element.degrees.start, element.degrees.end, 0.001, 360, element.wedge, this.animationSpeed / 2, this.options.pie.hole, 1);

			}

		}

	}

	_sortData() {

		this.data = this.data.sort(sortFunction);

		function sortFunction(a, b) {
			if (a[1] === b[1]) {
				return 0;
			}
			else {
				return (a[1] > b[1]) ? -1 : 1;
			}
		}

	}

	update(data) {

		if (data.length > this.dataLimit) {
			data = data.slice(0, this.dataLimit);
		}

		this.data = data;

		if (this.options.pie.highToLow) {
			this._sortData();
		}

		this.draw();

	}

	get total() {

		let value = 0;

		for (let i = 0; i < this.data.length; i++) {
			value += this.data[i][1];
		}

		return value;

	}

	/**
	 * @param {any} value
	 */
	set color(value) {

		if (this._isValidColor(value)) this.options.chart.color = value;

		if (this._getContrastColor(this.options.chart.color) === this.pallet.white) {

			this.options.pie.palletOffset = 6;

		} else {

			this.options.pie.palletOffset = 0;

		}

		this.draw();

	}

}