<script setup>

</script>

<template>

  <v-container class="text-center">
    <v-progress-circular
        indeterminate
        color="primary"
        v-if="instanceData === null"
    ></v-progress-circular>

    <div id="scene"></div>

    <div v-if="instanceData !==null" class="text-center mt-1 text-sm-caption">
      Controls: Mouse wheel to zoom, Mouse click to pan
    </div>
  </v-container>

</template>


<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons";
import InstancesService from "@/services/instances.service";
import Problems from "@/data/problems";

export default {
  name: "MaximumPolygonPackingVisualization",
  props: {
    instance: Object
  },
  data() {
    return {
      instanceData: null
    }
  },
  mounted() {
    (new InstancesService(Problems.MaximumPolygonPacking.id)).getInstanceRaw(this.instance.uid).then((response) => {
      this.instanceData = response.data
      this.initializeScene();
    }).catch((error) => {
      console.error(error)
    });
  },
  methods: {
    polygonGeometryFromCoordinates(coordinates) {
      let polyShape = new THREE.Shape(coordinates.map((p) => new THREE.Vector2(p.x, p.y)))
      const polyGeometry = new THREE.ShapeGeometry(polyShape);
      polyGeometry.setAttribute("position", new THREE.Float32BufferAttribute(
          coordinates.map(p => [p.x, p.y, 0]).flat(), 3)
      )
      return polyGeometry
    },
    polygonFromCoordinates(coordinates, color) {
      return new THREE.Mesh(this.polygonGeometryFromCoordinates(coordinates),
          new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
          }))
    },
    polygonBoundaryFromCoordinates(coordinates, color) {
      const edgesGeometry = new THREE.EdgesGeometry(this.polygonGeometryFromCoordinates(coordinates))
      return new THREE.LineSegments(edgesGeometry,
          new THREE.LineBasicMaterial({
            color: color
          }))
    },
    fitCameraToObject(object, camera, offset, orbitControls) {
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
    },
    coordinatesFromJson(item) {
      return item.x.map((x, i) => {
        return {
          x: x,
          y: item.y[i]
        }
      });
    },
    shiftCoordinates(coordinates, dx, dy) {
      return coordinates.map((p) => {
        return {
          x: p.x + dx,
          y: p.y + dy
        }
      })
    },
    initializeScene() {
      const width = document.getElementById("scene").offsetWidth;
      const height = 500;
      const aspectRatio = width / height;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xefefef);

      const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(width, height);
      document.getElementById("scene").appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableRotate = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN
      }

      let container = this.coordinatesFromJson(this.instanceData.container);

      let containerWidth = Math.max(...this.instanceData.container.x);
      let containerHeight = Math.max(...this.instanceData.container.y);

      let allObjects = new THREE.Group();

      let itemColors = ['#a1c9f4', '#8de5a1', '#ff9f9b', '#d0bbff', '#fffea3', '#b9f2f0']

      let totalRowHeight = 0;
      let currentRowHeight = 0;
      let currentRowWidth = 0;
      let desiredWidth = aspectRatio * containerWidth * 2;

      this.instanceData.items.forEach((item, i) => {

        let itemWidth = Math.max(...item.x)
        let itemHeight = Math.max(...item.y)

        if (currentRowWidth + itemWidth > desiredWidth) {
          currentRowWidth = 0;
          totalRowHeight += currentRowHeight;
          currentRowHeight = 0;
        }

        currentRowWidth += 0.005 * containerWidth;

        let coordinates = this.coordinatesFromJson(item);

        coordinates = this.shiftCoordinates(coordinates,
            1.05 * containerWidth + currentRowWidth,
            totalRowHeight + 0.005 * containerWidth
        )

        currentRowWidth += itemWidth
        currentRowHeight = Math.max(currentRowHeight, itemHeight)

        allObjects.add(this.polygonFromCoordinates(coordinates, itemColors[i % itemColors.length]))

      })

      container = this.shiftCoordinates(container, 0, (totalRowHeight / 2) - (containerHeight / 2))

      allObjects.add(this.polygonBoundaryFromCoordinates(container, "#000000"));

      scene.add(allObjects);

      this.fitCameraToObject(allObjects, camera, 3, controls);
      controls.update()

      function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
      }

      animate()
    }
  }
}

</script>

<style scoped>
#scene {
  border-radius: 50px;
  overflow: hidden;
}
</style>