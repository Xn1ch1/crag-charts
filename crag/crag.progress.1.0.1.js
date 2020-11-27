class CragProgress {

	constructor(options) {

		this.data = {
			current: 0,
			target: 0,
			total: 0
		}

		this.options = {
			bar: {
				color: 'blue',
				targetColor: null,
				totalColor: null,
				striped: false,
				animated: false,
				corners: {
					topLeft: 25,
					topRight: 25,
					bottomRight: 25,
					bottomLeft: 25
				}
			},
			labels: {
				current: 'Current',
				total: 'Total',
				target: 'Target'
			}
		}

		this.chart = {
			parent: null,
			area: null,
			bar: null,
			progress: null,
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

		if (options.data != undefined) {

			const option = options.data;

			if (option.total != undefined) {
				this.data.total = option.total;
			}
			if (option.current != undefined) {
				this.data.current = option.current;
			}
			if (option.target != undefined) {
				this.data.target = option.target;
			}

		}

		if (options.bar != undefined) {

			const option = options.bar;

			if (option.color != undefined && pallet.hasOwnProperty(option.color)) {
				this.options.bar.color = option.color;
			}
			if (option.totalColor != undefined && pallet.hasOwnProperty(option.totalColor)) {
				this.options.bar.totalColor = option.totalColor;
			}
			if (option.targetColor != undefined && pallet.hasOwnProperty(option.targetColor)) {
				this.options.bar.targetColor = option.targetColor;
			}
			if (option.striped != undefined && typeof option.striped === 'boolean') {
				this.options.bar.striped = option.striped;
			}
			if (option.animated != undefined && typeof option.animated === 'boolean') {
				this.options.bar.animated = option.animated;
			}

		}

		if (options.labels != undefined) {

			const option = options.labels;

			if (option.current != undefined) {
				this.options.labels.current = option.current;
			}
			if (option.target != undefined) {
				this.options.labels.target = option.target;
			}
			if (option.total != undefined) {
				this.options.labels.total = option.total;
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
		this.chart.lines.current = document.createElement('div');
		this.chart.lines.total = document.createElement('div');
		this.chart.labels.target = document.createElement('span');
		this.chart.valueLabels.target = document.createElement('span');
		this.chart.labels.total = document.createElement('span');
		this.chart.valueLabels.total = document.createElement('span');
		this.chart.labels.current = document.createElement('span');
		this.chart.valueLabels.current = document.createElement('span');

		this.chart.parent.style.position = 'relative';
		this.chart.area.style.position = 'relative';
		this.chart.area.style.top = (this.chart.parent.offsetHeight / 2) - 125;

		this.chart.lines.total.style.right = -5;
		this.chart.lines.total.style.top = 50;

		this.chart.lines.target.style.left = -5;
		this.chart.lines.target.style.top = 50;

		this.chart.lines.current.style.left = -5;
		this.chart.lines.current.style.bottom = 50;

		this.chart.labels.total.style.right = -100;
		this.chart.labels.total.style.top = 50;
		this.chart.valueLabels.total.style.right = -100;
		this.chart.valueLabels.total.style.top = 68;

		this.chart.labels.target.style.left = -100;
		this.chart.labels.target.style.top = 50;
		this.chart.valueLabels.target.style.left = -100;
		this.chart.valueLabels.target.style.top = 68;

		this.chart.labels.current.style.left = -100;
		this.chart.labels.current.style.bottom = 50;
		this.chart.valueLabels.current.style.left = -100;
		this.chart.valueLabels.current.style.bottom = 68;

		this.chart.labels.target.textContent = this.options.labels.target;
		this.chart.labels.total.textContent = this.options.labels.total;
		this.chart.labels.current.textContent = this.options.labels.current;

		this.chart.valueLabels.current.textContent = this.data.current;
		this.chart.valueLabels.target.textContent = this.data.target;
		this.chart.valueLabels.total.textContent = this.data.total;

		this._lineLarge(this.chart.lines.target);
		this._lineLarge(this.chart.lines.current);
		this._lineSmall(this.chart.lines.total);

		this.chart.area.className = 'cragProgressArea';
		this.chart.bar.className = 'cragProgressBar';
		this.chart.progress.className = 'cragProgressProgress';
		this.chart.lines.target.className = 'cragProgressLine';
		this.chart.lines.total.className = 'cragProgressLine';
		this.chart.lines.current.className = 'cragProgressLine';
		this.chart.labels.target.className = 'cragProgressLabel';
		this.chart.labels.total.className = 'cragProgressLabel';
		this.chart.labels.current.className = 'cragProgressLabel';
		this.chart.valueLabels.target.className = 'cragProgressValueLabel';
		this.chart.valueLabels.total.className = 'cragProgressValueLabel';
		this.chart.valueLabels.current.className = 'cragProgressValueLabel';

		if (this.options.bar.striped) this.chart.progress.classList.add('cragProgressStripe');
        if (this.options.bar.animated) this.chart.progress.classList.add('cragProgressStripeAnimate');

		this.chart.parent.appendChild(this.chart.area);
		this.chart.bar.appendChild(this.chart.progress);
		this.chart.area.appendChild(this.chart.bar);
		this.chart.area.appendChild(this.chart.labels.target);
		this.chart.area.appendChild(this.chart.valueLabels.target);
		this.chart.area.appendChild(this.chart.labels.total);
		this.chart.area.appendChild(this.chart.valueLabels.total);
		this.chart.area.appendChild(this.chart.labels.current);
		this.chart.area.appendChild(this.chart.valueLabels.current);
		this.chart.area.appendChild(this.chart.lines.target);
		this.chart.area.appendChild(this.chart.lines.total);
		this.chart.area.appendChild(this.chart.lines.current);

		setTimeout(this.draw.bind(this), 500);

		return this;

	}

	draw() {

		const t = this;

		const barWidth = t.chart.area.offsetWidth;
		const currentPosition = Math.round((barWidth / t.data.total) * t.data.current);
		const targetPosition = Math.round((barWidth / t.data.total) * t.data.target);

		t.chart.labels.target.textContent = t.options.labels.target;
		t.chart.labels.total.textContent = t.options.labels.total;
		t.chart.labels.current.textContent = t.options.labels.current;

		t.chart.valueLabels.current.textContent = t.data.current;
		t.chart.valueLabels.target.textContent = t.data.target;
		t.chart.valueLabels.total.textContent = t.data.total;

		t.chart.lines.total.style.right = 0;
		t.chart.labels.total.style.right = 5;
		t.chart.valueLabels.total.style.right = 5;

		if (t.data.current == t.data.total) {
            if (t.options.bar.totalColor != null) {
				t.chart.progress.style.backgroundColor = pallet[t.options.bar.totalColor];
			} else {
				t.chart.progress.style.backgroundColor = pallet[t.options.bar.color];
			}
		} else if (t.data.current >= t.data.target) {
            if (t.options.bar.targetColor != null) {
				t.chart.progress.style.backgroundColor = pallet[t.options.bar.targetColor];
			} else {
				t.chart.progress.style.backgroundColor = pallet[t.options.bar.color];
			}
		} else {
            t.chart.progress.style.backgroundColor = pallet[t.options.bar.color];
		}

		t.chart.progress.style.width = currentPosition + 'px';

		if ((targetPosition > barWidth - Math.max(t.chart.labels.total.offsetWidth, t.chart.valueLabels.total.offsetWidth) - 5 && t.data.target != t.data.total) ||
			(t.data.current == t.data.total && t.data.target != t.data.total)) {
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

		if (targetPosition < Math.max(t.chart.labels.target.offsetWidth, t.chart.valueLabels.target.offsetWidth)) {
			t.chart.labels.target.style.left = targetPosition + 5;
			t.chart.valueLabels.target.style.left = targetPosition + 5;
		} else {
			if (t.data.total == t.data.target) {
				t.chart.labels.target.style.left = targetPosition - t.chart.labels.target.offsetWidth - 5;
				t.chart.valueLabels.target.style.left = targetPosition - t.chart.valueLabels.target.offsetWidth - 5;
			} else {
				t.chart.labels.target.style.left = targetPosition - t.chart.labels.target.offsetWidth;
				t.chart.valueLabels.target.style.left = targetPosition - t.chart.valueLabels.target.offsetWidth;
			}
		}

		if (currentPosition < Math.max(t.chart.labels.current.offsetWidth, t.chart.valueLabels.current.offsetWidth)) {
			t.chart.labels.current.style.left = currentPosition + 5;
			t.chart.valueLabels.current.style.left = currentPosition + 5;
		} else {
			if (t.data.total == t.data.current) {
				t.chart.labels.current.style.left = currentPosition - t.chart.labels.current.offsetWidth - 5;
				t.chart.valueLabels.current.style.left = currentPosition - t.chart.valueLabels.current.offsetWidth - 5;
			} else {
				t.chart.labels.current.style.left = currentPosition - t.chart.labels.current.offsetWidth;
				t.chart.valueLabels.current.style.left = currentPosition - t.chart.valueLabels.current.offsetWidth;
			}
		}

		if (t.data.target == 0) {
			t.chart.lines.target.style.left = 0;
			t._lineSmall(t.chart.lines.target);
			t._hideTarget();
		} else {
			t._showTarget();
			t.chart.lines.target.style.left = targetPosition;
			if (t.data.target == t.data.total) {
				t._lineSmall(t.chart.lines.target);
				t.chart.lines.target.style.left = 'calc(100% - 5px)';
			} else {
				t._lineLarge(t.chart.lines.target)
				if (t.options.bar.corners.bottomRight > 0) {
					if (targetPosition < 25) {
						t._lineSmall(t.chart.lines.target);
						t.chart.lines.target.style.height = Math.min(100 - (10 - targetPosition), 100) + 'px';
					} else if (barWidth - targetPosition < 25) {
						t._lineSmall(t.chart.lines.target);
						t.chart.lines.target.style.height = Math.min(100 - (15 - (barWidth - targetPosition))) + 'px';
					}
				}
			}
		}

		if (t.data.current == 0) {
			t.chart.lines.current.style.left = 'calc(0%)';
			t._lineSmall(t.chart.lines.current);
		} else {
			if (t.data.current == t.data.total) {
				t._lineSmall(t.chart.lines.current);
				t.chart.lines.current.style.left = 'calc(100% - 5px)';
			} else {
				t._lineLarge(t.chart.lines.current);
				t.chart.lines.current.style.left = currentPosition + 'px';
				if (currentPosition < 25) {
					t._lineSmall(t.chart.lines.current);
					t.chart.lines.current.style.height = Math.min(100 - (10 - currentPosition), 100) + 'px';
				} else if (barWidth - currentPosition < 25 && t.options.bar.corners.topRight > 0) {
					t._lineSmall(t.chart.lines.current);
					t.chart.lines.current.style.height = Math.min(100 - (15 - (barWidth - currentPosition)), 100) + 'px';
				}
			}
		}

		if (t.data.total == t.data.current ||
			t.data.total == t.data.target ||
			targetPosition > barWidth - Math.max(t.chart.labels.total.offsetWidth, t.chart.valueLabels.total.offsetWidth) - 5) {
			t._hideTotal();
		} else {
			t._showTotal();
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
		elem.style.height = '120px';
		elem.style.background = '#AAA';
		elem.style.opacity = 0.7;
	}
	_lineLarge(elem) {
		elem.style.height = '100px';
		elem.style.background = '#AAA';
		elem.style.opacity = 0.7;
	}

	_lineSmall(elem) {
		elem.style.height = '80px';
		elem.style.background = '#DDD';
		elem.style.opacity = 1;
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