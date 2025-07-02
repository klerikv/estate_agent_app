import { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';

import '../styles/AddListingForm.css';
import Header from './Header';

import {toast} from 'react-toastify';


function AddListingForm() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('')
    const [city, setCity] = useState('Тюмень');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleButton = async (e) => {
        e.preventDefault();

        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if(!user){
                navigate('/login');
                return
            }

            const response = await fetch('http://localhost:5000/api/listings', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title,
                    price: Number(price),
                    city,
                    userId: user.id
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка при добавлении');
            }

            toast.success('Объявление успешно добавлено!');
            
            //после успешного добавления направляем на список объявлений
            navigate('/listings');

        } catch(err) {
            setError(err.message);
            toast.error('Ошибка при создании объявления');
        }
    }

    return (
        <>
        <Header />
        <div className='listings-container'>
            <button className='back-button row' ><Link to='/listings'>← Назад</Link></button>

            
            {error && <div className='error-message'>{error}</div>}
            <form onSubmit={handleButton} className='add-listing-form col'>
                <h2>Добавить новое объявление</h2>
                <input id='title'
                    type='text'
                    value={title} 
                    placeholder='Название'
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            
                
                <input id='price'
                    type='number'
                    value={price} 
                    placeholder='Цена (₽)'
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min='100000'
                />
                
                <select id='city' 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}>
                        <option value='Тюмень'>Тюмень</option>
                        <option value='Москва'>Москва</option>
                        <option value='Казань'>Казань</option>
                        <option value='Екатеринбург'>Екатеринбург</option>
                </select>
                

                <button type='submit' className='white-btn'>
                    Добавить объявление
                </button>

            </form>
        </div>
        </>
    );

}

export default AddListingForm;