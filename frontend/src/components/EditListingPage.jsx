import { useState, useEffect } from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';

import '../styles/AddListingForm.css';
import Header from './Header';
import {toast} from 'react-toastify';


const EditListingPage = () => {
    const {state} = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        city: ''
    });

    const [error, setError] = useState('');

    useEffect (() => {
        if (state?.listing) {
            setFormData({
                title: state.listing.title,
                price: state.listing.price,
                city: state.listing.city
            });
        } else navigate('/listings') //если нет данных - возвращаемся обратно

    }, [state, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch (
                `http://localhost:5000/api/listings/${state.listing.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formData,
                        userId: user.id
                    })
                }
            );

            if (!response.ok) throw new Error(errorData.error|| 'ошибка обновления');

            toast.success('Изменения успешно сохранены!');
            
            navigate('/listings', {state: {update: true}});

        }catch (err) {
            setError(err.message);
            toast.error('Ошибка при сохранении изменений');
            
        }
    };

    return (
        <>
        <Header />
        <div className="listings-container">
        <button className='back-button row' ><Link to='/listings'>← Назад</Link></button>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className='add-listing-form col'>
            <h2>Редактирование объявления</h2>
            <div className="form-group col">
            <label>Название:</label>
            <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
            />
            </div>

            <div className="form-group col">
            <label>Цена (₽):</label>
            <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                min="100000"
                required
            />
            </div>

            <div className="form-group col">
            <label>Город:</label>
            <select
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
            >
                <option value='Тюмень'>Тюмень</option>
                <option value='Москва'>Москва</option>
                <option value='Казань'>Казань</option>
                <option value='Екатеринбург'>Екатеринбург</option>
            </select>
            </div>

            <button type="submit" className='white-btn blue-btn'>
                Сохранить
            </button>
        </form>
        </div>
        </>
    );
};

export default EditListingPage;