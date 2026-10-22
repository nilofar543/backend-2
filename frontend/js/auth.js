let isRegister = false;
const $ = (id) => document.getElementById(id);

$('switch').onclick = (e) => {
  e.preventDefault();
  isRegister = !isRegister;
  $('title').textContent = isRegister ? 'Register' : 'Login';
  $('submit').textContent = isRegister ? 'Create account' : 'Login';
  $('name').style.display = isRegister ? 'block' : 'none';
  $('switch-text').textContent = isRegister ? 'Already have an account?' : 'New here?';
  $('switch').textContent = isRegister ? 'Login' : 'Create an account';
  $('msg').textContent = '';
};

$('submit').onclick = async () => {
  const body = { email: $('email').value.trim(), password: $('password').value };
  if (isRegister) body.name = $('name').value.trim();
  try {
    const data = await api(isRegister ? '/auth/register' : '/auth/login', { method: 'POST', body: JSON.stringify(body) });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    location.href = 'index.html';
  } catch (err) {
    $('msg').className = 'msg error';
    $('msg').textContent = err.message;
  }
};
