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
      <v-btn-toggle
          v-model="colorScheme"
          variant="outlined"
          divided
      >
        <v-btn icon="mdi-palette" value="default"></v-btn>
        <v-btn icon="mdi-sun-thermometer" value="heatmap"></v-btn>
      </v-btn-toggle>
    </div>

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
import {CSS2DObject, CSS2DRenderer, OrbitControls} from "three/addons";
import axios from "axios";
import {Raycaster, Vector2} from "three";
import {
  polygonFromCoordinates,
  polygonBoundaryFromCoordinates,
  shiftCoordinates, fitCameraToObject
} from "@/lib/visualization/threejs_helper";
import {createColors, rgbHex} from 'color-map'


export default {
  name: "MaximumPolygonPackingVisualization",
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
    maxValue() {
      if (this.data === null) return 0;
      return Math.max(...this.data.items.map(item => item.value))
    },
    minValue() {
      if (this.data === null) return 0;
      return Math.min(...this.data.items.map(item => item.value))
    }
  },
  data() {
    return {
      rendered: false,
      renderer: null,
      labelRenderer: null,
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
        let itemColors = ['#a1c9f4', '#8de5a1', '#ff9f9b', '#d0bbff', '#fffea3', '#b9f2f0']
        return itemColors[i % itemColors.length]
      } else {
        const n = 72;
        const rgbaRange = createColors([150, 150, 150], [186, 100, 100], n + 1)
        const value = this.data.items[i].value

        if(this.minValue === this.maxValue) return rgbHex(rgbaRange[0])

        return rgbHex(rgbaRange[Math.floor((value - this.minValue) / (this.maxValue - this.minValue) * n)])
      }
    },
    arrangeItems(aspectRatio, containerWidth) {
      let polygons = [];
      let totalRowHeight = 0;
      let currentRowHeight = 0;
      let currentRowWidth = 0;
      let desiredWidth = aspectRatio * containerWidth * 2;

      this.data.items.forEach((item, i) => {

        let itemWidth = Math.max(...item.x)
        let itemHeight = Math.max(...item.y)

        if (currentRowWidth + itemWidth > desiredWidth) {
          currentRowWidth = 0;
          totalRowHeight += currentRowHeight;
          currentRowHeight = 0;
        }

        currentRowWidth += 0.005 * containerWidth;

        let coordinates = this.coordinatesFromJson(item);

        coordinates = shiftCoordinates(coordinates,
            1.05 * containerWidth + currentRowWidth,
            totalRowHeight + 0.005 * containerWidth
        )

        currentRowWidth += itemWidth
        currentRowHeight = Math.max(currentRowHeight, itemHeight)

        polygons.push(this.addItem(coordinates, this.colorForItem(i), i))
      })

      return {
        height: totalRowHeight,
        polygons: polygons
      }
    },
    setupLabelRenderer(width, height) {
      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize(width, height);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.top = '0px';
      this.labelRenderer.domElement.style.left = '0px';
      this.labelRenderer.domElement.style.pointerEvents = 'none';
      document.getElementById(this.sceneContainerId).appendChild(this.labelRenderer.domElement);
    },
    setupLabel() {
      const labelDiv = document.createElement('div');
      labelDiv.className = 'label';
      const label = new CSS2DObject(labelDiv);
      label.visible = false;
      return label;
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

      this.setupLabelRenderer(width, height);
      let label = this.setupLabel();
      scene.add(label);

      const controls = new OrbitControls(camera, this.renderer.domElement);
      controls.enableRotate = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN
      }

      let container = this.coordinatesFromJson(this.data.container);

      let containerWidth = Math.max(...this.data.container.x);
      let containerHeight = Math.max(...this.data.container.y);

      let allObjects = new THREE.Group();

      if (this.data.solution) {
        this.data.solution.packing.item_indices.forEach((itemIdx, i) => {
          let item = this.data.items[itemIdx];
          let xTranslation = this.data.solution.packing.x_translations[i];
          let yTranslation = this.data.solution.packing.y_translations[i];

          let coordinates = this.coordinatesFromJson(item);
          coordinates = shiftCoordinates(coordinates, xTranslation, yTranslation);

          allObjects.add(this.addItem(coordinates, this.colorForItem(i), i))
        });
      } else {
        let arrangedItems = this.arrangeItems(aspectRatio, containerWidth)
        allObjects.add(...arrangedItems.polygons)
        container = shiftCoordinates(container, 0, (arrangedItems.height / 2) - (containerHeight / 2))
      }

      allObjects.add(polygonBoundaryFromCoordinates(container, "#000000"));

      scene.add(allObjects);

      fitCameraToObject(allObjects, camera, 3, controls);
      controls.update()

      // Track mouse movement to pick objects
      const raycaster = new Raycaster();
      const mouse = new Vector2(-3, -3); // set these values to be off screen initially.
      let lastHoverUpdate = Date.now();
      let requireHoverUpdate = false;

      document.getElementById(this.sceneId).addEventListener('mousemove', (e) => {
        if (Date.now() - lastHoverUpdate > 50) {
          let rect = e.target.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / width) * 2 - 1
          mouse.y = -((e.clientY - rect.top) / height) * 2 + 1

          lastHoverUpdate = Date.now();
          requireHoverUpdate = true;
        }
      });

      this.renderer.setAnimationLoop(() => {
        controls.update()

        if (requireHoverUpdate) {
          // Pick objects from view using normalized mouse coordinates
          raycaster.setFromCamera(mouse, camera);

          const [hovered] = raycaster.intersectObjects(allObjects.children);

          if (hovered) {
            // Setup label
            label.visible = true;
            label.element.textContent = hovered.object.label

            let boundingBox = new THREE.Box3().setFromObject(hovered.object);
            let center = boundingBox.getCenter(new THREE.Vector3());

            // Move label over hovered element
            label.position.set(center.x, center.y, center.z + 1)
          } else {
            // Reset label
            label.visible = false;
            label.element.textContent = '';
          }

          requireHoverUpdate = false;

        }


        if (this.colorSchemeChanged) {
          // apply new color Scheme
          allObjects.children.forEach((child, i) => {
            if (child.itemIdx !== undefined && child.itemIdx !== null) {
              child.material.color.set(this.colorForItem(child.itemIdx))
            }
          })

          this.colorSchemeChanged = false;
        }

        this.renderer.render(scene, camera);
        this.labelRenderer.render(scene, camera);
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