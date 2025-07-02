import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    const handleButton = () => {
        //Удаляем данные пользователя из localStorage
        localStorage.removeItem('user');

        //перенаправляем на форму входа
        navigate('/login');
    };

    return (
        <button className='logout-button' onClick={handleButton}>
            Выйти
        </button>
    );
};

export default LogoutButton;