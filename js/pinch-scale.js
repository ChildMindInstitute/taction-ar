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

    if(AFPS.gamestate.type == 'bee'){
      document.getElementById('scarymusicclip').setAttribute('src', 'audio/bee-or-wasp-in-flight-fast.mp3');
      document.getElementById('feargraphic1').setAttribute('src', 'graphics/bee1.gif');
      document.getElementById('feargraphic2').setAttribute('src', 'graphics/bee2.gif');
      document.getElementById('feargraphic3').setAttribute('src', 'graphics/bee3.gif');
      document.getElementById('feargraphic4').setAttribute('src', 'graphics/bee4.gif');
      document.getElementById('feargraphic5').setAttribute('src', 'graphics/bee5.gif');
    } else if (AFPS.gamestate.type == 'dog'){
      document.getElementById('scarymusicclip').setAttribute('src', 'audio/DogGrowling.mp3');
      document.getElementById('feargraphic1').setAttribute('src', 'graphics/bee1.gif');
      document.getElementById('feargraphic2').setAttribute('src', 'graphics/bee2.gif');
      document.getElementById('feargraphic3').setAttribute('src', 'graphics/bee3.gif');
      document.getElementById('feargraphic4').setAttribute('src', 'graphics/bee4.gif');
      document.getElementById('feargraphic5').setAttribute('src', 'graphics/bee5.gif');
    } else if (AFPS.gamestate.type == 'search'){
      document.getElementById('scarymusicclip').setAttribute('src', 'audio/Le-grand-cahier-Les-alertes.mp3');
      document.getElementById('feargraphic1').setAttribute('src', AFPS.gamestate.searchurls[0]);
      document.getElementById('feargraphic2').setAttribute('src', AFPS.gamestate.searchurls[1]);
      document.getElementById('feargraphic3').setAttribute('src', AFPS.gamestate.searchurls[2]);
      document.getElementById('feargraphic4').setAttribute('src', AFPS.gamestate.searchurls[3]);
      document.getElementById('feargraphic5').setAttribute('src', AFPS.gamestate.searchurls[4]);
    }


    //initial position
    const camera = document.getElementById('camera'); 
    //second way to do position
    console.log("calculate position with rar camera angle and position: ");
    var angle = camera.getAttribute("rotation");
    var x = 1 * Math.cos(angle.y * Math.PI / 180);
    var y = 1 * Math.sin(angle.y * Math.PI / 180);
    var pos2 = camera.getAttribute("position");
    pos2.x -= y*15;
    pos2.z -= x*15;
    this.el.setAttribute("position", pos2);
    console.log(pos2);


    //reload image material
     this.el.setAttribute('material', 'src', '#feargraphic1');
     document.getElementById('thefear').setAttribute('material', 'src', '#feargraphic1'); //again

     console.log("reload fear entity image src");

    // var fearquery = $("#search_txt").val();
    // console.log("the search query was: " + fearquery);
    })

  },
  remove: function () {
    this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
  },
  handleEvent: function (event) {

    const thefear = document.getElementById('thefear');
    const explodegraphic = document.getElementById('explodegraphic');

  //  let isactive = thefear.getAttribute('active');
    console.log("active status inside pinch event: " + AFPS.gamestate.fearisactive);

    //don't allow for user interaction when fear entity is not active
    if(AFPS.gamestate.fearisactive){


      this.scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread
      this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.min), this.data.max)

      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z

      //if scale is below threshold display explosion animation 
      if(this.scaleFactor < 0.5){

        //increase score and set fear entitity as not active
        let newscore = AFPS.gamestate.score + 1;
        console.log("new score: " + newscore);
        AFPS.gamestate.score = newscore;

       // thefear.setAttribute('score', newscore);
        document.getElementById('scoredisplay').innerHTML = "SCORE: " + newscore;


    //    thefear.setAttribute('active', false);
        AFPS.gamestate.fearisactive = false;
        console.log("set active to false");



        //set explosion graphic position at fear position
        let theposition = thefear.getAttribute('position');
        console.log("current position of fear element: "); 
        console.log(theposition);
        explodegraphic.setAttribute('position', theposition);

        //hide 'destroyed' fear graphic and show explosion graphic
        thefear.setAttribute('visible', false);
        explodegraphic.setAttribute('visible', true);

        //set fear entitity distance really high for game loop dialogue
        thefear.setAttribute('initdistance', 999);
        document.getElementById("dialogue").innerHTML = "<p>SILLY FEAR!</p>";

        //stop scary music and play explosion sound effect
        const fearsound = document.getElementById('scarymusic');
        const explodesound = document.getElementById('explodesound');
        fearsound.components.sound.stopSound();
        explodesound.components.sound.playSound();

        //start loading next fear graphic into fear entity in background
        console.log("change material");
        let scorelastdigit = Math.abs(newscore) % 10;
        switch (scorelastdigit % 10)
        {
            case 0:
                thefear.setAttribute('material', 'src', '#feargraphic1');
                break;
            case 1:
                thefear.setAttribute('material', 'src', '#feargraphic2');
                break;
            case 2:
                thefear.setAttribute('material', 'src', '#feargraphic3');
                break;
            case 3:
                thefear.setAttribute('material', 'src', '#feargraphic4');
                break;
            case 4:
                thefear.setAttribute('material', 'src', '#feargraphic5');
                break;
            case 5:
                thefear.setAttribute('material', 'src', '#feargraphic1');
                break;
            case 6:
                thefear.setAttribute('material', 'src', '#feargraphic2');
                break;
            case 7:
                thefear.setAttribute('material', 'src', '#feargraphic3');
                break;
            case 8:
                thefear.setAttribute('material', 'src', '#feargraphic4');
                break;
            case 9:
                thefear.setAttribute('material', 'src', '#feargraphic5');
                break;
            default:
                thefear.setAttribute('material', 'src', '#feargraphic2');
        }





        //stop explosion graphics and hide everything after a few seconds
        setTimeout(()=> {
            explodegraphic.setAttribute('visible', false);
            explodesound.components.sound.stopSound();

            document.getElementById("dialogue").innerHTML = "<p>LOOK AROUND TO FACE MORE FEAR...</p>";

            //RESET FOR NEXT FEAR ENTITY
            setTimeout(()=> {
                fearsound.components.sound.playSound();

                //set new position
                const camera = document.getElementById('camera'); 

                var angle = camera.getAttribute("rotation");
                var x = 1 * Math.cos(angle.y * Math.PI / 180);
                var y = 1 * Math.sin(angle.y * Math.PI / 180);
                var pos = camera.getAttribute("position");
                pos.x -= y*15;
                pos.z -= x*15;
                this.el.setAttribute("position", pos);
                console.log("change position: ");
                console.log(pos);

                //reset scale
                this.scaleFactor = 1;

                //make fear entity visible again
                thefear.setAttribute('visible', true);

                //get new initial distance of camera/player from fear entity
                let camPos = camera.object3D.position;
                let targetPos = thefear.object3D.position;
                AFPS.gamestate.initialdistance = camPos.distanceTo(targetPos);

                //allow user interaction with fear entity
                AFPS.gamestate.fearisactive = true;

            }, 6000);

        }, 5000);



      } //end is destroy fear proximity conditional

    } //end isactive conditional
  }
});