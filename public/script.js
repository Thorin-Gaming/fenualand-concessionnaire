// Appel à l'API pour récupérer les véhicules
fetch('http://localhost:3000/api/vehicles')
    .then(response => response.json())
    .then(data => {
        const carContainer = document.getElementById('car-container');
        data.vehicles.forEach(vehicle => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';

            // Associe l'ID de la catégorie au nom de la catégorie avec categoryMap
            const categoryName = categoryMap[vehicle.category_id] || 'aucune'; // "aucune" si aucune correspondance
            carCard.setAttribute('data-category', categoryName.toLowerCase());

            carCard.innerHTML = `
                <h3>${vehicle.name}</h3>
                <p>Prix: ${vehicle.price} XPF</p>
                <p>Vitesse Max: ${vehicle.max_speed} km/h</p>
                <p>Capacité de stockage: ${vehicle.storage_capacity}</p>
                <img src="${vehicle.image_url}" alt="${vehicle.name}">
            `;
            carContainer.appendChild(carCard);
        });
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
	
	function filterCategory(category) {
    const carCards = document.querySelectorAll('.car-card');
    carCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            const carCategory = card.getAttribute('data-category');
            card.style.display = (carCategory === category) ? 'block' : 'none';
        }
    });
}

// Map d'association entre les IDs de catégories et leurs noms
const categoryMap = {
    1: 'sportive',
    2: 'suv',
    3: '4x4'
    // Ajoute d'autres associations ID-nom ici si nécessaire
};

db.all(`SELECT vehicles.*, categories.name AS category_name
        FROM vehicles
        LEFT JOIN categories ON vehicles.category_id = categories.id`, [], (err, rows) => {
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    res.json({ vehicles: rows });
});