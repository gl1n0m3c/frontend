
const api = "https://nomoreparties.co/v1/frontend-st-cohort-201";

const me = `${api}/users/me`;
const cards = `${api}/cards`;

const headers = {
    authorization: "961a71fe-eb41-46f5-a026-43e86bb63e8d",
    'Content-Type': "application/json"
};

const errorHandler = async (res) => {
    if (res.ok) {
        return await res.json();
    }
    return Promise.reject(`Error: ${JSON.stringify(res.body)}`);
}

const logger = error => console.log(error);


//API Requests

const fetchUserData = () => {
    return fetch(me, {headers}).then(errorHandler).catch(logger);
}

const fetchCards = () => {
    return fetch(cards, {headers}).then(errorHandler).catch(logger);
}

const updateProfile = (profile) => {
    return fetch(me, {
        method: "PATCH",
        headers,
        body: JSON.stringify(profile),
    })
    .then(errorHandler)
    .catch(logger);
}

const addCard = (card) => {
    return fetch(cards, {
        method: "POST",
        headers,
        body: JSON.stringify(card),
    })
    .then(errorHandler)
    .catch(logger);
}

const deleteCard = (cardId) => {
    return fetch(`${cards}/${cardId}`, {
        method: "DELETE",
        headers,
    })
    .then(errorHandler)
    .catch(logger);
}

const toggleLikeCard = (cardId, method) => {
    if (method === "PUT" || method === "DELETE") {
        return fetch(`${cards}/likes/${cardId}`, {
            method,
            headers
        })
        .then(errorHandler)
        .catch(logger);
    }
    console.log(`[toggleLikeCard]: Method(${method}) is not allowed (405)`);
    return null;
}

const updateAvatar = (avatar) => {
    return fetch(`${me}/avatar`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(avatar)
    })
    .then(errorHandler)
    .catch(logger);
}

export {fetchUserData, fetchCards, updateProfile, addCard, deleteCard, toggleLikeCard, updateAvatar};