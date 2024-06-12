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

    <v-slider v-if="data && data.solution" v-model="highlight" min="0" :max="maxColor" step="1" label="Subgraph" thumb-label></v-slider>

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
  name: "MinimumSubgraphPartitionVisualization",
  props: {
    url: String,
    solutionUrl: String
  },
  watch: {
    highlight() {
      this.changedHighlight = true;
    }
  },
  computed: {
    maxColor() {
      if(!this.data.solution) {
        return 0;
      }

      return Math.max(...this.data.solution.colors);
    }
  },
  data() {
    return {
      changedHighlight: true,
      rendered: false,
      highlight: 0,
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

      const points = this.data.points.xs.map((x, i) => {
        return {x: x, y: this.data.points.ys[i]}
      });

      const controls = new OrbitControls(camera, this.renderer.domElement);
      controls.enableRotate = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN
      }

      let allObjects = new THREE.Group();

      let matLine = new LineMaterial({
        color: 0x000000,
        opacity: 0.1,
        linewidth: 1, // in world units with size attenuation, pixels otherwise,
        resolution: new THREE.Vector2(width, height)
      });

      this.data.edges.start.forEach((a, i) => {
        const b = this.data.edges.end[i];
        const coordinates = [
          points[a].x, points[a].y, 1,
          points[b].x, points[b].y, 1
        ];

        const geometry = new LineGeometry().setPositions(coordinates);
        allObjects.add(new Line2(geometry, matLine));
      });

      const vertices = [];
      const colors = [];

      points.forEach((p, i) => {
        vertices.push(new Vector3(p.x, p.y, 1));
        let color = hexToRgb(this.colorForItem(i)).map(c => c / 255)
        colors.push(...color)
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

        if (this.data.solution && this.changedHighlight) {
          highlightedObjects.clear();
          let matLine = new LineMaterial({
            color: this.solutionColor(this.highlight),
            opacity: 1,
            linewidth: 2, // in world units with size attenuation, pixels otherwise,
            resolution: new THREE.Vector2(width, height)
          });

          this.data.edges.start.forEach((a, i) => {
            if(this.data.solution.colors[i] !== this.highlight) {
              return;
            }
            const b = this.data.edges.end[i];
            const coordinates = [
              points[a].x, points[a].y, 1,
              points[b].x, points[b].y, 1
            ];

            const geometry = new LineGeometry().setPositions(coordinates);
            highlightedObjects.add(new Line2(geometry, matLine));
          });

          this.changedHighlight = false
        }

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