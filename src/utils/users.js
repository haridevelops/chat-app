const users = [];

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    // check for existing user
    const exisitingUsers = users.find(user => user.room === room && user.username === username);

    // validate username
    if (exisitingUsers) {
        return {
            error: 'Username already exists!'
        }
    }

    // store user
    const user = { id, username, room };
    users.push(user);

    return {user};
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    
    if (index != -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => {
    room = room.toLowerCase();
    return users.filter(user => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }