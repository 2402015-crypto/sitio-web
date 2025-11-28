// app.js - utilidades compartidas
function logout() {
	try {
		// Clear any app-specific state (if used)
		if (window.localStorage) {
			// Optionally clear specific keys instead of whole storage
			// localStorage.removeItem('session');
		}
	} catch (e) {
		// ignore storage errors
	}
	// Provide feedback and navigate to login page
	window.location.href = 'login.html';
}

// Attach handler to any button with class 'cerrar' for pages that use it
document.addEventListener('DOMContentLoaded', function () {
	var btn = document.querySelector('.cerrar');
	if (btn) {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			logout();
		});
	}
});

