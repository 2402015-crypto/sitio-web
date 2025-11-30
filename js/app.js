// app.js - utilidades compartidas
console.log('app.js loaded (with dashboard edit controls)');
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
					// populate other dashboard fields
					try {
						var roleEl = document.getElementById('role-value');
						var matriculaEl = document.getElementById('matricula-value');
						var cuatriEl = document.getElementById('cuatrimestre-value');
						var carreraEl = document.getElementById('carrera-value');
						var grupoEl = document.getElementById('grupo-value');
						if (roleEl) roleEl.textContent = (user.roleName || user.role || (user.id_rol ? 'Beneficiario' : ''));
						if (matriculaEl) matriculaEl.textContent = (user.matricula || user.matricula || '');
						if (cuatriEl) cuatriEl.textContent = (user.cuatrimestre || user.cuatrimestre || '');
						// leave carrera and grupo blank as requested
						if (carreraEl) carreraEl.textContent = '';
						if (grupoEl) grupoEl.textContent = '';
					} catch (e) { /* ignore */ }
				}).catch(function(){
					// fallback to localStorage user if available
					try {
						var u = JSON.parse(localStorage.getItem('bocaditos_user') || 'null');
						if (u && (u.name || u.nombre)) {
							var n = (u.name || u.nombre).trim();
							var a = (u.apellido || '').trim();
							el.textContent = n + (a ? ' ' + a : '');
							// populate minimal fields from localStorage fallback
							var roleEl2 = document.getElementById('role-value');
							var matriculaEl2 = document.getElementById('matricula-value');
							var cuatriEl2 = document.getElementById('cuatrimestre-value');
							var carreraEl2 = document.getElementById('carrera-value');
							var grupoEl2 = document.getElementById('grupo-value');
							if (roleEl2) roleEl2.textContent = (u.roleName || u.role || 'Beneficiario');
							if (matriculaEl2) matriculaEl2.textContent = (u.matricula || '');
							if (cuatriEl2) cuatriEl2.textContent = (u.cuatrimestre || '');
							if (carreraEl2) carreraEl2.textContent = '';
							if (grupoEl2) grupoEl2.textContent = '';
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

		// Edit profile: show form, allow editing and save via API
		(function setupEditProfile(){
			var completeBtn = document.getElementById('complete-data-btn');
			var container = document.getElementById('edit-profile-container');
			var form = document.getElementById('edit-profile-form');
			var saveBtn = document.getElementById('save-profile-btn');
			var cancelBtn = document.getElementById('cancel-profile-btn');
			if (!completeBtn || !container || !form) return;

			function fillFormWithUser(user){
				try{
					document.getElementById('edit-name').value = user.name || user.nombre || '';
					document.getElementById('edit-apellido').value = user.apellido || '';
					document.getElementById('edit-matricula').value = user.matricula || '';
					document.getElementById('edit-cuatrimestre').value = user.cuatrimestre || '';
					document.getElementById('edit-carrera').value = user.carrera || '';
					document.getElementById('edit-grupo').value = user.grupo || '';
				}catch(e){console.warn('fillForm error', e);}        
			}

			completeBtn.addEventListener('click', function(ev){
				ev.preventDefault();
				// fetch current user if token present
				var token = localStorage.getItem('bocaditos_token');
				if (token){
					fetch('http://localhost:3000/me', { headers: { 'Authorization': 'Bearer ' + token }})
					.then(function(r){ if (!r.ok) throw new Error('no-auth'); return r.json(); })
					.then(function(user){ fillFormWithUser(user); container.style.display = 'block'; })
					.catch(function(){
						// fallback to localStorage
						try{ var u = JSON.parse(localStorage.getItem('bocaditos_user')||'null'); if(u) { fillFormWithUser(u); container.style.display='block'; } }
						catch(e){ showToast('No se pudo cargar los datos de usuario'); }
					});
				} else {
					try{ var u2 = JSON.parse(localStorage.getItem('bocaditos_user')||'null'); if(u2){ fillFormWithUser(u2); container.style.display='block'; return; } }catch(e){}
					showToast('Debes iniciar sesión para editar tus datos');
				}
			});

			cancelBtn && cancelBtn.addEventListener('click', function(ev){ ev.preventDefault(); container.style.display='none'; });

			form.addEventListener('submit', function(ev){
				ev.preventDefault();
				var token = localStorage.getItem('bocaditos_token');
				var stored = null;
				try{ stored = JSON.parse(localStorage.getItem('bocaditos_user')||'null'); }catch(e){}
				var userId = (stored && stored.id) || null;

				// Simple validation
				var nameVal = document.getElementById('edit-name').value.trim();
				var apellidoVal = document.getElementById('edit-apellido').value.trim();
				var matriculaVal = document.getElementById('edit-matricula').value.trim();
				var cuatriVal = document.getElementById('edit-cuatrimestre').value.trim();
				if (!nameVal || nameVal.length < 2) { showToast('El nombre debe tener al menos 2 caracteres'); return; }
				if (apellidoVal && apellidoVal.length < 2) { showToast('El apellido debe tener al menos 2 caracteres'); return; }
				if (matriculaVal && matriculaVal.length < 5) { showToast('La matrícula debe tener al menos 5 caracteres'); return; }

				// show confirmation modal
				var modal = document.getElementById('confirm-modal');
				var yes = document.getElementById('confirm-yes');
				var no = document.getElementById('confirm-no');
				if (!modal || !yes || !no) {
					showToast('No se pudo mostrar la confirmación');
					return;
				}
				modal.style.display = 'flex';

				// ensure single-use handlers
				function cleanupHandlers(){
					yes.removeEventListener('click', onYes);
					no.removeEventListener('click', onNo);
				}

				function onNo(ev){
					ev && ev.preventDefault();
					modal.style.display = 'none';
					cleanupHandlers();
				}

				function doUpdate(id){
					if (!id){ showToast('Usuario no identificado'); modal.style.display='none'; cleanupHandlers(); return; }
					var payload = {
						name: nameVal,
						apellido: apellidoVal,
						matricula: matriculaVal,
						cuatrimestre: cuatriVal,
						carrera: document.getElementById('edit-carrera').value.trim(),
						grupo: document.getElementById('edit-grupo').value.trim()
					};
					yes.disabled = true;
					fetch('http://localhost:3000/update-user/' + id, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (token || '') },
						body: JSON.stringify(payload)
					}).then(function(res){ yes.disabled = false; if (!res.ok) return res.json().then(function(j){ throw j; }); return res.json(); })
					.then(function(updated){
						try{
							var title = document.querySelector('.user-title');
							if (title) title.textContent = (updated.name || updated.nombre) + (updated.apellido ? ' ' + updated.apellido : '');
							var mat = document.getElementById('matricula-value'); if(mat) mat.textContent = updated.matricula || '';
							var cuat = document.getElementById('cuatrimestre-value'); if(cuat) cuat.textContent = updated.cuatrimestre || '';
							var car = document.getElementById('carrera-value'); if(car) car.textContent = updated.carrera || '';
							var gru = document.getElementById('grupo-value'); if(gru) gru.textContent = updated.grupo || '';
							try{ var lu = JSON.parse(localStorage.getItem('bocaditos_user')||'null') || {}; Object.assign(lu, updated); localStorage.setItem('bocaditos_user', JSON.stringify(lu)); }catch(e){}
						}catch(e){console.warn('update UI error', e);}                    
						showToast('Datos actualizados');
						container.style.display='none';
						modal.style.display='none';
						cleanupHandlers();
					}).catch(function(err){
						yes.disabled = false;
						console.error('update error', err);
						showToast(err && err.error ? err.error : 'Error al guardar');
						modal.style.display='none';
						cleanupHandlers();
					});
				}

				function onYes(ev){
					ev && ev.preventDefault();
					// identify user id then update
					if (userId && token){ doUpdate(userId); return; }
					if (token){
						fetch('http://localhost:3000/me', { headers: { 'Authorization': 'Bearer ' + token }})
						.then(function(r){ if (!r.ok) throw new Error('no-auth'); return r.json(); })
						.then(function(user){ doUpdate(user.id); })
						.catch(function(){ showToast('No se pudo identificar al usuario'); modal.style.display='none'; cleanupHandlers(); });
					} else { showToast('Debes iniciar sesión'); modal.style.display='none'; cleanupHandlers(); }
				}

				yes.addEventListener('click', onYes);
				no.addEventListener('click', onNo);
			});
		})();
	});
});

