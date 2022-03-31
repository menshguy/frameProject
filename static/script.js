let config = {
    shesHeldButtonOnce: false,
    loading: false,
    image_folder: 'static/images',
    currentAlbum: -1
};

let transitionAnimationConfig = {
    outroDuration: 2000,
    introDuration: 1000,
}

const swiperConfig = {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    preloadImages: true,
    updateOnImagesReady: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
}

// let albums = [
//     {
//         length: 49,
//         images: [],
//         swiper: null,
//         name: "125th St / Mis·cel·la·ne·ous"
//     },
//     {
//         length: 35,
//         images: [],
//         swiper: null,
//         name: "96th St & Date Nights"
//     },
//     {
//         length: 27,
//         images: [],
//         swiper: null,
//         name: "86th & Hiking in NY"
//     },
//     {
//         length: 23,
//         images: [],
//         swiper: null,
//         name: "72nd & Van Life"
//     },
//     {
//         length: 11,
//         images: [],
//         swiper: null,
//         name: "Lexington & Ski Bums"
//     },
//     {
//         length: 10,
//         images: [],
//         swiper: null,
//         name: "57th & San Fransisco Softies"
//     },
//     {
//         length: 27,
//         images: [],
//         swiper: null,
//         name: "42nd St & Home Cooking "
//     },
//     {
//         length: 3,
//         images: [],
//         swiper: null,
//         name: "Times Sq & Lords of the land"
//     },
//     {
//         length: 8,
//         images: [],
//         swiper: null,
//         name: "34th St - Day Trippers"
//     },
//     {
//         length: 6,
//         images: [],
//         swiper: null,
//         name: "14th st & Xmas '21"
//     },
//     {
//         length: 5,
//         images: [],
//         swiper: null,
//         name: "East 7th & Chewish"
//     },
//     {
//         length: 4,
//         images: [],
//         swiper: null,
//         name: "Canal St & Baby J"
//     },
//     {
//         length: 6,
//         images: [],
//         swiper: null,
//         name: "Fulton St & Weddings"
//     },
//     {
//         length: 10,
//         images: [],
//         swiper: null,
//         name: "Wall St & Narcolepsy"
//     },
// ];

let albums;

https://swiperjs.com/swiper-api#methods-and-properties
// function initSwiper () {
//     const { image_folder } = config
    
//     // Creates all Albums and appends all images
//     albums.forEach((album, i) => {
        
//         // Create swiper container for each album
//         $( "#swipers_container" ).append(`
//             <div class="swiper" id="swiper${ i }">
//                 <!-- Additional required wrapper -->
//                 <div class="swiper-wrapper">
//                     <!-- Slides Here -->
//                 </div>

//                 <!-- Uncomment If we need pagination -->
//                 <!-- <div class="swiper-pagination"></div> -->

//                 <!-- Uncomment If we need navigation buttons -->
//                 <!-- <div class="swiper-button-prev"></div> -->
//                 <!-- <div class="swiper-button-next"></div> -->

//                 <!-- Uncomment If we need scrollbar -->
//                 <!-- <div class="swiper-scrollbar"></div>
//             </div>
//         `);

//         // Create each swiper
//         let swiper = new Swiper(`#swiper${ i }`, swiperConfig);
//         albums[i].swiper = swiper;

//         // Load all of the images for each swiper
//         for (let j = 0; j < albums[i].length; j++) {
//             let src = `${ image_folder }/${ i }/${ j }.png`;
//             let elem = `
//                 <div class="swiper-slide">
//                     <img src="${ src }" /> 
//                 </div>
//             `;
//             albums[i].swiper.appendSlide( elem );
//         }

//         // Hide the swiper until it is needed
//         $(`#swiper${ i }`).hide();
//         albums[i].swiper.update()
//     })
// }
function initSwiper () {
    const { image_folder } = config
    
    // Creates all Albums and appends all images
    albums.forEach((album, i) => {
        
        // Create swiper container for each album
        $( "#swipers_container" ).append(`
            <div class="swiper" id="swiper${ i }">
                <!-- Additional required wrapper -->
                <div class="swiper-wrapper">
                    <!-- Slides Here -->
                </div>

                <!-- Uncomment If we need pagination -->
                <!-- <div class="swiper-pagination"></div> -->

                <!-- Uncomment If we need navigation buttons -->
                <!-- <div class="swiper-button-prev"></div> -->
                <!-- <div class="swiper-button-next"></div> -->

                <!-- Uncomment If we need scrollbar -->
                <!-- <div class="swiper-scrollbar"></div>
            </div>
        `);

        // Create each swiper
        let swiper = new Swiper(`#swiper${ i }`, swiperConfig);
        albums[i].swiper = swiper;

        // Load all of the images for each swiper
        for (let j = 0; j < albums[i].length; j++) {
            let src = `${ image_folder }/${ album.dir }/${ album.images[j] }`;
            let elem = `
                <div class="swiper-slide">
                    <img src="${ src }" /> 
                </div>
            `;
            albums[i].swiper.appendSlide( elem );
        }

        // Hide the swiper until it is needed
        $(`#swiper${ i }`).hide();
        albums[i].swiper.update()
    })
}

$(document).ready(function() {

    // Elements
    const loadingContainer = $("#loading_container");
    const doorsLeft = $("#doors_left");
    const doorsRight = $("#doors_right");
    
    // Generate swiper albums and images
    // initSwiper();


    // ----- Sockets ----- //
    var socket = io(); // Init Scokets- SocketIO connection to the server
    
    socket.on('connected', function(data) { 
        console.log("connected to socket.io, response:", data) // SocketIO Conection event
        
        // fetch all album names
        $.get("/albums", function(data, status){
            console.log("Albums Data: ",data)
            console.log("Status: ",status);
            albums = data
            
            // Sort albums by their prefix
            albums.sort(function(a, b) {
                let a_number = Number.parseInt(a.dir.split('_')[0])
                let b_number = Number.parseInt(b.dir.split('_')[0])
                
                if (a_number < b_number) return -1;
                if (a_number > b_number) return 1;
                return 0;
            });

            // Get the Name for Each Album 
            albums.forEach((album, i) => {
                let name = album.dir.split('_')[1]
                albums[i].name = name
            })

            initSwiper()
        });
        
    });
    
    socket.on('next_image', nextImage);
    $("#mock_nextImage").click( nextImage ); //For local development
    window.nextImage = nextImage; 
   
    socket.on('next_album', nextAlbum);
    $("#mock_nextAlbum").click( nextAlbum ); //For local development
    window.nextAlbum = nextAlbum; //For local development
    // ----- End Sockets ----- //

    function nextImage (data) {
        albums[config.currentAlbum].swiper.slideNext();
    }
    
    function nextAlbum (data) {
        
        // If we are loading and shes already tried to change albums, we block this action
        if (config.loading) return;
        
        loadNextAlbum()

        // If shes already tried to change albums, we play both the intro and outro
        // else, we play just the intro since we are already in loading state on startup
        if (config.shesHeldButtonOnce){
            playOutro();
            setTimeout(() => {
                playIntro();
            } , transitionAnimationConfig.outroDuration);
        } else {
            config.shesHeldButtonOnce = true;
            playIntro();
        }
    }

    function loadNextAlbum () {
        let previousAlbum = config.currentAlbum;
        config.currentAlbum = getNextAlbumIndex();
    
        // Hide Previous album (if we are not on the first album)
        if (albums[previousAlbum]?.swiper) {
            $(`#swiper${previousAlbum}`).hide()
        }
        
        // Show the current Album
        if (albums[ config.currentAlbum ].swiper) {
            $(`#swiper${config.currentAlbum}`).show()
        }
    }

    function playIntro () {
        setTimeout(function () {
            config.loading = false;
            // player.pause();
            hideLoadingAnimation();
        }, transitionAnimationConfig.introDuration)
        playDoorsOpen();
    }

    function playOutro () {
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

})