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
	// Populate user display (Nombre + Apellido) in pages that have .user-title
	(function populateUserTitle(){
		try {
			var el = document.querySelector('.user-title');
			if (!el) return;

			// Prefer backend /me if token exists
			var token = localStorage.getItem('bocaditos_token');
			if (token) {
				fetch('http://localhost:3000/me', {
					method: 'GET',
					headers: { 'Authorization': 'Bearer ' + token }
				}).then(function(res){
					if (!res.ok) throw new Error('no-auth');
					return res.json();
				}).then(function(user){
					if (!user) return;
					var name = (user.name || user.nombre || '').trim();
					var apellido = (user.apellido || '').trim();
					var display = name + (apellido ? ' ' + apellido : '');
					if (display) el.textContent = display;
				}).catch(function(){
					// fallback to localStorage user if available
					try {
						var u = JSON.parse(localStorage.getItem('bocaditos_user') || 'null');
						if (u && (u.name || u.nombre)) {
							var n = (u.name || u.nombre).trim();
							var a = (u.apellido || '').trim();
							el.textContent = n + (a ? ' ' + a : '');
						}
					} catch (e){/* ignore */}
				});
				return;
			}

			// No token: try localStorage
			try {
				var u2 = JSON.parse(localStorage.getItem('bocaditos_user') || 'null');
				if (u2 && (u2.name || u2.nombre)) {
					var nn = (u2.name || u2.nombre).trim();
					var aa = (u2.apellido || '').trim();
					el.textContent = nn + (aa ? ' ' + aa : '');
				}
			} catch (e) { /* ignore parse errors */ }
		} catch (err) {
			// don't break page
			console.warn('populateUserTitle error', err);
		}
	})();
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

