<script setup>

</script>

<template>

  <v-container class="text-center">
    <v-progress-circular
        indeterminate
        color="primary"
        v-if="data === null"
    ></v-progress-circular>

    <div class="text-end mb-1">
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


    <div v-if="data !==null" class="text-center mt-1 text-sm-caption">
      Controls: Mouse wheel to zoom, Mouse click to pan
    </div>
  </v-container>

</template>


<script>
import * as THREE from 'three';
import {CSS2DObject, CSS2DRenderer, OrbitControls} from "three/addons";
import axios from "axios";
import {Raycaster, Vector2} from "three";

import {createColors, rgbHex} from 'color-map'
import {th} from "vuetify/locale";


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
    polygonGeometryFromCoordinates(coordinates) {
      let polyShape = new THREE.Shape(coordinates.map((p) => new THREE.Vector2(p.x, p.y)))
      const polyGeometry = new THREE.ShapeGeometry(polyShape);
      polyGeometry.setAttribute("position", new THREE.Float32BufferAttribute(
          coordinates.map(p => [p.x, p.y, 0]).flat(), 3)
      )
      return polyGeometry
    },
    polygonFromCoordinates(coordinates, color, itemIdx = null) {
      let mesh = new THREE.Mesh(this.polygonGeometryFromCoordinates(coordinates),
          new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
          }))

      mesh.itemIdx = itemIdx;

      if (itemIdx !== null) {
        const value = this.data.items[itemIdx].value
        mesh.label = "value: " + value
      }

      return mesh
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
    colorForItem(i) {
      if (this.colorScheme === "default") {
        let itemColors = ['#a1c9f4', '#8de5a1', '#ff9f9b', '#d0bbff', '#fffea3', '#b9f2f0']
        return itemColors[i % itemColors.length]
      } else {
        const n = 72;
        const rgbaRange = createColors([150, 150, 150], [186, 100, 100], n + 1)
        const value = this.data.items[i].value
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

        coordinates = this.shiftCoordinates(coordinates,
            1.05 * containerWidth + currentRowWidth,
            totalRowHeight + 0.005 * containerWidth
        )

        currentRowWidth += itemWidth
        currentRowHeight = Math.max(currentRowHeight, itemHeight)

        polygons.push(this.polygonFromCoordinates(coordinates, this.colorForItem(i), i))
      })

      return {
        height: totalRowHeight,
        polygons: polygons
      }
    },
    setupLabelRenderer(width, height) {
      const labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(width, height);
      labelRenderer.domElement.style.position = 'absolute';
      labelRenderer.domElement.style.top = '0px';
      labelRenderer.domElement.style.left = '0px';
      labelRenderer.domElement.style.pointerEvents = 'none';
      document.getElementById(this.sceneContainerId).appendChild(labelRenderer.domElement);

      return labelRenderer;
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

      const renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(width, height);
      document.getElementById(this.sceneId).appendChild(renderer.domElement);

      const labelRenderer = this.setupLabelRenderer(width, height);
      let label = this.setupLabel();
      scene.add(label);

      const controls = new OrbitControls(camera, renderer.domElement);
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
          coordinates = this.shiftCoordinates(coordinates, xTranslation, yTranslation);

          allObjects.add(this.polygonFromCoordinates(coordinates, this.colorForItem(i), i))
        });
      } else {
        let arrangedItems = this.arrangeItems(aspectRatio, containerWidth)
        allObjects.add(...arrangedItems.polygons)
        container = this.shiftCoordinates(container, 0, (arrangedItems.height / 2) - (containerHeight / 2))
      }

      allObjects.add(this.polygonBoundaryFromCoordinates(container, "#000000"));

      scene.add(allObjects);

      this.fitCameraToObject(allObjects, camera, 3, controls);
      controls.update()

      // Track mouse movement to pick objects
      const raycaster = new Raycaster();
      const mouse = new Vector2(-3, -3); // set these values to be off screen initially.
      let lastHoverUpdate = Date.now();
      let requireHoverUpdate = false;

      document.getElementById(this.sceneId).addEventListener('mousemove', (e) => {
        if(Date.now() - lastHoverUpdate > 50) {
          let rect = e.target.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / width) * 2 - 1
          mouse.y = -((e.clientY - rect.top) / height) * 2 + 1

          lastHoverUpdate = Date.now();
          requireHoverUpdate = true;
        }
      });

      renderer.setAnimationLoop(() => {
        controls.update()

        if(requireHoverUpdate) {
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

        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
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