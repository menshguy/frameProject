let player;

let config = {
    shesHeldButtonOnce: false,
    loading: false,
    image_folder: 'static/images',
    currentAlbum: -1,
    num_preloaded_images: 4, // This is the number of images that will get loaded into the browser ahead of the current one
};

let transitionAnimationConfig = {
    outroDuration: 2000,
    introDuration: 2000,
}

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
    // // Any init code here, like open the subway doors, etc.
    // loadNextAlbum();
    
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

function onMount (splide) {
    return () => {
        console.log("onMount")
        const { image_folder, currentAlbum, num_preloaded_images } = config
        
        // Dynamically load the first set of images based on the num_preloaded_images value
        let img_counter = 0;
        while ( img_counter < num_preloaded_images ) {
            let src = `${ image_folder }/${ currentAlbum }/${ img_counter }.png`;
            // albums[ currentAlbum ].images.push( src );
            let elem = `<li class="splide__slide"> <img src="${ src }" /> </li>`;
            splide.add( elem );
            img_counter++;
        }
    }
}

function onMoved (splide) {
    return () => {
        console.log("onMoved")
        const { image_folder, currentAlbum, num_preloaded_images } = config;
        let index = splide.Components.Controller.getIndex();
        let index_of_next = index + ( num_preloaded_images - 1);
        let album_length = albums[ currentAlbum ].length
        let current_length = splide.length;
    
        // If the next image to load has not already been loaded, and we are within the length of the album, 
        // load the next image
        if ( current_length <= album_length ) {
            // current_length.push(`${ image_folder }/${ currentAlbum }/${index_of_next}.png`)
            let src = `${ image_folder }/${ currentAlbum }/${index_of_next}.png`
            let elem = `<li class="splide__slide"> <img src="${src}" /> </li>`;
            splide.add(elem);
        }
    }
}

function initPlyr () {
    //Instatiate Plyr - https://github.com/sampotts/plyr
    player = new Plyr('#player', plyrConfig);
}

$(document).ready(function() {

    // Elements
    const loadingContainer = $("#loading_container");
    const doorsLeft = $("#doors_left");
    const doorsRight = $("#doors_right");
    
    // Placeholder in case I want to change default state
    initSplide();
    // initPlyr();

    // Scokets
    var socket = io(); // SocketIO connection to the server
    
    socket.on('connected', function(data) { 
        console.log("connected to socket.io, response:", data) // SocketIO Conection event∏
    });

    // Next Image Event - Jquery function is for local dev.
    socket.on('next_image', nextImage);
    $("#mock_nextImage").click( nextImage );
    
    // Next Album Event - Jquery function is for local dev.
    socket.on('next_album', nextAlbum);
    $("#mock_nextAlbum").click( nextAlbum );

    function nextImage (data) {
        let next = getNextSlideIndex(albums[config.currentAlbum].splide);
        albums[config.currentAlbum].splide.go(next);
    }
    
    function nextAlbum (data) {
        // If we are loading and shes already tried to change albums, we block this action
        if (config.loading) {
            return;
        }

        // loadNextAlbum()

        // If shes already tried to change albums, we play both the intro and outro
        // else, we play just the intro since we are already in loading state on startup
        if (config.shesHeldButtonOnce){
            playSplideOutro();
            setTimeout(() => {
                playSplideIntro();
            } , transitionAnimationConfig.outroDuration);
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
            // player.pause();
        }, transitionAnimationConfig.introDuration)
        playDoorsOpen();
        hideLoadingAnimation();
    }

    function playDoorsOpen () {
        const animationDuration = 1000;

         // css
         doorsLeft.animate(
            {
                top: "-540px"
            },
            animationDuration,
            () => { console.log("doors open") } // plays after animation
        )
        doorsRight.animate(
            {
                bottom: "-540px"
            },
            animationDuration, 
            () => { console.log("doors open") } // plays after animation
        )

        // Plr
        // player.currentTime = 0;
        // player.play();
    }
    
    function playDoorsClose () {
        const animationDuration = 1000;

        // css
        doorsLeft.animate(
            {
                top: "0px"
            }, 
            animationDuration, 
            () => { console.log("doors close") }
        )
        doorsRight.animate(
            {
                bottom: "0px"
            }, 
            animationDuration, 
            () => { console.log("doors close") }
        )

        // Plr
        // player.currentTime = 2;
        // player.play();
        // // setTimeout(function () {
        // //     player.pause();
        // // }, 2000);
    }

    function hideLoadingAnimation () {
        loadingContainer.hide();
    }
    
    function showLoadingAnimation () {
        loadingContainer.show();
    }

})

function getNextSlideIndex(splide) {
    let next = splide.Components.Controller.getNext();
    if ( next < 0 ) next = 0; // if splide returns -1, return to first slide
    return next;
}

function getNextAlbumIndex() {
    let next;
    if (config.currentAlbum < (albums.length - 1))
    {
        next = config.currentAlbum + 1
    } 
    else
    {
        next = 0
    }
    return next;
}

function loadNextAlbum () {

    let previousAlbum = config.currentAlbum;
    config.currentAlbum = getNextAlbumIndex();

    if (albums[previousAlbum]?.splide) {
        albums[previousAlbum].splide.destroy();
        $(`.splide${previousAlbum}`).hide()
    }

    // Mounth new album splide
    if (!albums[ config.currentAlbum ].splide)
    {
        let splide = new Splide( `.splide${ config.currentAlbum }`, splideConfig );
        albums[config.currentAlbum].splide = splide

        splide.on( 'mounted', onMount(splide) );
        splide.on( 'moved', onMoved(splide) );
        // // splide.on( 'destroy', onDestroy(splide) );
        
        splide.mount();
        //  $(`.splide${ config.currentAlbum }`).show()
    }
    else 
    {
        albums[ config.currentAlbum ].splide.mount()
        // $(`.splide${config.currentAlbum}`).show()
    }

}