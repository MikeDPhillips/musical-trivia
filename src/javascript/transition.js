

//changes audio
var change = document.getElementById('change');

$('html').bind('keypress', function(e) {
    if (e.which === 13) {
        e.preventDefault();
        return false;
  }
});


window.onresize = () => {
  textFit($(".button"), {minFontSize:12, maxFontSize: 50,
    alignVert: false, alignHoriz:false, reProcess:true});
}

var genreForRound = localStorage.getItem('genre');
console.log(genreForRound);
var genres = ["hip-hop", "pop", "classical", "country", "rock"];
if(genreForRound == "shuffle")
{
    var rand = genres[Math.floor(Math.random() * genres.length)];
    var player = new spotifyPlayer(rand, 5);
    console.log(rand);
}
else
    var player = new spotifyPlayer(genreForRound, 5);


var isPlaying = false;
function changeAudioElement(){
  //e.preventDefault();

  //var elm = e.target;
  var audio = document.getElementById('audio');

  var source = document.getElementById('audioSource');
  source.src = player.getPlayerURL();

  audio.load(); //call this to just preload the audio without playing
  audio.play(); //call this to play the song right away
}

change.onload = async () => {
    const result = await player.initList();
};

let tracksRemaining = 5;
var counter = 30;
var timerID = null;
function countdown() {
    counter--;
    if (counter === 0) {
      clearInterval(timerID);
    }
    else {
      $('.counter').text(`:${counter}`);
    }
};
function resetTimer() {
  clearInterval(timerID);
  counter =30;
  $('.counter').text(`:${counter}`);
  timerID = setInterval(countdown, 1000);
}

var stop = document.getElementById('stpBtn');
// Get the modal
var modal = document.getElementById('game-area');

//hint modal
var hintmodal = document.getElementById('hintModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the button that closes the modal
var close = document.getElementById("close");

var cont = document.getElementById("continue");

var hint = document.getElementById("hint");

var stay = document.getElementById("stay");

var userinput = "";
//$('#playbutton').attr("opacity", 0.0);

// Try to read the score from localStorage
// if not there then initalize it to 0
// NOTE; we need to reset this to 0 somewhere when we are done with score
var score = 0;


var num_wrong = 0;


var my_genre = localStorage.getItem("genre")
if (!my_genre)
    my_genre = "NA";




//player object; name is inherited from index.js
var this_player = {
	thename: name,
	thescore: score,
	nwrong: num_wrong,
    thegenre: my_genre
};


const updateScore = (pts) => {
  this_player.thescore += pts;
  $("#score").text(this_player.thescore);
};

$(".button").click((event) => {

  let answer = event.currentTarget.innerText;
  console.log("Your answer is " + answer);
  if (answer === player.getSongName()) {
    let track = player.getCurrentTrack();
    let time = parseInt($('.counter').text().replace(':',''));
    console.log("Time = " + time);
    let pts = (100-track.popularity)*time;
    console.log("Youre right for " + (100-track.popularity)*time + " points");
    let scaledPts = 100*pts / ((100)*30);
    console.log("Scaled value is " + Math.ceil(scaledPts/5)*5);
    updateScore(Math.ceil(scaledPts/5)*5);
  }
  tracksRemaining--;
  if (tracksRemaining===0) {
    alert(`Game over you scored ${this_player.thescore} points!`);
    return;
  }
  player.next();
  changeAudioElement();
  audio.play();
  console.log("Now playing: " + player.getSongName());
  getAnswers();
  resetTimer(timerID);
});



var audio = document.getElementById('audio');
stop.onclick = function() {
  beginGame();
}

$('#startLink').click(function() {
  console.log("Start has been clicked");
  beginGame();
});

const beginGame = () => {
  $('.play-container').hide();
  score = 0;
  tracksRemaining = 5;
  $('.begin').addClass("hide");
  $('.game-area').removeClass("hide");
  $('.scorebox').removeClass("hide");
  $('.counter').removeClass("hide");

  resetTimer(timerID);
  changeAudioElement();
  console.log("Hit the button.");
  audio.play();
  console.log("Now playing: " + player.getArtist());
  userinput = "Answer"
  console.log(player.list);
  getAnswers();
}

const getAnswers =  () => {
  console.log("Song list is ");
  let songList = getSongList(player.rawData, 6);
  console.log(songList);

  $('.button').each((i, obj) => {
    $("span", obj).text(songList[i].name);
  })
  $('.textFitted').css({fontSize:"2px"});
  textFit($('.button'));
}

function togglePlay() {
  if (isPlaying) {
   // audio.pause();
    $('#playbutton').attr("opacity", 1);
  } else {
    $('#playbutton').attr("opacity", 1);
    audio.play();
  }
};

audio.onplaying = function() {
  isPlaying = true;
};
audio.onpause = function() {
  isPlaying = false;
};

const getSongList = (li, n) => {
  let newList = [window.nowPlaying];
  while(newList.length < n) {
    let title = li[Math.floor(Math.random()*li.length)];
    if(newList.find(obj => obj.name === title.name) == null)
      newList.push(title);
  }
  shuffle(newList);
return newList;
}


//Shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// modal.style.display="block";


/*  let result = player.checkAnswer(userinput);
  console.log(result.isCorrect);
  console.log(result.hint);
  if(result.isCorrect)
  {
    let content = document.getElementById("answer");
    content.innerHTML = "<h1>Correct! </h1>" + "<h3> " + player.getSongName() + " by " + player.getArtist() + "</h3>";
    this_player.thescore++;
    (document.getElementById("score")).innerHTML = this_player.thescore;
    //Save new score in localStorage
  }
  //modal.style.display = "block";
  else
  {
    this_player.nwrong++;
    let content = document.getElementById("answer");
    var songname = player.getSongName();
    content.innerHTML = "<h1>Wrong, the song is " + songname + "</h1>" + "<h3>" + player.getSongName() + "by " + player.getArtist() + "</h3>" + "<h4>#wrong: " + this_player.nwrong + "</h4>";

    //Save number wrong in localStorage
    localStorage.num_wrong = this_player.nwrong;
    if(this_player.nwrong >= 5)
    {

      window.location.assign("stats.html")
    }
  }*/


//     //code will be added here to submit to database
//     playInsert = {
//         "username": this_player.thename,
//         "score": this_player.thescore,
//         "nwrong": this_player.nwrong,
//         "genre": this_player.thegenre
//     };


//     var jqxhr = $.ajax( {
//         url: "https://amuseme-trivia-game.herokuapp.com/submit",
//         type: "POST",
//         data:JSON.stringify(playInsert),
//         dataType: "json",
//         contentType: "application/json; charset==utf-8",
//         success: function(results, status) {
//             console.log("Posted to db successfully.")
//         },
//         error: function(jqxhr, ex) {
//             console.log("Error writing to database " + ex )
//             console.log("\n\n" | jqxhr)
//         }
//     });
//     jqxhr.always(function() {
//         //reset score so for next round it restarts at 0
//         alert( "Your final score is " + localStorage.score
//         + "    You had " + localStorage.num_wrong + " wrong answers");
//         localStorage.score = 0;
//         localStorage.num_wrong = 0;
//         modal.style.display = "none";
//         window.location.assign("homepage.html");
//     });
// };


/*cont.onclick= function() {
    modal.style.display = "none";
    //window.location.reload();
    player.next();
    changeAudioElement();
    document.getElementById("myform").reset();

}*/

/*


hint.onclick = function() {
      hintcount++;
      //audio.pause();
      userinput = "Hi Hi Hi";
      let result = player.checkAnswer(userinput);
      hintmodal.style.display = "block";
      let hintcontent = document.getElementById("hintanswer");
      var songname = result.hint;
      if (hintcount > 3)
        hintcontent.innerHTML = "<h1>No more hints!</h1>";
      else
        hintcontent.innerHTML = "<h1>Hint: " + songname + "</h1>";
}*/