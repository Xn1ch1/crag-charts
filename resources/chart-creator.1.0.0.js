
document.getElementById('data-input-overlay').onclick = () => {

	const newData = validateData();

	if (newData === false) return;

	chart.newData = newData;

	document.getElementById('data-input-modal').style.display = 'none';
	document.getElementById('data-input-overlay').style.display = 'none';

}

document.body.onload = () => {

	const inputTable = document.getElementById('data-input-table');

	for (let r = 0; r < 20; r++) {

		const row = inputTable.insertRow();

		const name = document.createElement('textarea');
		const value = document.createElement('input');

		name.type = 'text';
		name.id = `data-input-name-${r}`;
		name.onpaste = (event) => {

			setTimeout(() => {

				const newData = name.value.split('\n');

				for (let i = r; i < 20; i++) {

					if (!newData[i] || newData[i] === '') continue;

					const split = newData[i].split('\t');

					if (split[0] === '') continue;
					if (split.length === 1) continue;

					split[1] = parseNumber(split[1]);

					if (isNaN(Number(split[1]))) continue;

					document.getElementById(`data-input-name-${i}`).value = split[0];
					document.getElementById(`data-input-value-${i}`).value = Number(split[1]);


				}

			}, 50);

		}

		value.type = 'number';
		value.id = `data-input-value-${r}`;

		name.onfocus = () => name.select();
		value.onfocus = () => value.select();

		row.insertCell().append((r + 1).toString());
		row.insertCell().append(name);
		row.insertCell().append(value);

	}

}


			
document.body.oncontextmenu = (event) => {

	if (document.getElementById('canvas-presentation').contains(event.target)) return;
	
	event.preventDefault();
	
	
	if (document.getElementById('menu-modal').contains(event.target)) return;
	
	document.getElementById('menu-modal').style.display = '';
	
	document.getElementById('menu-modal').style.left = `${event.clientX}px`;
	document.getElementById('menu-modal').style.top = `${event.clientY}px`;
	
}

function hideMenu() {
	
	document.getElementById('menu-modal').style.display = 'none';
	
}
	
	
document.getElementById('menu-modal-head').ondragstart = function() {
	return false;
};

document.getElementById('menu-modal-head').onmousedown = function(event) {

	const target = event.target;
	target.style.cursor = 'grab';

	let shiftX = event.clientX - document.getElementById('menu-modal').getBoundingClientRect().left;
	let shiftY = event.clientY - document.getElementById('menu-modal').getBoundingClientRect().top;

	// centers the ball at (pageX, pageY) coordinates
	function moveAt(pageX, pageY) {
		document.getElementById('menu-modal').style.left = pageX - shiftX + 'px';
		document.getElementById('menu-modal').style.top = pageY - shiftY + 'px';
	}

	// move our absolutely positioned ball under the pointer
	moveAt(event.pageX, event.pageY);

	function onMouseMove(event) {
		moveAt(event.pageX, event.pageY);
	}

	// (2) move the ball on mousemove
	document.addEventListener('mousemove', onMouseMove);

	// (3) drop the ball, remove unneeded handlers
	document.getElementById('menu-modal').onmouseup = function() {

		target.style.cursor = '';

		document.removeEventListener('mousemove', onMouseMove);
		document.getElementById('menu-modal').onmouseup = null;

	};

}

function showData() {

	let row = 0;

	for (let r = 0; r < 20; r++) {

		document.getElementById(`data-input-name-${r}`).value = '';
		document.getElementById(`data-input-value-${r}`).value = '';
		document.getElementById(`data-input-name-${r}`).style.background = '';
		document.getElementById(`data-input-value-${r}`).style.background = '';
	}

	for (const d of chart.data.series) {

		document.getElementById(`data-input-name-${row}`).value = d[0];
		document.getElementById(`data-input-value-${row++}`).value = d[1];

	}

	document.getElementById('data-input-overlay').style.display = '';
	document.getElementById('data-input-modal').style.display = '';

}

function validateData() {

	const output = [];

	for (let r = 0; r < 20; r++) {

		const name = document.getElementById(`data-input-name-${r}`).value;
		const value = document.getElementById(`data-input-value-${r}`).value;

		if (name === '' && value === '') continue;

		if (name === '') {

			document.getElementById(`data-input-name-${r}`).style.background = 'red';

		} else {

			document.getElementById(`data-input-name-${r}`).style.background = '';

		}

		if (value === '' || isNaN(value)) {

			document.getElementById(`data-input-value-${r}`).style.background = 'red';
			return false;

		} else {

			document.getElementById(`data-input-value-${r}`).style.background = '';

		}

		output.push([name, Number(value)]);

	}

	return output

}

function parseNumber(value, locales = navigator.languages) {

	const example = Intl.NumberFormat(locales).format('1.1');
	const cleanPattern = new RegExp(`[^-+0-9${ example.charAt( 1 ) }]`, 'g');
	const cleaned = value.replace(cleanPattern, '');
	const normalized = cleaned.replace(example.charAt(1), '.');

	return parseFloat(normalized);
}

function htmlToCanvas() {

	document.body.style.pointerEvents = 'none';

	hideMenu();

	setTimeout(() => {

		html2canvas(document.querySelector("body")).then(canvas => {

			document.querySelector('#canvas-presentation').appendChild(canvas);
			document.querySelector('#canvas-presentation').style.display = '';
			document.body.style.pointerEvents = '';

		});

	}, 50)

}

function closeCanvas() {

	document.querySelector('#canvas-presentation').style.display = 'none';

	const children = document.getElementById('canvas-presentation').getElementsByTagName('canvas');

	for (const child of children) child.remove();

}
