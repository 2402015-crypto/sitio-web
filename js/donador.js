// donador.js
function logout() {
  // borrar cualquier información de sesión del donante si lo deseas
  // localStorage.removeItem('bocaditos_donor_profile');
  alert("Sesión cerrada");
  window.location.href = "login.html";
}

// Opcionalmente, exponer una función para cargar datos de donantes (se mantiene aquí para posible reutilización)
function getDonorProfile(){
  try{ return JSON.parse(localStorage.getItem('bocaditos_donor_profile')||'null'); }catch(e){ return null; }
}