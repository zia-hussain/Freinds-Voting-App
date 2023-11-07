setInterval(()=>{
    var dt = new Date();
document.getElementById("datetime").innerHTML = dt.toLocaleString();
//  var dt = Date % 12 || 12;

},1000)
