<script setup>

</script>

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
import {Line2, LineGeometry, LineMaterial, OrbitControls} from "three/addons";
import axios from "axios";
import {Vector3} from "three";

import {
  hexToRgb,
  fitCameraToObject
} from "@/lib/visualization/threejs_helper";
import {createColors, rgbHex} from 'color-map'
import colormap from "colormap";


export default {
  name: "MinimumNonObtuseTriangulationVisualization",
  props: {
    url: String,
    solutionUrl: String
  },
  data() {
    return {
      rendered: false,
      data: null,
      sceneId: this.$.uid + '-scene',
      sceneContainerId: this.$.uid + '-sceneContainer',
      renderer: null
    }
  },
  mounted() {
    axios.get(this.url).then((response) => {
      this.data = response.data
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
    colorForItem(i) {
      let itemColors = ['#4694e6', '#3bd35d', '#e1413a', '#7241df',
        '#e3e131', '#21a39f']
      return itemColors[i % itemColors.length]
    },
    solutionColor(i) {
      return "#0a6e6e"
    },
    initializeScene() {
      const width = document.getElementById(this.sceneId).offsetWidth;
      const height = 500;
      const aspectRatio = width / height;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(width, height);
      document.getElementById(this.sceneId).appendChild(this.renderer.domElement);

      const points = this.data.points_x.map((x, i) => {
        return {x: x, y: this.data.points_y[i]}
      });

      const controls = new OrbitControls(camera, this.renderer.domElement);
      controls.enableRotate = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN
      }

      let allObjects = new THREE.Group();

      this.data.additional_constraints.forEach((constraint) => {
        const a = constraint[0];
        const b = constraint[1];

        const coordinates = [
          points[a].x, points[a].y, 1,
          points[b].x, points[b].y, 1
        ];
        const geometry = new LineGeometry().setPositions(coordinates);
        allObjects.add(new Line2(geometry, new LineMaterial({
          color: 0xff0000,
          opacity: 1,
          linewidth: 1,
          resolution: new THREE.Vector2(width, height)
        })));
      });

      this.data.region_boundary.forEach((a, i) => {
        const b = this.data.region_boundary[(i+ 1) % this.data.region_boundary.length];
        const coordinates = [
          points[a].x, points[a].y, 1,
          points[b].x, points[b].y, 1
        ];
        const geometry = new LineGeometry().setPositions(coordinates);
        allObjects.add(new Line2(geometry, new LineMaterial({
          color: 0x000000,
          opacity: 1,
          linewidth: 2,
          resolution: new THREE.Vector2(width, height)
        })));
      });

      const vertices = [];
      const colors = [];

      points.forEach((p) => {
        vertices.push(new Vector3(p.x, p.y, 1));
        colors.push(...hexToRgb("#000000"))
      })

      const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      let tex = new THREE.TextureLoader().load(require("@/assets/circle_texture.png"));

      let material = new THREE.PointsMaterial({
        vertexColors: true,
        map: tex,
        size: 1,
        sizeAttenuation: false,
        alphaTest: 0.5,
        transparent: true
      });
      const pointsMesh = new THREE.Points(geometry, material);
      allObjects.add(pointsMesh);

      scene.add(allObjects);

      fitCameraToObject(allObjects, camera, 3, controls);
      controls.update()

      let highlightedObjects = new THREE.Group();
      scene.add(highlightedObjects);


      this.renderer.setAnimationLoop(() => {
        controls.update()
        let scaleVector = new THREE.Vector3();
        pointsMesh.material.size = Math.min(10,
            scaleVector.subVectors(pointsMesh.position, camera.position).length() / width);


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