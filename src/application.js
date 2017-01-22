/* eslint-env browser */
import * as THREE from 'three';
import Gui from './gui.js';
import CollectionGeometries from './geometries.js';
import CollectionMaterials from './materials.js';

const gui = new Gui();
const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.style.margin =0;
document.body.appendChild(renderer.domElement);
camera.position.z = 80;
this.controls = new OrbitControls(camera, renderer.domElement);


//scene
const materials = new CollectionMaterials;
const geometries = new CollectionGeometries;
var objects = [];
var group = new THREE.Group();

//lights
let ambientLight = new THREE.AmbientLight( 0x000000 );
scene.add( ambientLight );
gui.addScene(scene, ambientLight, renderer);
gui.addMaterials(materials);

let lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );


var axisHelper = new THREE.AxisHelper( 50 );
//scene.add( axisHelper );

window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
});

function populateGroup(selected_geometry, selected_material) {
    for (var i = 0; i< gui.params.num; i++) {
        let coord = {x:i, y:i, z:i};
        let object = new THREE.Mesh(selected_geometry, selected_material);
        object.position.set(coord.x, coord.y, coord.z);
        object.rotateY( (90 + 40 + i * 100/gui.params.num ) * -Math.PI/180.0 );

        objects.push(object);
        group.add(object);
    }
    scene.add(group);
}

function resetGroup(){
    for(var index in objects){
        let object = objects[index];
	    group.remove( object );
    }
    scene.remove(group);
    objects = [];
}

function render(){
    populateGroup(geometries[gui.params.geometry],materials[gui.params.material]);
    if(gui.params.rotate_flower){
        group.rotateZ( 0.0137);
    }
	requestAnimationFrame(render);
	renderer.render(scene, camera);
    resetGroup();
}

render();
