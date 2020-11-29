class CragProgress {

	constructor(options) {

		this.data = {
			current: 0,
			target: 0,
			total: 100
		}

		this.options = {
			chart: {
				color: 'white',
				title: null
			},
			bar: {
				inset: false,
				striped: false,
				animated: false,
				corners: {
					topLeft: 25,
					topRight: 25,
					bottomRight: 25,
					bottomLeft: 25
				}
			},
			current: {
				value: 0,
				label: 'Current',
				color: 'blue',
				percentage: false,
				inside: false,
				show: true
			},
			total: {
				value: 100,
				label: 'Total',
				color: null,
				show: true
			},
			target: {
				value: 0,
				label: 'Target',
				color: null
			}
		}

		this.chart = {
			parent: null,
			area: null,
			bar: null,
			progress: null,
			title: null,
			titleMargin: 0,
			lines: {
				current: null,
				total: null,
				target: null
			},
			labels: {
				current: null,
				total: null,
				target: null
			},
			valueLabels: {
				current: null,
				total: null,
				target: null
			}
		}

		if (options.chart != undefined) {

			const option = options.chart;

			if (option.color != undefined && pallet.hasOwnProperty(option.color)) {
				this.options.chart.color = option.color;
			}
			if (option.title != undefined) {
				this.options.chart.title = option.title;
			}
		}

		if (options.bar != undefined) {

			const option = options.bar;

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

		if (options.current != undefined) {

			const option = options.current;

			if (option.value != undefined) {
				this.data.current = option.value;
			}
			if (option.label != undefined) {
				this.options.current.label = option.label;
			}
			if (option.color != undefined && pallet.hasOwnProperty(option.color)) {
				this.options.current.color = option.color;
			}
			if (option.percentage != undefined && typeof option.percentage === 'boolean') {
				this.options.current.percentage = option.percentage;
			}
			if (option.inside != undefined && typeof option.inside === 'boolean') {
				this.options.current.inside = option.inside;
			}
			if (option.show != undefined && typeof option.show === 'boolean') {
				this.options.current.show = option.show;
			}

		}

		if (options.target != undefined) {

			const option = options.target;

			if (option.value != undefined) {
				this.data.target = option.value;
			}
			if (option.label != undefined) {
				this.options.target.label = option.label;
			}
			if (option.color != undefined && pallet.hasOwnProperty(option.color)) {
				this.options.target.color = option.color;
			}

		}

		if (options.total != undefined) {

			const option = options.total;

			if (option.value != undefined) {
				this.data.total = option.value;
			}
			if (option.label != undefined) {
				this.options.total.label = option.label;
			}
			if (option.color != undefined && pallet.hasOwnProperty(option.color)) {
				this.options.total.color = option.color;
			}
			if (option.show != undefined && typeof option.show === 'boolean') {
				this.options.total.show = option.show;
			}

		}
		if (this.options.chart.title != null) {
			if (this.data.target == 0 && !this.options.total.show) {
				this.chart.titleMargin = 0;
			} else {
				this.chart.titleMargin = 20;
			}
		}

	}

	create(e) {

		if (e == undefined || document.getElementById(e) == undefined) {
			throw 'Invalid Parent Element: create() function requires string id of html doc element';
		}

		this.chart.parent = document.getElementById(e);
		this.chart.area = document.createElement('div');
		this.chart.bar = document.createElement('div');
		this.chart.progress = document.createElement('span');
		this.chart.lines.target = document.createElement('div');
		this.chart.lines.total = document.createElement('div');
		this.chart.labels.target = document.createElement('span');
		this.chart.valueLabels.target = document.createElement('span');
		this.chart.labels.total = document.createElement('span');
		this.chart.valueLabels.total = document.createElement('span');
		this.chart.title = document.createElement('h1');

		this.chart.parent.style.position = 'relative';

		// Chart Area
		this.chart.area.style.top = (this.chart.parent.offsetHeight / 2) - 125;
		this.chart.area.className = 'cragProgressArea';

		if (this.options.chart.title != null) {
			this.chart.title.textContent = this.options.chart.title;
		}

		this.chart.bar.style.top = 95 + this.chart.titleMargin;

		// Current
		if (this.options.current.show) {

			this.chart.lines.current = document.createElement('div');
			this.chart.labels.current = document.createElement('span');
			this.chart.valueLabels.current = document.createElement('span');

			if (this.options.current.inside) {
				this.chart.lines.current.style.display = 'none';
				this.chart.labels.current.style.display = 'none';
				this.chart.valueLabels.current.style.bottom = 116 - this.chart.titleMargin;
			} else {
				this.chart.lines.current.style.left = -5;
				this.chart.lines.current.style.bottom = 50 - this.chart.titleMargin;
				this.chart.labels.current.style.left = -100;
				this.chart.labels.current.style.bottom = 50 - this.chart.titleMargin;
				this.chart.valueLabels.current.style.bottom = 68 - this.chart.titleMargin;
			}

			this.chart.valueLabels.current.style.left = -100;
			this.chart.valueLabels.current.textContent = this.data.current;
			this.chart.labels.current.textContent = this.options.current.label;
			this.chart.valueLabels.current.className = 'cragProgressValueLabel';
			this.chart.labels.current.className = 'cragProgressLabel';
			this.chart.lines.current.className = 'cragProgressLine';

		}

		// Total
		if (this.options.total.show) {
			this.chart.lines.total.style.right = -4;
			this.chart.lines.total.style.top = 50 + this.chart.titleMargin;
			this.chart.labels.total.style.right = -100;
			this.chart.labels.total.style.top = 50 + this.chart.titleMargin;
			this.chart.valueLabels.total.style.right = -100;
			this.chart.valueLabels.total.style.top = 68 + this.chart.titleMargin;
			this.chart.labels.total.textContent = this.options.total.label;
			this.chart.valueLabels.total.textContent = this.data.total;
			this.chart.lines.total.className = 'cragProgressLine';
			this.chart.labels.total.className = 'cragProgressLabel';
			this.chart.valueLabels.total.className = 'cragProgressValueLabel';
		}

		// Target
		this.chart.lines.target.style.left = -5;
		this.chart.lines.target.style.top = 50 + this.chart.titleMargin;
		this.chart.labels.target.style.left = -100;
		this.chart.labels.target.style.top = 50 + this.chart.titleMargin;
		this.chart.valueLabels.target.style.left = -100;
		this.chart.valueLabels.target.style.top = 68 + this.chart.titleMargin;
		this.chart.labels.target.textContent = this.options.target.label;
		this.chart.valueLabels.target.textContent = this.data.target;
		this.chart.lines.target.className = 'cragProgressLine';
		this.chart.labels.target.className = 'cragProgressLabel';
		this.chart.valueLabels.target.className = 'cragProgressValueLabel';

		this._lineLarge(this.chart.lines.target);
		this._lineLarge(this.chart.lines.current);
		this._lineSmall(this.chart.lines.total);

		this.chart.bar.className = 'cragProgressBar';
		this.chart.progress.className = 'cragProgressProgress';
		this.chart.title.className = 'cragProgressTitle';

		if (this.options.bar.inset) {
			this.chart.progress.classList.add('cragProgressInsetProgress');
			this.chart.bar.classList.add('cragProgressInset');
		}
		if (this.options.bar.striped) this.chart.progress.classList.add('cragProgressStripe');
		if (this.options.bar.animated) this.chart.progress.classList.add('cragProgressStripeAnimate');

		// Colors
		this.chart.area.style.backgroundColor = pallet[this.options.chart.color];
		this.chart.title.style.color = pallet[getContrastYIQ(this.chart.area.style.backgroundColor)];
		this.chart.labels.target.style.color = pallet[getContrastYIQ(this.chart.area.style.backgroundColor)];
		this.chart.valueLabels.target.style.color = pallet[getContrastYIQ(this.chart.area.style.backgroundColor)];
		if (this.options.total.show) {
			this.chart.labels.total.style.color = pallet[getContrastYIQ(this.chart.area.style.backgroundColor)];
			this.chart.valueLabels.total.style.color = pallet[getContrastYIQ(this.chart.area.style.backgroundColor)];
		}
		if (this.options.current.show) {
			this.chart.labels.current.style.color = pallet[getContrastYIQ(this.chart.area.style.backgroundColor)];
			this.chart.valueLabels.current.style.color = pallet[getContrastYIQ(this.chart.area.style.backgroundColor)];
		}


		this.chart.parent.appendChild(this.chart.area);
		this.chart.bar.appendChild(this.chart.progress);
		this.chart.area.appendChild(this.chart.bar);
		this.chart.area.appendChild(this.chart.title);
		this.chart.area.appendChild(this.chart.labels.target);
		this.chart.area.appendChild(this.chart.valueLabels.target);
		this.chart.area.appendChild(this.chart.lines.target);

		if (this.options.current.show) {
			this.chart.area.appendChild(this.chart.labels.current);
			this.chart.area.appendChild(this.chart.valueLabels.current);
			this.chart.area.appendChild(this.chart.lines.current);
		}
		if (this.options.total.show) {
			this.chart.area.appendChild(this.chart.lines.total);
			this.chart.area.appendChild(this.chart.labels.total);
			this.chart.area.appendChild(this.chart.valueLabels.total);
		}

		setTimeout(this.draw.bind(this), 500);

		return this;

	}

	draw() {

		const t = this;

		const barWidth = t.chart.area.offsetWidth;
		const currentPosition = Math.round((barWidth / t.data.total) * t.data.current);
		const targetPosition = Math.round((barWidth / t.data.total) * t.data.target);

		// Current
		if (t.options.current.show) {

			if (t.options.current.percentage) {
				t.chart.valueLabels.current.textContent = formatLabel(t.data.current / t.data.total * 100) + '%';
			} else {
				t.chart.valueLabels.current.textContent = t.data.current;
			}

			if (currentPosition < Math.max(t.chart.labels.current.offsetWidth, t.chart.valueLabels.current.offsetWidth)) {
				t.chart.labels.current.style.left = currentPosition + 4;
				t.chart.valueLabels.current.style.left = currentPosition + 4;
			} else {
				if (t.data.total == t.data.current) {
					t.chart.labels.current.style.left = currentPosition - t.chart.labels.current.offsetWidth - 4;
					t.chart.valueLabels.current.style.left = currentPosition - t.chart.valueLabels.current.offsetWidth - 4;
				} else {
					let offset = 4;
					if (!t.options.current.inside) {
						offset = 0;
					}
					t.chart.labels.current.style.left = currentPosition - t.chart.labels.current.offsetWidth + offset;
					t.chart.valueLabels.current.style.left = currentPosition - t.chart.valueLabels.current.offsetWidth + offset;
				}
			}

			if (t.data.current == 0) {

				t.chart.lines.current.style.left = 'calc(0%)';
				t._lineSmall(t.chart.lines.current);

			} else {
				if (t.data.current == t.data.total) {

					t._lineSmall(t.chart.lines.current);
					t.chart.lines.current.style.left = 'calc(100% - 4px)';

					if (t.options.bar.animated) {
						t.chart.progress.classList.remove('cragProgressStripeAnimate');
					}

				} else {

					t._lineLarge(t.chart.lines.current);
					t.chart.lines.current.style.left = currentPosition + 'px';

					if (currentPosition < 25) {

						t._lineSmall(t.chart.lines.current);
						t.chart.lines.current.style.height = Math.min(101 - (10 - currentPosition), 101) + 'px';

					} else if ((barWidth - currentPosition < 25 && targetPosition > barWidth - Math.max(t.chart.labels.total.offsetWidth, t.chart.valueLabels.total.offsetWidth) - 4 && t.options.total.show) || !t.options.total.show) {

						t._lineSmall(t.chart.lines.current);
						t.chart.lines.current.style.height = Math.min(101 - (15 - (barWidth - currentPosition)), 101) + 'px';

					}
				}
			}

		}


		// Target
		if (t.data.target == 0) {

			t.chart.lines.target.style.left = 0;
			t._lineSmall(t.chart.lines.target);
			t._hideTarget();

		} else {

			if (t.options.target.percentage) {
				t.chart.valueLabels.target.textContent = formatLabel(t.data.target / t.data.total * 100) + '%';
			} else {
				t.chart.valueLabels.target.textContent = t.data.target;
			}

			if (targetPosition < Math.max(t.chart.labels.target.offsetWidth, t.chart.valueLabels.target.offsetWidth)) {
				t.chart.labels.target.style.left = targetPosition + 4;
				t.chart.valueLabels.target.style.left = targetPosition + 4;
			} else {
				if (t.data.total == t.data.target) {
					t.chart.labels.target.style.left = targetPosition - t.chart.labels.target.offsetWidth - 4;
					t.chart.valueLabels.target.style.left = targetPosition - t.chart.valueLabels.target.offsetWidth - 4;
				} else {
					t.chart.labels.target.style.left = targetPosition - t.chart.labels.target.offsetWidth;
					t.chart.valueLabels.target.style.left = targetPosition - t.chart.valueLabels.target.offsetWidth;
				}
			}

			t._showTarget();
			t.chart.lines.target.style.left = targetPosition;

			if (t.data.target == t.data.total) {

				t._lineSmall(t.chart.lines.target);
				t.chart.lines.target.style.left = 'calc(100% - 4px)';

			} else {

				t._lineLarge(t.chart.lines.target)

				if (t.options.current.inside || t.data.current < t.data.total) {

					if (targetPosition < 25) {

						t._lineSmall(t.chart.lines.target);
						t.chart.lines.target.style.height = Math.min(101 - (10 - targetPosition), 101) + 'px';

					} else if (barWidth - targetPosition < 25) {

						t._lineSmall(t.chart.lines.target);
						t.chart.lines.target.style.height = Math.min(101 - (15 - (barWidth - targetPosition))) + 'px';

					}
				}
			}
		}


		// Total
		if (t.options.total.show) {
			t.chart.valueLabels.total.textContent = t.data.total;
			t.chart.valueLabels.total.style.right = 4;
			t.chart.lines.total.style.right = 0;
			t.chart.labels.total.style.right = 4;

			if (targetPosition > barWidth - Math.max(t.chart.labels.total.offsetWidth, t.chart.valueLabels.total.offsetWidth) - 4) {
				t._hideTotal();
			} else {
				t._showTotal();
			}
		}


		// Progress Bar
		t.chart.progress.style.width = currentPosition + 'px';

		if (t.data.current == t.data.total && t.options.total.color != null) {
			t.chart.progress.style.backgroundColor = pallet[t.options.total.color];
		} else if (t.data.current >= t.data.target && t.options.target.color != null) {
			t.chart.progress.style.backgroundColor = pallet[t.options.target.color];
		} else {
			t.chart.progress.style.backgroundColor = pallet[t.options.current.color];
		}


		// Current Label Color
		if (t.options.current.inside && t.options.current.show) {
			if (currentPosition < Math.max(t.chart.labels.current.offsetWidth, t.chart.valueLabels.current.offsetWidth)) {
				t.chart.valueLabels.current.style.color = pallet['darkgrey'];
			} else {
				t.chart.valueLabels.current.style.color = pallet[getContrastYIQ(t.chart.progress.style.backgroundColor)];
			}
		} else if (t.options.current.show) {
			t.chart.valueLabels.current.style.color = pallet[getContrastYIQ(t.chart.area.style.backgroundColor)];
		}


		// Corners
		if (((targetPosition > barWidth - Math.max(t.chart.labels.total.offsetWidth, t.chart.valueLabels.total.offsetWidth) - 4 && t.options.total.show) || !t.options.total.show) && t.data.target != t.data.total) {
			t.options.bar.corners.topRight = 25;
		} else {
			t.options.bar.corners.topRight = 0;
		}

		if (t.data.current == 0) {
			t.options.bar.corners.bottomLeft = 0;
		} else {
			t.options.bar.corners.bottomLeft = 25;
		}

		if (t.data.current == t.data.total) {
			t.options.bar.corners.bottomRight = 0;
		} else {
			t.options.bar.corners.bottomRight = 25;
		}
		if (!t.options.current.show || t.options.current.inside) {
			t.options.bar.corners.bottomLeft = 25;
			t.options.bar.corners.bottomRight = 25;
		}

		if (t.options.bar.animated) {
			if (t.data.total == t.data.current) {
				t.chart.progress.classList.remove('cragProgressStripeAnimate');
			} else {
				t.chart.progress.classList.add('cragProgressStripeAnimate');
			}
		}

		t._updateBarRadius();

	}

	_showTotal() {
		this.chart.lines.total.style.opacity = 1;
		this.chart.labels.total.style.opacity = 1;
		this.chart.valueLabels.total.style.opacity = 1;
	}

	_hideTotal() {
		this.chart.lines.total.style.opacity = 0;
		this.chart.labels.total.style.opacity = 0;
		this.chart.valueLabels.total.style.opacity = 0;
	}

	_showTarget() {
		this.chart.lines.target.style.opacity = 1;
		this.chart.labels.target.style.opacity = 1;
		this.chart.valueLabels.target.style.opacity = 1;
	}

	_hideTarget() {
		this.chart.lines.target.style.opacity = 0;
		this.chart.labels.target.style.opacity = 0;
		this.chart.valueLabels.target.style.opacity = 0;
	}

	_lineXLarge(elem) {
		if (elem != null) {
			elem.style.height = '121px';
			elem.style.background = '#AAA';
			elem.style.opacity = 0.7;
		}
	}
	_lineLarge(elem) {
		if (elem != null) {
			elem.style.height = '101px';
			elem.style.background = '#AAA';
			elem.style.opacity = 0.7;
		}
	}

	_lineSmall(elem) {
		if (elem != null) {
			elem.style.height = '81px';
			elem.style.background = '#DDD';
			elem.style.opacity = 1;
		}
	}

	_updateBarRadius() {
		this.chart.bar.style.borderTopLeftRadius = this.options.bar.corners.topLeft + 'px';
		this.chart.bar.style.borderTopRightRadius = this.options.bar.corners.topRight + 'px';
		this.chart.bar.style.borderBottomRightRadius = this.options.bar.corners.bottomRight + 'px';
		this.chart.bar.style.borderBottomLeftRadius = this.options.bar.corners.bottomLeft + 'px';
	}

	set target(value) {
		if (value < 0) {
			value = 0;
		}
		if (value > this.data.total) {
			value = this.data.total;
		}
		this.data.target = value;
		this.draw();
	}

	set current(value) {
		if (value < 0) {
			value = 0;
		}
		if (value > this.data.total) {
			value = this.data.total;
		}
		this.data.current = value;
		this.draw();
	}

	set total(value) {
		this.data.total = value;
		this.draw();
	}

}