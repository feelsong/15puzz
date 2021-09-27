import * as THREE from './three.js/build/three.module.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from './three.js/examples/jsm/postprocessing/EffectComposer.js';
import { OutlinePass } from './three.js/examples/jsm/postprocessing/OutlinePass.js';
import { RenderPass } from './three.js/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './three.js/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from './three.js/examples/jsm/shaders/FXAAShader.js';


const videoSource = require('./1.mp4');
const videoSource2 = require('./2.mp4');
const videoSource3 = require('./3.mp4');
const videoSource4 = require('./4.mp4');
const videoSource5 = require('./5.mp4');
const videoSource6 = require('./6.mp4');
const audioSrc = require('./tap2.mp3');



let videos = [videoSource, videoSource2, videoSource3, videoSource4, videoSource5, videoSource6 ];
let videoIdx = Math.floor(Math.random() * videos.length);
console.log('videoIdx', videoIdx);
var video;
var texture;
var videoImageContext;
let clock;
var clip,clip2;
var sound = true;
var isMobile = false; //initiate as false

const uvMap16 =[
  [0,1,0.24375,1,0,0.75625,0.24375,0.75625],[0.25625,1,0.49375,1,0.25625,0.75625,0.49375,0.75625],[0.50625,1,0.74375,1,0.50625,0.75625,0.74375,0.75625],[0.75625,1,1,1,0.75625,0.75625,1,0.75625],[0,0.74375,0.24375,0.74375,0,0.50625,0.24375,0.50625],[0.25625,0.74375,0.49375,0.74375,0.25625,0.50625,0.49375,0.50625],[0.50625,0.74375,0.74375,0.74375,0.50625,0.50625,0.74375,0.50625],[0.75625,0.74375,1,0.74375,0.75625,0.50625,1,0.50625],[0,0.49375,0.24375,0.49375,0,0.25625,0.24375,0.25625],[0.25625,0.49375,0.49375,0.49375,0.25625,0.25625,0.49375,0.25625],[0.50625,0.49375,0.74375,0.49375,0.50625,0.25625,0.74375,0.25625],[0.75625,0.49375,1,0.49375,0.75625,0.25625,1,0.25625],[0,0.24375,0.24375,0.24375,0,0,0.24375,0],[0.25625,0.24375,0.49375,0.24375,0.25625,0,0.49375,0],[0.50625,0.24375,0.74375,0.24375,0.50625,0,0.74375,0],[0.75625,0.24375,1,0.24375,0.75625,0,1,0]
];

let _blank = 15;
var container, stats;
var camera, scene, renderer, controls;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedObjects = [];
var composer, effectFXAA, outlinePass;
var obj3d = new THREE.Object3D();
var group = new THREE.Group();
group.useQuaternion = true;
var pieceGroup = new THREE.Group();
var pieces = [];
let initialPos = [];

var coord = [];
var initialQ;

const randomButton = document.getElementById('random');
const originalButton = document.getElementById('original');
const changeButton = document.getElementById('change');
const soundButton = document.getElementById('sound');
const soundOnButton = document.getElementById('sound-on');
const soundOffButton = document.getElementById('sound-off');

const tabSound = new Audio(audioSrc);
tabSound.volume = 0.2;

let originalMode = true;
let mixers = [];

var clip;

function reset() {

}

function getRandomPos() {
  let num = 0;
  let arr = [];
  do {
    num += 1;
    arr = shuffleArray([...Array(16).keys()]);
    arr = shuffleArray(arr);
  } while (findSolvable(arr))

  console.log('num of attempts', num);
  return arr;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function findBlankRowIfEven(input) {
  var index = input.indexOf(15);
  var row = Math.floor(index/4);
  return !(row%2);
}

function findNumberOfInversion(input) {
  input = input.filter(i => i !== 15)
  let l = input.length;
  let numOfInversion = 0;
  input.forEach((el,i) => {
    if (i!==l-1) {
      for (let j = i+1; j < l;  j++) {
        if (el > input[j]) {
          numOfInversion++;
        }
      }
    }
  });
  return numOfInversion;
}
function findSolvable(input) {
  var numInversion = findNumberOfInversion(input);
  var evenInversion = !(numInversion % 2) ;
  if (findBlankRowIfEven(input)) {
    return !evenInversion;
  } else {
    return evenInversion;
  }
}


init();
animate();

function init() {
  initialPos = getRandomPos();
  video = document.createElement( 'video' );
  video.src = videos[videoIdx];
  video.muted = true;
  video.setAttribute('playsinline', true);
  video.loop = true;

  video.load();
  video.play();
  // setTimeout(()=>video.play(),1000);

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var width = window.innerWidth;
	var height = window.innerHeight-4;

	renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;


	renderer.setSize( width, height );
	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 200 );

  // camera.position.set(0 , 110, 0 );
  setCameraLocation();

	camera.lookAt(0,0,0);


	scene.add( new THREE.AmbientLight( 0xaaaaaa, 0.2 ) );

	var light = new THREE.DirectionalLight( 0xddffdd, 0.6 );
	light.position.set( 1, 1, 1 );
	light.castShadow = true;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;

	var d = 10;

	light.shadow.camera.left = - d;
	light.shadow.camera.right = d;
	light.shadow.camera.top = d;
	light.shadow.camera.bottom = - d;

	light.shadow.camera.far = 1000;

	scene.add( light );
	scene.add( group );


	var material = new THREE.MeshPhongMaterial( { color: 0xffaaff } );
   let videoImage = document.createElement( 'canvas' );
    videoImage.width = 480;
    videoImage.height = 480;

    videoImageContext = videoImage.getContext( '2d' );
    // background color if no video present
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
    texture = new THREE.Texture(videoImage);

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

	var planeMaterial = new THREE.MeshBasicMaterial( { map: texture, morphTargets: true, transparent: false} );


	for (let i = 0; i < 4; i ++ ) {
		for (let j = 0; j < 4; j ++ ) {

        coord.push({z: 10 * i + 0.5*i - 15.5, x: 10*j + 0.5*j - 15.5});
        //coord.push({z: 10 * i - 15 , x: 10*j - 15});

				if (!(i===3 && j===3)) {
					let pGeo = new THREE.PlaneBufferGeometry( 10, 10 );

					let plane = new THREE.Mesh(
							pGeo,
							planeMaterial
						);

            plane.position.y = 1.2;
            /*
						plane.position.z = 10 * i + 1 * i;
						plane.position.x = 10 * j + 1 * j - 25;
            */

            plane.rotation.x = - Math.PI / 2;
						plane.data = i*4+j;
						let uv = uvMap16[i*4+j];
						var uvs = new Float32Array( uv);
						pGeo.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
						pieces.push(plane);
				}
		}
	}

  initialQ = group.quaternion.clone();

  var geometry = new THREE.PlaneGeometry( 50, 50 );
  var material = new THREE.MeshBasicMaterial( {color: 0x505050, side: THREE.DoubleSide} );
  var mid = new THREE.Mesh( geometry, material );
  mid.position.y = -0.5;
  mid.rotation.x = Math.PI / 2;
  group.add( mid );

  let backGeo = new THREE.PlaneBufferGeometry( 40, 40 );
  let backPlane = new THREE.Mesh(backGeo,planeMaterial);
  backPlane.position.y = -2;
  backPlane.rotation.x = Math.PI / 2;
  backPlane.rotation.z = Math.PI *0.5;
  // backPlane.visible = false;
  group.add(backPlane);

  initialPos.forEach((el, i)=> {
    if (el !== 15) {
      let currPiece = pieces.filter(piece => piece.data === el)[0];
      currPiece.pos = i;
      currPiece.position.x = coord[i].x;
      currPiece.position.z = coord[i].z;
      pieceGroup.add(currPiece);
    } else {
      _blank = i;
    }

  })

  group.add(pieceGroup);

  const animationGroup = new THREE.AnimationObjectGroup();
  animationGroup.add(group);

  var mixer = new THREE.AnimationMixer( animationGroup );

 mixers.push(mixer);

 var xAxis = new THREE.Vector3( 0.7071067690849304, 0, 0.7071067690849304);
 var qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis,  0);
 var qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis,  Math.PI);
 var quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1 ], [qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w]);
 clip = new THREE.AnimationClip( null , 1, [ quaternionKF ] );


//clock
 clock = new THREE.Clock();


	// postprocessing

	composer = new EffectComposer( renderer );

	var renderPass = new RenderPass( scene, camera );
	composer.addPass( renderPass );

	outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
	composer.addPass( outlinePass );


	effectFXAA = new ShaderPass( FXAAShader );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
	composer.addPass( effectFXAA );

	window.addEventListener( 'resize', onWindowResize, false );

	window.addEventListener( 'mousemove', onTouchMove );
	window.addEventListener( 'touchmove', onTouchMove );

	renderer.domElement.addEventListener("click", onclick, true);

  randomButton.addEventListener('click', onRandomClick, true);
  originalButton.addEventListener('click', onOriginalClick, true);
  changeButton.addEventListener('click', onChangeClick, true);
  soundButton.addEventListener('click', onSoundClick, true);

  renderer.domElement.addEventListener('touchend', onDocumentTouchEnd, false);

  // window.addEventListener("orientationchange", function () {
  //   console.log("The orientation of the screen is: " + window.orientation);
  // });


  function onSoundClick() {
    if (sound) {
      soundOnButton.style.display = 'none';
      soundOffButton.style.display = 'inline';
    } else {
      soundOffButton.style.display = 'none';
      soundOnButton.style.display = 'inline';
    }
    sound = !sound;
  }

  function onDocumentTouchEnd(event) {
    event.preventDefault();

    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    checkIntersection();
    onclick();

  }


  function onChangeClick() {
    videoIdx++;
    if (videoIdx >= videos.length) {
      videoIdx = 0;
    }

    videoImageContext.clearRect(0,0,480,480);
    video.src = videos[videoIdx];
    video.play();

  }

  function onRandomClick() {

    let randomPos = getRandomPos();

    randomPos.forEach((el, i)=> {
      if (el !== 15) {
        let currPiece = pieces.filter(piece => piece.data === el)[0];
        currPiece.pos = i;
        currPiece.position.x = coord[i].x;
        currPiece.position.z = coord[i].z;
      } else {
        _blank = i;
      }
    });

  }

  function onOriginalClick() {
    outlinePass.selectedObjects = [];
    let action = mixers[0].clipAction(clip);

    if (originalMode) {
        action.reset();
        action.timeScale = 1;
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.play();
    } else {
      action.paused = false;
      action.timeScale = -1;
      action.setLoop(THREE.LoopOnce);
      action.play();
    }


          originalMode = !originalMode;
  }

	function onclick(srcEvent) {
    if (selectedObjects.length ===0) {
        onTouchMove(srcEvent);
        // checkIntersection();
    }

		let index = selectedObjects[0].data;
		let pos = selectedObjects[0].pos;

		if (
			( [0,1,2,3].includes(pos) && [0,1,2,3].includes(_blank) )
			||
			( [4,5,6,7].includes(pos) && [4,5,6,7].includes(_blank) )
			||
			([8,9,10,11].includes(pos) && [8,9,10,11].includes(_blank) )
			||
			( [12,13,14,15].includes(pos) && [12,13,14,15].includes(_blank) )
		) {
      if (sound) {
        tabSound.play();
      }
			if (pos < _blank) {
				let diff = _blank - pos;
				for (let i = 0; i < diff; i ++) {
					let curr = _blank - 1 - i;
					let currPiece = pieces.filter(piece => piece.pos === curr)[0];
					let currIndex = currPiece.data;

					pieces[currIndex].position.set(coord[_blank-i].x, 1.2, coord[_blank-i].z);
					pieces[currIndex]['pos'] = _blank -i;
				}
			} else {
				let diff = pos - _blank;
				for (let i = 0; i < diff; i ++) {
					let curr = _blank + 1 + i;
					let currPiece = pieces.filter(piece => piece.pos === curr)[0];
					let currIndex = currPiece.data;
					pieces[currIndex].position.set(coord[_blank+i].x, 1.2, coord[_blank+i].z);
					pieces[currIndex]['pos'] = _blank + i;
				}

			}

      _blank = pos;

		} else if ((pos - _blank) % 4 === 0){
      if (sound) {
        tabSound.play();
      }
			if (pos < _blank) {
				let diff = parseInt((_blank - pos)/4);
				for (let i = 0; i < diff; i ++) {
					let curr = _blank - ((i+1)*4);
					let currPiece = pieces.filter(piece => piece.pos === curr)[0];
					let currIndex = currPiece.data;
					pieces[currIndex].position.set(coord[_blank-i*4].x, 1.2, coord[_blank-i*4].z);
					pieces[currIndex]['pos'] = _blank - i*4;
				}
			} else {
				let diff = parseInt((pos - _blank)/4);
				for (let i = 0; i < diff; i ++) {
					let curr = _blank + ((i+1)*4);
					let currPiece = pieces.filter(piece => piece.pos === curr)[0];
					let currIndex = currPiece.data;
					pieces[currIndex].position.set(coord[_blank+i*4].x, 1.2, coord[_blank+i*4].z);
					pieces[currIndex]['pos'] = _blank  + i*4;
				}

			}
			_blank = pos;
		} else {

		}
}


	function onTouchMove( event ) {
		var x, y;

    if (!event)
      return

		if ( event.changedTouches ) {

			x = event.changedTouches[ 0 ].pageX;
			y = event.changedTouches[ 0 ].pageY;

		} else {

			x = event.clientX;
			y = event.clientY;

		}

		mouse.x = ( x / window.innerWidth ) * 2 - 1;
		mouse.y = - ( y / window.innerHeight ) * 2 + 1;

		checkIntersection();

	}

	function addSelectedObject( object ) {

		selectedObjects = [];
		selectedObjects.push( object );

	}

	function checkIntersection() {

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObject( pieceGroup, true );

		if ( intersects.length > 0 ) {

			var selectedObject = intersects[ 0 ].object;
			addSelectedObject( selectedObject );
			outlinePass.selectedObjects = selectedObjects;

		} else {

			outlinePass.selectedObjects = [];

		}

	}

}

function onWindowResize() {
	var width = window.innerWidth;
	var height = window.innerHeight - 4;
  camera.aspect  = width/ height;

  setCameraLocation();
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );
	composer.setSize( width, height );



	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

}

function setCameraLocation() {
  // if (camera.aspect > 1.7 || camera.aspect < 0.6) {
  //   if (window.innerWidth <= 414 || window.innerHeight  <= 414)  {
  //     console.log('w or h smaller than 400');
  //
  //     camera.position.set(0,60,0);
  //   }
  //
  // } else {
  //  console.log('else')

  // }
  if (camera.aspect > 1.7) {
    if (window.innerHeight <= 400) {
      camera.position.set(0,68,0);
    } else if (window.innerHeight <= 500) {
        camera.position.set(0,65,0);
    } else {
        camera.position.set(0,90,0);
    }


  } else {
    if (window.innerWidth <= 400) {
      camera.position.set(0,110,0);
    } else if (window.innerWidth <= 500) {
      camera.position.set(0,100,0);
    } else if (window.innerWidth <= 768) {
      camera.position.set(0,95,0);
    } else {
      camera.position.set(0,90,0);
    }
  }

}

function animate() {
  if(video.readyState === video.HAVE_ENOUGH_DATA){
    //draw video to canvas starting from upper left corner
    //console.log('video', video);
    videoImageContext.drawImage(video, 0, 0);
    //tell texture object it needs to be updated
    texture.needsUpdate = true;
  }
 var timer = performance.now();
  var mixerUpdateDelta = clock.getDelta();

  for ( var i = 0; i < mixers.length; ++ i ) {

    mixers[ i ].update( mixerUpdateDelta );

  }


	requestAnimationFrame( animate );

	composer.render();

}
