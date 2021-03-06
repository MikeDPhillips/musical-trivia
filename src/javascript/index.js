
let hpAudio = document.getElementById('hp-audio');
var firstTime = true;
$(document).ready(function() {
  let hpAudio = document.getElementById('hp-audio');
  $('#hp-body').click( function() {
    hpAudio.play();
  });
  $('a.popup').click(function() {
    hpAudio.play();
    $('.login-popup').fadeIn(300);

    //Set the center alignment padding + border see css style
    var popMargTop = ($('.login-popup').height() + 24) / 2;
    var popMargLeft = ($('.login-popup').width() + 24) / 2;

    $('.login-popup').css({
      'margin-top' : -popMargTop,
      'margin-left' : -popMargLeft

    });

    //Read username from localstorage if it exists already
    localStorageSupport = true;
    var name;
    try {
      name = localStorage.getItem('username')
    }
    catch (err) {
      //localStorage is not supported
      localStorageSupport = false;
    }
    if (name) {
      document.getElementById("username").value  = name;
    }

    // Add the mask to body
    $('body').append('<div id="mask"></div>');
    $('#mask').fadeIn(300);

    //$('.blinking-cursor').fadeIn(300);
    document.getElementById("username").focus();
    $('html').bind('keypress', function(e) {
      if (e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    return false;
  });


  // When clicking on the button close, close the popup window
  $('a.close, #mask').live('click', function() {
    $('#mask , .login-popup').fadeOut(300 , function() {
      $('#mask').remove();
    });
    return false;
  });

  $('fieldset.textbox').click(function(){
    $('.blinking-cursor').fadeOut(300);
  });



  //if user entered a username, inherit the username to the following pages
  document.getElementsByTagName("button")[0].onclick = function(){
    name = document.getElementById("username").value;

    name = sanitize(name);

    //write name to local storage
    if (localStorageSupport)
    {
      localStorage.setItem('username', name);
      localStorage.score = 0;
    }
    //window.location.assign("genre.html");
    $('#mask , .login-popup').fadeOut(300 , function() {
      $('#mask').remove();
    });
    $("#hp-body").hide();
    $("#genre-page").show();
    $("#hp-style").attr('href', '../style/genre_style.css')

  };


  //if user decides to play anonymously
  document.getElementsByTagName("button")[1].onclick = function(){
    name = "Anonymous"
    if (localStorageSupport)
    {
      localStorage.setItem('username', name);
      localStorage.score = 0;
    }
    //window.location.assign("genre.html");
    $('#mask , .login-popup').fadeOut(300 , function() {
      $('#mask').remove();
    });
    $("#hp-body").hide();
    $("#genre-page").show();
    $("#hp-style").attr('href', '../style/genre_style.css')
  };





});



const playSound = (clicked_id) => {
  if (firstTime && clicked_id=="hip-hop") {
    firstTime = false;
    return;
  }
  let hpAudio = document.getElementById('hp-audio');
  hpAudio.pause();
  let newId = `audio-${clicked_id}`;
  let currAudio = document.getElementById(newId);
  currAudio.play();
  console.log("you clicked " +newId);
}

const stopSound = (clicked_id) => {
  console.log("stopping sound");
  let newId = `audio-${clicked_id}`;
  let currAudio = document.getElementById(newId);
  currAudio.pause();
}

function saveGenre(clicked_id)
{
  var thegenre = clicked_id;
  console.log(thegenre);
  localStorage.setItem("genre", thegenre);

}

function sanitize(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
};

