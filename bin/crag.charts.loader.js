class CragLoader {

	defaultPath = 'https://combinatronics.com/Xn1ch1/Crag-Charts/main/crag/';
	resources = {
		core: {
			js: 'crag.charts.core.0.5.1.js',
			css: 'crag.charts.core.0.2.1.css'
		},
		column: {
			js: 'crag.column.1.4.0.js',
			css: 'crag.column.1.0.2.css'
		},
		progress: {
			js: 'crag.progress.1.1.2.js',
			css: 'crag.progress.1.2.0.css'
		},
		lines: {
			js: 'crag.lines.1.5.0.js',
			css: 'crag.lines.1.0.3.css'
		},
		combo: {
			js: ['crag.lines.1.5.0.js', 'crag.column.1.4.0.js', 'crag.combo.1.5.0.js'],
			css: 'crag.combo.1.0.2.css'
		},
		pie: {
			js: 'crag.pie.1.2.1.js',
			css: 'crag.pie.1.0.2.css'
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
					js = this.resources.column.js;
					css = this.resources.column.css;
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

			if (Array.isArray(js)) {

				const loader = new ScriptLoader();
				let i = 0;

				for (const resource of js) {

					loader.addScript(new Script(this.defaultPath + resource, i++));

				}

				loader.loadScripts()
					.then(() => resolve(true));

			} else {

				const script = document.createElement('script');

				script.type = 'text/javascript';
				script.src = this.defaultPath + js;

				head.appendChild(script);

				script.onload = () => resolve(true);

			}

		});

	}

}

class Script {
	constructor(path, dependencyOrder) {
		this.path = path;
		this.dependencyOrder = dependencyOrder;
	}
}
class ScriptLoader {
	constructor() {
		this.scripts = [];

	}
	addScript(script) {
		const exists = this.scripts.find( s => s.path.toLowerCase() === script.path.toLowerCase());
		if (!exists) {
			this.scripts.push(script);
		}
	}
	async loadScripts() {
		if (Array.isArray(this.scripts)) {
			const orderedScripts = this.orderScriptsByDependency();
			let scriptsLoaded = false;
			let counter = 0;
			while (!scriptsLoaded) {
				const _script = orderedScripts[counter]
				await this.loadScript(_script, _script.dependencyOrder > -1);
				counter += 1;
				scriptsLoaded = counter === orderedScripts.length;
			}
		}
	}
	async loadScript(script, waitToLoad) {
		return new Promise( (resolve, reject) => {
			const scriptTag = document.createElement('script');
			scriptTag.src = script.path;
			if (waitToLoad) {
				scriptTag.async = true;
				document.body.appendChild(scriptTag);
				scriptTag.onload = () => { resolve(); }
			} else {
				document.body.appendChild(scriptTag);
				resolve();
			}
		} );
	}
	orderScriptsByDependency() {
		if (Array.isArray(this.scripts)) {
			return this.scripts.sort( (a, b) => {
				return a.dependencyOrder - b.dependencyOrder;
			});
		}
		return null;
	}
}