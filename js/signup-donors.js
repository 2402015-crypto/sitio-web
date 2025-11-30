// signup-donors.js
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('signupDonorForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {
      razon: document.getElementById('razon').value.trim(),
      rfc: document.getElementById('rfc').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      correo: document.getElementById('correo').value.trim(),
      ubicacion: document.getElementById('ubicacion').value.trim(),
      createdAt: Date.now()
    };
    try {
      localStorage.setItem('bocaditos_donor_profile', JSON.stringify(data));
    } catch (err) {
      console.error('Error saving donor profile', err);
    }
    // Redirigir al inicio de sesión con role=donor para que el inicio de sesión redirija al panel del donante
    window.location.href = 'login.html?role=donor';
  });
});
