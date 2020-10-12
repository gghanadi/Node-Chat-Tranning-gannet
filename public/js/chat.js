const socket = io();
//ada yang pake Dollar sign ($) itu agar mempermudah untuk mengetahui bahwa it element yang di ambil dari html gak pake juga gpp 
const $pesanForm = document.querySelector('#pesan');
const $pesanFormInput = $pesanForm.querySelector('input');
const $pesanFormButton = $pesanForm.querySelector('button');
const $pesanFormButtonLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $usernameform = document.querySelector('#username')
const messageTamplate = document.querySelector('#message-template').innerHTML
const linkTamplate = document.querySelector('#link-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML


//option ini dari qs.min.js

const autoscroll = () =>{
    //new message element
    const $newMessage = $messages.lastElementChild;

    //height of the new message
    const newMessageStyle = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visble height
    const visbleHeight = $messages.offsetHeight

    //height of messager container
    const containerHeight = $messages.scrollHeight 

    //how far i scroll?
    const scrollOffset = $messages.scrollTop + visbleHeight

    if( (containerHeight - newMessageHeight) <=scrollOffset ){
        $messages.scrollTop = $messages.scrollHeight
    }

}

const { username, roomname }   = Qs.parse(location.search, { ignoreQueryPrefix: true })



socket.on('serverSend',(message) =>{
    console.log(message);
    const html = Mustache.render(messageTamplate, {
            username: message.username,
            message: message.text, // ini kenapa satu karena pesan di html nya dan di chat js sama jika berbeda maka di tulis messagehtmlnya: message
            createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('pesanLocation',(message) =>{
    console.log(message)
    const htmllink = Mustache.render(linkTamplate, {
        username: message.username,
        link: message.link ,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', htmllink)
    autoscroll()
})

socket.on('roomData', ({roomname, users}) =>{
    const html = Mustache.render(sideBarTemplate,{
        users,
        roomname
    })
    document.querySelector('#sidebar').innerHTML = html
})

$pesanForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    $pesanFormButton.setAttribute('disabled', 'disabled')

    const pesan = e.target.elements.message_s1.value //untuk menggunakan ini jika dalam 1 form ada banyak inputan biar gak bingung ambil yang mana makanya di file html nya di buat name dan nama hjarus sesuai name nya
    socket.emit('clientSide',pesan, (error) =>{
        $pesanFormButton.removeAttribute('disabled')
        $pesanFormInput.value = ''
        $pesanFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('The message was deliverd')
    })
})

$pesanFormButtonLocation.addEventListener('click', () =>{

    if(!navigator.geolocation){
        return alert('tidak support geolocation di browsware')
    }
    $pesanFormButtonLocation.setAttribute('disabled','disabled');
    $pesanFormButtonLocation.focus()
    navigator.geolocation.getCurrentPosition((posisi) =>{
        //console.log(posisi);
        socket.emit('sendLocation', {
            latitude: posisi.coords.latitude,
            longitude: posisi.coords.longitude
        }, () =>{
            $pesanFormButtonLocation.removeAttribute('disabled');
            $pesanFormButtonLocation.focus()
            console.log('Location Send!')
        })

    })
    
})

socket.emit('join', { username,roomname }, (error) =>{
    if(error){
        alert(error)
        location.href = '/'
    }
} )