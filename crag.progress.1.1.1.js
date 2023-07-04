class CragProgress extends CragCore {

	constructor(options) {
		super();

		this.data = {
			current: 0,
			target: 0,
			total: 100
		}

		this.options = {
			chart: {
				color: CragPallet.white,
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
				color: CragPallet.blue,
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

		/* CHART */
		this.options.chart.title = this.validateOption(options?.chart?.title, 'string', this.options.chart.title);
		if (this._isValidColor(options?.chart?.color)) this.options.chart.color = options.chart.color;

		this.options.bar.inset = this.validateOption(options?.bar?.inset, 'boolean', this.options.bar.inset);
		this.options.bar.striped = this.validateOption(options?.bar?.striped, 'boolean', this.options.bar.striped);
		this.options.bar.animated = this.validateOption(options?.bar?.animated, 'boolean', this.options.bar.animated);

		this.data.current = this.validateOption(options?.current?.value, 'number', this.options.current.value);
		this.options.current.label = this.validateOption(options?.current?.label, 'string', this.options.current.label);
		if (this._isValidColor(options?.current?.color)) this.options.current.color = options.current.color;
		this.options.current.percentage = this.validateOption(options?.current?.percentage, 'boolean', this.options.current.percentage);
		this.options.current.inside = this.validateOption(options?.current?.inside, 'boolean', this.options.current.inside);
		this.options.current.show = this.validateOption(options?.current?.show, 'boolean', this.options.current.show);

		this.data.target = this.validateOption(options?.target?.value, 'number', this.options.target.value);
		this.options.target.label = this.validateOption(options?.target?.label, 'string', this.options.target.label);
		if (this._isValidColor(options?.target?.color)) this.options.target.color = options.target.color;

		this.data.total = this.validateOption(options?.total?.value, 'number', this.options.total.value);
		this.options.total.label = this.validateOption(options?.total?.label, 'string', this.options.total.label);
		if (this._isValidColor(options?.total?.color)) this.options.total.color = options.total.color;
		this.options.total.show = this.validateOption(options?.total?.show, 'boolean', this.options.total.show);

		if (this.options.chart.title != null) {

			if (this.data.target === 0 && !this.options.total.show) {

				this.chart.titleMargin = 0;

			} else {

				this.chart.titleMargin = 20;

			}

		}

	}

	create(e) {

		if (e === undefined) return;

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
		this.chart.area.className = 'cragProgressArea';
		if (this.options.chart.title != null) 	this.chart.title.textContent = this.options.chart.title;

		// Current
		if (this.options.current.show) {

			this.chart.lines.current = document.createElement('div');
			this.chart.labels.current = document.createElement('span');
			this.chart.valueLabels.current = document.createElement('span');

			if (this.options.current.inside) {

				this.chart.lines.current.style.display = 'none';
				this.chart.labels.current.style.display = 'none';
				this.chart.valueLabels.current.style.bottom = `${116 - this.chart.titleMargin}px`;

			} else {

				this.chart.lines.current.style.left = '-5px';
				this.chart.lines.current.style.bottom = `${50 - this.chart.titleMargin}px`;
				this.chart.labels.current.style.left = '-100px';
				this.chart.labels.current.style.bottom = `${50 - this.chart.titleMargin}px`;
				this.chart.valueLabels.current.style.bottom = `${68 - this.chart.titleMargin}px`;

			}

			this.chart.valueLabels.current.style.left = '-100px';
			this.chart.valueLabels.current.textContent = this.data.current;
			this.chart.labels.current.textContent = this.options.current.label;
			this.chart.valueLabels.current.className = 'cragProgressValueLabel';
			this.chart.labels.current.className = 'cragProgressLabel';
			this.chart.lines.current.className = 'cragProgressLine';

		}

		// Total
		if (this.options.total.show) {

			this.chart.lines.total.style.right = '-4px';
			this.chart.lines.total.style.top = `${50 + this.chart.titleMargin}px`;
			this.chart.labels.total.style.right = '-100px';
			this.chart.labels.total.style.top = `${50 + this.chart.titleMargin}px`;
			this.chart.valueLabels.total.style.right = '-100px';
			this.chart.valueLabels.total.style.top = `${68 + this.chart.titleMargin}px`;
			this.chart.labels.total.textContent = this.options.total.label;
			this.chart.valueLabels.total.textContent = this.data.total;
			this.chart.lines.total.className = 'cragProgressLine';
			this.chart.labels.total.className = 'cragProgressLabel';
			this.chart.valueLabels.total.className = 'cragProgressValueLabel';

		}

		// Target
		this.chart.lines.target.style.left = '-5px';
		this.chart.lines.target.style.top = `${50 + this.chart.titleMargin}px`;
		this.chart.labels.target.style.left = '-100px';
		this.chart.labels.target.style.top = `${50 + this.chart.titleMargin}px`;
		this.chart.valueLabels.target.style.left = '-100px';
		this.chart.valueLabels.target.style.top = `${68 + this.chart.titleMargin}px`;
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

		setTimeout(() => {

			this._draw();
			this._colorize();

		}, 500);

		this._applyListeners();

		return this;

	}

	/**
	 * Any default listeners to be applied here
	 * @private
	 */
	_applyListeners() {

		window.addEventListener('resize', () => {
			setTimeout(() => {
				this._draw();
			}, 400);
		});

	}

	_colorize() {

		this.chart.area.style.backgroundColor = this._resolveColor(this.options.chart.color);

		this.chart.title.style.color = this._getContrastColor(this.options.chart.color);
		this.chart.labels.target.style.color = this._getContrastColor(this.options.chart.color);
		this.chart.valueLabels.target.style.color = this._getContrastColor(this.options.chart.color);

		if (this.options.total.show) {

			this.chart.labels.total.style.color = this._getContrastColor(this.options.chart.color);
			this.chart.valueLabels.total.style.color = this._getContrastColor(this.options.chart.color);

		}

		if (this.options.current.show) {

			this.chart.labels.current.style.color = this._getContrastColor(this.options.chart.color);
			this.chart.valueLabels.current.style.color = this._getContrastColor(this.options.chart.color);

		}

		// Current Label Color
		if (this.options.current.inside && this.options.current.show) {

			if (this.chart.labels.current.offsetWidth >= Math.round((this.chart.area.offsetWidth / this.data.total) * this.data.current)) {

				this.chart.valueLabels.current.style.color = this._getContrastColor(this.chart.bar.style.backgroundColor);

			} else {

				this.chart.valueLabels.current.style.color = this._getContrastColor(this.chart.progress.style.backgroundColor);

			}

		} else if (this.options.current.show) {

			this.chart.valueLabels.current.style.color = this._getContrastColor(this.options.chart.color);

		}

	}

	_draw() {

		const barWidth = this.chart.area.offsetWidth;
		const currentPosition = Math.round((barWidth / this.data.total) * this.data.current);
		const targetPosition = Math.round((barWidth / this.data.total) * this.data.target);

		this.chart.area.style.marginTop = `${(this.chart.parent.offsetHeight / 2) - 125}px`;
		this.chart.bar.style.top = `${95 + this.chart.titleMargin}px`;

		// Current
		if (this.options.current.show) {

			if (this.options.current.percentage) {

				this.chart.valueLabels.current.textContent = `${formatLabel(this.data.current / this.data.total * 100)}%`;

			} else {

				this.chart.valueLabels.current.textContent = this.data.current;

			}

			if (currentPosition < Math.max(this.chart.labels.current.offsetWidth, this.chart.valueLabels.current.offsetWidth)) {

				this.chart.labels.current.style.left = `${currentPosition + 4}px`;
				this.chart.valueLabels.current.style.left = `${currentPosition + 4}px`;

			} else {

				if (this.data.total === this.data.current) {

					this.chart.labels.current.style.left = `${currentPosition - this.chart.labels.current.offsetWidth - 4}px`;
					this.chart.valueLabels.current.style.left = `${currentPosition - this.chart.valueLabels.current.offsetWidth - 4}px`;

				} else {

					let offset = 4;

					if (!this.options.current.inside) offset = 0;

					this.chart.labels.current.style.left = `${currentPosition - this.chart.labels.current.offsetWidth + offset}px`;
					this.chart.valueLabels.current.style.left = `${currentPosition - this.chart.valueLabels.current.offsetWidth + offset}px`;

				}

			}

			if (this.data.current === 0) {

				this.chart.lines.current.style.left = 'calc(0%)';
				this._lineSmall(this.chart.lines.current);

			} else {

				if (this.data.current === this.data.total) {

					this._lineSmall(this.chart.lines.current);
					this.chart.lines.current.style.left = 'calc(100% - 4px)';

					if (this.options.bar.animated)	this.chart.progress.classList.remove('cragProgressStripeAnimate');

				} else {

					this._lineLarge(this.chart.lines.current);
					this.chart.lines.current.style.left = `${currentPosition}px`;

					if (currentPosition < 25) {

						this._lineSmall(this.chart.lines.current);
						this.chart.lines.current.style.height = `${Math.min(101 - (10 - currentPosition), 101)}px`;

					} else if (
						(
							barWidth - currentPosition < 25 &&
							targetPosition > barWidth - Math.max(this.chart.labels.total.offsetWidth, this.chart.valueLabels.total.offsetWidth) - 4 &&
							this.options.total.show
						) ||
						!this.options.total.show) {

						this._lineSmall(this.chart.lines.current);
						this.chart.lines.current.style.height = `${Math.min(101 - (15 - (barWidth - currentPosition)), 101)}px`;

					}
				}
			}

		}


		// Target
		if (this.data.target === 0) {

			this.chart.lines.target.style.left = '0px';
			this._lineSmall(this.chart.lines.target);
			this._hideTarget();

			this.chart.labels.target.style.left = `4px`;
			this.chart.valueLabels.target.style.left = `4px`;

			this.chart.valueLabels.target.textContent = `0`;

		} else {

			if (this.options.target.percentage) {

				this.chart.valueLabels.target.textContent = `${formatLabel(this.data.target / this.data.total * 100)}%`;

			} else {

				this.chart.valueLabels.target.textContent = this.data.target;

			}

			if (targetPosition < Math.max(this.chart.labels.target.offsetWidth, this.chart.valueLabels.target.offsetWidth)) {

				this.chart.labels.target.style.left = `${targetPosition + 4}px`;
				this.chart.valueLabels.target.style.left = `${targetPosition + 4}px`;

			} else {

				if (this.data.total === this.data.target) {

					this.chart.labels.target.style.left = `${targetPosition - this.chart.labels.target.offsetWidth - 4}px`;
					this.chart.valueLabels.target.style.left = `${targetPosition - this.chart.valueLabels.target.offsetWidth - 4}px`;

				} else {

					this.chart.labels.target.style.left = `${targetPosition - this.chart.labels.target.offsetWidth}px`;
					this.chart.valueLabels.target.style.left = `${targetPosition - this.chart.valueLabels.target.offsetWidth}px`;

				}

			}

			this._showTarget();
			this.chart.lines.target.style.left = `${targetPosition}px`;

			if (this.data.target === this.data.total) {

				this._lineSmall(this.chart.lines.target);
				this.chart.lines.target.style.left = 'calc(100% - 4px)';

			} else {

				this._lineLarge(this.chart.lines.target)

				if (this.options.current.inside || this.data.current < this.data.total) {

					if (targetPosition < 25) {

						this._lineSmall(this.chart.lines.target);
						this.chart.lines.target.style.height = `${Math.min(101 - (10 - targetPosition), 101)}px`;

					} else if (barWidth - targetPosition < 25) {

						this._lineSmall(this.chart.lines.target);
						this.chart.lines.target.style.height = `${Math.min(101 - (15 - (barWidth - targetPosition)))}px`;

					}

				}

			}

		}


		// Total
		if (this.options.total.show) {

			this.chart.valueLabels.total.textContent = this.data.total;
			this.chart.valueLabels.total.style.right = '4px';
			this.chart.lines.total.style.right = '0px';
			this.chart.labels.total.style.right = '4px';

			if (targetPosition > barWidth - Math.max(this.chart.labels.total.offsetWidth, this.chart.valueLabels.total.offsetWidth) - 4) {

				this._hideTotal();

			} else {

				this._showTotal();

			}

		}


		// Progress Bar
		this.chart.progress.style.width = `${currentPosition}px`;

		if (this.data.current === this.data.total && this.options.total.color != null) {

			this.chart.progress.style.backgroundColor = this._resolveColor(this.options.total.color);

		} else if (this.data.current >= this.data.target && this.options.target.color != null) {

			this.chart.progress.style.backgroundColor = this._resolveColor(this.options.target.color);

		} else {

			this.chart.progress.style.backgroundColor = this._resolveColor(this.options.current.color);

		}

		// Corners
		if (
			(
				(targetPosition > barWidth - Math.max(this.chart.labels.total.offsetWidth, this.chart.valueLabels.total.offsetWidth) - 4 &&
					this.options.total.show) ||
				!this.options.total.show) &&
			this.data.target !== this.data.total) {

			this.options.bar.corners.topRight = 25;

		} else {

			this.options.bar.corners.topRight = 0;

		}

		if (this.data.current === 0) {

			this.options.bar.corners.bottomLeft = 0;

		} else {

			this.options.bar.corners.bottomLeft = 25;

		}

		if (this.data.current === this.data.total) {

			this.options.bar.corners.bottomRight = 0;

		} else {

			this.options.bar.corners.bottomRight = 25;

		}

		if (!this.options.current.show || this.options.current.inside) {

			this.options.bar.corners.bottomLeft = 25;
			this.options.bar.corners.bottomRight = 25;

		}

		if (this.options.bar.animated) {

			if (this.data.total === this.data.current) {

				this.chart.progress.classList.remove('cragProgressStripeAnimate');

			} else {

				this.chart.progress.classList.add('cragProgressStripeAnimate');

			}

		}

		this._updateBarRadius();

	}

	_showTotal() {

		this.chart.lines.total.style.opacity = '1';
		this.chart.labels.total.style.opacity = '1';
		this.chart.valueLabels.total.style.opacity = '1';

	}

	_hideTotal() {

		this.chart.lines.total.style.opacity = '0';
		this.chart.labels.total.style.opacity = '0';
		this.chart.valueLabels.total.style.opacity = '0';

	}

	_showTarget() {

		this.chart.lines.target.style.opacity = '1';
		this.chart.labels.target.style.opacity = '1';
		this.chart.valueLabels.target.style.opacity = '1';

	}

	_hideTarget() {

		this.chart.lines.target.style.opacity = '0';
		this.chart.labels.target.style.opacity = '0';
		this.chart.valueLabels.target.style.opacity = '0';

	}

	_lineLarge(elem) {

		if (elem != null) {

			elem.style.height = '101px';
			elem.style.background = '#AAA';
			elem.style.opacity = '0.7';

		}

	}

	_lineSmall(elem) {

		if (elem != null) {

			elem.style.height = '81px';
			elem.style.background = '#DDD';
			elem.style.opacity = '1';

		}

	}

	_updateBarRadius() {

		this.chart.bar.style.borderTopLeftRadius = `${this.options.bar.corners.topLeft}px`;
		this.chart.bar.style.borderTopRightRadius = `${this.options.bar.corners.topRight}px`;
		this.chart.bar.style.borderBottomRightRadius = `${this.options.bar.corners.bottomRight}px`;
		this.chart.bar.style.borderBottomLeftRadius = `${this.options.bar.corners.bottomLeft}px`;

	}

	set target(value) {

		if (value < 0) value = 0;

		if (value > this.data.total) value = this.data.total;

		this.data.target = value;
		this._draw();
		this._colorize();

	}

	set current(value) {

		if (value < 0) value = 0;

		if (value > this.data.total) value = this.data.total;

		this.data.current = value;
		this._draw();
		this._colorize();

	}

	set total(value) {

		this.data.total = value;
		this._draw();
		this._colorize();

	}

	/**
	 * @param {any} value
	 */
	set color(value) {

		if (this._isValidColor(value)) this.options.chart.color = value;

		this._colorize();

	}

}