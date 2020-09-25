import * as THREE from './three.js/build/three.module.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from './three.js/examples/jsm/postprocessing/EffectComposer.js';
import { OutlinePass } from './three.js/examples/jsm/postprocessing/OutlinePass.js';
import { RenderPass } from './three.js/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './three.js/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from './three.js/examples/jsm/shaders/FXAAShader.js';


const videoSource = require('./saved.mp4');
const videoSource2 = require('./1.mp4');
const videoSource3 = require('./2.mp4');

const audioSrc = require('./tap2.mp3');


let videoIdx = 0;
let videos = [videoSource, videoSource2, videoSource3];
var video;
var texture;
var videoImageContext;
let clock;
var clip,clip2;

// const uvMap16 = [
//     [0, 1, 0.25, 1, 0, 0.75, 0.25, 0.75],
//     [0.25, 1, 0.5, 1, 0.25, 0.75, 0.5, 0.75],
//     [0, 0.75, 0.25, 0.75, 0, 0.5, 0.25, 0.5],
//     [0.25, 0.75, 0.5, 0.75, 0.25, 0.5, 0.5, 0.5],
//     [0.5, 1, 0.75, 1, 0.5, 0.75, 0.75, 0.75],
//     [0.75, 1, 1, 1, 0.75, 0.75, 1, 0.75],
//     [0.5, 0.75, 0.75, 0.75, 0.5, 0.5, 0.75, 0.5],
//     [0.75, 0.75, 1, 0.75, 0.75, 0.5, 1, 0.5],
//     [0, 0.5, 0.25, 0.5, 0, 0.25, 0.25, 0.25],
//     [0.25, 0.5, 0.5, 0.5, 0.25, 0.25, 0.5, 0.25],
//     [0, 0.25, 0.25, 0.25, 0, 0, 0.25, 0],
//     [0.25, 0.25, 0.5, 0.25, 0.25, 0, 0.5, 0],
//     [0.5, 0.5, 0.75, 0.5, 0.5, 0.25, 0.75, 0.25],
//     [0.75, 0.5, 1, 0.5, 0.75, 0.25, 1, 0.25],
//     [0.5, 0.25, 0.75, 0.25, 0.5, 0, 0.75, 0],
//     [0.75, 0.25, 1, 0.25, 0.75, 0, 1, 0]
// ];

// const uvMap16 = [
//     [0, 1, 0.24875, 1, 0, 0.75125, 0.24875, 0.75125],
//     [0.25125, 1, 0.49875, 1, 0.25125, 0.75125, 0.49875, 0.75125],
//     [0.50125, 1, 0.74875, 1, 0.50125, 0.75125, 0.74875, 0.75125],
//     [0.75125, 1, 1, 1, 0.75125, 0.75125, 1, 0.75125],
//     [0, 0.74875, 0.24875, 0.74875, 0, 0.50125, 0.24875, 0.50125],
//     [0.25125, 0.74875, 0.49875, 0.74875, 0.25125, 0.50125, 0.49875, 0.50125],
//     [0.50125, 0.74875, 0.74875, 0.74875, 0.50125, 0.50125, 0.74875, 0.50125],
//     [0.75125, 0.74875, 1, 0.74875, 0.75125, 0.50125, 1, 0.50125],
//     [0, 0.49875, 0.24875, 0.49875, 0, 0.25125, 0.24875, 0.25125],
//     [0.25125, 0.49875, 0.49875, 0.49875, 0.25125, 0.25125, 0.49875, 0.25125],
//     [0.50125, 0.49875, 0.74875, 0.49875, 0.50125, 0.25125, 0.74875, 0.25125],
//     [0.75125, 0.49875, 1, 0.49875, 0.75125, 0.25125, 1, 0.25125],
//     [0, 0.24875, 0.24875, 0.24875, 0, 0, 0.24875, 0],
//     [0.25125, 0.24875, 0.49875, 0.24875, 0.25125, 0, 0.49875, 0],
//     [0.50125, 0.24875, 0.74875, 0.24875, 0.50125, 0, 0.74875, 0],
//     [0.75125, 0.24875, 1, 0.24875, 0.75125, 0, 1, 0]
// ];

const uvMap16 =[
  [0,1,0.24375,1,0,0.75625,0.24375,0.75625],[0.25625,1,0.49375,1,0.25625,0.75625,0.49375,0.75625],[0.50625,1,0.74375,1,0.50625,0.75625,0.74375,0.75625],[0.75625,1,1,1,0.75625,0.75625,1,0.75625],[0,0.74375,0.24375,0.74375,0,0.50625,0.24375,0.50625],[0.25625,0.74375,0.49375,0.74375,0.25625,0.50625,0.49375,0.50625],[0.50625,0.74375,0.74375,0.74375,0.50625,0.50625,0.74375,0.50625],[0.75625,0.74375,1,0.74375,0.75625,0.50625,1,0.50625],[0,0.49375,0.24375,0.49375,0,0.25625,0.24375,0.25625],[0.25625,0.49375,0.49375,0.49375,0.25625,0.25625,0.49375,0.25625],[0.50625,0.49375,0.74375,0.49375,0.50625,0.25625,0.74375,0.25625],[0.75625,0.49375,1,0.49375,0.75625,0.25625,1,0.25625],[0,0.24375,0.24375,0.24375,0,0,0.24375,0],[0.25625,0.24375,0.49375,0.24375,0.25625,0,0.49375,0],[0.50625,0.24375,0.74375,0.24375,0.50625,0,0.74375,0],[0.75625,0.24375,1,0.24375,0.75625,0,1,0]
];


// const uvTo = [0,1,4,5,2,3,6,7,8,9,12,13,10,11,14,15];

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
const solveButton = document.getElementById('solve');
const originalButton = document.getElementById('original');
const changeButton = document.getElementById('change');


const tabSound = new Audio(audioSrc);
tabSound.volume = 0.2;

let originalMode = true;
let mixers = [];

var clip;

function solved(arr) {
  var a  = arr.map((x)=> {
      //pos === data
      return x.pos === x.data;
  })

  return !a.filter(x=> false).length;
}

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
  console.log('initial Pos', initialPos);


  video = document.createElement( 'video' );
  video.src = videos[2];
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
	camera.position.set(0 , 100, 0 );
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

            plane.position.y = 0;
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
  mid.position.y = -0.05;
  mid.rotation.x = Math.PI / 2;
  group.add( mid );

  let backGeo = new THREE.PlaneBufferGeometry( 40, 40 );
  let backPlane = new THREE.Mesh(backGeo,planeMaterial);
  backPlane.position.y = -0.1;
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

  console.log('_blank', _blank);
  console.log('pieces', pieces);

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

  // window.onload = ()=> { console.log('onload');video.play();}
  // document.addEventListener('DOMContentLoaded', ()=> { console.log('onload');video.play();});


	window.addEventListener( 'resize', onWindowResize, false );

	window.addEventListener( 'mousemove', onTouchMove );
	window.addEventListener( 'touchmove', onTouchMove );

	renderer.domElement.addEventListener("click", onclick, true);

  solveButton.addEventListener('click', onSolveClick, true);
  randomButton.addEventListener('click', onRandomClick, true);
  originalButton.addEventListener('click', onOriginalClick, true);
  changeButton.addEventListener('click', onChangeClick, true);


  renderer.domElement.addEventListener('touchend', onDocumentTouchEnd, false);

  function onDocumentTouchEnd(event) {
    event.preventDefault();

    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    checkIntersection();
    onclick();

  }


  function onChangeClick() {
    console.log('on change clicked');
    videoIdx++;
    if (videoIdx > 2) {
      videoIdx = 0;
    }

    videoImageContext.clearRect(0,0,480,480);
    video.src = videos[videoIdx];
    console.log('video', video);
    video.play();

  }

  function onSolveClick() {
    console.log('solve clicked');

    [...Array(15).keys()].forEach((i)=> {

      let currPiece = pieces[i];
      // console.log('currPiece', currPiece);
      currPiece.pos = i;
      currPiece.position.x = coord[i].x;
      currPiece.position.z = coord[i].z;

    });
    _blank = 15;
  }


  function onRandomClick() {
    console.log('random clicked');

    let randomPos = getRandomPos();
    console.log('randomPos', randomPos);

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
    console.log('original mode', originalMode);
    outlinePass.selectedObjects = [];
    // // console.log('timescale',   action.timeScale );
    // console.log(' !originalMode? 1: -1',    originalMode? 1: -1 );
    console.log('quaternion', group.quaternion);

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

    // console.log('action.timeScale',   action.timeScale);

    // mesh.userData.mixer = new THREE.AnimationMixer(mesh);
  }

	function onclick(srcEvent) {
    console.log('selectedObjects', selectedObjects)


		console.log('clicked!', selectedObjects[0] ? selectedObjects[0].data : null);
		console.log('_blank!', _blank);
		// get some data
    if (selectedObjects.length ===0) {

        console.log('zero out');
        onTouchMove(srcEvent);
        // checkIntersection();
    }


		let index = selectedObjects[0].data;
		let pos = selectedObjects[0].pos;

			console.log('index', index);
      	console.log('pos', pos);

		if (
			( [0,1,2,3].includes(pos) && [0,1,2,3].includes(_blank) )
			||
			( [4,5,6,7].includes(pos) && [4,5,6,7].includes(_blank) )
			||
			([8,9,10,11].includes(pos) && [8,9,10,11].includes(_blank) )
			||
			( [12,13,14,15].includes(pos) && [12,13,14,15].includes(_blank) )
		) {

        console.log('same row');
			if (pos < _blank) {
          console.log('left');

				let diff = _blank - pos;
				for (let i = 0; i < diff; i ++) {
					let curr = _blank - 1 - i;
					let currPiece = pieces.filter(piece => piece.pos === curr)[0];
					let currIndex = currPiece.data;

					pieces[currIndex].position.set(coord[_blank-i].x, 0, coord[_blank-i].z);
					pieces[currIndex]['pos'] = _blank -i;
				}
			} else {
            console.log('right');
				let diff = pos - _blank;
				for (let i = 0; i < diff; i ++) {
					let curr = _blank + 1 + i;
					let currPiece = pieces.filter(piece => piece.pos === curr)[0];
					let currIndex = currPiece.data;
					pieces[currIndex].position.set(coord[_blank+i].x, 0, coord[_blank+i].z);
					pieces[currIndex]['pos'] = _blank + i;
				}

			}
      tabSound.play();
      _blank = pos;


		} else if ((pos - _blank) % 4 === 0){
      console.log('same column');

			if (pos < _blank) {
        console.log('bottom');

				let diff = parseInt((_blank - pos)/4);
				for (let i = 0; i < diff; i ++) {
					let curr = _blank - ((i+1)*4);
					let currPiece = pieces.filter(piece => piece.pos === curr)[0];
					let currIndex = currPiece.data;
					pieces[currIndex].position.set(coord[_blank-i*4].x, 0, coord[_blank-i*4].z);
					pieces[currIndex]['pos'] = _blank - i*4;
				}
			} else {
        console.log('top');

				let diff = parseInt((pos - _blank)/4);
				for (let i = 0; i < diff; i ++) {
					let curr = _blank + ((i+1)*4);
					let currPiece = pieces.filter(piece => piece.pos === curr)[0];
					let currIndex = currPiece.data;
					pieces[currIndex].position.set(coord[_blank+i*4].x, 0, coord[_blank+i*4].z);
					pieces[currIndex]['pos'] = _blank  + i*4;
				}

			}
      tabSound.play();
			_blank = pos;
		} else {



			// not a vaild move
			console.log('no move');
		}

}


	function onTouchMove( event ) {
    //console.log('touch move', event);
		var x, y;

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

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );
	composer.setSize( width, height );

	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

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
