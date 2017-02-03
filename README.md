This repository contains a demo that uses the LeafGeometry.

A demo is also online on my [website](http://davideprati.com/demo/LeafGeometry)

For now it is es6 only, to use it in your project, download the file `src/LeafGeometry.js`, include it in your application and use this geometry to create a mesh, for example:

```javascript
import LeafGeometry from './leafGeometry.js';

let geometry = new LeafGeometry(
			gui.params.length,
			gui.params.length_stem,
			gui.params.width_stem,
			gui.params.leaf_width,
			gui.params.leaf_up,
			gui.params.density,
			gui.params.curvature,
			gui.params.curvature_border,
			gui.params.leaf_inclination
);

object = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x2194CE}));
scene.add(object);

```

To try out this example, clone the repository and:

```javascript
npm install
npm start
npm build
```

![example](uno.png)
![example](due.png)
![example](tre1.png)
![example](quattro.png)
