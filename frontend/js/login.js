document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const nombre = document.getElementById('username').value.trim();
    const contrasenia = document.getElementById('password').value.trim();

    if (nombre === 'admin' && contrasenia === '12345') {
        window.location.href = 'dashboard.html'; 
    } else {
        alert('Usuario o contraseña incorrectos'); 
    }
});
