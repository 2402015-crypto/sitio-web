// app.js - utilidades compartidas
function logout() {
	try {
		// Borrar cualquier estado específico de la aplicación (si se utiliza)
		if (window.localStorage) {
			// Opcionalmente, eliminar claves específicas en lugar de todo el almacenamiento
// localStorage.removeItem('session');
		}
	} catch (e) {
		// ignorar errores de almacenamiento
	}
	// Proporcionar retroalimentación y navegar a la página de inicio de sesión
	window.location.href = 'login.html';
}

// Adjuntar controlador a cualquier botón con la clase 'cerrar' para las páginas que lo usan
document.addEventListener('DOMContentLoaded', function () {
	var btn = document.querySelector('.cerrar');
	if (btn) {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			logout();
		});
	}
});

// Controladores de Guardar / Enviar para los inputs del panel
document.addEventListener('DOMContentLoaded', function () {
	function showToast(message) {
		var t = document.createElement('div');
		t.className = 'bt-toast';
		t.textContent = message;
		document.body.appendChild(t);
		requestAnimationFrame(function () { t.classList.add('visible'); });
		setTimeout(function () { t.classList.remove('visible'); setTimeout(function () { t.remove(); }, 400); }, 2500);
	}

	// Guardar alergias (localStorage)
	document.querySelectorAll('.guardar').forEach(function (btn) {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			var row = btn.closest('.card-row');
			if (!row) return;
			var input = row.querySelector('input.input-like');
			if (!input) return showToast('No se encontró el campo para guardar.');
			var val = input.value.trim();
			if (!val) return showToast('Escribe algo antes de guardar.');
			try {
				var stored = JSON.parse(localStorage.getItem('bocaditos_alergias') || '[]');
				stored.push({ value: val, ts: Date.now() });
				localStorage.setItem('bocaditos_alergias', JSON.stringify(stored));
				showToast('Alergia guardada localmente.');
			} catch (err) {
				console.error(err);
				showToast('Error al guardar.');
			}
		});
	});

	// Enviar comentarios (simulado: guarda localmente y limpia textarea)
	document.querySelectorAll('.enviar').forEach(function (btn) {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			var row = btn.closest('.card-row');
			if (!row) return;
			var ta = row.querySelector('textarea.input-like');
			if (!ta) return showToast('No se encontró el campo de comentarios.');
			var val = ta.value.trim();
			if (!val) return showToast('Escribe tus comentarios antes de enviar.');
			try {
				// Simular envío guardando en localStorage; reemplaza con fetch() si tienes backend
				var arr = JSON.parse(localStorage.getItem('bocaditos_comentarios') || '[]');
				arr.push({ text: val, ts: Date.now() });
				localStorage.setItem('bocaditos_comentarios', JSON.stringify(arr));
				ta.value = '';
				showToast('Comentario enviado.');
			} catch (err) {
				console.error(err);
				showToast('Error al enviar.');
			}
		});
	});
});

