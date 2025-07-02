import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) navigate ('/login');
    }, []);

    return <div>Добро пожаловать, {user?.name}!</div>;
};

export default Dashboard;