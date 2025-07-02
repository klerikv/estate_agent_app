import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditListingButton = ({listing}) => {
    const navigate = useNavigate();

    const handleEditClick = () => {
        // Передаем данные объявления через state в навигации
        navigate('/edit-listing', { state: {listing} });
    };

    return (
        <button onClick={handleEditClick}>
            <img src='src/images/edit.png'></img>
        </button>
    );
};

export default EditListingButton;