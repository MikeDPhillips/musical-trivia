

//changes audio
var change = document.getElementById('change');
var gameResults = [];
$('.counter').hide();
$('html').bind('keypress', function(e) {
    if (e.which === 13) {
        e.preventDefault();
        return false;
  }
});

//On page load wait for all the tracks to be loaded in player
change.onload = async () => {
  const result = await player.initList();
  $(change).css('pointer-events', 'all');
};


window.onresize = () => {
  textFit($(".button"), {minFontSize:12, maxFontSize: 50,
    alignVert: false, alignHoriz:false, reProcess:true});
}


//Get the genre and create the player
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
  var audio = document.getElementById('audio');
  var source = document.getElementById('audioSource');
  let retValue =  player.getPlayerURL();
  if (retValue)
    source.src = player.getPlayerURL();
  console.log("Should play a new song now " + retValue);
  audio.load(); //call this to play the song right away
  audio.play();
}



const TIME_PER_SONG = 15;
const TRACKS_PER_GAME = 6
var trackNo =  1;
var counter = TIME_PER_SONG ;
var timerID = null;
function countdown() {
    counter--;
    if (counter === 0) {
      $('.counter').text(`:${counter}`);
      let objResult = {id:trackNo};
      let correct = player.getSongName();
      let artist = player.getArtist();
      objResult['song'] = correct;
      objResult['artist'] = artist;
      objResult['score'] = 0;
      nextSong(objResult);
    }
    else {
      $('.counter').text(`:${counter}`);
    }
};
function resetTimer() {
  clearInterval(timerID);
  counter =TIME_PER_SONG ;
  $('.counter').text(`:${counter}`);
  timerID = setInterval(countdown, 1000);
}

var stop = document.getElementById('stpBtn');
var my_genre = localStorage.getItem("genre")
if (!my_genre)
    my_genre = "NA";


//player object; name is inherited from index.js
var this_player = {
  pName: name,
	pScore: 0,
  pCorrect: 0,
  pGenre: my_genre
};


const updateScore = (pts) => {
  this_player.pCorrect+=1;
  this_player.pScore += pts;
  $("#score").text(this_player.pScore);
};

//User selects an answer
$(".button").click((event) => {
  let objResult = {id:trackNo};
  let answer = event.currentTarget.innerText;
  console.log("Your answer is " + answer);
  let correct = player.getSongName();
  let artist = player.getArtist();
  objResult['song'] = correct;
  objResult['artist'] = artist;
  if (answer === correct) {
    let track = player.getCurrentTrack();
    let time = parseInt($('.counter').text().replace(':',''));
    console.log("Time = " + time);
    let pts = (100-track.popularity)*time;
    console.log("Youre right for " + (100-track.popularity)*time + " points");
    let scaledPts = Math.ceil( (100*pts / ((100)*TIME_PER_SONG)) / TRACKS_PER_GAME)*TRACKS_PER_GAME;
    objResult['score'] = scaledPts;
    console.log("Scaled value is " + scaledPts);
    updateScore(scaledPts);
  }
  else
    objResult['score'] = 0;
  nextSong(objResult);
});

const nextSong = (objResult) => {
  gameResults.push(objResult);
  console.log (`"Now playing track # ${trackNo}`)
  if (trackNo === TRACKS_PER_GAME) {
    endGame();
    return;
  }
  trackNo++;
  player.next();
  changeAudioElement();
  audio.play();
  console.log("Now playing: " + player.getSongName());
  getAnswers();
  resetTimer(timerID);
}
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
  $('.begin').hide();
  $('.game-area').show();
  $('#game-score').show();
  $('.counter').show();
  score = 0;
  tracksRemaining = TRACKS_PER_GAME;


  resetTimer(timerID);
  changeAudioElement();
  console.log("Hit the button.");
  audio.play();
  console.log("Now playing: " + player.getArtist());
  userinput = "Answer"
  console.log(player.list);
  getAnswers();
}

const resetGame = () => {
  $('.game-area').hide();
  $('#game-score').hide();
  $('.counter').hide();
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


$("#high-scores").click(function() {
  window.location.assign("stats.html");
});

$("#play-again").click( () => {
  window.location.assign("homepage.html");
})
const endGame = () => {
  audio.pause();
  clearInterval(timerID);
  resetGame();

    //code will be added here to submit to database
    let playInsert = {
        "name": this_player.pName,
        "score": this_player.pScore,
        "correct": this_player.pCorrect,
        "genre": this_player.pGenre
    };


    var jqxhr = $.ajax( {
        //url: "http://localhost:5000/submit",
        url: "https://musical-trivia-app.herokuapp.com/submit",
        type: "POST",
        data:JSON.stringify(playInsert),
        dataType: "json",
        contentType: "application/json; charset==utf-8",
        success: function(results, status) {
            console.log("Posted to db successfully.")
        },
        error: function(jqxhr, ex) {
            console.log("Error writing to database " + ex )
            console.log("\n\n" | jqxhr)
        }
    });
    jqxhr.always(function() {
        showResults();
    });
};

const showResults = () => {

  $('body').append('<div id="mask"></div>');
  $('#mask').fadeIn(300);

  $('#my-results').show();
  //Handle results modal
  const table = new Tabulator("#results-table", {
    //height:"311px",
    data:gameResults,
    layout:"fitDataStretch",
    responsiveLayout:"hide",

    columns:[
      {title:"Q", field:"id", responsive:0},
      {title:"Score", field:"score", hozAlign:"right", sorter:"number"},
      {title:"Song", field:"song", responsive:1},
      {title:"Artist", field:"artist", responsive:2}
    ],
  });
  $('#result-score').text(this_player.pScore);
}





