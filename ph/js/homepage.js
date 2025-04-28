function node_start() {
    fetch('../php/chat/chatStart.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.flag === 'success') {console.log(data.message); navigate('./chat/menu.htm');}
        else if (data.flag === 'false') {console.log(data.message);}
    });
}