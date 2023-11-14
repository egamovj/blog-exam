document.addEventListener('DOMContentLoaded', function() {
    let openHam = document.querySelector('#openHam');
    let closeHam = document.querySelector('#closeHam');
    let navigationItems = document.querySelector('.navbar__wrapper');

    const toggleHamburger = () => {
        let computedStyle = window.getComputedStyle(navigationItems);
        navigationItems.style.display = computedStyle.getPropertyValue('display') === 'none' ? 'flex' : 'none';
        openHam.style.display = computedStyle.getPropertyValue('display') === 'none' ? 'block' : 'none';
        closeHam.style.display = computedStyle.getPropertyValue('display') === 'none' ? 'none' : 'block';
    };

    const handleResize = () => {
        if (window.innerWidth <= 576) {
            toggleHamburger();
        } else {
            navigationItems.style.display = 'flex';
            openHam.style.display = 'none';
            closeHam.style.display = 'none';
        }
    };

    handleResize();

    openHam.addEventListener('click', toggleHamburger);
    closeHam.addEventListener('click', toggleHamburger);

    window.addEventListener('resize', handleResize);
});

function validateForm() {
    const name = document.getElementById("firstName").value.trim();
    const lastname = document.getElementById("lastName").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    document.getElementById("name-error").innerHTML = "";
    document.getElementById("lastname-error").innerHTML = "";
    document.getElementById("username-error").innerHTML = "";
    document.getElementById("password-error").innerHTML = "";

    if (name === "") {
        document.getElementById("name-error").innerHTML = "Please enter your First Name";
        return false;
    }

    if (lastname === "") {
        document.getElementById("lastname-error").innerHTML = "Please enter your Last Name";
        return false;
    }

    if (username === "") {
        document.getElementById("username-error").innerHTML = "Please enter Username";
        return false;
    } else if (username.length < 5 || username.length > 20) {
        document.getElementById("username-error").innerHTML = "Username must be between 5 and 20 characters";
        return false;
    }

    if (password === "") {
        document.getElementById("password-error").innerHTML = "Please enter a password";
        return false;
    } else if (password.length < 7 || password.length > 20) {
        document.getElementById("password-error").innerHTML = "Password must be between 7 and 20 characters";
        return false;
    }

    if (password !== confirmPassword) {
        document.getElementById("password-error").innerHTML = "Passwords do not match";
        return false;
    }

    return true;
}


document.getElementById("registration-form").addEventListener("submit", function(e) {
    if (!validateForm()) {
        e.preventDefault();
    }
});


/* ------- RENDER DATA TO THE DOM ------- */



const postContainer = document.getElementById('userList');

async function createUser() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const userName = document.getElementById('username').value.trim();
    const userID = new Date().getMilliseconds();

    const response = await fetch('https://reqres.in/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, userName, userID }),
    });

    if (response.ok) {
        const newUser = await response.json();
        console.log(newUser);
        const postWrapper = document.createElement('li');
        postWrapper.classList.add('userListsItem')

        const name = document.createElement('span');
        name.textContent = newUser.firstName;

        const lastNameElement = document.createElement('span');
        lastNameElement.textContent = newUser.lastName;

        const userName = document.createElement('span');
        userName.textContent = newUser.userName;

        postWrapper.appendChild(name);
        postWrapper.appendChild(lastNameElement);
        postWrapper.appendChild(userName);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        postWrapper.appendChild(deleteButton);

        postContainer.appendChild(postWrapper);

        deleteButton.addEventListener('click', () => {
            deletePost(newUser.id, postWrapper);
        });
    }
}

async function deletePost(postId, postElement) {
    const response = await fetch(`https://reqres.in/api/users/${postId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        postContainer.removeChild(postElement);
    } else {
        console.log(`${postId} bilan o'chirishda xatolik ro'y berdi`);
    }
}

function searchUsers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const users = document.querySelectorAll('.userListsItem');

    users.forEach(user => {
        const firstName = user.querySelector('span:nth-child(1)').textContent.toLowerCase();
        const lastName = user.querySelector('span:nth-child(2)').textContent.toLowerCase();
        const username = user.querySelector('span:nth-child(3)').textContent.toLowerCase();

        if (firstName.includes(searchInput) || lastName.includes(searchInput) || username.includes(searchInput)) {
            user.style.display = 'flex';
        } else {
            user.style.display = 'none';
        }
    });
}


const form = document.getElementById('registration-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    createUser();
    form.reset();
});