
//run on doc load
$( document ).ready(function() {
    console.log( "stupid jquery!" );

  $("#submitsearch").click(function(e) {
    e.preventDefault();
    var searchQuery = $("#search_txt").val();
    
    console.log("searching giphy for " + searchQuery);
    getGif(searchQuery);
  });

});


//virtual mesh sphere around player is used to place materials infront of player without markers or camera image processing

AFRAME.registerComponent ('positionfear', {
  init: function () {
    var scene = this.el.sceneEl.object3D;  // THREE.Scene
    var camera = document.querySelector("[camera]").getObject3D('camera');
    var el = this.el;  // Entity.
    
    //add player bubble sphere for raycast/gaze intersection calculation
    var sphereGeom = new THREE.IcosahedronGeometry(sphereRadius, 3);
    var sphereMat = new THREE.MeshBasicMaterial({color: 'yellow', wireframe: true});
    var sphere = new THREE.Mesh(sphereGeom, sphereMat);
    scene.add(sphere);
  }
  var scene = document.querySelector('a-scene').object3D;  // THREE.Scene

  //add player bubble sphere for raycast/gaze intersection calculation
  var sphereGeom = new THREE.IcosahedronGeometry(sphereRadius, 3);
  var sphereMat = new THREE.MeshBasicMaterial({color: 'yellow', wireframe: true});
  var sphere = new THREE.Mesh(sphereGeom, sphereMat);
  scene.add(sphere);

  //get intersection position
  var pos = camera.position.clone().negate().normalize().multiplyScalar(sphereRadius);
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

        //update image assets
        document.querySelector('#feargraphic1').setAttribute('src', 'https://media.giphy.com/media/' + response.data[0].id + '/giphy.gif');
        document.querySelector('#feargraphic2').setAttribute('src', 'https://media.giphy.com/media/' + response.data[1].id + '/giphy.gif');
        document.querySelector('#feargraphic3').setAttribute('src', 'https://media.giphy.com/media/' + response.data[2].id + '/giphy.gif');
        document.querySelector('#feargraphic4').setAttribute('src', 'https://media.giphy.com/media/' + response.data[3].id + '/giphy.gif');
        document.querySelector('#feargraphic5').setAttribute('src', 'https://media.giphy.com/media/' + response.data[4].id + '/giphy.gif');
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
      const thetarget = document.getElementById('thefear');
      const camera = document.getElementById('camera'); 
      let camPos = camera.object3D.position;
      let targetPos = thetarget.object3D.position;
      const initialdistance = camPos.distanceTo(targetPos);
      thetarget.setAttribute('initdistance', initialdistance);
    },
    tick: function() {
      let thetarget = document.getElementById('thefear');
  //    let textcont = document.getElementById('debug-text');
      let camera = document.getElementById('camera');
      let camPos = camera.object3D.position;
      let targetPos = thetarget.object3D.position;
      let initialdistance = Number(thetarget.getAttribute("initdistance"));
      let currentdistance = camPos.distanceTo(targetPos);
  //    textcont.setAttribute("value", camPos.distanceTo(targetPos));

  //is the player close enough to the fear entitity to face it?
  if( (currentdistance / initialdistance) > 0.25 ){
  	if((currentdistance / initialdistance) > 0.85 ){
	  	document.getElementById("dialogue").innerHTML = "<p>GET CLOSER!</p><br><p>" + (currentdistance / initialdistance) + "</p>";
	} 
	else {
		document.getElementById("dialogue").innerHTML = "<p>PINCH YOUR FEAR AWAY!</p><br><p>" + (currentdistance / initialdistance) + "</p>";
	}
  }
      

      //increase init distance value if current distance is greater ie init distance -> max distance
      if(currentdistance > initialdistance){
      	thetarget.setAttribute('initdistance', currentdistance);
      }
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
      loadingScreen.style.display = 'none';
   //   promptImage.style.visibility = 'visible';      
	   const dialogue = document.getElementById('dialogue');
	   const displayscore = document.getElementById('scoredisplay'); 
	   dialogue.style.visibility = 'visible';
	   displayscore.style.visibility = 'visible';
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
      loadingImg.src = "graphics/LoadingScreen.jpg";
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

