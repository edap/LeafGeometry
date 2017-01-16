/* eslint-env browser */
import {Scene, PerspectiveCamera, WebGLRenderer} from 'three';
import Cube from './cube.js';
import DAT from 'dat-gui';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const gui = new DAT.GUI();
var params = {
    pos_x: 0,
    pos_y: 0
};

gui.add(params, "pos_x").min(-10).max(10).step(1);
gui.add(params, "pos_y").min(-10).max(10).step(1);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const cube = new Cube();
scene.add(cube.mesh);

camera.position.z = 5;

function render(){
	requestAnimationFrame(render);
    cube.mesh.position.x = params.pos_x;
    cube.mesh.position.y = params.pos_y;
	renderer.render(scene, camera);
}

render();
