import * as THREE from './three.js/build/three.module.js';


import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from './three.js/examples/jsm/loaders/OBJLoader.js';


import { EffectComposer } from './three.js/examples/jsm/postprocessing/EffectComposer.js';
import { OutlinePass } from './three.js/examples/jsm/postprocessing/OutlinePass.js';
import { RenderPass } from './three.js/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './three.js/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from './three.js/examples/jsm/shaders/FXAAShader.js';

const txtfile = require('./grid-sprite.jpg');
const txtfile2 = require('./meeko.jpg');
const txtfile3 = require('./tri_pattern.jpg');


const uvMap16 = [
    [0, 1, 0.25, 1, 0, 0.75, 0.25, 0.75],
    [0.25, 1, 0.5, 1, 0.25, 0.75, 0.5, 0.75],
    [0, 0.75, 0.25, 0.75, 0, 0.5, 0.25, 0.5],
    [0.25, 0.75, 0.5, 0.75, 0.25, 0.5, 0.5, 0.5],
    [0.5, 1, 0.75, 1, 0.5, 0.75, 0.75, 0.75],
    [0.75, 1, 1, 1, 0.75, 0.75, 1, 0.75],
    [0.5, 0.75, 0.75, 0.75, 0.5, 0.5, 0.75, 0.5],
    [0.75, 0.75, 1, 0.75, 0.75, 0.5, 1, 0.5],
    [0, 0.5, 0.25, 0.5, 0, 0.25, 0.25, 0.25],
    [0.25, 0.5, 0.5, 0.5, 0.25, 0.25, 0.5, 0.25],
    [0, 0.25, 0.25, 0.25, 0, 0, 0.25, 0],
    [0.25, 0.25, 0.5, 0.25, 0.25, 0, 0.5, 0],
    [0.5, 0.5, 0.75, 0.5, 0.5, 0.25, 0.75, 0.25],
    [0.75, 0.5, 1, 0.5, 0.75, 0.25, 1, 0.25],
    [0.5, 0.25, 0.75, 0.25, 0.5, 0, 0.75, 0],
    [0.75, 0.25, 1, 0.25, 0.75, 0, 1, 0]
];

const uvTo = [0,1,4,5,2,3,6,7,8,9,12,13,10,11,14,15];

let _blank = 15;



var container, stats;
var camera, scene, renderer, controls;
var raycaster = new THREE.Raycaster();

var mouse = new THREE.Vector2();
var selectedObjects = [];

var composer, effectFXAA, outlinePass;
var obj3d = new THREE.Object3D();

var group = new THREE.Group();

var pieces = [];
let initialPos = [];

var params = {
	edgeStrength: 3.0,
	edgeGlow: 0.0,
	edgeThickness: 1.0,
	pulsePeriod: 0,
	rotate: false,
	usePatternTexture: false
};

var coord = [];

const randomButton = document.getElementById('random');
const solveButton = document.getElementById('solve');
console.log('randomButton', randomButton);
console.log('solveButton', solveButton);


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
  let arr = shuffleArray([...Array(16).keys()]);
  return shuffleArray(arr);
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



init();
animate();

function init() {


  initialPos = getRandomPos();
  console.log('initial Pos', initialPos);


	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var width = window.innerWidth;
	var height = window.innerHeight;

	renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	// todo - support pixelRatio in this demo
	renderer.setSize( width, height );
	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();
	scene.add(new THREE.AxesHelper(5));

	camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 200 );
	camera.position.set( 20 , 20, 10 );
	camera.lookAt(0,0,0);

	controls = new OrbitControls( camera, renderer.domElement );
	controls.minDistance = 5;
	controls.maxDistance = 100;
	controls.enablePan = false;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	//

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

	var texture = new THREE.TextureLoader().load(txtfile2);
	var planeMaterial = new THREE.MeshBasicMaterial( { map: texture, morphTargets: true, transparent: false} );


	for (let i = 0; i < 4; i ++ ) {
		for (let j = 0; j < 4; j ++ ) {
				coord.push({z: 10 * i + 1 * i, x: 10*j+1*j-25 });
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
						let uv = uvMap16[uvTo[i*4+j]];
						var uvs = new Float32Array( uv);
						pGeo.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
						pieces.push(plane);
				}
		}
	}


  initialPos.forEach((el, i)=> {
    if (el !== 15) {
      let currPiece = pieces.filter(piece => piece.data === el)[0];
      currPiece.pos = i;
      currPiece.position.x = coord[i].x;
      currPiece.position.z = coord[i].z;
      group.add(currPiece);
    } else {
      _blank = i;
    }

  })

  console.log('_blank', _blank);
  console.log('pieces', pieces);


	// postprocessing

	composer = new EffectComposer( renderer );

	var renderPass = new RenderPass( scene, camera );
	composer.addPass( renderPass );

	outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
	composer.addPass( outlinePass );

	var onLoad = function ( texture ) {

		outlinePass.patternTexture = texture;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;

	};

	var loader = new THREE.TextureLoader();

	loader.load( 'textures/tri_pattern.jpg', onLoad );

	effectFXAA = new ShaderPass( FXAAShader );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
	composer.addPass( effectFXAA );





	window.addEventListener( 'resize', onWindowResize, false );

	window.addEventListener( 'mousemove', onTouchMove );
	window.addEventListener( 'touchmove', onTouchMove );
	renderer.domElement.addEventListener("click", onclick, true);

  solveButton.addEventListener('click', onSolveClick, true);
  randomButton.addEventListener('click', onRandomClick, true);

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

	function onclick() {
    // console.log('selectedObjects', selectedObjects)
		console.log('clicked!', selectedObjects ? selectedObjects[0].data : null);
		console.log('_blank!', _blank);
		// get some data
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
			_blank = pos;
		} else {



			// not a vaild move
			console.log('no move');
		}

}


	function onTouchMove( event ) {

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

		var intersects = raycaster.intersectObject( scene, true );

		if ( intersects.length > 0 ) {

			var selectedObject = intersects[ 0 ].object;
			addSelectedObject( selectedObject );
			outlinePass.selectedObjects = selectedObjects;

		} else {

			// outlinePass.selectedObjects = [];

		}

	}

}

function onWindowResize() {

	var width = window.innerWidth;
	var height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );
	composer.setSize( width, height );

	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	//stats.begin();

	var timer = performance.now();

	if ( params.rotate ) {

		group.rotation.y = timer * 0.0001;

	}
  //
	// controls.update();

	composer.render();

//	stats.end();

}
