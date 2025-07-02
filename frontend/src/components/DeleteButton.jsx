import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const DeleteButton = ({listingId, onDeleteSuccess}) => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {

        if (!window.confirm('Вы точно хотите удалить это объявление?')) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if(!user) return navigate('/login');

            const response = await fetch(`http://localhost:5000/api/listings/${listingId}`,
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId: user.id})
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении');
            }

            toast.success('Объявление успешно удалено!');
            onDeleteSuccess(listingId);
        } catch(err) {
            console.error('Ошибка удаления');
            setError(err.message);
            toast.error('Ошибка при удалении объявления');

        }
    };

    return (
        <button onClick={handleDelete}>
            <img src='src/images/delete.png'></img>
        </button>
    );
}

export default DeleteButton;


/*
const handleDelete = async (listingId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user){
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/listings/${listingId}`, 
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId: user.id})
                }
            );

            if (!response.ok) {
                throw new Error('Ошибка при удалении');
            }

            //Обновляем список объявлений после удаления
            setListings(listings.filter(listing => listing.id !== listingId));

        }catch (err) {
            console.error('Ошибка удаления');
            setError(err.message);
        }
    };
*/
