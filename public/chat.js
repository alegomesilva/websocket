const socket = io(); //http://localhost:3001

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

//EMIT => emite informação ao servidor
//ON => escuta a informação

const usernameDiv = document.getElementById("username");
usernameDiv.innerHTML = `Olá, <strong>${username}</strong> - Você está na sala: <strong>${room}</strong>`;

socket.emit("select_room", {
    username,
    room,
}, (messages) => {
    //console.log(messages)
    messages.forEach(message => createMessage(message));
    }
);

document.getElementById("message_input")
.addEventListener('keypress', (event) => {

    if(event.key === "Enter") {
        const message = event.target.value;
        //console.log(message)
        const data = {
            room,
            message,
            username,
        };

        socket.emit("message", data)

        event.target.value = '';
    }
})
//console.log(username, room)

socket.on("message", data => {
    //console.log(data);
    createMessage(data)
   
});

function createMessage(data) {

    const messageDiv = document.getElementById("messages");

    messageDiv.innerHTML += `
    <div class="new_message">
        <label class="form-label">
            <strong>${data.username}</strong> <span>${data.text} - ${dayjs(data.createdAt).format("DD/MM HH:mm")}</span>
        </label>
</div>
`;
};

document.getElementById("logout").addEventListener("click", (event) => {
    window.location.href = "index.html";
});