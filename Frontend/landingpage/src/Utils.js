// Get Username
const getUserName = () => {
    let data = localStorage.getItem('user');
    if (data != null) {
        data = JSON.parse(data);
        return data.username;
    }
    return '';
}

const getUserID = () => {
    let data = localStorage.getItem('user');
    if (data != null) {
        data = JSON.parse(data);
        return data.id;
    }
    return '';
}

// Format Date
const formatDate = (date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date(date);
    return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// Format Tags
const tagArray = (tags) => {
    if (tags) {
        const tagArray = tags.split(',');
        return tagArray;
    }
}

// Rating to star array
const ratingToStars = (rating) => {
    let stars = [0, 0, 0, 0, 0];
    let counter = 0;
    while (rating > 0) {
        if (rating >= 1) {
            stars[counter] = 1;
            rating -= 1;
        } else {
            stars[counter] = rating;
            rating = 0;
        }
        counter++;
    }
    return stars;
}

export { getUserName, formatDate, tagArray, ratingToStars, getUserID };