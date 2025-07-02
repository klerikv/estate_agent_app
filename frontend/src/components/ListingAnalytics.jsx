import { useState, useEffect } from 'react';

const ListingAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.id;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/listings/analytics/${userId}`
        );
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки аналитики');
        }

        const data = await response.json();
        setAnalytics(data);
        
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnalytics();
  }, [userId]);

  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!analytics) return null;

  return (
    <div className=" text-center">     
      <div className="analytics-grid row">
        <div>
          <p>{analytics.count}</p>
          <h4>объявлений</h4>
        </div>
        
        <div>
          <p>{analytics.avgPrice.toLocaleString()} ₽</p>
          <h4>средняя цена</h4>
        </div>
        
        <div>
          <ol>
            {analytics.topCities.map((city, index) => (
              <li key={city.city}>
                {city.city} ({city.count})
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ListingAnalytics;