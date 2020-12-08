class CragPie {

	constructor (options) {

		this.data = options.data;

		this.options = {
			chart: {
				title: null,
				color: 'white'
			},
			pie: {
				gap: 0.008,
				hole: 0,
				highToLow: true
			},
			key: {
				show: true,
				position: 'right'
			}
		}
;
		this.parent = null;
		this.chartContainer = null;

		this.chart = {
			area: null,
			titleArea: null,
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
		this.palletOffset = 0;
		this.animationSpeed = 500;

		if (this.data.length > this.dataLimit) {
			this.data = this.data.slice(0, this.dataLimit);
		}

		if (this.options.pie.highToLow) {
			this._sortData();
		}

		if (options != undefined) {

			if (options.chart != undefined) {

				const option = options.chart;

				if (option.title != undefined) {
					this.options.chart.title = option.title;
				}
				if (option.color != undefined && pallet.hasOwnProperty(option.color)) {
					this.options.chart.color = option.color;
				}

			}

			if (options.pie != undefined) {

				const option = options.pie;

				if (option.gap != undefined && option.gap > -1 && option.gap < 6) {
					this.options.pie.gap = option.gap * 0.004;
				}
				if (option.hole != undefined && option.hole > -1 && option.hole < 100) {
					this.options.pie.hole = option.hole / 100;
				}

			}

		}

	}

	create(e) {

		if (e == undefined) return;

		this.parent = document.getElementById(e);

		this.chartContainer = document.createElement('div');
		this.chart.area = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.chart.titleArea = document.createElement('div');
		this.chart.leftKey = document.createElement('div');
		this.chart.rightKey = document.createElement('div');
		this.chart.bottomKey = document.createElement('div');
		this.toolTip.container = document.createElement('div');
		this.toolTip.title = document.createElement('h6');
		this.toolTip.value = document.createElement('h6');
		this.toolTip.label = document.createElement('h6');

		this.chart.area.setAttribute('viewBox', '-1 -1 2 2');

		this.chart.area.setAttribute('width', '100%');
		this.chart.area.setAttribute('height', '100%');

		this.chartContainer.style.backgroundColor = pallet[this.options.chart.color];

		if (this.options.chart.title != null) {
			this.chart.title = document.createElement('h1');
			this.chart.title.className = 'cragPieTitleText';
			this.chart.title.textContent = this.options.chart.title;
			this.chart.titleArea.appendChild(this.chart.title);
			this.chart.title.style.color = getContrastColor(this.options.chart.color);
		}

		this.chartContainer.className = 'cragPieChartContainer';
		this.chart.area.setAttribute('class', 'cragPieChart');
		this.chart.titleArea.className = 'cragPieTitle';
		this.chart.leftKey.className = 'cragPieLeftKey';
		this.chart.rightKey.className = 'cragPieRightKey';
		this.chart.bottomKey.className = 'cragPieBottomKey';
		this.toolTip.container.className = 'cragPieToolTip';
		this.toolTip.title.className = 'cragPieToolTipTitle';
		this.toolTip.value.className = 'cragPieToolTipValue';
		this.toolTip.label.className = 'cragPieToolTipLabel';

		this.parent.appendChild(this.chartContainer);
		this.chartContainer.appendChild(this.chart.titleArea);
		this.chartContainer.appendChild(this.chart.area);
		this.chartContainer.appendChild(this.chart.leftKey);
		this.chartContainer.appendChild(this.chart.rightKey);
		this.chartContainer.appendChild(this.chart.bottomKey);

		this.parent.appendChild(this.toolTip.container);
		this.toolTip.container.appendChild(this.toolTip.title);
		this.toolTip.container.appendChild(this.toolTip.label);
		this.toolTip.container.appendChild(this.toolTip.value);

		setTimeout(this.draw.bind(this), 500);

		return this;

	}

	draw() {

		const t = this;

		const total = t.total;
		const outsideOffset = (t.options.pie.gap) / 25;
		const insideOffset = (t.options.pie.hole == 0) ? 0 :  outsideOffset / t.options.pie.hole;

		t._addRemoveSeriesElems();

		let maxLen = 0;
		let i = 0;

		for (const [index, elements] of Object.entries(t.chart.elements)) {

			elements.key.label.textContent = elements.name;

			elements.key.key.style.top = (28 * i++) + (t.chart.leftKey.offsetHeight / 2 - ((28 * ObjectLength(t.chart.elements)) / 2)) + 'px';

			if (elements.key.key.offsetWidth > maxLen) {
				maxLen = elements.key.key.offsetWidth;
			}

		}

		t.chart.rightKey.style.width = maxLen + 8 + 'px';

		let sum = 0;

		setTimeout(function() {

			let cumulativeValue = 0;
			let color = t.palletOffset;

			for (const [index, elements] of Object.entries(t.chart.elements)) {

				elements.wedge.setAttribute('fill', pallet.key(color));
				elements.key.marker.style.backgroundColor = pallet.key(color++);

				t._animateSector(elements.degrees.start - 90, elements.degrees.end - 90, t.animationSpeed, elements.wedge, elements.degrees.oldStart - 90, elements.degrees.oldEnd - 90);

				elements.degrees.oldEnd = elements.degrees.end;
				elements.degrees.oldStart = elements.degrees.start;

				cumulativeValue += elements.val;

			}

		}, 50);

	}

	_addRemoveSeriesElems() {

		const t = this;
		const sE = ObjectLength(t.chart.elements);
		const sL = this.data.length;

		if (sE < sL) {
			for (let i = 0; i < sL - sE; i++) {

				const index = i + sE;

				t.chart.elements[index] = {
					val: 0,
					text: '',
					name: '',
					wedge: t._createWedge(),
					key: t._createKey(),
					degrees: {
						total: 0,
						start: 0,
						end: 0,
						oldStart: 360,
						oldEnd: 360
					}
				}

				let arc = t._describeArc(0, 0, t.options.pie.gap, 1);

				t.chart.elements[index].wedge.setAttribute("d", arc);
				t.chart.elements[index].wedge.setAttribute('stroke',  pallet[t.options.chart.color]);
				t.chart.elements[index].wedge.setAttribute('stroke-width', t.options.pie.gap);
				t.chart.elements[index].wedge.classList = 'cragPieWedge';
				t.chart.elements[index].wedge.addEventListener('mouseover', function() {
					t._showToolTip(index);
				});
				t.chart.elements[index].wedge.addEventListener('mouseout', function() {
					t._hideToolTip(index);
				});
				t.chart.elements[index].key.marker.addEventListener('mouseover', function() {
					t._showToolTip(index);
				});
				t.chart.elements[index].key.marker.addEventListener('mouseout', function() {
					t._hideToolTip(index);
				});

				t.chart.elements[index].key.key.style.opacity = 1;
				t.chart.elements[index].key.label.style.opacity = 1;

				t.chart.rightKey.appendChild(t.chart.elements[index].key.key);
				t.chart.area.insertChildAtIndex(t.chart.elements[index].wedge, 0);

			}

		} else if (sE > sL) {
			for (let i = 0; i < sE - sL; i++) {

				const index = i + sL;
				const wedge = t.chart.elements[index].wedge;
				const key = t.chart.elements[index].key;
				const degrees = t.chart.elements[index].degrees;


				setTimeout(function() {
					t._animateSector(270, 270, t.animationSpeed, wedge, degrees.start - 90, degrees.end - 90);
				}, 50);

				key.key.style.opacity = 0;

				setTimeout(function() {
					wedge.remove();
					key.key.remove();
				}, t.animationSpeed + 50);

				delete t.chart.elements[index];

			}

		}

		let sum = 0;
		const total = t.total;

		for (let i = 0; i < t.data.length; i++) {
			t.chart.elements[i].name = t.data[i][0];
			t.chart.elements[i].val = t.data[i][1];
			t.chart.elements[i].text = formatLabel(t.data[i][1]);
			t.chart.elements[i].degrees.total = 360 / total * t.chart.elements[i].val;
			t.chart.elements[i].degrees.start = 360 / total * sum;
			t.chart.elements[i].degrees.end = 360 / total * (sum + t.chart.elements[i].val);
			sum += t.chart.elements[i].val;
		}
	}

	_polarToCartesian(angleInDegrees, radius) {

		let angleInRadians = (angleInDegrees) * Math.PI / 180.0;

		return {
		  x: 0 + (radius * Math.cos(angleInRadians)),
		  y: 0 + (radius * Math.sin(angleInRadians))
		};
	}

	_describeArc(startAngle, endAngle, insideRadius, outsideRadius) {

		let t = this;

		let start = t._polarToCartesian(endAngle, outsideRadius);
		let end = t._polarToCartesian(startAngle, outsideRadius);

		let startInside = t._polarToCartesian(endAngle, insideRadius);
		let endInside = t._polarToCartesian(startAngle, insideRadius);

		let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

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

	_animateSector(startAngle, endAngle, animationDuration, element, oldStart, oldEnd) {

		let t = this;

		let startTime = performance.now();

		function doAnimationStep() {

			let progress = Math.min((performance.now() - startTime) / animationDuration, 1.0);
			let p = t._easeInOutSin(progress);
		 	let sAngle = oldStart + p * (startAngle - oldStart);
			let eAngle = oldEnd + p * (endAngle - oldEnd);
			let arc = t._describeArc(sAngle, eAngle, t.options.pie.hole, 1);

			element.setAttribute("d", arc);

		 	if (progress < 1.0) requestAnimationFrame(doAnimationStep);

		}

		requestAnimationFrame(doAnimationStep);

	}

	_createWedge() {

		const wedge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		return wedge;

	}

	_createKey() {

		const parent = document.createElement('div');
		const marker = document.createElement('div');
		const label = document.createElement('span');

		parent.classList.add('cragPieKey');
		marker.classList.add('cragPieKeyMarker');
		label.classList.add('cragPieKeyLabel');

		parent.style.marginBottom = this.options.pie.gap * 1000 + 'px';
		parent.style.opacity = 0;
		label.style.opacity = 0;

		parent.appendChild(label);
		parent.appendChild(marker);

		return {'key': parent, 'marker': marker, 'label': label};

	}

	_createLabel() {

		const text =document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.setAttribute('class', 'cragPieWedgeLabel');
		return text;

	}

	_showToolTip(index) {

		// this.toolTip.title.textContent = this.data.series[index][0];
		// this.toolTip.label.textContent = this.options.vAxis.label;
		// this.toolTip.value.textContent = this.chart.elements[index].text;

		// this.toolTip.container.style.opacity = 1;

		for (const [index, elements] of Object.entries(this.chart.elements)) {
			elements.wedge.style.opacity = 0.4;
		}
		this.chart.elements[index].wedge.style.opacity = 1;
		this.chart.elements[index].wedge.classList.add('cragPieWedgeHover');

	}

	_hideToolTip() {

		// this.toolTip.container.style.opacity = 0;

		for (const [index, elements] of Object.entries(this.chart.elements)) {
			elements.wedge.style.opacity = 1;
			this.chart.elements[index].wedge.classList.remove('cragPieWedgeHover');
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