let player;

let config = {
    shesHeldButtonOnce: false,
    loading: false,
    image_folder: 'static/images',
    currentAlbum: -1,
};

let transitionAnimationConfig = {
    outroDuration: 2000,
    introDuration: 1000,
}

const splideConfig = {
    type    : 'slide',
    fixedHeight  : '800px',
    fixedWidth   : '1000px',
    rewind  : true,
    updateOnMove : true,
    // pagination: false,
    // arrows  : false,
    // lazyLoad: 'next',
    autoplay: false, interval: 5000, // autoplay interval
    perPage : 1,
    cover   : true
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
    const { image_folder } = config
    
    // Creates all Albums and appends all images
    albums.forEach((album, i) => {
        // Create splide container for each album
        $( "#splide_container" ).append(`
            <div id="slider${ i }" class="splide${ i }">
                <div class="splide__track">
                    <ul class="splide__list">
                    </ul>
                </div>
            </div>
        `);

        // Create each splide and mount it. 
        let splide = new Splide( `#slider${ i }`, splideConfig )
        splide.on( 'mounted', () => { console.log("onMounted") } );
        splide.on( 'moved', () => { console.log("onMoved") } );
        splide.on( 'destroy', () => { console.log("onDestroy") } );
        splide.mount();
        albums[i].splide = splide;

        // Hide the splide until it is needed
        splide.destroy()
        
        // Load all of the images for each splide
        let img_counter = 0;
        while ( img_counter <= albums[i].length ) {
            let src = `${ image_folder }/${ i }/${ img_counter }.png`;
            let elem = `<li class="splide__slide"> <img src="${ src }" /> </li>`;
            albums[i].splide.add( elem );
            img_counter++;
        }
    })
}

$(document).ready(function() {

    // Elements
    const loadingContainer = $("#loading_container");
    const doorsLeft = $("#doors_left");
    const doorsRight = $("#doors_right");
    
    // Generate a "splide" slider for each album
    initSplide();

    // Init Scokets
    var socket = io(); // SocketIO connection to the server
    socket.on('connected', function(data) { 
        console.log("connected to socket.io, response:", data) // SocketIO Conection event∏
    });
    socket.on('next_image', nextImage);
    $("#mock_nextImage").click( nextImage ); //For local development
    window.nextImage = nextImage; 
    socket.on('next_album', nextAlbum);
    $("#mock_nextAlbum").click( nextAlbum ); //For local development
    window.nextAlbum = nextAlbum; //For local development

    function nextImage (data) {
        albums[config.currentAlbum].splide.go('>');
    }
    
    function nextAlbum (data) {
        
        // If we are loading and shes already tried to change albums, we block this action
        if (config.loading) return;
        
        loadNextAlbum()

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

    function playSplideIntro () {
        setTimeout(function () {
            config.loading = false;
            // player.pause();
            hideLoadingAnimation();
        }, transitionAnimationConfig.introDuration)
        playDoorsOpen();
    }

    function playSplideOutro () {
        config.loading = true;
        playDoorsClose();
        showLoadingAnimation();
    }

    function playDoorsOpen () {
        const animationDuration = 1000;

         // css
         doorsLeft.animate(
            {
                top: "-540px"
            },
            animationDuration,
            () => { console.log("left door open") } // plays after animation
        )
        doorsRight.animate(
            {
                bottom: "-540px"
            },
            animationDuration, 
            () => { console.log("right door open") } // plays after animation
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
            () => { console.log("left door close") }
        )
        doorsRight.animate(
            {
                bottom: "0px"
            }, 
            animationDuration, 
            () => { console.log("right door close") }
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
    
        // Hide Previous album (if we are not on the first album)
        if (albums[previousAlbum]?.splide) {
            albums[previousAlbum].splide.destroy();
            $(`.splide${previousAlbum}`).hide()
        }
    
        // Show the current Album
        if (albums[ config.currentAlbum ].splide)
        {
            albums[ config.currentAlbum ].splide.mount()
        }
    
    }

})

// https://splidejs.com/guides/transition/
// function CSSTransition( Splide, Components, options ) {
//     // const { bind } = EventInterface( Splide );
//     const { Move } = Components;
//     const { list } = Components.Elements;
  
//     function mount() {}

//     function start( index, done ) {
//         // Converts the index to the position
//         const destination = Move.toPosition( index, true );
    
//         // Applies the CSS transition
//         list.style.transition = 'transform 800ms cubic-bezier(.44,.65,.07,1.01)';
    
//         // Moves the slider to the destination.
//         Move.translate( destination );
    
//         // Calls the `done` callback.
//         done();
//     }
  
//     function cancel() {
//         list.style.transition = '';
//     }
  
//     return {
//         mount,
//         start,
//         cancel,
//     };
// }