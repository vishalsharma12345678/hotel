let check_in = document.getElementById("check_in");
let check_out = document.getElementById("check_out");

check_in.addEventListener("change", async (e) => {
    if(check_out.value){
        let rooms = await fetch("http://localhost:4000/room/getallrooms");
  let data = await rooms.json();
  console.log(data)
  let g = []
  let availability = false;
  Array.from(data).forEach((item) => {
    item.currentbookings.forEach((booking) => {
        if(item.currentbookings.length){
            if((new Date(check_in.value).getTime() >= new Date(booking.fromdate).getTime() && new Date(check_in.value).getTime() <=new Date(booking.todate).getTime()) &&((new Date(check_out.value).getTime() >= new Date(booking.fromdate).getTime() && new Date(check_out.value).getTime() <=new Date(booking.todate).getTime())) ){
                availability = true;
            }
        }
    })
    if(availability || item.currentbookings.length==0) 
    {
      g.push(item)
    }
  });
      let addrooms = document.getElementById('rooms')
      addrooms.innerHTML = ""
    Array.from(g).forEach((item)=>{
        let option = document.createElement('option')
        option.value = item._id;
        option.textContent = item.roomNo
        addrooms.appendChild(option)
    })
    }
});
check_out.addEventListener("change", async (e) => {
    if(check_in.value){
        let rooms = await fetch("http://localhost:4000/room/getallrooms");
  let data = await rooms.json();
  console.log(data)
  let g = []
  Array.from(data).forEach((item) => {
      console.log(check_in.value +"  "+ check_out.value)
      let availability = false;
        for (var booking of item.currentbookings) {
        availability = false;
        if(item.currentbookings.length){
    
            console.log(!((new Date(booking.formdate).getTime() +"o"+ new Date(check_in.value).getTime()) +" ok "+ (new Date(booking.formdate).getTime()+"o"+ new Date(check_out.value).getTime())))
            if(!((new Date(booking.formdate).getTime() >= new Date(check_in.value).getTime()) && (new Date(booking.formdate).getTime() < new Date(check_out.value).getTime())) && !((new Date(booking.todate).getTime() >= new Date(check_in.value).getTime()) && (new Date(booking.todate).getTime() <= new Date(check_out.value).getTime()))){
                availability = true;
            }            
        }
        if(!availability) break;

    }
    console.log(availability)
    if(availability || item.currentbookings.length==0) 
    {
      g.push(item)
    }
  });
      let addrooms = document.getElementById('rooms')
      addrooms.innerHTML = ""
    Array.from(g).forEach((item)=>{
        let option = document.createElement('option')
        option.value = item._id;
        option.textContent = item.roomNo
        addrooms.appendChild(option)
    })
    }
});
