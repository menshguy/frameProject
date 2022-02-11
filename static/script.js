console.log("script.js runs");

$(document).ready(function(){
    // SocketIO connection to the server
    var socket = io();
    
    // SocketIO Conection event
    socket.on('connected', function(data) {
        console.log("connected event response:", data)
    });

    // Recieves event from server, updates color of indicator and SVG
    socket.on('update_svg', function(data) {
        console.log("update_svg response:", data)
        if (data.status === 'on') {
            $("#SwitchIndicator").css("background-color", data.color);
            $("#SVG_Example").css("fill", data.color);
	    $("#on_layer").css("visibility", "visible");
	    $("#off_layer").css("visibility", "hidden");
        }
        else if (data.status === 'off') {
            $("#SwitchIndicator").css("background-color", data.color);
            $("#SVG_Example").css("fill", data.color);
	    $("#off_layer").css("visibility", "visible");
	    $("#on_layer").css("visibility", "hidden");
        }
    });

    /** 
     * Buttons
     */
    $('#turnOnBtn').on('click', function(e){
       	
        // Sockets
        socket.emit("toggle_light", 'on')
        
        // Ajax
        // $.ajax({
        //     url: '/led?status=on',
        //     method: 'GET',
        //     success: function(result) {
        //         console.log(result);
        //     }
        // });

        e.preventDefault();
    });
    
    $('#turnOffBtn').on('click', function(e){
        
        // Sockets
        socket.emit("toggle_light", 'off')
        
        // Ajax
        // $.ajax({
        //     url: '/led?status=off',
        //     method: 'GET',
        //     success: function(result) {
        //         console.log("turnOffBtn")
        //         console.log(result);
        //     }
        // });

        e.preventDefault();
    });
    
    $('#btnToggle').on('click', function(e){
        let status;
        if($(this).text() == 'Turn On LED') {
            $(this).text('Turn Off LED')
            $(this).removeClass().addClass('btn btn-block btn-light');
            status = 'on';
        } else {
            $(this).text('Turn On LED');
            $(this).removeClass().addClass('btn btn-block btn-dark');
            status = 'off';
        }

        //Sockets
        socket.emit("toggle_light", status)
        
        // Ajax
        // $.ajax({
        //     url: '/led?status=' + status,
        //     method: 'GET',
        //     success: function(result) {
        //         console.log(result);
        //  }
        // });

        e.preventDefault();
    });

});

