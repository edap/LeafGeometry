import * as THREE from 'THREE';

export default class CollectionMaterials {
    constructor(){
        let materials = {
            "standard": new THREE.MeshStandardMaterial( {color: 0x00ff00} ),
            "wireframe": new THREE.MeshBasicMaterial( {color: 0x00ff00,
                                                       wireframe: true,
                                                       wireframeLinecap:"butt",
                                                       wireframeLineWidth:66
                                                      } ),
            "physical": new THREE.MeshPhysicalMaterial({color: 0x2194CE,
                                                        clearCoat:1.0,
                                                        clearCoatRoughness:0.0,
                                                        reflectivity:0.9}),
            "phong": new THREE.MeshPhongMaterial({color: 0x2194CE}),
            "lambert": new THREE.MeshPhongMaterial({color: 0x2194CE})
        };
        return materials;
    }
}
