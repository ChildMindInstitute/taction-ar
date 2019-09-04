AFRAME.registerComponent('pinch-scale', {
  schema: {
    min: { default: 0.3 },
    max: { default: 8 }
  },
  init: function () {
    this.initialScale = this.el.object3D.scale.clone()
    this.scaleFactor = 1
    this.handleEvent = this.handleEvent.bind(this)
    this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
  },
  remove: function () {
    this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
  },
  handleEvent: function (event) {
    this.scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread
    this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.min), this.data.max)

    this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
    this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
    this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z
  }
});

AFRAME.registerComponent('pinch-scale-destroy', {
  schema: {
    min: { default: 0.3 },
    max: { default: 8 }
  },
  init: function () {
    this.initialScale = this.el.object3D.scale.clone()
    this.scaleFactor = 1
    this.handleEvent = this.handleEvent.bind(this)
    this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)

  //make sure everything is in order after load
  const scene = this.el.sceneEl;
  scene.addEventListener('realityready', () => {
    //initial position
    var sphereRadius = 10;
    var cameraobject = document.querySelector("[camera]").getObject3D('camera');
    var camera = document.getElementById('camera'); 

    var pos = cameraobject.position.clone().negate().normalize().multiplyScalar(sphereRadius);
    console.log("raycast calculated position:");
    console.log(pos);

    this.el.object3D.position.copy(pos);

    //second way to do position
    console.log("calculate position with rar camera angle and position: ");
    var angle = camera.getAttribute("rotation");
    var x = 1 * Math.cos(angle.y * Math.PI / 180);
    var y = 1 * Math.sin(angle.y * Math.PI / 180);
    var pos2 = camera.getAttribute("position");
    pos2.x -= y*5;
    pos2.z -= x*5;
    this.el.setAttribute("position", pos2);
    console.log(pos2);


    //reload image material
     this.el.setAttribute('material', 'src', '#feargraphic1');
     document.getElementById('thefear').setAttribute('material', 'src', '#feargraphic1'); //again

     console.log("reload fear entity image src");

     var fearquery = $("#search_txt").val();
     console.log("the search query was: " + fearquery);
    })

  },
  remove: function () {
    this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
  },
  handleEvent: function (event) {
    this.scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread
    this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.min), this.data.max)

    this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
    this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
    this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z

    //if scale is below threshold display explosion animation 
    if(this.scaleFactor < 0.5){
      //load explosion graphic
      const thefear = document.getElementById('thefear');
      const explodegraphic = document.getElementById('explodegraphic');
      thefear.setAttribute('visible', false);

      //set explosion graphic position at fear position
      let theposition = thefear.getAttribute('position');
      explodegraphic.setAttribute('position', theposition);
      explodegraphic.setAttribute('visible', true);

      //start loading next fear graphic into fear entity in background
      console.log("change material");
      thefear.setAttribute('material', 'src', '#feargraphic2');
      thefear.setAttribute('material', 'src', '#feargraphic2');

      console.log("current position of fear element: "); 
      console.log(theposition);

      //set fear entitity distance really high for game loop dialogue
      thefear.setAttribute('initdistance', 999);
      document.getElementById("dialogue").innerHTML = "<p>SILLY FEAR!</p>";

      //increase score and set fear entitity as not active
      let isactive = thefear.getAttribute('active');
      if(isactive){
          //increase score
          let score = parseInt( thefear.getAttribute('score') );
          console.log("current score: " + score);

          thefear.setAttribute('score', (score + 1));
          document.getElementById('scoredisplay').innerHTML = "SCORE: " + score;

          thefear.setAttribute('active', false);
          console.log("set active to false");
      }



      //stop scary music and play explosion sound effect
      const themusic = document.getElementById('scarymusic');
      const explodesound = document.getElementById('explodesound');
      themusic.components.sound.stopSound();
      explodesound.components.sound.playSound();


      //hide evrything after a couple seconds
      setTimeout(()=> {
          explodegraphic.setAttribute('visible', false);
          explodesound.components.sound.stopSound();

          document.getElementById("dialogue").innerHTML = "<p>LOOK AROUND TO FACE MORE FEAR...</p>";

      }, 8000);

      //RESET FOR NEXT FEAR ENTITY
      setTimeout(()=> {
          
          thefear.setAttribute('active', true);
          
          themusic.components.sound.playSound();

          //set new position
          const camera = document.getElementById('camera'); 
         // let camPos = camera.object3D.position;
        //  thefear.object3D.position.x = camera.object3D.position.x + Math.random()*5;
        //  thefear.object3D.position.y = camera.object3D.position.y + Math.random()*2;
        //  thefear.object3D.position.z = camera.object3D.position.z + 0;

          var angle = camera.getAttribute("rotation");
          var x = 1 * Math.cos(angle.y * Math.PI / 180);
          var y = 1 * Math.sin(angle.y * Math.PI / 180);
          var pos = camera.getAttribute("position");
          pos.x -= y*5;
          pos.z -= x*5;
          this.el.setAttribute("position", pos);
          console.log("change position: ");
          console.log(pos);

          //reset scale
          this.scaleFactor = 1;

          thefear.setAttribute('visible', true);

      }, 16000);



    }
  }
});