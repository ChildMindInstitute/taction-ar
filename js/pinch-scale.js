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

      //set fear entitity distance really high for game loop dialogue
      thefear.setAttribute('initdistance', 999);
      document.getElementById("dialogue").innerHTML = "<p>SILLY FEAR!</p>";

      //increase score and set fear entitity as not active
      let isactive = thefear.getAttribute('active');
      if(isactive){
          //increase score
          let score = parseInt( thefear.getAttribute('score') );
          console.log("current score: " + score);

          thefear.setAttribute('score', (score + 1);
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



    }
  }
});