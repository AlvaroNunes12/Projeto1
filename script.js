// Função para login
async function login(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const msg = document.getElementById('msg');

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await response.json();
    if (response.ok) {
      msg.textContent = data.message;
      msg.style.color = 'green';
      // Redirecionar para home após 1 segundo
      setTimeout(() => {
        window.location.href = 'Home/index.html';
      }, 1000);
    } else {
      msg.textContent = data.error;
      msg.style.color = 'red';
    }
  } catch (error) {
    msg.textContent = 'Erro ao conectar ao servidor.';
    msg.style.color = 'red';
  }
}

// Função para registro
async function register(event) {
  event.preventDefault();
  const email = document.getElementById('regEmail').value;
  const senha = document.getElementById('regSenha').value;
  const msg = document.getElementById('regMsg');

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await response.json();
    if (response.ok) {
      msg.textContent = data.message;
      msg.style.color = 'green';
      // Redirecionar para home após 2 segundos
      setTimeout(() => {
        window.location.href = 'Home/index.html';
      }, 2000);
    } else {
      msg.textContent = data.error;
      msg.style.color = 'red';
    }
  } catch (error) {
    msg.textContent = 'Erro ao conectar ao servidor.';
    msg.style.color = 'red';
  }
}

// Função para toggle de senha
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input.type === 'password') {
        input.type = 'text';
        this.classList.remove('bx-show');
        this.classList.add('bx-hide');
      } else {
        input.type = 'password';
        this.classList.remove('bx-hide');
        this.classList.add('bx-show');
      }
      this.style.animation = 'rotate 0.3s ease';
      setTimeout(() => this.style.animation = '', 300);
    });
  });
});

// Funções para alternar entre formulários
function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('forgotForm').style.display = 'none';
  document.getElementById('resetForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

function showForgotPassword() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('forgotForm').style.display = 'block';
}

function showResetPassword() {
  document.getElementById('forgotForm').style.display = 'none';
  document.getElementById('resetForm').style.display = 'block';
}

// Função para esqueci a senha
async function forgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('forgotEmail').value;
  const msg = document.getElementById('forgotMsg');

  try {
    const response = await fetch('/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    msg.textContent = data.message || data.error;
    msg.style.color = response.ok ? 'green' : 'red';
    if (response.ok) {
      setTimeout(() => showResetPassword(), 2000); // Ir para reset após sucesso
    }
  } catch (error) {
    msg.textContent = 'Erro ao conectar ao servidor.';
    msg.style.color = 'red';
  }
}

// Função para resetar senha
async function resetPassword(event) {
  event.preventDefault();
  const token = document.getElementById('resetToken').value;
  const novaSenha = document.getElementById('novaSenha').value;
  const msg = document.getElementById('resetMsg');

  try {
    const response = await fetch('/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, novaSenha })
    });
    const data = await response.json();
    if (response.ok) {
      msg.textContent = data.message;
      msg.style.color = 'green';
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        showLogin();
      }, 2000);
    } else {
      msg.textContent = data.error;
      msg.style.color = 'red';
    }
  } catch (error) {
    msg.textContent = 'Erro ao conectar ao servidor.';
    msg.style.color = 'red';
  }
}