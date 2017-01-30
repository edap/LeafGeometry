import {Vector3, Face3, Geometry} from 'three';

export default class LeafGeometry{
    constructor(length, length_stem, width_stem, leaf_width, density, positive_curvature, positive_curvature_border, leaf_inclination){
        //leaf_width it's a value that goes from 0.1 to 1.0
        let curvature = positive_curvature * -1.0;
        let curvature_border = positive_curvature_border * -1.0;
        let n_discard_leaf = 1; //number of leaf skipped at the end
        let available_length = length - length_stem;
        let leaf_z_space = available_length/density; //length that each leaf occupies on the z axis, padding included
        let y = 0;
        let x = 0;
        let current_z = 0;
        let key_last_vertex = 0;
        let z_zero = length/2.0;
        let y_zero = this._getPointZero(curvature, length);
        let x_zero = this._getPointZero(curvature_border, length);
        let vertices = [];
        let faces = [];
        let n_leaves = (Math.abs(density - n_discard_leaf));
        let stem_decrease_value = width_stem / (n_leaves * 2);
        if (length_stem > 0) {
            vertices.push(new Vector3(-width_stem/2, y, current_z));
            vertices.push(new Vector3(width_stem/2, y, current_z));
            current_z += length_stem;
            y = this._getVauleOnParabola(curvature, current_z, z_zero, y_zero );
            width_stem -= stem_decrease_value;
            vertices.push(new Vector3((-width_stem/2), y, length_stem));
            vertices.push(new Vector3((width_stem/2), y, length_stem));
            faces.push(new Face3(0, 2, 1));
            faces.push(new Face3(2, 3, 1));
            key_last_vertex = 3;
        };
        let lunghezza_foglia = 3; // questo punto verra' poi calcolato usando le parabole
        let apertura = leaf_z_space * leaf_width;
        let space_between_leaves = leaf_z_space - apertura;
        for (let i = 0; i< n_leaves; i++) {
            //draw stem between the leaves
            if (length_stem > 0) {
                current_z += apertura;
                y = this._getVauleOnParabola(curvature, current_z, z_zero, y_zero );
                width_stem -= stem_decrease_value;
                vertices.push(new Vector3((-width_stem/2), y, current_z));
                vertices.push(new Vector3((width_stem/2), y, current_z));
                faces.push(new Face3(key_last_vertex-1, key_last_vertex+1, key_last_vertex));
                faces.push(new Face3(key_last_vertex+1, key_last_vertex+2, key_last_vertex));
                key_last_vertex += 2;
            } else {
                y = this._getVauleOnParabola(curvature, current_z, z_zero, y_zero );
                vertices.push(new Vector3((-width_stem/2), y, current_z));
                vertices.push(new Vector3((width_stem/2), y, current_z));

                current_z += length_stem;
                y = this._getVauleOnParabola(curvature, length_stem, z_zero, y_zero );
                width_stem -= stem_decrease_value;
                vertices.push(new Vector3((-width_stem/2), y, length_stem));
                vertices.push(new Vector3((width_stem/2), y, length_stem));
                faces.push(new Face3(0, 2, 1));
                faces.push(new Face3(2, 3, 1));
                key_last_vertex = 3;
            }

            // leaf dx, looking from the beginning of the stem in direction end of the leaf
            let z_foglia = (current_z + (space_between_leaves*3) * leaf_inclination);
            x = this._getVauleOnParabola(curvature_border, z_foglia, z_zero, x_zero );
            vertices.push(new Vector3(
                (-width_stem/2 + (x * -1)),
                this._getVauleOnParabola(curvature, z_foglia, z_zero, y_zero ),
                z_foglia));
            faces.push(new Face3(key_last_vertex+1, key_last_vertex-1, key_last_vertex-3));
            key_last_vertex += 1;

            //leaf sx
            x = this._getVauleOnParabola(curvature_border, z_foglia, z_zero, x_zero );
            vertices.push(new Vector3(
                (width_stem/2 + x),
                this._getVauleOnParabola(curvature, z_foglia, z_zero, y_zero ),
                z_foglia));
            faces.push(new Face3(key_last_vertex-1, key_last_vertex+1, key_last_vertex-3));
            key_last_vertex += 1;

            //draw the stem between the leaves, unless it is not the last iteration
            if (!(i === n_leaves -1)) {
                current_z += space_between_leaves;
                y = this._getVauleOnParabola(curvature, current_z, z_zero, y_zero );
                width_stem -= stem_decrease_value;
                vertices.push(new Vector3((-width_stem/2), y, current_z));
                vertices.push(new Vector3((width_stem/2), y, current_z));
                faces.push(new Face3(key_last_vertex-3, key_last_vertex+1, key_last_vertex-2));
                faces.push(new Face3(key_last_vertex+1, key_last_vertex+2, key_last_vertex-2));
                key_last_vertex += 2;
            }
        }

        var geom = new Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();
        return geom;
    }

    _getVauleOnParabola(curvature, z, z_zero, y_zero){
        let y = curvature * ((z - z_zero)*(z - z_zero)) + y_zero;
        return y;
    }

    _getPointZero(curvature, length){
        return (-1 * curvature) * ((length/2.0)*(length/2.0));
    }
}
