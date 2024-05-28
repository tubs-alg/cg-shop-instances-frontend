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


    <div v-if="data !==null" class="text-center mt-1 text-sm-caption">
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
  polygonFromCoordinates,
  hexToRgb,
  fitCameraToObject
} from "@/lib/visualization/threejs_helper";
import {createColors, rgbHex} from 'color-map'


export default {
  name: "MinimumConvexPartitionVisualization",
  props: {
    url: String,
    solutionUrl: String
  },
  watch: {
    colorScheme() {
      this.colorSchemeChanged = true;
    }
  },
  computed: {
    maxX() {
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
    },
  },
  data() {
    return {
      colorScheme: "default",
      colorSchemeChanged: false,
      data: null,
      sceneId: this.$.uid + '-scene',
      sceneContainerId: this.$.uid + '-sceneContainer'
    }
  },
  mounted() {
    axios.get(this.url).then((response) => {
      this.data = response.data
      console.log(this.data)
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
        let itemColors = ['#4694e6', '#3bd35d', '#e1413a', '#7241df',
          '#e3e131', '#21a39f']
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

      const points = this.data.points.xs.map((x, i) => {
        return {x: x, y: this.data.points.ys[i]}
      });

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableRotate = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN
      }

      let allObjects = new THREE.Group();

      if (this.data.solution) {

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

      }
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

      let material = new THREE.PointsMaterial({vertexColors: true, map: tex, alphaTest: 0.5, transparent: true});
      material.size = (this.maxX - this.minX) / width * 10;
      allObjects.add(new THREE.Points(geometry, material));


      scene.add(allObjects);

      fitCameraToObject(allObjects, camera, 3, controls);
      controls.update()

      renderer.setAnimationLoop(() => {
        controls.update()
        renderer.render(scene, camera);
      });

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