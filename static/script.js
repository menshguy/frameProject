let player;

let config = {
    shesHeldButtonOnce: false,
    loading: false,
    // transitioning: true,
};

const splideConfig = {
    type    : 'loop',
    height  : '800px',
    width   : '1000px',
    // pagination: false,
    arrows  : false,
    lazyLoad: 'next',
    autoplay: true,
    interval: 5000, // autoplay interval
    perPage : 1,
    cover   : true
};

const plyrConfig = {
    controls: [] // no controls
};

let albums = [
    {
        length: 49,
        images: [],
        splide: null,
        name: "125th St / Mis·cel·la·ne·ous"
    },
    {
        length: 35,
        images: [],
        splide: null,
        name: "96th St & Date Nights"
    },
    {
        length: 27,
        images: [],
        splide: null,
        name: "86th & Hiking in NY"
    },
    {
        length: 23,
        images: [],
        splide: null,
        name: "72nd & Van Life"
    },
    {
        length: 11,
        images: [],
        splide: null,
        name: "Lexington & Ski Bums"
    },
    {
        length: 10,
        images: [],
        splide: null,
        name: "57th & San Fransisco Softies"
    },
    {
        length: 27,
        images: [],
        splide: null,
        name: "42nd St & Home Cooking "
    },
    {
        length: 3,
        images: [],
        splide: null,
        name: "Times Sq & Lords of the land"
    },
    {
        length: 8,
        images: [],
        splide: null,
        name: "34th St - Day Trippers"
    },
    {
        length: 6,
        images: [],
        splide: null,
        name: "14th st & Xmas '21"
    },
    {
        length: 5,
        images: [],
        splide: null,
        name: "East 7th & Chewish"
    },
    {
        length: 4,
        images: [],
        splide: null,
        name: "Canal St & Baby J"
    },
    {
        length: 6,
        images: [],
        splide: null,
        name: "Fulton St & Weddings"
    },
    {
        length: 10,
        images: [],
        splide: null,
        name: "Wall St & Narcolepsy"
    },
];

function initSplide () {
    // Any init code here, like open the subway doors, etc.
    let splide = new Splide( '.splide0', splideConfig );
    albums[0].splide = splide
    splide.mount();

    // Append extra splides
    albums.forEach((album, i) => {
        if ( i > 0 ) { // avoid duplicating the first splide
            $( "#splide_container" ).append(`
                <div id="slider${i}" class="splide${ i }">
                    <div class="splide__track">
                        <ul class="splide__list">
                            <li class="splide__slide"></li>
                        </ul>
                    </div>
                </div>
            ` );
        }

    })
}

function initPlyr () {
    //Instatiate Plyr - https://github.com/sampotts/plyr
    player = new Plyr('#player', plyrConfig);

}


$(document).ready(function() {
    
    // Placeholder in case I want to change default state
    initSplide();
    initPlyr();

    // Scokets
    var socket = io(); // SocketIO connection to the server
    
    socket.on('connected', function(data) { 
        console.log("connected event response:", data) // SocketIO Conection event∏
    });

    // Next Image Event - Jquery function is for local dev.
    socket.on('next_image', nextImage);
    $("#mock_nextImage").click( nextImage );
    
    // Next Album Event - Jquery function is for local dev.
    socket.on('next_album', nextAlbum);
    $("#mock_nextAlbum").click( nextAlbum );

    function nextImage (data) {
        console.log("nextimage")
    }
    
    function nextAlbum (data) {
        // If we are loading and shes already tried to change albums, we block this action
        if (config.loading) {
            console.log("blocked action nextAlbume")
            return;
        }

        // If shes already tried to change albums, we play both the intro and outro
        // else, we play just the intro since we are already in loading state on startup
        if (config.shesHeldButtonOnce){
            playSplideOutro();
            setTimeout(() => {
                playSplideIntro();
            } , 2000);
        } else {
            config.shesHeldButtonOnce = true;
            playSplideIntro();
        }
    }

    function playSplideOutro () {
        config.loading = true;
        playDoorsClose();
        showLoadingAnimation();
    }
    
    function playSplideIntro () {
        setTimeout(function () {
            config.loading = false;
            player.pause();
        }, 2000)
        playDoorsOpen();
        hideLoadingAnimation();
    }

    function playDoorsOpen () {
        player.currentTime = 0;
        player.play();
    }
    
    function playDoorsClose () {
        player.currentTime = 2;
        player.play();
        // setTimeout(function () {
        //     player.pause();
        // }, 2000);
    }

    function hideLoadingAnimation () {
        $("#loading_container").hide();
    }

    function showLoadingAnimation () {}

})