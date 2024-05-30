<template>

  <v-container class="text-center">
    <v-progress-circular
        indeterminate
        color="primary"
        v-if="!rendered"
    ></v-progress-circular>

    <div class="position-relative" :id="sceneContainerId">
      <div :id="sceneId"></div>
    </div>


    <div v-if="rendered" class="text-center mt-1 text-sm-caption">
      Controls: Mouse wheel to zoom, Mouse click to pan
    </div>
  </v-container>

</template>


<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons";
import axios from "axios";
import {
  polygonFromCoordinates, fitCameraToObject
} from "@/lib/visualization/threejs_helper";

import solution from "@/assets/1.json";
import colormap from "colormap";


export default {
  name: "MinimumCoverageByConvexPolygonsVisualization",
  props: {
    url: String,
    solutionUrl: String
  },
  data() {
    return {
      rendered: false,
      renderer: null,
      labelRenderer: null,
      data: null,
      sceneId: this.$.uid + '-scene',
      sceneContainerId: this.$.uid + '-sceneContainer'
    }
  },
  mounted() {
    axios.get(this.url).then((response) => {
      this.data = response.data
      this.data.solution = solution;
      this.data.solution.polygons = this.shuffle(this.data.solution.polygons);
      if (this.solutionUrl) {
        axios.get(this.solutionUrl).then((response) => {
          this.data.solution = response.data
          this.initializeScene();
        }).catch((error) => {
          console.error(error)
        });
      } else {
        this.initializeScene();
      }
    }).catch((error) => {
      console.error(error)
    });
  },
  methods: {
    shuffle(arr) {
      return arr.reduce(([a, b]) =>
          (b.push(...a.splice(Math.random() * a.length | 0, 1)), [a, b]), [[...arr], []])[1]
    },
    coordinatesFromJson(obj) {
      return obj.xs.map((x, i) => {

        if (typeof x === 'number') {
          return {
            x: x,
            y: obj.ys[i]
          }
        }

        return {
          x: x.numerator / x.denominator,
          y: obj.ys[i].numerator / obj.ys[i].denominator
        }
      });
    },
    colorForItem(i) {
      let itemColors = colormap({
        colormap: 'jet',
        nshades: this.data.solution.polygons.length,
        format: 'hex',
        alpha: 1
      });
      return itemColors[i % itemColors.length]
    },
    initializeScene() {
      const width = document.getElementById(this.sceneId).offsetWidth;
      const height = 500;
      const aspectRatio = width / height;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xefefef);

      const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(width, height);
      document.getElementById(this.sceneId).appendChild(this.renderer.domElement);

      const controls = new OrbitControls(camera, this.renderer.domElement);
      controls.enableRotate = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN
      }

      let allObjects = new THREE.Group();

      allObjects.add(polygonFromCoordinates(
          this.coordinatesFromJson(this.data.outer_boundary),
          "#cccccc"))

      this.data.holes.forEach((hole) => {
        allObjects.add(polygonFromCoordinates(
            this.coordinatesFromJson(hole),
            "#ffffff"))
      });

      if (this.data.solution) {
        this.data.solution.polygons.forEach((polygon, i) => {
          const mesh = polygonFromCoordinates(
              this.coordinatesFromJson(polygon),
              this.colorForItem(i));

          mesh.material.opacity = 0.2;
          mesh.material.transparent = true;
          allObjects.add(mesh)
        });
      }

      scene.add(allObjects);

      fitCameraToObject(allObjects, camera, 3, controls);

      this.renderer.setAnimationLoop(() => {
        controls.update()
        this.renderer.render(scene, camera);
        this.rendered = true;
      });
    }
  },
  unmounted() {
    if (this.renderer) this.renderer.dispose();
  }
}

</script>

<style scoped>
#scene {
  border-radius: 50px;
  overflow: hidden;
}

:deep(.label) {
  background: #2c3e50;
  color: white;
  margin-top: -3em;
  padding: .5em;
  border-radius: 5px;
}
</style>