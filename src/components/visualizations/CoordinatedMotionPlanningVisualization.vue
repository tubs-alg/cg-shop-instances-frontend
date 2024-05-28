<script setup>

</script>

<template>

  <v-container class="text-center">
    <v-progress-circular
        indeterminate
        color="primary"
        v-if="data === null"
    ></v-progress-circular>

    <div class="position-relative" :id="sceneContainerId">
      <div :id="sceneId"></div>
    </div>

    <v-slider
        v-model="animationStep"
        :max="maxAnimationStep"
        :min="0"
        :step="1"
        thumb-label
    ></v-slider>


    <div v-if="data !==null" class="text-center mt-1 text-sm-caption">
      Controls: Mouse wheel to zoom, Mouse click to pan, Slider to animate
    </div>
  </v-container>

</template>


<script>
import * as THREE from 'three';
import {Line2, LineGeometry, LineMaterial, OrbitControls} from "three/addons";
import axios from "axios";
import {Vector3} from "three";

const colormap = require("colormap")

import example from "@/assets/small_free_001_10x10_40_40.instance.json";
import solution from "@/assets/small_free_001_10x10_40_40.json";


import {
  polygonFromCoordinates,
  hexToRgb,
  fitCameraToObject
} from "@/lib/visualization/threejs_helper";
import {createColors, rgbHex} from 'color-map'

export default {
  name: "CoordinatedMotionPlanningVisualization",
  props: {
    url: String,
    solutionUrl: String
  },
  watch: {
    colorScheme() {
      this.colorSchemeChanged = true;
    },
    animationStep() {
      window.dispatchEvent(new Event('robot-position-update'))
      //console.log(this.robotPositions.geometry.attributes.positions);
    }
  },
  computed: {
    maxAnimationStep() {
      if (this.data === null || this.data.solution === null) return 0;
      return this.data.solution.steps.length
    },
    allPositions() {
      if (this.data === null || this.data.solution === null) return [];

      let currentPositions = this.data.starts.map((p) => {
        return {x: p[0], y: p[1]}
      });

      let positions = [currentPositions.slice(0)]

      this.data.solution.steps.forEach((step) => {
        currentPositions = [...currentPositions];
        for (const [idx, val] of Object.entries(step)) {
          let xDiff = 0;
          let yDiff = 0;
          if (val === "W") {
            xDiff = -1;
          } else if (val === "E") {
            xDiff = 1;
          } else if (val === "N") {
            yDiff = 1;
          } else if (val === "S") {
            yDiff = -1;
          }

          currentPositions[idx] = {
            x: currentPositions[idx].x + xDiff,
            y: currentPositions[idx].y + yDiff
          }
        }
        positions.push(currentPositions)
      })

      return positions;
    },
    /*maxX() {
      if (this.data === null) return 0;
      return Math.max(...this.data.points.xs)
    },
    maxY() {
      if (this.data === null) return 0;
      return Math.max(...this.data.points.ys)
    },
    minX() {
      if (this.data === null) return 0;
      return Math.min(...this.data.points.xs)
    },
    minY() {
      if (this.data === null) return 0;
      return Math.min(...this.data.points.ys)
    },*/
  },
  data() {
    return {
      animationStep: 0,
      colorScheme: "default",
      colorSchemeChanged: false,
      robotPositions: null,
      data: null,
      sceneId: this.$.uid + '-scene',
      sceneContainerId: this.$.uid + '-sceneContainer'
    }
  },
  mounted() {
    this.data = example
    this.data.solution = solution
    this.initializeScene();
  },
  methods: {
    addItem(coordinates, color, itemIdx = null) {
      let mesh = polygonFromCoordinates(coordinates, color);

      mesh.itemIdx = itemIdx;

      if (itemIdx !== null) {
        const value = this.data.items[itemIdx].value
        mesh.label = "value: " + value
      }

      return mesh
    },
    coordinatesFromJson(item) {
      return item.x.map((x, i) => {
        return {
          x: x,
          y: item.y[i]
        }
      });
    },
    colorForItem(i) {
      if (this.colorScheme === "default") {
        //let itemColors = ['#4694e6', '#3bd35d', '#e1413a', '#7241df', '#e3e131', '#21a39f']
        let itemColors = colormap({
          colormap: 'jet',
          nshades: this.data.starts.length,
          format: 'hex',
          alpha: 1
        });
        return itemColors[i % itemColors.length]
      } else {
        const n = 72;
        const rgbaRange = createColors([150, 150, 150], [186, 100, 100], n + 1)
        const value = this.data.items[i].value
        return rgbHex(rgbaRange[Math.floor((value - this.minValue) / (this.maxValue - this.minValue) * n)])
      }
    },
    initializeScene() {
      const width = document.getElementById(this.sceneId).offsetWidth;
      const height = 500;
      const aspectRatio = width / height;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(width, height);
      document.getElementById(this.sceneId).appendChild(renderer.domElement);

      const starts = this.data.starts.map((p) => {
        return {x: p[0], y: p[1]}
      });

      const targets = this.data.targets.map((p) => {
        return {x: p[0], y: p[1]}
      });

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableRotate = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN
      }

      let allObjects = new THREE.Group();

      /*if (this.data.solution) {

        console.log(this.data.solution)

        this.data.solution.edges.endpoints_a.forEach((a, i) => {
          const b = this.data.solution.edges.endpoints_b[i];
          const coordinates = [
            points[a].x, points[a].y, 1,
            points[b].x, points[b].y, 1
          ];

          const geometry = new LineGeometry().setPositions(coordinates);

          let matLine = new LineMaterial({
            color: 0x000000,
            linewidth: 1, // in world units with size attenuation, pixels otherwise,
            resolution: new THREE.Vector2(width, height)
          });

          let line = new Line2(geometry, matLine);
          line.computeLineDistances();
          allObjects.add(line);

        });

      }*/

      let vertices = [];
      let colors = [];

      targets.forEach((p, i) => {
        vertices.push(new Vector3(p.x, p.y, 1));
        let color = hexToRgb(this.colorForItem(i)).map(c => (c / 255) * 0.1)
        colors.push(...color)
      })

      let targetTexture = new THREE.TextureLoader().load(require("@/assets/tile.png"));

      const targetsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
      targetsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      allObjects.add(new THREE.Points(
          targetsGeometry,
          new THREE.PointsMaterial({
            vertexColors: true,
            map: targetTexture,
            size: 1,
            opacity: 1,

            transparent: true
          })
      ));

      vertices = []
      colors = []

      starts.forEach((p, i) => {
        vertices.push(new Vector3(p.x, p.y, 1));
        let color = hexToRgb(this.colorForItem(i)).map(c => c / 255)
        colors.push(...color)
      })

      const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('targetPosition', geometry.attributes.position.clone());

      let robotTex = new THREE.TextureLoader().load(require("@/assets/circle_texture_border.png"));
      let material = new THREE.PointsMaterial({
        vertexColors: true,
        map: robotTex,
        transparent: true,
        size: 1
      });
      const robots = new THREE.Points(geometry, material)
      allObjects.add(robots);

      scene.add(allObjects);

      fitCameraToObject(allObjects, camera, 3, controls);
      controls.update()

      let needUpdate = false;

      renderer.setAnimationLoop(() => {
            controls.update()

            if (needUpdate) {
              let furthest = 0;
              let positions = robots.geometry.attributes.position.array;
              let targetPositions = robots.geometry.attributes.targetPosition.array;
              for (let i = 0; i < positions.length; i++) {
                const diff = (targetPositions[i] - positions[i]);
                furthest = Math.max(furthest, Math.abs(diff))
                positions[i] += diff * 0.1;
              }

              if (furthest < 0.01) {
                needUpdate = false;
              }

              robots.geometry.attributes.position.needsUpdate = true;
            }

            renderer.render(scene, camera);
          }
      )
      ;

      window.addEventListener('robot-position-update', () => {
        this.allPositions[this.animationStep].forEach((p, i) => {
          robots.geometry.attributes.targetPosition.array[i * 3] = p.x;
          robots.geometry.attributes.targetPosition.array[i * 3 + 1] = p.y;
        });

        needUpdate = true;
      })

    }
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