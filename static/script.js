console.log("script.js runs");

/** Config variables */
let image_folder = 'static/images'
let currentAlbum = 0;
let num_preloaded_images = 4; // This is the number of images that will get loaded into the browser ahead of the current one

// @TODO: Load Albums dynamically so she can add images via a USB
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

/** Splidejs Configuration: https://splidejs.com/guides/apis/ */
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

/** Intialize first splide */
let splide0 = new Splide( '.splide0', splideConfig );
albums[0].splide = splide0
splide0.on( 'mounted', onMount(splide0) );
splide0.on( 'moved', onMoved(splide0) );
splide0.on( 'destroy', onDestroy(splide0) );
splide0.mount();

function getNextSlideIndex(splide) {
    let next = splide.Components.Controller.getNext();
    if ( next < 0 ) next = 0; // if splide returns -1, return to first slide
    return next;
}

function onMount (splide) {
    return () => {
        console.log("onMount")

        playDoorsOpen(player);
        
        // Dynamically load the first set of images based on the num_preloaded_images value
        let img_counter = 0;
        while (img_counter < num_preloaded_images) {
            let src = `${image_folder}/${currentAlbum}/${img_counter}.png`;
            albums[currentAlbum].images.push(src);
            let elem = `<li class="splide__slide"> <img src="${src}" /> </li>`;
            splide.add(elem);
            img_counter++;
        }
    }
}

function onDestroy (splide) {
    return () => {
        console.log("onDestroy", splide)
        playDoorsClose(player);
        // setTimeout(function () {
        //     playDoorsOpen(player);
        // }, 2000);

    }
}

function onMoved (splide) { 
    return () => {
        console.log("onMoved")
        let index = splide.Components.Controller.getIndex();
        let index_of_next = index + (num_preloaded_images - 1);
        let current_album_length = albums[currentAlbum].length
        let current_album_images = albums[currentAlbum].images;

        // If the next image to load has not already been loaded, and we are within the length of the album, 
        // load the next image
        if ( !current_album_images[index_of_next] &&
            index_of_next <= current_album_length )
        {
            current_album_images.push(`${image_folder}/${currentAlbum}/${index_of_next}.png`)
            let src = current_album_images[index_of_next];
            let elem = `<li class="splide__slide"> <img src="${src}" /> </li>`;
            splide.add(elem);
        }
    }
};

function playDoorsOpen (player) {
    player.currentTime = 0;
    player.play();
    setTimeout(function () {
        player.pause();
    }, 1800);
}

function playDoorsClose (player) {
    player.currentTime = 2;
    player.play();
    setTimeout(function () {
        player.pause();
    }, 1800);
}

function showStreetSign () {
    $("#subway_platform_text").show();
}

function hideStreetSign () {
    $("#subway_platform_text").hide();
}

function updateStreetSign (text) {
    $("#subway_platform_text").text(text);
}


/** Jquery / Socket events */
$(document).ready(function(){

    //Instatiate Plyr - https://github.com/sampotts/plyr
    const player = new Plyr('#player', {
        controls: [] // no controls
    });

    //OpenDoors after a few seconds
    playDoorsOpen(player)

    //Instantiate HTML
    updateStreetSign(albums[0].name)

    // Append extra splides
    albums.forEach((album, i) => {
        if ( i > 0 ) { // avoid duplicating the first splide
            $( "#parent" ).append(`
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

    // SocketIO connection to the server
    var socket = io();
    
    // SocketIO Conection event∏
    socket.on('connected', function(data) {
        console.log("connected event response:", data)
    });

    // Recieves event from server, updates slide
    // https://splidejs.com/components/controller/
    socket.on('next_image', nextImage);
    
    socket.on('next_album', nextAlbum);

    function nextImage (data) {
        console.log("next_image")
        let next = getNextSlideIndex(albums[currentAlbum].splide);
        albums[currentAlbum].splide.go(next);
        hideStreetSign();
    }

    function nextAlbum (data) {
        // Close Doors
        // const transitionAnimationPlayTime = 2000;
        // playDoorsClose(player);
        // setTimeout(function () {
        //     playDoorsOpen(player);
        // }, transitionAnimationPlayTime);

        // Set current and previous alumbs for splide
        let previousAlbum = currentAlbum;
        if (currentAlbum < (albums.length - 1)) currentAlbum = currentAlbum + 1
        else currentAlbum = 0;

        // Destroy the previous splide
        albums[previousAlbum].splide.destroy();
        // $(`.splide${previousAlbum}`).hide()

        // Update Street Sign text
        updateStreetSign(albums[currentAlbum].name)
        showStreetSign();

        // Mounth new album splide
        if (!albums[currentAlbum].splide)
        {
            let newSplide = new Splide( `.splide${currentAlbum}`, splideConfig );
            albums[currentAlbum].splide = newSplide;
            albums[currentAlbum].splide.on( 'mounted', onMount(newSplide) );
            albums[currentAlbum].splide.on( 'moved', onMoved(newSplide) );
            albums[currentAlbum].splide.mount()
            $(`.splide${currentAlbum}`).show()
        }
        else 
        {
            console.log("runs...")
            albums[currentAlbum].splide.mount()
            $(`.splide${currentAlbum}`).show()
        }


    }

    // For Local Development - allows me to simulate the bottom events
    $("#mock_nextImage").click(function () {
        console.log("mock_nextImage")
        nextImage()
    });
    $("#mock_nextAlbum").click(function () {
        console.log("mock_nextAlbum")
        nextAlbum()
    });

});

/**Helpful RPi SCRIPTS 
 * Copy Files Scrips
    sudo cp /media/pi/Install\ macOS\ Catalina/1_Dates/* /home/pi/Documents/frame_project_sockets/static/images/1
    sudo cp /media/pi/Install\ macOS\ Catalina/2_Baby\ Jordan/* /home/pi/Documents/frame_project_sockets/static/images/2
    sudo cp /media/pi/Install\ macOS\ Catalina/3_Christmas-21/* /home/pi/Documents/frame_project_sockets/static/images/3
    sudo cp /media/pi/Install\ macOS\ Catalina/4_Hannukah-21/* /home/pi/Documents/frame_project_sockets/static/images/4
    sudo cp /media/pi/Install\ macOS\ Catalina/5_Hikes\ NY/* /home/pi/Documents/frame_project_sockets/static/images/5
    sudo cp /media/pi/Install\ macOS\ Catalina/6_Home\ Cooking/* /home/pi/Documents/frame_project_sockets/static/images/6
    sudo cp /media/pi/Install\ macOS\ Catalina/7_Home\ Owners/* /home/pi/Documents/frame_project_sockets/static/images/7
    sudo cp /media/pi/Install\ macOS\ Catalina/8_Day\ Trips/* /home/pi/Documents/frame_project_sockets/static/images/8
    sudo cp /media/pi/Install\ macOS\ Catalina/9_Road\ Trip/* /home/pi/Documents/frame_project_sockets/static/images/9
    sudo cp /media/pi/Install\ macOS\ Catalina/10_SF/* /home/pi/Documents/frame_project_sockets/static/images/10
    sudo cp /media/pi/Install\ macOS\ Catalina/11_Skiing/* /home/pi/Documents/frame_project_sockets/static/images/11
 
 * To Rotatoe Images in a directory, cd into the directory and run:
    for p in *.png ; do   sudo convert "$p" -rotate 90 "$p"; done

 * To Open a image from cmd line (when permission denied):
    sudo gpicview <IMAGE>.png
    sudo gpicview .png
*/