class CragLoader {

	defaultPath = 'https://combinatronics.com/Xn1ch1/Crag-Charts/main/crag/';
	resources = {
		core: {
			js: 'crag.charts.core.0.2.0.js',
			css: 'crag.charts.core.0.0.1.css'
		},
		bar: {
			js: 'crag.column.1.0.1.js',
			css: 'crag.column.1.0.1.css'
		},
		progress: {
			js: 'crag.progress.1.0.2.js',
			css: 'crag.progress.1.0.1.css'
		},
		lines: {
			js: 'crag.lines.1.0.1.js',
			css: 'crag.lines.1.0.2.css'
		},
		combo: {
			js: 'crag.combo.1.0.1.js',
			css: 'crag.combo.1.0.1.css'
		},
		pie: {
			js: 'crag.pie.0.0.0.js',
			css: 'crag.pie.0.0.0.css'
		}
	};

	/**
	 *
	 * @param {array.<string>} charts
	 * @param path
	 * @param _callback
	 */
	constructor(charts, _callback, path) {

		/**
		 * Use specified path if provided
		 */
		if (path) this.defaultPath = path;

		if (charts.constructor !== Array) throw 'No chart type array passed';

		this.attach(_callback, charts).then(_callback)

	}

	async attach(_callback, charts) {

		/**
		 * Attach core resources
		 */
		await this.attachResources();

		/**
		 * Attach chart specific resources
		 */
		for (let i = 0; i < charts.length; i++) {
			await this.attachResources(charts[i]);
		}

	}

	async attachResources(res) {

		return new Promise(resolve => {

			let js = null;
			let css = null;

			switch(res) {
				case 'progress':
					js = this.resources.progress.js;
					css = this.resources.progress.css;
					break;
				case 'column':
					js = this.resources.bar.js;
					css = this.resources.bar.css;
					break;
				case 'combo':
					js = this.resources.combo.js;
					css = this.resources.combo.css;
					break;
				case 'lines':
					js = this.resources.lines.js;
					css = this.resources.lines.css;
					break;
				case 'pie':
					js = this.resources.pie.js;
					css = this.resources.pie.css;
					break;
				default:
					js = this.resources.core.js;
					css = this.resources.core.css;
			}

			const head = document.getElementsByTagName("HEAD")[0];

			if (css != null) {

				const link = document.createElement('link');

				link.rel = 'stylesheet';
				link.type = 'text/css';
				link.href = this.defaultPath + css;

				head.appendChild(link);

			}

			const script = document.createElement('script');

			script.type = 'text/javascript';
			script.src = this.defaultPath + js;

			head.appendChild(script);

			script.onload = () => resolve(true);

		});

	}

}