const array_to_set = function (array) {
	for (var i = 0; i < array.length; i += 1) {
		const u = array[i];
		for (var j = i + 1; j < array.length; j += 1) {
			if (u === array[j]) {
				array.splice(j, 1);
				j -= 1;
			}
		}
	}

	return array.sort();
};

var terminales = [];
var no_terminales = [];
var alfabeto = null;
var simbolo_inicial = null;

var G = {};
var G_raw = [];

onload = function () {
	var txt_produccion = document.getElementById('txt_produccion');

	txt_produccion.onkeydown = function (e) {
		if (e.keyCode === 13) {
			insertar_produccion();
		}
	};

	var txt_terminales = document.getElementById('txt_terminales');
	var txt_no_terminales = document.getElementById('txt_no_terminales');
	var txt_simbolo_inicial = document.getElementById('txt_simbolo_inicial');

	txt_terminales.value = sessionStorage.getItem('terminales') || '';
	txt_no_terminales.value = sessionStorage.getItem('no_terminales') || '';
	txt_simbolo_inicial.value = sessionStorage.getItem('simbolo_inicial') || '';
};

function inicializar_simbolos() {
	var txt_terminales = document.getElementById('txt_terminales');
	var txt_no_terminales = document.getElementById('txt_no_terminales');
	var txt_simbolo_inicial = document.getElementById('txt_simbolo_inicial');
	
	terminales = array_to_set(txt_terminales.value.replace(/\s/g, '').split(''));

	console.log('Terminales:', terminales);
	
	no_terminales = array_to_set(txt_no_terminales.value.replace(/\s/g, '').split(''));

	console.log('No-Terminales:', no_terminales);
	
	simbolo_inicial = (array_to_set(txt_simbolo_inicial.value.replace(/\s/g, '').split('')) || ['#'])[0];

	console.log('Símbolo Inicial:', simbolo_inicial);

	var error = null;
	no_terminales.forEach(function (x) {
		var i = terminales.indexOf(x);

		if (i >= 0) {
			error = terminales[i];
		}
	});

	if (error) {
		alert("El símbolo [" + error + "] se definió en terminales y no-terminales");
		return;
	}

	if (no_terminales.indexOf(simbolo_inicial) < 0) {
		alert('El símbolo inicial no está en los símbolos No-Terminales');
		return;
	}

	txt_terminales.disabled = true;
	txt_no_terminales.disabled = true;
	txt_simbolo_inicial.disabled = true;

	txt_terminales.value = terminales.join(', ');
	txt_no_terminales.value = no_terminales.join(', ');
	txt_simbolo_inicial.value = simbolo_inicial;

	alfabeto = [];

	terminales.forEach(function (x) {
		alfabeto.push(x);
	});

	no_terminales.forEach(function (x) {
		alfabeto.push(x);
	});

	console.log('alfabeto', alfabeto);

	sessionStorage.setItem('terminales', terminales.join(' '));
	sessionStorage.setItem('no_terminales', no_terminales.join(' '));
	sessionStorage.setItem('simbolo_inicial', simbolo_inicial);
}

function insertar_produccion() {
	if (!alfabeto) {
		inicializar_simbolos();
	}

	var txt_produccion = document.getElementById('txt_produccion');

	var aux = txt_produccion.value.replace(/\s/g, '').split('<-');

	console.log(aux);

	if (aux === [] || aux.length < 2) {
		alert('La producción no es válida');
		return;
	}

	var X = aux[0];
	var Y = aux[1];

	if (no_terminales.indexOf(X) < 0) {
		alert('El símbolo ' + X + ' no es no-terminal');
		return;
	}

	error = null;
	Y.split('').forEach(function (x) {
		if (alfabeto.indexOf(x) < 0) {
			error = x;
		}
	});

	if (error) {
		alert('El símbolo ' + error + ' no está en los símbolos terminales ni en los no-terminales');
		return;
	}

	if (G_raw.indexOf(X + '@' + Y) >= 0) {
		alert('La producción ya está agregada');
		return;
	}

	if (!G[X]) {
		G[X] = [];
	}

	G[X].push(Y.split(''));

	G_raw.push(X + '@' + Y);

	console.log('Gramática', G);

	var tbl_producciones = document.getElementById('tbl_producciones');

	var tr = document.createElement('tr');

	tr.innerHTML = '<td>' + X + ' &lt;- ' + Y.split('').join(' ') + '</td>';

	tbl_producciones.appendChild(tr);

	txt_produccion.value = '';

	var producciones = document.getElementById('producciones');

	producciones.hidden = false;
};

function generarTablaAnalisis() {
	var analisis = document.getElementById('analisis');

	analisis.hidden = false;

	
};