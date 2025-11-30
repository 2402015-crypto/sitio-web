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
    // Redirect to login with role=donor so login redirects to donor dashboard
    window.location.href = 'login.html?role=donor';
  });
});
