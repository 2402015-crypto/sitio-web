// donador.js
function logout() {
  // clear any donor session info if you want
  // localStorage.removeItem('bocaditos_donor_profile');
  alert("Sesión cerrada");
  window.location.href = "login.html";
}

// Optionally expose a function to load donor data (kept here for possible reuse)
function getDonorProfile(){
  try{ return JSON.parse(localStorage.getItem('bocaditos_donor_profile')||'null'); }catch(e){ return null; }
}