import { io } from './http';

interface RoomUser {
    socket_id: string,
    username: string,
    room: string
}

interface Message {
    room: string,
    text: string,
    createdAt: Date,
    username: string,
}

const users: RoomUser[] = [];

const messages: Message[] = [];

io.on("connection", socket => {
    //console.log("ID: ",socket.id);
    socket.on("select_room", (data, callback) => {
        //console.log(data);
        socket.join(data.room);

        const userInRoom = users.find(user => user.username === data.username && user.room === data.room);

        if(userInRoom) {
            userInRoom.socket_id = socket.id
        } else {
            users.push ({
                room: data.room,
                username: data.username,
                socket_id: socket.id
            })
        } 
        //console.log(users)

        //Guardando as mensagens
        const messagesRoom = getMessagesRoom(data.room);
        callback(messagesRoom);       
    });

    socket.on("message", data => {
        //Salvar a mensagem
        const message: Message = {
            room: data.room,
            username: data.username,
            text: data.message,
            createdAt: new Date()
        };
        //Armazenando mensagens
        messages.push(message)

        //Enviar mensagem para o usuário da sala
        io.to(data.room).emit("message", message);
    })
});

function getMessagesRoom (room: string) {
    const messagesRoom = messages.filter((message) => message.room === room);
    return messagesRoom;
}
