let hiphopAudio = document.getElementById('a-rap');

function sound(surl)
{
	document.getElementById("myspan").innerHTML=
	"<embed src=\""+surl+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
}

function stopSound(surl) 
{
	document.getElementById("myspan").innerHTML=
	"<embed src=\""+surl+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
}

function saveGenre(clicked_id)
{
	var thegenre = clicked_id;
	console.log(thegenre);
	localStorage.setItem("genre", thegenre);

}

function playSound(clicked_id) {
	let newId = `audio-${clicked_id}`;
			let currAudio = document.getElementById(newId);
	currAudio.play();
	console.log("you clicked " +newId);
}
$('#a-hh').mouseover( function() {

	console.log("Hip hop enetered");
	hiphopAudio.play();
});
