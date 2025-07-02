import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/UserListings.css'
import DeleteButton from './DeleteButton.jsx';
import Header from './Header.jsx';
import EditListingButton from './EditListingButton.jsx';
import ListingAnalytics from './ListingAnalytics.jsx';
import ListingFilters from './ListingFilter';


function UserListings() {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    //получаем объявления при загрузке компонента
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    navigate('/login');
                    return;
                }


                console.log('userId: ', user.id);

                const response = await fetch(`http://localhost:5000/api/listings?userId=${user.id}`);


                if(!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }

                const data = await response.json();
                setListings(data);
                setFilteredListings(data);
                // Получаем уникальные города
                const uniqueCities = [...new Set(data.map(item => item.city))];
                setCities(uniqueCities);

            } catch(err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [navigate]);

    if (loading) return <div>Загрузка...</div>
    if (error) return <div>Ошибка: {error}</div>
    

    // Обработчик фильтрации
    const handleFilter = async (filters) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const params = new URLSearchParams();
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.city) params.append('city', filters.city);
        params.append('userId', user.id);

        const res = await fetch(`http://localhost:5000/api/listings/filtered?${params}`);
        const data = await res.json();
        setFilteredListings(data);
    };


    return (
        <>
        <Header/>
        <ListingAnalytics />
        <div className='listings-container'>
            <ListingFilters onFilter={handleFilter} cities={cities} />
        </div>
        
        <div className='listings-container'>
            
            <div className="filters-container row">
                <h2>Ваши объявления</h2>
                <Link to='/add-listing'><button className='white-btn green-btn'>Добавить</button></Link>
            </div>
            {listings.length === 0 ? (<p>У вас пока нет объявлений</p>)
            : (
                <div>
                {filteredListings.map((listing) =>(
                    <div key={listing.id} className='listing-card row'>
                        <div className='row'>
                            
                            <div>
                                    <h2>{listing.title}</h2>
                                    <p className='city'>{listing.city}</p>
                                    <p className='price'>{listing.price.toLocaleString()} ₽</p>
                                    <div><span className='city'>Агент: {listing.username}</span></div>
                            </div>
                            
                        </div>
                        
                        <div className='icons'>
                            <EditListingButton listing={listing}/>
                            <DeleteButton 
                                listingId={listing.id}  
                                onDeleteSuccess={(deletedId) => setListings(listings.filter(l => l.id !== deletedId))}
                            /> 
                            
                        </div>
                            
                    </div>
                ))}
                </div>
            )}
        </div>
        </>
    );
};

export default UserListings;

