document.getElementById('vehicle-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Récupère les valeurs du formulaire
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const max_speed = parseInt(document.getElementById('max_speed').value);
    const storage_capacity = parseInt(document.getElementById('storage_capacity').value);
    const category_id = parseInt(document.getElementById('category').value); // Récupère l'identifiant de la catégorie
    const sub_category = document.getElementById('sub_category').value || null;
    const image_url = document.getElementById('image_url').value;

    // Prépare les données à envoyer
    const vehicleData = {
        name,
        price,
        max_speed,
        storage_capacity,
        category_id, // Ajoute la catégorie
        sub_category,
        image_url
    };

    // Envoie les données au backend via une requête POST
    fetch('http://localhost:3000/api/vehicles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Véhicule ajouté avec succès !');
        document.getElementById('vehicle-form').reset();
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout du véhicule.');
    });
});