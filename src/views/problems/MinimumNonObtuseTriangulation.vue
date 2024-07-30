<script setup>
import MathFormula from "@/components/math/MathFormula.vue";
import Problems from "@/data/problems";
import InstanceSchema from "@/components/instances/InstanceSchema.vue";
import urlJoin from "url-join";
import MinimumNonObtuseTriangulationVisualization
  from "@/components/visualizations/MinimumNonObtuseTriangulationVisualization.vue";


const exampleInstanceUrl = urlJoin(process.env.VUE_APP_API_URL, 'min_nonobt_triang/instances/cgshop2025_examples_simple-polygon-exterior-20_100_741418808487093555/raw')

</script>

<template>
  <v-container>

    <h1 class="text-h3 mb-4">Minimum Non-Obtuse Triangulations</h1>


    <p>
      The Seventh Computational Geometry Challenge is on Minimum Non-Obtuse Triangulations,
      as part of CG Week in Kanazawa, Japan, June
      23-27, 2025.
    </p>
    <p>
      As in previous years, the objective will be to compute good solutions to instances of a difficult geometric
      optimization problem. The specific problem chosen for the 2025 Challenge is Minimum Non-Obtuse Triangulations, as
      follows.
    </p>

    <v-divider class="my-5"></v-divider>

    <h3>Description</h3>
    <p>
      In the Planar Straight Line Graphs (PSLGs) variant of the Minimum Non-Obtuse Triangulation problem, the objective
      is to triangulate the convex hull of a given PSLG
      <MathFormula formula="G"/>
      , which is defined by a set of vertices and edges laid out in a plane such that the edges do not cross except at
      their endpoints. The triangulation must incorporate the existing edges of
      <MathFormula formula="G"/>
      and can include the addition of Steiner points anywhere in the plane, including on these edges. The placement of
      Steiner points is particularly challenging because it can affect the geometric properties of adjacent faces, thus
      complicating the triangulation process. All triangles formed in the solution must be non-obtuse, with each angle
      not exceeding 90 degrees, and the solution seeks to minimize the total number of Steiner points. This problem is
      complex due to its geometric constraints and the interdependencies introduced by Steiner points, making it a
      computationally demanding task likely belonging to the NP-hard class of problems. For a polygon, an example of a
      Minimum Non-Obtuse Triangulation can be found as Figure 1 in [3], see below.

      The objective is to find a feasible non-obtuse triangulation using a minimum number of Steiner points.
      If one is not able to find a
      triangulation without obtuse triangles, we seek to reduce the number of obtuse triangles in the triangulation.
    </p>

    <v-expansion-panels class="mt-5">
      <v-expansion-panel
          title="Instance Schema"
      >
        <v-expansion-panel-text>
          <InstanceSchema :problem-id="Problems.NonObtuseTriangulations.id"/>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-divider class="my-5"></v-divider>

    <h3>Example Instance</h3>

    <MinimumNonObtuseTriangulationVisualization :url="exampleInstanceUrl" />

    <v-divider class="my-5"></v-divider>

    <h3>References</h3>

    <p>
      [1] Brenda S. Baker, Eric Grosse, Conor S. Rafferty: Nonobtuse Triangulation of Polygons. Discret. Comput. Geom.
      3: 147-168 (1988)
    </p>

    <p>
      [2] Marshall W. Bern, David Eppstein: Polynomial-Size Nonobtuse Triangulation of Polygons. SoCG 1991: 342-350
    </p>

    <p>
      [3]
      Marshall W. Bern, Scott A. Mitchell, Jim Ruppert: Linear-Size Nonobtuse Triangulation of Polygons. Discret.
      Comput. Geom. 14(4): 411-428 (1995)
    </p>

    <p>
      [3] - SoCG version
      Marshall W. Bern, Scott A. Mitchell, Jim Ruppert: Linear-Size Nonobtuse Triangulation of Polygons. SoCG 1994:
      221-230
    </p>

    <p>
      [4]
      Christopher J. Bishop: Nonobtuse Triangulations of PSLGs. Discret. Comput. Geom. 56(1): 43-92 (2016)
    </p>

  </v-container>
</template>

<style scoped>

</style>