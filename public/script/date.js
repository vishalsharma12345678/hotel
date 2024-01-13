async function dataFetch(){
    let rooms = await fetch('http://localhost:4000/room/getallrooms')
    let data = await rooms.json()
    // let addrooms = document.getElementById('rooms')
    // Array.from(data).forEach((item)=>{
    //     let option = document.createElement('option')
    //     option.value = item._id;
    //     option.textContent = item.roomNo
    //     addrooms.appendChild(option)
    // })

}
async function roomNofetch(){
    let rooms = await fetch('http://localhost:4000/room/getallroomstype')
    let data = await rooms.json()
    console.log(data)
}
dataFetch()
roomNofetch()

