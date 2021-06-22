

// var tableData = [
//     {id:1, name:"Billy Bob", score:"12"},
//     {id:2, name:"Mary May", score:"1"}
// ];

// var backbtn = document.getElementById('tohome');

$(document).ready(function() {
    console.log("here");
      $('#tohome').click(function(){
       window.location.assign("homepage.html");
        localStorage.score = 0;
    localStorage.num_wrong = 0;
});
  var table = new Tabulator(".tabulator", {
    //ajaxURL:"http://localhost:5000/api/history",
    ajaxURL:"https://musical-trivia-app.herokuapp.com/submit",
    ajaxParams:{key1:"name", key2:"score", key3:"genre", key4:"correct", key5:"date"},
    ajaxConfig:{
      method:"GET",
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'omit'
    },
    autoResize:true,
    layout:"fitDataFill",
    layout:"fitColumns",
    columns:[
    {title:"Name", field:"name", align:"center"},
    {title:"Genre", field:"genre", align:"center"},
      {title:"Correct", field:"correct", sorter:"number"},
    {title:"Score", field:"score", align:"center", sorter:"number"},
      {title:"Date", field:"date", sorter:"datetime"}
    ]
  });

  //table.setData();

});


    
