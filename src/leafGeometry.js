import {Vector3, Face3, Geometry} from 'three';

export default class LeafGeometry{
    constructor(length, length_gambo, leaf_width, density, positive_curvature, positive_curvature_border, leaf_inclination){
        //leaf width e' un valore che va da 0 a 1. Zero e' la foglia il piu' stretta possibile
        // 1 e lo spazio a disposizione dopo aver calcolato la lunghezza
        let curvature = positive_curvature * -1.0;
        let curvature_border = positive_curvature_border * -1.0;
        let n_discard_leaf = 1; //numero di foglie che non verranno aggiunte
        let available_length = length - length_gambo;
        let leaf_z_space = available_length/density; //length that each leaf occupy on the z axis, padding included
        let width_gambo = 2; //larghezza fissa,per ora, che definisce quanto il gambo e' largo

        let y = 0; //alt the y's are for now on 0
        let x = 0; //alt the y's are for now on 0
        //gambo
        let current_z = 0;
        let key_last_vertex = 0;
        let z_zero = length/2.0;
        let y_zero = this.getPointZero(curvature, length);
        let x_zero = this.getPointZero(curvature_border, length);
        let vertices = [];
        let faces = [];
        if(length_gambo > 0){
            vertices.push(new Vector3(-width_gambo/2, y, current_z));
            vertices.push(new Vector3(width_gambo/2, y, current_z));
            current_z += length_gambo;
            y = this.getValueOnParabola(curvature, current_z, z_zero, y_zero );
            vertices.push(new Vector3((-width_gambo/2), y, length_gambo));
            vertices.push(new Vector3((width_gambo/2), y, length_gambo));
            faces.push(new Face3(0, 2, 1));
            faces.push(new Face3(2, 3, 1));
            key_last_vertex = 3;
        };
        let lunghezza_foglia = 3; // questo punto verra' poi calcolato usando le parabole
        let apertura = leaf_z_space * leaf_width;
        let space_between_leaves = leaf_z_space - apertura;
        let n_leaves = (Math.abs(density - n_discard_leaf));
        for(let i = 0; i< n_leaves; i++){
            //disegna gambo tra le foglie
            if (length_gambo > 0) {
                current_z += apertura;
                y = this.getValueOnParabola(curvature, current_z, z_zero, y_zero );
                vertices.push(new Vector3((-width_gambo/2), y, current_z));
                vertices.push(new Vector3((width_gambo/2), y, current_z));
                faces.push(new Face3(key_last_vertex-1, key_last_vertex+1, key_last_vertex));
                faces.push(new Face3(key_last_vertex+1, key_last_vertex+2, key_last_vertex));
                key_last_vertex += 2;
            } else {
                y = this.getValueOnParabola(curvature, current_z, z_zero, y_zero );
                vertices.push(new Vector3((-width_gambo/2), y, current_z));
                vertices.push(new Vector3((width_gambo/2), y, current_z));

                current_z += length_gambo;
                y = this.getValueOnParabola(curvature, length_gambo, z_zero, y_zero );
                vertices.push(new Vector3((-width_gambo/2), y, length_gambo));
                vertices.push(new Vector3((width_gambo/2), y, length_gambo));
                faces.push(new Face3(0, 2, 1));
                faces.push(new Face3(2, 3, 1));
                key_last_vertex = 3;
            }

            // foglia dx, guardando dal gambo verso la fine
            //let z_foglia = current_z + (space_between_leaves * leaf_inclination); // questo dovrai modificarlo poi, usando la curva
            // let z_foglia = current_z; // questo dovrai modificarlo poi, usando la curva
            // console.log(current_z);
            // console.log(space_between_leaves);
            // console.log("wtg"+ (current_z + space_between_leaves * 0.2));
            let z_foglia = (current_z + (space_between_leaves*2) * leaf_inclination);
            x = this.getValueOnParabola(curvature_border, z_foglia, z_zero, x_zero );
            vertices.push(new Vector3(
                (-width_gambo/2 + (x * -1)),
                this.getValueOnParabola(curvature, z_foglia, z_zero, y_zero ),
                z_foglia));
            faces.push(new Face3(key_last_vertex+1, key_last_vertex-1, key_last_vertex-3));
            key_last_vertex += 1;

            //foglia sx, guardando dal gambo verso la fine
            x = this.getValueOnParabola(curvature_border, z_foglia, z_zero, x_zero );
            vertices.push(new Vector3(
                (width_gambo/2 + x),
                this.getValueOnParabola(curvature, z_foglia, z_zero, y_zero ),
                z_foglia));
            faces.push(new Face3(key_last_vertex-1, key_last_vertex+1, key_last_vertex-3));
            key_last_vertex += 1;

            // disegna spazio incluso, a meno che questa non fosse l'ultima itearazione
            if (!(i === n_leaves -1)) {
                current_z += space_between_leaves;
                y = this.getValueOnParabola(curvature, current_z, z_zero, y_zero );
                vertices.push(new Vector3((-width_gambo/2), y, current_z));
                vertices.push(new Vector3((width_gambo/2), y, current_z));
                faces.push(new Face3(key_last_vertex-3, key_last_vertex+1, key_last_vertex-2));
                faces.push(new Face3(key_last_vertex+1, key_last_vertex+2, key_last_vertex-2));
                key_last_vertex += 2;
            }
        }

        //debugger;

        var geom = new Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();
        return geom;
    }

    getValueOnParabola(curvature, z, z_zero, y_zero){
        let y = curvature * ((z - z_zero)*(z - z_zero)) + y_zero;
        return y;
    }

    getPointZero(curvature, length){
        return (-1 * curvature) * ((length/2.0)*(length/2.0));
    }
}
