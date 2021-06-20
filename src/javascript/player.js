window.nowPlaying = null;
/*
 *  initialize function prototype and attributes
 */
function spotifyPlayer(genre, number) {
    this.genre = genre;
    this.numberTracks = number;
    this.accessToken = undefined;
    this.counter = 0;
    this.list = [];
    this.rawData = [];
}

/*
 *  initialize play list by using spotify recommendations api
 */
spotifyPlayer.prototype.initList = function() {
    var self = this;
    var deferred = new $.Deferred();
    this.getCredential()
    .done(function(){
        console.log('Bearer ' + self.accessToken);

        $.ajax({
            url: 'https://api.spotify.com/v1/recommendations',
            method: 'GET',
            dataType: 'json',
            data: {
                seed_genres: self.genre,
                market: 'US',
                min_popularity: 50,
                offset: Math.random() * 100,
                limit: 50
            },

            headers: {
                'Authorization': 'Bearer ' + self.accessToken
            }

        })
        .done(function(data) {
            console.log("Data is");
            console.log(data);

            for (eachTrack of data.tracks) {

                let currTrack = {
                    album: eachTrack.album || 'Unknown',

                    artists: eachTrack.artists.map(a => a.name).join(', ') || 'Unknown',

                    name: cleanName(eachTrack.name),
                    preview_url: eachTrack.preview_url,
                    id: eachTrack.id,
                    popularity: eachTrack.popularity || 80
                }
                self.rawData.push(currTrack);
                if (eachTrack.preview_url !== null) {
                    self.list.push(currTrack);
                }
            }
            window.nowPlaying = self.list[0];
            self.numberTracks = self.list.length;
            console.log("list is ")
            console.log(self.rawData);
            deferred.resolve();
        });
    });

    return deferred;
};

const cleanName = (n) => {
    n = n.replace(/\s*\(.*?\)\s*/g, '');
    n = n.split('-')[0].trim();
    n = n.split('feat.')[0].trim();
    return(n);
}

spotifyPlayer.prototype.expand = function() {
    var self = this;
    var deferred = $.Deferred();
    $.ajax({
        url: 'https://api.spotify.com/v1/recommendations',
        method: 'GET',
        dataType: 'json',
        data: {
            seed_genres: self.genre,
            market: 'US',
        },

        headers: {
            'Authorization': 'Bearer ' + self.accessToken
        }

    })
    .done(function(data) {
        console.log(data);
        for (eachTrack of data.tracks) {
            if (eachTrack.preview_url !== null) {
                let currTrack = {
                    album: eachTrack.album || 'Unknown',
                    artists: eachTrack.artists.map(a => a.name).join(', ') || 'Unknown',
                    name: eachTrack.name,
                    preview_url: eachTrack.preview_url,
                    id: eachTrack.id,
                    popularity: eachTrack.popularity || 80
                }
                self.list.push(currTrack);
            }
        }
        self.numberTracks = self.list.length;
        console.log(self.list);
        deferred.resolve();
    });

    return deferred;
}

/*
 *  increment the current counter
 */
spotifyPlayer.prototype.next = function() { 

    console.log(this.counter, this.list.length);
    this.counter++;
    window.nowPlaying = this.list[this.counter];
    
};

spotifyPlayer.prototype.getCurrentTrack = function() {
    if(this.counter < this.numberTracks) {
        return (this.list[this.counter]);
    }
};

spotifyPlayer.prototype.getSongName = function() {
    if(this.counter < this.numberTracks) {
        return this.list[this.counter].name;
    }
}

spotifyPlayer.prototype.getArtist = function() {
    if(this.counter < this.numberTracks) {
        return this.list[this.counter].artists;
        console.log(this.list[this.counter].artists);
    }
}

/*
 *  return a url to the song
 */
spotifyPlayer.prototype.getPlayerURL = function() {
    if (this.counter == this.numberTracks - 1){
        this.expand();
        return this.list[this.counter].preview_url;
    }
    else if (this.counter < this.numberTracks) {
        return this.list[this.counter].preview_url;
    }
    else {
        console.error("Exhausted", this.counter, this.numberTracks);
    }
};


 /*  validate userinput function
 */
spotifyPlayer.prototype.checkAnswer = function (answer) {
    // var key_words = (this.list[this.counter].name).replace(/\([^)]*\)/g, " ").split(/\W+/); // split by non-word chars
    // console.log(key_words);
    console.log("The whole list:")
    console.log(this.list);
    var key_words = (this.list[this.counter].name).replace(/\([^)]*\)/g, "");
    console.log(key_words);
    var key_words = key_words.split(/\W+/);
    var ans_words = answer.replace(/\([^)]*\)/g, " ").split(/\W+/); // split by non-word chars
    var hint_words = [];
    var correct = true;

    for (var i = 0; i < key_words.length; i++) {
        correct &= (ans_words[i] && key_words[i].toLowerCase() == ans_words[i].toLowerCase()) || key_words[i] == "";
        hint_words[i] = (key_words[i] == "" ? "" : "__");
    } 

    for (var ans of ans_words) {
        for (var j = 0; j < key_words.length; j++) {
            if (key_words[j].toLowerCase() == ans.toLowerCase()) {

                hint_words[j] = key_words[j];
            }
        }
    }

    var hint_string = hint_words.join(' ');
    return {'isCorrect': correct, 'hint': hint_string};

};

spotifyPlayer.prototype.getCredential = function () {
    var self = this;
    var deferred = new $.Deferred();

    $.ajax({
        url: 'https://peaceful-castle-28546.herokuapp.com/credential',
        method: 'GET',
        dataType: 'json',
        crossOrigin: true
    })
    .done(function(data) {
        console.log(data.access_token);
        self.accessToken = data.access_token;
        deferred.resolve();
    });

    return deferred;
}
