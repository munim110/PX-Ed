// Get Username
const getUserName = () => {
    let data = localStorage.getItem('user');
    if (data != null) {
        data = JSON.parse(data);
        return data.username;
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

export { getUserName, formatDate, tagArray };