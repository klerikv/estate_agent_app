import { useState } from 'react';

function LoginForm() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка входа');
      }

      const { user } = await response.json();
      console.log('Успешный вход! Пользователь:', user);
      // Сохраняем данные пользователя 
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/listings'; //перенаправление

      
    } catch (err) {
      setError(err.message);
    }
  };

  return (        
    <form onSubmit={handleSubmit} className='add-listing-form col center listings-container' >
      <h2>Вход в личный кабинет</h2>
      <input
        type="text"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Логин"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        required
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button className='white-btn' type="submit">Войти</button>
    </form>
  );
}

export default LoginForm;