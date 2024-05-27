import * as THREE from "three";

function polygonGeometryFromCoordinates(coordinates) {
    let polyShape = new THREE.Shape(coordinates.map((p) => new THREE.Vector2(p.x, p.y)))
    const polyGeometry = new THREE.ShapeGeometry(polyShape);
    polyGeometry.setAttribute("position", new THREE.Float32BufferAttribute(
        coordinates.map(p => [p.x, p.y, 0]).flat(), 3)
    )
    return polyGeometry
}

function polygonFromCoordinates(coordinates, color) {
    return new THREE.Mesh(polygonGeometryFromCoordinates(coordinates),
        new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        }))
}

function polygonBoundaryFromCoordinates(coordinates, color) {
    const edgesGeometry = new THREE.EdgesGeometry(polygonGeometryFromCoordinates(coordinates))
    return new THREE.LineSegments(edgesGeometry,
        new THREE.LineBasicMaterial({
            color: color
        }))
}

function fitCameraToObject(object, camera, offset, orbitControls) {
    let boundingBox = new THREE.Box3().setFromObject(object);
    let size = boundingBox.getSize(new THREE.Vector3());
    let center = boundingBox.getCenter(new THREE.Vector3());

    // get the max side of the bounding box
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

    // offset the camera as desired - usually a value of ~ 1.25 is good to prevent
    // object filling the whole canvas
    if (offset !== undefined && offset !== 0) cameraZ *= offset;

    camera.position.set(center.x, center.y, cameraZ);

    // set the far plane of the camera so that it easily encompasses the whole object
    const minZ = boundingBox.min.z;
    const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();

    if (orbitControls !== undefined) {
        // set camera to rotate around center of loaded object
        orbitControls.target = center;
        // prevent camera from zooming out far enough to create far plane cutoff
        orbitControls.maxDistance = cameraToFarEdge * 2;
    }
}

function shiftCoordinates(coordinates, dx, dy) {
    return coordinates.map((p) => {
        return {
            x: p.x + dx,
            y: p.y + dy
        }
    })
}

function hexToRgb(hex) {
    if(hex.startsWith("#")) hex = hex.slice(1);
    return hex.match(/.{1,2}/g).map(e => parseInt(e, 16));
}

export {
    polygonGeometryFromCoordinates,
    polygonFromCoordinates,
    polygonBoundaryFromCoordinates,
    fitCameraToObject,
    shiftCoordinates,
    hexToRgb
};