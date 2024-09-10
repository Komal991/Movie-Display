document.addEventListener('DOMContentLoaded', function() {
    // Load saved recommendations from localStorage when the page loads
    loadRecommendations();

    document.getElementById('recommendationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;

        // Format the new recommendation
        const formattedMessage = name ? `“ ${message} ” - ${name}` : `“ ${message} ”`;

        // Create and add the new recommendation
        addRecommendation(formattedMessage);

        // Save the new recommendation to localStorage
        saveRecommendation(formattedMessage);

        // Clear the form
        document.getElementById('recommendationForm').reset();
    });
});

function addRecommendation(message) {
    const newRecommendation = document.createElement('div');
    newRecommendation.classList.add('recommendation');

    // Add recommendation text and remove button
    newRecommendation.innerHTML = `
        <p>${message}</p>
        <button class="remove-btn">Remove</button>
    `;

    const recommendationsContainer = document.querySelector('.recommendations');
    recommendationsContainer.appendChild(newRecommendation);

    // Add event listener to the remove button
    newRecommendation.querySelector('.remove-btn').addEventListener('click', function() {
        removeRecommendation(message, newRecommendation);
    });
}

function saveRecommendation(message) {
    let recommendations = JSON.parse(localStorage.getItem('recommendations')) || [];
    recommendations.push(message);
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
}

function loadRecommendations() {
    let recommendations = JSON.parse(localStorage.getItem('recommendations')) || [];
    recommendations.forEach(message => addRecommendation(message));
}

function removeRecommendation(message, recommendationElement) {
    // Remove the recommendation from the DOM
    recommendationElement.remove();

    // Remove the recommendation from localStorage
    let recommendations = JSON.parse(localStorage.getItem('recommendations')) || [];
    recommendations = recommendations.filter(rec => rec !== message);
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
}
