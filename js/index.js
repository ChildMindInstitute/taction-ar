
//game state global 

window.AFPS = {
  gamestate: {
    score: 0,
    type: 'none',       //search, dog or bee - search is default
    fearisactive: false,  //can player interact with/destroy the fear entity
    startgame: false,
    initialdistance: 0,
    feardistance: 0,      //distance of player/camera from fear entity
    dialogue: 'none',
    imageurls: ["", "", "", "", ""],
    fearsoundurl: ""
  }
};

//run on doc load
$( document ).ready(function() {
    console.log( "stupid jquery!" );

  //fade in image search form after delay
  $(".search-ui").delay(2000).animate({ opacity: 1 }, 225, function(){ });

  /***** IMAGE SEARCH SUBMIT BUTTON *****/
  //event handler for image search form submit button
  $("#submitsearch").click(function(e) {
    console.log("PRESS IMAGE SEARCH BUTTON");
    e.preventDefault();
    var searchQuery = $("#search_txt").val();

    //set global fear type
    AFPS.gamestate.type = 'search';

    //load generic scary music for fear entity sound
    AFPS.gamestate.fearsoundurl = 'audio/Le-grand-cahier-Les-alertes_short.mp3';
    
    //call giphy API to get image URLs
    console.log("searching giphy for " + searchQuery);
    if(searchQuery != ""){
      getGif(searchQuery);
    }


    setTimeout(()=> {
      //set fear element to active so we know we are ready to play
      AFPS.gamestate.startgame = true;
    }, 3500);

    //hide submit button and show loading progress bar
    $("#submitsearch").animate({
      opacity: 0
    }, 1000, function(){

      //display none for search and select buttons so it doesn't take up space
      $(".select-button").hide();


      //fade in loading progress bar elements
      $("#bar-wrapper").fadeIn(500);

      $( ".bar" ).delay(500).animate({
        width: "80%",
        }, 28000, "swing",
        function() {
            console.log("progress bar complete");
        });

      });

  });

  /***** DOG SELECT BUTTON *****/
  //event handler for image search form submit button
  $("#selectdogs").click(function(e) {
    console.log("PRESS DOG BUTTON");
    e.preventDefault();
  
    AFPS.gamestate.type = 'dog';
    
    //call giphy API to get image URLs
    console.log("loading dog assetts");
    AFPS.gamestate.fearsoundurl = 'audio/DogGrowling.mp3';

    AFPS.gamestate.imageurls[0] = 'graphics/dog1small.gif';
    AFPS.gamestate.imageurls[1] = 'graphics/dog2small.gif';
    AFPS.gamestate.imageurls[2] = 'graphics/dog3small.gif';
    AFPS.gamestate.imageurls[3] = 'graphics/dog4small.gif';
    AFPS.gamestate.imageurls[4] = 'graphics/dog5small.gif';

    setTimeout(()=> {
      document.querySelector('#feargraphic1').setAttribute('src', AFPS.gamestate.imageurls[0]);

      //set fear element to active so we know we are ready to play
      AFPS.gamestate.startgame = true;
    }, 3000);

    setTimeout(()=> {
      document.querySelector('#feargraphic2').setAttribute('src', AFPS.gamestate.imageurls[1]);
      document.querySelector('#feargraphic3').setAttribute('src', AFPS.gamestate.imageurls[2]);
      document.querySelector('#feargraphic4').setAttribute('src', AFPS.gamestate.imageurls[3]);
      document.querySelector('#feargraphic5').setAttribute('src', AFPS.gamestate.imageurls[4]);
    }, 8000);




    //hide submit button and show loading progress bar
    $("#submitsearch").animate({
      opacity: 0
    }, 1000, function(){

      //display none for search and select buttons so it doesn't take up space
      $(".select-button").hide();

      //fade in loading progress bar elements
      $("#bar-wrapper").fadeIn(500);

      $( ".bar" ).delay(500).animate({
        width: "80%",
        }, 28000, "swing",
        function() {
            console.log("progress bar complete");
        });
      });
  });

  /***** BEE SELECT BUTTON *****/
  //event handler for image search form submit button
  $("#selectbees").click(function(e) {
    console.log("PRESS BEE BUTTON");
    e.preventDefault();
   
    AFPS.gamestate.type = 'bee';
    
    //call giphy API to get image URLs
    console.log("loading bee assetts");
    AFPS.gamestate.fearsoundurl = 'audio/beehive-clip.mp3"';

    AFPS.gamestate.imageurls[0] = 'graphics/bee1.gif';
    AFPS.gamestate.imageurls[1] = 'graphics/bee2.gif';
    AFPS.gamestate.imageurls[2] = 'graphics/bee3.gif';
    AFPS.gamestate.imageurls[3] = 'graphics/bee4small.gif';
    AFPS.gamestate.imageurls[4] = 'graphics/bee5small.gif';

    setTimeout(()=> {
      document.querySelector('#feargraphic1').setAttribute('src', AFPS.gamestate.imageurls[0]);

      //set fear element to active so we know we are ready to play
      AFPS.gamestate.startgame = true;
    }, 3000);

    setTimeout(()=> {
      document.querySelector('#feargraphic2').setAttribute('src', AFPS.gamestate.imageurls[1]);
      document.querySelector('#feargraphic3').setAttribute('src', AFPS.gamestate.imageurls[2]);
      document.querySelector('#feargraphic4').setAttribute('src', AFPS.gamestate.imageurls[3]);
      document.querySelector('#feargraphic5').setAttribute('src', AFPS.gamestate.imageurls[4]);
    }, 8000);


    //hide submit button and show loading progress bar
    $("#submitsearch").animate({
      opacity: 0
    }, 1000, function(){

      //display none for search and select buttons so it doesn't take up space
      $(".select-button").hide();

      //fade in loading progress bar elements
      $("#bar-wrapper").fadeIn(500);

      $( ".bar" ).delay(500).animate({
        width: "80%",
        }, 28000, "swing",
        function() {
            console.log("progress bar complete");
        });
      });
  });

});




/***************** GOOGLE IMAGE SEARCH API CALL ********************/
/*
$("#search_form").submit(function(e) {
  console.log("image search button pressed");

  e.preventDefault();
  var searchQuery = $("#search_txt").val() + "gif";
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: "https://www.googleapis.com/customsearch/v1",
    data: {
      key: "AIzaSyBAdFot2f1Xyl3tdtmG8JgIcGV_-aXryD8",
      cx: "004286675445984025592:ypgpkv9fjd4",
      filter: "1",
      searchType: "image",
    //  fileType: "gif",
   //   imgType: "animated",
      q: searchQuery,
      prettyPrint: true
    }
  }).done(function(data) {
     //   $('body').append("<img src='" + data.items[4].link + "' />");
        const thefear = document.getElementById('thefear');
        thefear.material.src = data.items[0].link;

        console.log("image search results: " + data.items + "specific" + data.items[0].link);
  });

  $("#fearsearch").hide();

});
*/

/***************** GIPHY IMAGE SEARCH API CALL ********************/
  function getGif(searchTerm) {
    console.log('searchTerm is: ', searchTerm)
    $.ajax({
      url: "//api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=dc6zaTOxFJmzC",
      type: "GET",
      success: function(response) {
        console.log(response)
        var max = response.data.length - 1 //length of response, minus 1 (cuz array starts at index 0)
        console.log('response.data.length is ', max)
        //var randomNumber = Math.round(Math.random() * max) //random number between 0 and max -1
        if(max > 0){
        var gifUrl = "https://media.giphy.com/media/" + response.data[0].id + "/giphy.gif"
        console.log(gifUrl);

        AFPS.gamestate.imageurls[0] = 'https://media.giphy.com/media/' + response.data[0].id + '/giphy.gif';
        AFPS.gamestate.imageurls[1] = 'https://media.giphy.com/media/' + response.data[1].id + '/giphy.gif';
        AFPS.gamestate.imageurls[2] = 'https://media.giphy.com/media/' + response.data[2].id + '/giphy.gif';
        AFPS.gamestate.imageurls[3] = 'https://media.giphy.com/media/' + response.data[3].id + '/giphy.gif';
        AFPS.gamestate.imageurls[4] = 'https://media.giphy.com/media/' + response.data[4].id + '/giphy.gif';

        //update image assets
        setTimeout(()=> {
          document.querySelector('#feargraphic1').setAttribute('src', AFPS.gamestate.imageurls[0]);
        }, 3000);

        setTimeout(()=> {
          document.querySelector('#feargraphic2').setAttribute('src', AFPS.gamestate.imageurls[1]);
          document.querySelector('#feargraphic3').setAttribute('src', AFPS.gamestate.imageurls[2]);
          document.querySelector('#feargraphic4').setAttribute('src', AFPS.gamestate.imageurls[3]);
          document.querySelector('#feargraphic5').setAttribute('src', AFPS.gamestate.imageurls[4]);
        }, 8000);

        console.log("load search result images into graphics asset elements");
      }
       // var body = document.getElementsByTagName('body')[0];
       // body.style.backgroundImage = `url(${gifUrl})`;
      },
      error: function(e) {
        alert(e);
      }
    });
  }



/***************** AFRAME COMPONENT REGISTRATION *********************/

AFRAME.registerComponent('game-loop', {
    init: function() {

    const scene = this.el.sceneEl;
    scene.addEventListener('realityready', () => {
   /*   const thetarget = document.getElementById('thefear');
      const camera = document.getElementById('camera'); 
      let camPos = camera.object3D.position;
      let targetPos = thetarget.object3D.position;
      AFPS.gamestate.initialdistance = camPos.distanceTo(targetPos); */

      //start default game after delay if user doesn't press any selection buttons
      if(AFPS.gamestate.fearisactive == false && AFPS.gamestate.startgame == false){
        setTimeout(()=> {
          AFPS.gamestate.startgame = true;
          console.log("NO USER SELECTION OF GAME TYPE - STARTING DEFAULT");
        }, 2000);

      }
    })
    //  const initialdistance = camPos.distanceTo(targetPos);
   //   thetarget.setAttribute('initdistance', initialdistance);
      

      // Set up the tick throttling. Will check if marker is active every 250ms
    this.tick = AFRAME.utils.throttleTick(this.tick, 250, this);
    },
    tick: function() {
      //PRE GAME
      //FLAG CONDITION CONTROLLED BY USER INTERFACE SELECTION BUTTONS - ready to begin
      if(AFPS.gamestate.fearisactive == false && AFPS.gamestate.startgame == true){
        setTimeout(()=> {
            console.log("**GAME READY INSIDE TICKER FUNCTION");
            console.log("AFPS.gamestate.type: " + AFPS.gamestate.type);
            console.log("AFPS.gamestate.fearisactive: " + AFPS.gamestate.fearisactive);

            let thefear = document.getElementById('thefear');
            let fearmusic = document.getElementById('scarymusic');
                fearmusic.components.sound.stopSound();

            document.getElementById('feargraphic1').setAttribute('src', AFPS.gamestate.imageurls[0]);
            document.getElementById('explode').setAttribute('src', 'graphics/explode.gif');

            setTimeout(()=> {

                thefear.setAttribute('material', 'src', '#feargraphic1');

                if(AFPS.gamestate.type == 'search'){
                    fearmusic.setAttribute('src', '#scarymusicclip');

                } else if(AFPS.gamestate.type == 'bee'){
                    fearmusic.setAttribute('src', '#beemusicclip');

                } else { //default is dog
                  AFPS.gamestate.type = 'dog';
                    fearmusic.setAttribute('src', '#dogmusicclip');
                }

                document.getElementById('explodegraphic').setAttribute('material', 'src', '#explode');

                fearmusic.components.sound.playSound();

                setTimeout(()=> {
                    AFPS.gamestate.fearisactive = true;

                    //set all music to selection music to prevent edge case
                    document.getElementById('scarymusicclip').setAttribute('src', AFPS.gamestate.fearsoundurl);
                    document.getElementById('dogmusicclip').setAttribute('src', AFPS.gamestate.fearsoundurl);
                    document.getElementById('beemusicclip').setAttribute('src', AFPS.gamestate.fearsoundurl);
                  }, 2000);

            }, 3000);

        }, 5000);

      
        AFPS.gamestate.startgame = 'done';
      }


        //DURING GAME
      //is the player close enough to the fear entitity to face it?
      if( AFPS.gamestate.fearisactive ){

          let thetarget = document.getElementById('thefear');
          let camera = document.getElementById('camera');
          let camPos = camera.object3D.position;
          let targetPos = thetarget.object3D.position;
          let initialdistance = AFPS.gamestate.initialdistance;// Number(thetarget.getAttribute("initdistance"));
          let currentdistance = camPos.distanceTo(targetPos);

          console.log("(currentdistance / initialdistance): " + currentdistance + " / " + initialdistance + " = " + (currentdistance / initialdistance) );


        	if((currentdistance / initialdistance) > 0.85 ){
            if(AFPS.gamestate.dialogue != 'closer'){
        	  	document.getElementById("dialogue").innerHTML = "<p>GET CLOSER!</p>";
            }
            AFPS.gamestate.dialogue = 'closer';
        	} 
        	else {
            if(AFPS.gamestate.dialogue != 'pinch'){
        		  document.getElementById("dialogue").innerHTML = "<p>PINCH YOUR FEAR AWAY!</p>";
            }
            AFPS.gamestate.dialogue = 'pinch';
        	}

          //increase init distance value if current distance is greater ie init distance -> max distance
          if(currentdistance > initialdistance){
            AFPS.gamestate.initialdistance = currentdistance;
          }
      }
      
console.log("end ticker");

    }
});





AFRAME.registerComponent('shadow-material', {
  init() {
    this.material = new THREE.ShadowMaterial();
    this.el.getOrCreateObject3D('mesh').material = this.material;
    this.material.opacity = 0.4;
  }
});

AFRAME.registerComponent('loading-screen', {
  init: function () {
    const scene = this.el.sceneEl
    document.fullscreenEnabled = true;
    const reasons = XR.XrDevice.incompatibleReasonsDetails;
    const device = XR.XrDevice.deviceEstimate();
    const loadingImg = document.getElementById('loadingImg');

    //display UI components when loaded
    scene.addEventListener('realityready', () => {
      
     //   promptImage.style.visibility = 'visible';      
     const fearsearch = document.getElementById('fearsearch');
	   const dialogue = document.getElementById('dialogue');
	   const displayscore = document.getElementById('scoredisplay'); 

     //show in game UI elements and hide load screen UI elements -- 6 second delay before default content loaded if no
     if(AFPS.gamestate.startgame){
       loadingScreen.style.display = 'none';
  	   dialogue.style.visibility = 'visible';
  	   displayscore.style.visibility = 'visible';
       fearsearch.style.visibility = 'hidden';
     } else {
      setTimeout(()=> {
            loadingScreen.style.display = 'none';
           dialogue.style.visibility = 'visible';
           displayscore.style.visibility = 'visible';
           fearsearch.style.visibility = 'hidden';
        }, 6000);
     }


    })

    scene.addEventListener('realityerror', () => {
      if (!XR.XrDevice.isDeviceBrowserCompatible()) {
        if (device.os != "iOS" && device.os != "Android") {
          loadingImg.src = "graphics/DesktopScreen.jpg";
          desktopImgForeground.style.visibility = 'visible';
        } else if (XR.XrDevice.IncompatibilityReasons.UNSUPPORTED_BROWSER) {
          loadingImg.src = "graphics/AlmostThere.jpg";
        } else {
          loadingImg.src = "graphics/Error.jpg";
        }
      }
    })
    
  }
});



// Component that places model where the ground is clicked
/*
AFRAME.registerComponent('tap-place', {
  init: function () {
    const ground = document.getElementById('ground');
    const promptImage = document.getElementById('promptImage');
    const ctaImage = document.getElementById('ctaImage');
    const scene = this.el.sceneEl;    
    
    ground.addEventListener('click', event => {      
      // Create new entity for the new object
      if (demo === null) {
        scene.removeAttribute('tap-place');
        demo = document.createElement('a-entity');
        demo.setAttribute('pinch-scale', '');
        demo.setAttribute('shadow', 'cast: true');
        demo.setAttribute('visible', false);
        demo.setAttribute('scale', '4.5 4.5 4.5');
        demo.setAttribute('gltf-model', '#demoModel');
        this.el.sceneEl.appendChild(demo);
        promptImage.style.visibility = "hidden";
        setTimeout(() => {
          ctaImage.style.visibility = 'visible';
          setTimeout(()=> {
            extLinkButton.style.visibility = 'visible';
          }, 5000);
        }, 5000);
      }

      // The raycaster gives a location of the touch in the scene
      const touchPoint = event.detail.intersection.point
      demo.setAttribute('position', touchPoint);

      demo.addEventListener('model-loaded', () => {        
        // Once the model is loaded, we are ready to show it
    //    var demoSound = document.querySelector('#demoAudio');
    //    demoSound.components.sound.playSound();
        demo.setAttribute('visible', true)
        demo.setAttribute('animation-mixer', { clip: 'Animation', loop: 'repeat' });
        
      })
      
    });
  }
});
*/


AFRAME.registerComponent('req-camera-permissions', {
  init: function () {
    const scene = this.el.sceneEl
    console.log('in req camera permissions');
    XR.addCameraPipelineModule({
      name: 'camerastartupmodule',
      onCameraStatusChange: ({ status }) => {
        console.log(status)
        if (status == 'requesting' && XR.XrDevice.deviceEstimate().os != 'Android') {
          console.log("in req-camera-permissions requesting")
          // loadingImg.src = "graphics/CameraPrompt.jpg";
        } else if (status == 'hasStream') {
       //   loadingImg.src = "graphics/LoadingScreen.jpg"
          loadingImg.src = "graphics/shark.gif"
        } else if (status == 'failed') {
          loadingImg.src = "graphics/CancelCamera.jpg"
        }
      },
    });
    if (window.orientation != 0) {
      loadingImg.src = "graphics/Landscape.jpg";
      // loadingImg.style.width = 'auto';
      loadingImg.style.height = '95%';
      console.log(window.orientation)
    } else {
    //  loadingImg.src = "graphics/LoadingScreen.jpg";
      loadingImg.src = "graphics/shark.gif";
      scene.setAttribute('xrweb', '');

    }
  }
});


AFRAME.registerComponent('camera-orientation', {
  init: function () {
    console.log('in camera orientation module')
    XR.addCameraPipelineModule({
      name: 'screenorientation',
      onDeviceOrientationChange: ({ GLctx, videoWidth, videoHeight, orientation }) => {
        console.log("in camera orientation module")
        if (orientation != 0) {
          loadingImg.src = "graphics/Landscape.jpg";
          loadingImg.style.height = '80%';
          loadingScreen.style.display = 'block';
        } else if (orientation == 0) {
          loadingScreen.style.display = 'none';
        }
      },
    })
  }
});

AFRAME.registerComponent('devicemotion-checker', {
  init: function () {
    console.log("in devicemotion module")
    let hasMotionEvents = false
    const motionListener = () => {
      hasMotionEvents = true
      window.removeEventListener('devicemotion', motionListener)
    }
    window.addEventListener('devicemotion', motionListener)

    this.el.addEventListener('realityready', () => {
      if (!hasMotionEvents) {
        console.log("show image")
        document.getElementById('gyroSettings').style.display = 'block'
        XR.pause()
        XR.stop()
      }
    })
  }
})

