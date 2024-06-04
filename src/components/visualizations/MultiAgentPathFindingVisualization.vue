<script setup>

</script>

<template>

  <v-container class="text-center">
    <v-progress-circular
        indeterminate
        color="primary"
        v-if="!rendered"
    ></v-progress-circular>

    <div class="text-end mb-1" v-if="rendered">
      <v-btn-toggle v-model="showFootprints" v-if="data.solution" variant="outlined" rounded="rounded-xl">
        <v-btn icon="mdi-shoe-print" :value="true"></v-btn>
      </v-btn-toggle>
    </div>

    <div class="position-relative" :id="sceneContainerId">
      <div :id="sceneId"></div>
    </div>

    <v-slider
        v-if="rendered && data.solution"
        label="Solution Step"
        v-model="animationStep"
        :max="maxAnimationStep"
        :min="0"
        :step="1"
        thumb-label
    ></v-slider>


    <div v-if="rendered" class="text-center mt-1 text-sm-caption">
      Controls: Mouse wheel to zoom, Mouse click to pan, Slider to animate
    </div>
  </v-container>

</template>


<script>
import * as THREE from 'three';
import {OrbitControls} from "three/addons";
import {Vector3} from "three";
import {throttle} from 'throttle-debounce';

const colormap = require("colormap")

import {
  hexToRgb,
  fitCameraToObject
} from "@/lib/visualization/threejs_helper";
import axios from "axios";

export default {
  name: "MultiAgentPathFindingVisualization",
  props: {
    url: String,
    solutionUrl: String
  },
  watch: {
    animationStep() {
      this.throttledUpdateRobotPositions()
    },
    showFootprints(newValue, oldValue) {
      if (newValue === true) {
        this.robots.forEach((r, i) => {
          if (i > 0) {
            r.visible = true;
          }
        });

        this.updateRobotPositions(true);
      } else {
        this.robots.forEach((r, i) => {
          if (i > 0) {
            r.visible = false;
          }
        });
      }
    }
  },
  computed: {
    maxAnimationStep() {
      if (!this.data || !this.data.solution) return 0;
      return this.data.solution.steps.length
    },
    allPositions() {
      if (this.data === null || this.data.solution === null) return [];

      let currentPositions = this.data.start_points.xs.map((x, i) => {
        return {x: x, y: this.data.start_points.ys[i]}
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
  },
  data() {
    return {
      rendered: false,
      renderer: null,
      animationStep: 0,
      robotPositions: null,
      data: null,
      sceneId: this.$.uid + '-scene',
      sceneContainerId: this.$.uid + '-sceneContainer',
      robots: [],
      needRenderUpdate: false,
      showFootprints: false,
      renderConfiguration: {
        relativeTrailLength: 0.5,
        nTrailRobots: 50,
        trailBaseOpacity: 0.1,
      },
      throttledUpdateRobotPositions: throttle(100, this.updateRobotPositions)
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
      let itemColors = colormap({
        colormap: 'jet',
        nshades: this.data.start_points.xs.length,
        format: 'hex',
        alpha: 1
      });
      return itemColors[i % itemColors.length]
    },
    updateRobotPositions(forceNewPositions = false) {
      if (this.robots.length === 0) return;

      let positionAttr = "targetPosition"

      if (forceNewPositions) {
        positionAttr = "position"
      }

      this.robots.forEach((r, i) => {
        if (i === 0) {
          this.allPositions[this.animationStep].forEach((p, j) => {
            r.geometry.attributes[positionAttr].array[j * 3] = p.x;
            r.geometry.attributes[positionAttr].array[j * 3 + 1] = p.y;
          });
        } else if (this.showFootprints && this.animationStep > 0) {
          // based on i, go to a position between the previous position and the target position

          this.allPositions[this.animationStep].forEach((p, j) => {
            const oldX = this.allPositions[this.animationStep - 1][j].x;
            const oldY = this.allPositions[this.animationStep - 1][j].y;
            const xDiff = (p.x - oldX);
            const yDiff = (p.y - oldY);
            r.geometry.attributes[positionAttr].array[j * 3] = oldX +
                (1 - this.renderConfiguration.relativeTrailLength) * xDiff +
                this.renderConfiguration.relativeTrailLength * xDiff * (i / this.robots.length);
            r.geometry.attributes[positionAttr].array[j * 3 + 1] = oldY +
                (1 - this.renderConfiguration.relativeTrailLength) * yDiff +
                this.renderConfiguration.relativeTrailLength * yDiff * (i / this.robots.length);
          });

        }

        if (forceNewPositions) {
          r.geometry.attributes.position.needsUpdate = true;
        }
      });

      if (!forceNewPositions) {
        this.needRenderUpdate = true;
      }
    },
    createRobotsAtStart(opacity = 1) {
      const starts = this.data.start_points.xs.map((x, i) => {
        return {x: x, y: this.data.start_points.ys[i]}
      });

      let vertices = [];
      let colors = [];

      starts.forEach((p, i) => {
        vertices.push(new Vector3(p.x, p.y, 1));
        let color = hexToRgb(this.colorForItem(i)).map(c => c / 255)
        colors.push(...color)
      })

      const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('targetPosition', geometry.attributes.position.clone());

      let robotTex = new THREE.TextureLoader().load(require("@/assets/circle_texture.png"));

      if (opacity === 1) {
        // Show a border for the primary robot.
        robotTex = new THREE.TextureLoader().load(require("@/assets/circle_texture_border.png"));
      }

      let material = new THREE.PointsMaterial({
        vertexColors: true,
        map: robotTex,
        transparent: true,
        size: 1,
        opacity: opacity
      });
      return new THREE.Points(geometry, material)
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

      const targets = this.data.target_points.xs.map((x, i) => {
        return {x: x, y: this.data.target_points.ys[i]}
      });

      const controls = new OrbitControls(camera, this.renderer.domElement);
      controls.enableRotate = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN
      }

      let allObjects = new THREE.Group();

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

      for (let i = this.renderConfiguration.nTrailRobots - 1; i >= 0; i--) {
        const robots = this.createRobotsAtStart(i === 0 ? 1 :
            this.renderConfiguration.trailBaseOpacity * i / this.renderConfiguration.nTrailRobots);
        if (i !== 0) {
          robots.visible = false;
        }
        this.robots.push(robots)
        allObjects.add(robots);
      }

      this.robots = this.robots.reverse();

      scene.add(allObjects);

      fitCameraToObject(allObjects, camera, 3, controls);
      controls.update()

      this.renderer.setAnimationLoop(() => {
            controls.update()
            if (this.needRenderUpdate) {
              let furthest = 0;

              this.robots.forEach((r, i) => {
                if (!this.showFootprints && i > 0) {
                  return;
                }

                let positions = r.geometry.attributes.position.array;
                let targetPositions = r.geometry.attributes.targetPosition.array;
                for (let i = 0; i < positions.length; i++) {
                  const diff = (targetPositions[i] - positions[i]);
                  furthest = Math.max(furthest, Math.abs(diff))
                  positions[i] += diff * 0.1;
                }
                r.geometry.attributes.position.needsUpdate = true;
              });

              if (furthest < 0.01) {
                this.needRenderUpdate = false;
              }
            }

            this.renderer.render(scene, camera);
            this.rendered = true;
          }
      );

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