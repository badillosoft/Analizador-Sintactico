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

var estados = [];

var T = {};

onload = function () {
	var txt_produccion = document.getElementById('txt_produccion');

	txt_produccion.onkeydown = function (e) {
		if (e.keyCode === 13) {
			insertar_produccion();
		}
	};

	var txt_cadena = document.getElementById('txt_cadena');

	txt_cadena.onkeydown = function (e) {
		if (e.keyCode === 13) {
			evaluar_cadena();
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

	if (terminales.indexOf("$") < 0) {
		terminales.push("$");
	}

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

function insertar_produccion_tabla(X, Y) {
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

	if (G_raw.length === 0) {
		insertar_produccion_tabla('X', simbolo_inicial);
	}

	insertar_produccion_tabla(X, Y);

	txt_produccion.value = '';

	var producciones = document.getElementById('producciones');

	producciones.hidden = false;
};

function generarTablaAnalisis() {
	var analisis = document.getElementById('analisis');

	analisis.hidden = false;

	var T = generar_tabla_analisis();

	console.log(T);
};

function obtener_elementos(X, marcados) {
	marcados = marcados || [];

	var no_marcado = marcados.indexOf(X) < 0;

	marcados.push(X);

	var elementos = [];

	if (no_marcado && no_terminales.indexOf(X) >= 0) {
		Ys = G[X];
		
		Ys.forEach(function (Y) {
			elementos.push(X + '@.' + Y.join(''));

			if (no_terminales.indexOf(Y[0]) >= 0) {
				var sub = obtener_elementos(Y[0], marcados);

				console.log('Sub', sub);

				sub.forEach(function (x) {
					elementos.push(x);
				});
			}
		});
	}

	console.log("Elementos", elementos);

	return elementos;
}

function recorrer_punto(Y) {
	var j = Y.indexOf('.');

	// console.log('J', j);

	if (j >= 0) {
		Y.splice(j, 1);
	}

	Y.splice(j + 1, 0, '.');
}

function obtener_simbolo_punto(Y) {
	// console.log('YY', Y);
	for (var i = 0; i < (Y.length - 1); i++) {
		if (Y[i] === '.') {
			return Y[i + 1];
		}
	}

	return '#';
}

var contador = -1;

function conjunto_canonico(X, Y) {
	recorrer_punto(Y);

	var e = null;
	estados.forEach(function (z, i) {
		if (z.id === X + '@' + Y.join('')) {
			console.log(z, i);
			e = i;
			return;
		}
	});

	if (e) {
		return estados[e];
	}

	contador += 1;

	e = contador;

	var elementos = obtener_elementos(Y[Y.indexOf('.') + 1]);

	estados.push({
		indice: contador,
		id: X + '@' + Y.join(''),
		sub: elementos,
		subc: []
	});

	var s = obtener_simbolo_punto(Y);

	var aux1 = X + '@' + Y.join('');
	var aux2 = 'X@' + simbolo_inicial + '.';

	if (s === '#' && aux1 === aux2) {
		s = "$";
	}

	var C = conjunto_canonico(X, Y);

	console.log('C', C);

	estados[e].subc.push({
		simbolo: s,
		estado: C.indice,
		cadena: X + '@' + Y.join('')
	});

	estados[e].sub.forEach(function (z) {
		var aux = z.split('@');

		var Xp = aux[0];
		var Yp = aux[1].split('');

		// recorrer_punto(Yp);

		// console.log('Xp', Xp);
		// console.log('Yp', Yp);

		s = obtener_simbolo_punto(Yp);

		C = conjunto_canonico(Xp, Yp);

		console.log('C', C);

		estados[e].subc.push({
			simbolo: s,
			estado: C.indice,
			cadena: Xp + '@' + Yp.join('')
		});
	});

	estados[e].subc.forEach(function (transicion) {
		if (transicion.simbolo === "$") {
			transicion.valor = 'aceptar';
			transicion.accion = 'aceptar';
			return;
		}

		if (transicion.simbolo === '#') {
			var cadena = transicion.cadena.substr(0, transicion.cadena.length - 1);

			var j = -1;

			G_raw.forEach(function (c, k) {
				if (c === cadena) {
					j = k;
					return;
				}
			})

			transicion.valor = 'r' + j;
			transicion.accion = 'reducir';
			return;
		}

		if (terminales.indexOf(transicion.simbolo) >= 0) {
			transicion.valor = 'd' + transicion.estado;
			transicion.accion = 'desplazar';
			return;
		}

		transicion.valor = transicion.estado;
		transicion.accion = 'ir_a';
	});

	return estados[e];
}

function iniciar_tabla_analisis() {
	var tbl_analisis = document.getElementById('tbl_analisis');

	var thead = document.createElement('thead');

	var tr = document.createElement('tr');

	tr.className = 'active';

	tr.innerHTML += '<th rowspan="2">Estado</th>';
	tr.innerHTML += '<th colspan="' + (terminales.length + 1) + '">Acciones</th>';
	tr.innerHTML += '<th colspan="' + no_terminales.length + '">IrA</th>';

	thead.appendChild(tr);

	tr = document.createElement('tr');

	tr.className = 'warning';

	alfabeto.forEach(function (x) {
		tr.innerHTML += '<th>' + x + '</th>';
	});

	thead.appendChild(tr);

	tbl_analisis.appendChild(thead);

	var tbody = document.createElement('tbody');

	tbody.id = 'tbl_analisis_body';

	tbl_analisis.appendChild(tbody);
}

function agregar_estado_tabla(estado) {
	console.log('Estado', estado);

	var tbl_analisis = document.getElementById('tbl_analisis_body');

	tr = document.createElement('tr');

	tr.innerHTML += '<td>' + estado.indice + '</td>';

	T[estado.indice] = {
		Accion: {},
		IrA: {}
	};

	terminales.forEach(function (x) {
		var marcado = false;
		estado.subc.forEach(function (transicion) {
			if (transicion.simbolo === '#' || transicion.simbolo === x) {
				T[estado.indice].Accion[x] = {
					tipo: transicion.accion,
					valor: Number(transicion.valor.substr(1))
				};
				tr.innerHTML += '<td>' + transicion.valor + '</td>';
				marcado = true;
				return;
			}
		});
		if (!marcado) {
			T[estado.indice].Accion[x] = {
				tipo: 'error',
				valor: -1
			};
			tr.innerHTML += '<td>*</td>';
		}
	});

	no_terminales.forEach(function (x) {
		var marcado = false;
		estado.subc.forEach(function (transicion) {
			if (transicion.simbolo === x) {
				T[estado.indice].IrA[x] = transicion.valor;
				tr.innerHTML += '<td>' + transicion.valor + '</td>';
				marcado = true;
				return;
			}
		});
		if (!marcado) {
			T[estado.indice].IrA[x] = null;
			tr.innerHTML += '<td>*</td>';
		}
	});

	tbl_analisis.appendChild(tr);
}

function generar_tabla_analisis() {
	estados = [];
	contador = -1;

	T = {};

	conjunto_canonico('X', simbolo_inicial.split(''), []);

	iniciar_tabla_analisis();

	estados.forEach(function (estado) {
		agregar_estado_tabla(estado);
	});

	console.log('T', T);
}

function insertar_decicion(p, w, d) {
	var tbl_decisiones = document.getElementById('tbl_decisiones');

	var tr = document.createElement('tr');

	var aux = [p.join(' '), w.join(' '), d];

	aux.forEach(function (x) {
		var td = document.createElement('td');
		td.innerHTML = x;
		tr.appendChild(td);
	});

	tbl_decisiones.appendChild(tr);
}

function Evaluar(w, T, G) {
	var p = [0];
	
	var e = 0;
	
	while (true) { // marcador

		var x = w[0] || '#'; // # representa al símbolo vacío

		console.log('Pila', p, 'Cadena', w, 'Accion', T[e]);
		console.log('Te', e, T[e], x);
		
		if (terminales.indexOf(x) >= 0) {
		
			var a = T[e].Accion[x];
			
			console.log('Accion:', a);

			if (a.tipo == 'desplazar') {
			
				var n = a.valor;
				
				insertar_decicion(p, w, 'd' + n);
				console.log('PILA', p, 'CADENA', w, 'd' + n);

				p.push(n);
				
				w.splice(0, 1); // Removemos el primer elemento
				
				e = n;
				
				continue; // Regresamos al marcador
				
			}
			
			if (a.tipo == 'reducir') {
			
				var n = a.valor;
				
				var aux = G_raw[n].split('@');

				var X = aux[0];
				var Y = aux[1].split('');

				console.log('X', X, 'Y', Y);

				var d = 'r' + n + ' ( ' + X + ' &lt;- ' + Y.join(' ') + ' )';

				insertar_decicion(p, w, d);
				console.log('PILA', p, 'CADENA', w, d);
				
				var m = Y.length;
				
				p = p.slice(0, p.length - m);
				
				e = p[p.length - 1];

				console.log('T', T[e], T[e].IrA[X]);

				var j = T[e].IrA[X];

				if (j === null || j < 0) {
					insertar_decicion(p, w, 'error');
					console.log('PILA', p, 'CADENA', w, 'error');
					return 'inválida';
				}
				
				var q = [];

				p.forEach(function (o) {
					q.push(o);
				});

				q.push('*');

				insertar_decicion(p, w, 'd' + j);
				console.log('PILA', p, 'CADENA', w, 'd' + j);

				p.push(j);
				
				e = j;
				
				continue;
			}
			
			if (a.tipo == 'aceptar') {
				insertar_decicion(p, w, 'aceptar');
				console.log('PILA', p, 'CADENA', w, 'aceptar');
				return 'válida';
			}
			
			insertar_decicion(p, w, 'error');
			console.log('PILA', p, 'CADENA', w, 'error');
			return 'inválida';
			
		}
		
		if (no_terminales.indexOf(x) >= 0) {
		
			var j = T[e].IrA[x];
				
			if (j === null || j < 0) {
				insertar_decicion(p, w, 'error');
				console.log('PILA', p, 'CADENA', w, 'error');
				return 'inválida';
			}

			insertar_decicion(p, w, 'd' + j);
			console.log('PILA', p, 'CADENA', w, 'd' + j);
			
			p.push(j);
			
			e = j;
			
			continue;
			
		}
		
		insertar_decicion(p, w, 'error');
		console.log('PILA', p, 'CADENA', w, 'error');
		return 'inválida';
		
	}
}

function evaluar_cadena() {
	var tbl_decisiones = document.getElementById('tbl_decisiones');

	tbl_decisiones.innerHTML = "";

	var txt_cadena = document.getElementById('txt_cadena');

	var w = (txt_cadena.value + "$").replace(/\s/g, '').split('');

	var resultado = Evaluar(w, T, G);

	console.log('Resultado', resultado);
}