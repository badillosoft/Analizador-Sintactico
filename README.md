<!-- PORTADA -->

<br><br><br>

<center>
**INSTITUTO POLITÉCNICO NACIONAL**

**Centro de Innovación y Desarrollo Tecnológico en Cómputo**

<br><br>

**Analizador Sintáctico LR(K)**

<br>

**Fundamentos de la Teoría de la Computación**

<br><br>

<br><br>
presenta
</p>

<br>

**Alan Badillo Salas**

<br><br><br><br>

<p style="width:100%;text-align:left;margin-left:8em">
Profesor: M. Miguel Hernández Bolaños
</p>

</center>

<br><br><br>

<p style="float: left">Ciudad de México.,</p>
<p style="float: right">junio 2016</p>
<br><br><br>

<div style="page-break-after: always;"></div>

<!-- P2 Introducción -->

<div>
<hr style="border: 0;height: 1px;background: #333;margin-bottom:2em">
<p style="font-size:1.5em;font-weight:bold">Introducción</h3>
<hr style="border: 0;height: 1px;background: #333;margin-top:2em">
</div>

<br><br>

<div style="text-align:justify;">
El siguiente trabajo describe el desarrollo e implementación del <i>Analizador Sintáctico LR(0)</i>. El programa desarrollado será capaz de definir gramáticas y generar tablas de análisis sintácitco para la posterior evaluación de cadenas y determinar si pertenecen o no a la gramática establecida, notando que las gramáticas <i>LR(0)</i> no cubren completamente las gramáticas <i>LR(k)</i> generalizadas.
<br><br>
En este trabajo se describen los diferentes algoritmos utilizados en <i>pseudocódigo</i> y su implementación en el lenguaje de <i>Javascript</i> para poder ser utilizado en cualquier navegador web moderno.
</div>

<!-- OBJETIVOS -->

<div>
<hr style="border: 0;height: 1px;background: #333;margin-bottom:2em">
<p style="font-size:1.5em;font-weight:bold">Objetivo General</h3>
<hr style="border: 0;height: 1px;background: #333;margin-top:2em">
</div>

<br><br>

<div style="text-align:justify;">
Crear un sistema que solicite una gramática especificada por una serie de producciones de conjuntos de símbolos terminales y no terminales. Para la gramática generada contruir la tabla de análisis sintáctico y determinar si un conjunto de cadenas son válidas para dicha gramática. Finalmente mostrar una tabla con la pila, la cadena y las acciones que fueron tomadas para determinar si la cadena es o no válida.
</div>

<br>

<div style="page-break-after: always;"></div>

<!-- Marco Teórico -->

<div>
<hr style="border: 0;height: 1px;background: #333;margin-bottom:2em">
<p style="font-size:1.5em;font-weight:bold">Marco Teórico</h3>
<hr style="border: 0;height: 1px;background: #333;margin-top:2em">
</div>

<br><br>

<div style="text-align:justify;">
Una <i>Analizador Sintáctico LR(k)</i> pertenece a la familia de <i>Analizadores Ascendentes</i>. El nombre <i>LR</i> es una contracción de <i>Left-to-right, Right-most-derivation</i> que significa leer de izquierda a derecha, haciendo una derivación a la derecha y <i>K</i> denota el número de símbolos que preanaliza el algoritmo.
<br><br>
El análisis ascendente lineal más utilizado es el algoritmo de <i>desplazamiento-reducción</i> (<i>shift-reduce</i>). Este algoritmo se basa en una pila de estados y una tabla de análisis. Existen diferentes métodos para generar la tabla de análisis (<i>LR(0), SLR, LALR, LR(1)</i>).
<br><br>
Algunas diferencias entre los algoritmos son:

<ul>
<li>El método <i>LR(1)</i> genera la tabla para cualquier gramática <i>LR(1)</i>, pero genera tablas muy grandes.</li>
<li>El método <i>SLR</i> genera tablas muy compactas pero no puede aplicarse a todas las gramáticas <i>LR(1)</i>.</li>
<li>El método <i>LALR</i> genera tablas compactas y puede aplicarse a la mayoría de gramáticas <i>LR(1)</i>.</li>
</ul>

Se utilizan las siguientes acciones básicas para construir la tabla:

<ul>
<li><b>Desplazar</b>: consiste en consumir un token de la cadena de entrada.</li>
<li><b>Reducir</b>: consiste en sustituir en la pila los símbolos de una parte derecha de una regla por su parte izquierda.</li>
<li><b>Aceptar</b>: Se acepta la cadena como válida.</li>
<li><b>Error</b>: Se invalida la cadena, este es por defecto cuando no ocurre ninguna acción.</li>
</ul>

La tabla se compone de las siguientes columnas:

<ul>
<li><b>Estado</b>: indica un estado diferente para cada fila.</li>
<li><b>Acciones</b>: para cada símbolo terminal y $.</li>
<li><b>IrA</b>: para cada símbolo no terminal.</li>
</ul>
</div>

<div style="page-break-after: always;"></div>

<!-- Algoritmo de Evaluación -->

<div>
<hr style="border: 0;height: 1px;background: #333;margin-bottom:2em">
<p style="font-size:1.5em;font-weight:bold">Algoritmo de Evaluación</h3>
<hr style="border: 0;height: 1px;background: #333;margin-top:2em">
</div>

<br><br>

El Siguiente algoritmo nos permite evaluar si una cadena es válida de acuerdo a una tabla de análisis dada.

### Algoritmo

Descripción del algoritmo:

1. Creamos una pila con el índice `0` referente al estado inicial.
2. Marcamos el índice `e` que representa el último estado de la pila.
3. Repetimos mediante un marcador
4. Leemos el primer símbolo `x` de la cadena `w`
5. Si `x` es un símbolo terminal leemos la acción asociada `a`.
6. Si `a` es un desplazamiento agregamos el índice del estado a desplazarse a la pila quitamos el primer símbolo de `w` para generar una nueva entrada. Regresamos al marcador.
7. Si `a` es una reducción obtenemos la producción `X` asociada al valor de desplazamiento y quitamos los últimos `m` estados de la pila según la longitud del lado derecho `Y` de la producción. Finalmente recuperamos el índice `j` de de la tabla en `IrA` en el símbolo `X`, ajustamos el último valor de `e` como `j` y regresamos al marcador.
8. Si `a` es aceptar terminamos y la cadena es válida.
9. En cualquier otro caso hubo un error en la validación y terminamos y la cadena no es válida.
10. En caso de que `x` sea no terminal recuperamos el el índice `j` de de la tabla en `IrA` en el símbolo `x`, ajustamos el último valor de `e` como `j` y regresamos al marcador.
11. En cualquier otro caso se detecta un símbolo que no es terminal ni no-terminal por lo que terminamos y la cadena no es válida.

El siguiente algoritmo en _pseudocódigo_ evalua una cadena `w` dada una _tabla de análisis_ `T` y devuelve `válida` o `inválida` según sea el resultado de la evaluación de `w`.

> Evaluar(w, T, G) - Evalua la cadena `w` según la _tabla de análisis_ `T` para la gramática `G`

~~~
p <- NUEVA PILA

p << 0

e <- 0

MARCADOR:
x <- w[0]

SI x ES TERMINAL:
	a <- LEER ACCIÓN EN T(e, x)
	
	SI a ES DESPLAZAR:
		n <- LEER ÍNDICE DE DESPLAZAMIENTO DE a
		
		p << n
		
		RECORRER w A LA IZQUIERDA
		
		e <- n
		
		REGRESAR A MARCADOR
		
	SI a ES REDUCIR:
		n <- LEER ÍNDICE DE REDUCCIÓN DE a
		
		X, Y <- LEER PRODUCCIÓN n
		
		m <- LONGITUD Y
		
		PARA i <- 1 HASTA m INCREMENTA 1:
			RECORRER p A LA DERECHA
				
		p >> e
		
		j <- LEER IrA EN T(e, X)
		
		p << j
		
		e <- j
		
		REGRESAR A MARCADOR
		
	SI a ES ACEPTAR:
		TERMINAR válida
		
	SI a ES ERROR O NULL:
		TERMINAR inválida
		
SI 	x ES NO_TERMINAL:
	j <- LEER IrA EN T(e, x)
	
	p << j
	
	e <- j
	
	REGRESAR A MARCADOR
	
TERMINAR inválida	
~~~

### Implementación del algoritmo

El siguiente código implementa en _javascript_ el algoritmo para evaluar una cadena `w` dada una _tabla de análisis_ `T` y devuelve `válida` o `inválida` según sea el resultado de la evaluación de `w`.

Antes vamos a definir la estructura de `G` y de `T`.

> Estructura de la gramática `G`

~~~js
G = {
	0: {
		X: 'Sp',
		Y: ['S'] // Representa S' <- S
	},
	1: {
		X: 'S',
		Y: ['B', 'A', 'a'] // Representa <S> <- <B> <A> a
	},
	2: {
		X: 'A',
		Y: ['b', 'C'] // Representa <A> <- b <C>
	},
	3: {
		X: 'B',
		Y: ['d'], // Representa <B> <- d
	},
	4: {
		X: 'B',
		Y: ['e', 'B'] // Representa <B> <- e <B>
	},
	5: {
		X: 'C',
		Y: ['c'] // Representa <C> <- c
	}
}
~~~

<div style="page-break-after: always;"></div>

> Estructura de la _Tabla de Análisis_ `T`

~~~js
T = {
	0: {
		Accion: {
			a: {},
			b: {},
			c: {},
			d: {
				tipo: 'desplazar',
				valor: 3
			},
			e: {
				tipo: 'desplazar',
				valor: 4
			},
			$: {}
		},
		IrA: {
			S: 1,
			A: -1,
			B: 2,
			C: -1
		}
	},
	// ...
}
~~~

> Evaluar(w, T, G) - Evalua la cadena `w` según la _tabla de análisis_ `T` para la gramática `G`

~~~js
function Evaluar(w, T, G) {
	var p = [0];
	
	var e = 0;
	
	while (true) { // marcador
	
		var x = w[0] || '#'; // # representa al símbolo vacío
		
		if (es_terminal(x)) {
		
			var a = T[e].Accion[x];
			
			if (a.tipo == 'desplazar') {
			
				var n = a.valor;
				
				p.push(n);
				
				w = w.splice(0, 1); // Removemos el primer elemento
				
				e = n;
				
				continue; // Regresamos al marcador
				
			}
			
			if (a.tipo == 'reducir') {
			
				var n = a.valor;
				
				var X = G[n].X;
				var Y = G[n].Y;
				
				var m = Y.length;
				
				p = p.slice(0, m);
				
				e = p[p.length - 1];
				
				var j = T[e].IrA[X];
				
				if (j < 0) {
					return 'inválida';
				}
				
				p.push(j);
				
				e = j;
				
				continue;
			}
			
			if (a.tipo == 'aceptar') {
				return 'válida';
			}
			
			return 'inválida';
			
		}
		
		if (es_no_terminal(x)) {
		
			var j = T[e].IrA[x];
				
			if (j < 0) {
				return 'inválida';
			}
			
			p.push(j);
			
			e = j;
			
			continue;
			
		}
		
		return 'inválida';
		
	}
}
~~~

### Ejemplo

<div style="text-align:justify;">
A continuación se muestra un ejemplo de una gramática y la tabla de análisis asociada a la gramática, posteriormente se muestra una tabla con la cadena y las acciones que realiza el algoritmo para determinar si es válida.
</div>

> Producciones de la gramática

	1. <S> <- <B> <A> a
	2. <A> <- b <C>
	3. <C> <- c
	4. <B> <- d
	5. <B> <- e <B>

> Tabla de Análisis Sintáctico para la gramática anterior

<table style="width:100%;text-align:center;font-size:0.5em">
	<tr>
		<th rowspan="2">Estado</th>
		<th colspan="6">Acciones</th>
		<th colspan="4">IrA</th>
	</tr>
	<tr>
		<th>a</th>
		<th>b</th>
		<th>c</th>
		<th>d</th>
		<th>e</th>
		<th>$</th>
		<th>S</th>
		<th>A</th>
		<th>B</th>
		<th>C</th>
	</tr>
	<tr>
		<td>0</td> <!-- Estado -->
		<td></td> <!-- a -->
		<td></td> <!-- b -->
		<td></td> <!-- c -->
		<td>d3</td> <!-- d -->
		<td>d4</td> <!-- e -->
		<td></td> <!-- $ -->
		<td>1</td> <!-- S -->
		<td></td> <!-- A -->
		<td>2</td> <!-- B -->
		<td></td> <!-- C -->
	</tr>
	<tr>
		<td>1</td> <!-- Estado -->
		<td></td> <!-- a -->
		<td></td> <!-- b -->
		<td></td> <!-- c -->
		<td></td> <!-- d -->
		<td></td> <!-- e -->
		<td>aceptar</td> <!-- $ -->
		<td></td> <!-- S -->
		<td></td> <!-- A -->
		<td></td> <!-- B -->
		<td></td> <!-- C -->
	</tr>
	<tr>
		<td>2</td> <!-- Estado -->
		<td></td> <!-- a -->
		<td>d6</td> <!-- b -->
		<td></td> <!-- c -->
		<td></td> <!-- d -->
		<td></td> <!-- e -->
		<td></td> <!-- $ -->
		<td></td> <!-- S -->
		<td>5</td> <!-- A -->
		<td></td> <!-- B -->
		<td></td> <!-- C -->
	</tr>
	<tr>
		<td>3</td> <!-- Estado -->
		<td></td> <!-- a -->
		<td>r4</td> <!-- b -->
		<td></td> <!-- c -->
		<td></td> <!-- d -->
		<td></td> <!-- e -->
		<td></td> <!-- $ -->
		<td></td> <!-- S -->
		<td></td> <!-- A -->
		<td></td> <!-- B -->
		<td></td> <!-- C -->
	</tr>
	<tr>
		<td>4</td> <!-- Estado -->
		<td></td> <!-- a -->
		<td></td> <!-- b -->
		<td></td> <!-- c -->
		<td>d3</td> <!-- d -->
		<td>d4</td> <!-- e -->
		<td></td> <!-- $ -->
		<td></td> <!-- S -->
		<td></td> <!-- A -->
		<td>7</td> <!-- B -->
		<td></td> <!-- C -->
	</tr>
	<tr>
		<td>5</td> <!-- Estado -->
		<td>d8</td> <!-- a -->
		<td></td> <!-- b -->
		<td></td> <!-- c -->
		<td></td> <!-- d -->
		<td></td> <!-- e -->
		<td></td> <!-- $ -->
		<td></td> <!-- S -->
		<td></td> <!-- A -->
		<td></td> <!-- B -->
		<td></td> <!-- C -->
	</tr>
	<tr>
		<td>6</td> <!-- Estado -->
		<td></td> <!-- a -->
		<td></td> <!-- b -->
		<td>d10</td> <!-- c -->
		<td></td> <!-- d -->
		<td></td> <!-- e -->
		<td></td> <!-- $ -->
		<td></td> <!-- S -->
		<td></td> <!-- A -->
		<td></td> <!-- B -->
		<td>9</td> <!-- C -->
	</tr>
	<tr>
		<td>7</td> <!-- Estado -->
		<td></td> <!-- a -->
		<td>r5</td> <!-- b -->
		<td></td> <!-- c -->
		<td></td> <!-- d -->
		<td></td> <!-- e -->
		<td></td> <!-- $ -->
		<td></td> <!-- S -->
		<td></td> <!-- A -->
		<td></td> <!-- B -->
		<td></td> <!-- C -->
	</tr>
	<tr>
		<td>8</td> <!-- Estado -->
		<td></td> <!-- a -->
		<td></td> <!-- b -->
		<td></td> <!-- c -->
		<td></td> <!-- d -->
		<td></td> <!-- e -->
		<td>r1</td> <!-- $ -->
		<td></td> <!-- S -->
		<td></td> <!-- A -->
		<td></td> <!-- B -->
		<td></td> <!-- C -->
	</tr>
	<tr>
		<td>9</td> <!-- Estado -->
		<td>r2</td> <!-- a -->
		<td></td> <!-- b -->
		<td></td> <!-- c -->
		<td></td> <!-- d -->
		<td></td> <!-- e -->
		<td></td> <!-- $ -->
		<td></td> <!-- S -->
		<td></td> <!-- A -->
		<td></td> <!-- B -->
		<td></td> <!-- C -->
	</tr>
	<tr>
		<td>10</td> <!-- Estado -->
		<td>r3</td> <!-- a -->
		<td></td> <!-- b -->
		<td></td> <!-- c -->
		<td></td> <!-- d -->
		<td></td> <!-- e -->
		<td></td> <!-- $ -->
		<td></td> <!-- S -->
		<td></td> <!-- A -->
		<td></td> <!-- B -->
		<td></td> <!-- C -->
	</tr>
</table>

> Tabla para resultante de evaluar la cadena **e d b c a $**

<table style="width:100%;font-size:0.8em">
	<tr>
		<th>Pila</th>
		<th>Entrada</th>
		<th>Acción</th>
	</tr>
	<tr>
		<td>0</td> <!-- Pila -->
		<td>e d b c a $</td> <!-- Entrada -->
		<td>d4</td> <!-- Acción -->
	</tr>
	<tr>
		<td>0 4</td> <!-- Pila -->
		<td>d b c a $</td> <!-- Entrada -->
		<td>d3</td> <!-- Acción -->
	</tr>
	<tr>
		<td>0 4 3</td> <!-- Pila -->
		<td>b c a $</td> <!-- Entrada -->
		<td>r4 (B := d)</td> <!-- Acción -->
	</tr>
	<tr>
		<td>0 4 7</td> <!-- Pila -->
		<td>b c a $</td> <!-- Entrada -->
		<td>r5 (B := e B)</td> <!-- Acción -->
	</tr>
	<tr>
		<td>0 2</td> <!-- Pila -->
		<td>b c a $</td> <!-- Entrada -->
		<td>d6</td> <!-- Acción -->
	</tr>
	<tr>
		<td>0 2 6</td> <!-- Pila -->
		<td>c a $</td> <!-- Entrada -->
		<td>d10</td> <!-- Acción -->
	</tr>
	<tr>
		<td>0 2 6 10</td> <!-- Pila -->
		<td>a $</td> <!-- Entrada -->
		<td>r3 (C := c)</td> <!-- Acción -->
	</tr>
	<tr>
		<td>0 2 6 9</td> <!-- Pila -->
		<td>a $</td> <!-- Entrada -->
		<td>r2 (A := b C)</td> <!-- Acción -->
	</tr>
	<tr>
		<td>0 2 5</td> <!-- Pila -->
		<td>a $</td> <!-- Entrada -->
		<td>d8</td> <!-- Acción -->
	</tr>
	<tr>
		<td>0 2 5 8</td> <!-- Pila -->
		<td>$</td> <!-- Entrada -->
		<td>r1 (S := B A a)</td> <!-- Acción -->
	</tr>
	<tr>
		<td>0 1</td> <!-- Pila -->
		<td>$</td> <!-- Entrada -->
		<td>aceptar</td> <!-- Acción -->
	</tr>
</table>

<div style="page-break-after: always;"></div>

<!-- Algoritmo de Construcción de la Tabla de Análisis -->

<div>
<hr style="border: 0;height: 1px;background: #333;margin-bottom:2em">
<p style="font-size:1.5em;font-weight:bold">Algoritmo de Construcción de la Tabla de Análisis</h3>
<hr style="border: 0;height: 1px;background: #333;margin-top:2em">
</div>

<br><br>

El sisguiente algoritmo nos permite crear una tabla de análisis y consta de varios subalgoritmos para construir la colección canónica de todos los elementos posibles sobre las producciones y de ahí podremos formar un autómata de estados de acuerdo a cada conjunto de la colección canónica.

### Algoritmo para construir el conjunto de elementos

Descripción del algoritmo:

1. Tomar cada una de las producciones e inicializarlas con punto como símbolo especial al principio de cada producción
2. Agregar las producciónes alteradas recorriendo el punto un lugar hasta llegar al final.

> Conjunto_Elementos(G) - Toma el conjunto de producciones `G` y devuelve el conjunto de todas los elementos posibles

~~~
C <- NUEVA COLECCIÓN

e <- 0

PARA CADA X,Y EN G:
	
	m <- LONGITUD Y

	PARA i <- 1 HASTA m INCREMENTAR 1:
		C[e] = { X: X, Y: insertar_punto(Y, i) }
		e <- e + 1
		
REGRESAR C	
~~~

### Implementación del algoritmo

> Conjunto_Elementos(G) - Toma el conjunto de producciones `G` y devuelve el conjunto de todas los elementos posibles

~~~js
function Conjunto_Elementos(G) {
	var C = {};
	
	var e = 0;
	
	Object(G).keys().forEach(function (p) {
		var X = p.X;
		var Y = p.Y;
		
		var m = Y.length;
		
		for (var i = 0; i < m; i++) {
			C[e] = { X: X, Y: insertar_punto(Y, i) };
			e++;
		}
	});
	
	return C;
}
~~~

El programa puede ser consultado en:

https://rawgit.com/badillosoft/Analizador-Sintactico/master/src/index.html

Y el código fuente está disponible en:

https://github.com/badillosoft/Analizador-Sintactico

<div style="page-break-after: always;"></div>

<!-- Biblografía -->

<div>
<hr style="border: 0;height: 1px;background: #333;margin-bottom:2em">
<p style="font-size:1.5em;font-weight:bold">Bibliografía</h3>
<hr style="border: 0;height: 1px;background: #333;margin-top:2em">
</div>

<br><br>

1. **Fundamentals of the Theory of Computation**, _R. Greenlaw, H. J. Hoover, Morgan Kaufmann_, Publishers, 1998.
2. **Lenguajes Formales y Teoría de la Computación**, _Martin C. John_, McGrawHill, 3a. Edición. 2011.
3. **Matemática Discreta y sus Aplicaciones**, _Rosen H. Kenneth_, McGrawHill, 5a. Edición. 2012.
4. **Formal Development of Programs and Proofs**, _E. W. Dijkstra_ (editor), Addison-Wesley Publishing Company, 1990.
5. **Teoría de Autómatas: Lenguajes y Computación**, _E.Hopcroft John y M. Rajeev_, Addison-Wesley, 3a. Edición, 2007.
6. **Introduction to the Theory of Computation**, _Michael Sipser_, Cengage Learning, ISBN-10: 113318779X, 2012.
7. **Teoría de la Computación: Lenguajes Formales, Autómatas y Complejidad**, _Brookshear J. G._, Addison-Wesley, 1993.