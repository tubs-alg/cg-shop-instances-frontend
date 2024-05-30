<script setup>
import MathFormula from "@/components/math/MathFormula.vue";
import MinimumConvexPartitionVisualization from "@/components/visualizations/MinimumConvexPartitionVisualization.vue";
import MinimumSubgraphPartitionVisualization
  from "@/components/visualizations/MinimumSubgraphPartitionVisualization.vue";

const exampleInstanceUrl = process.env.VUE_APP_API_URL + 'min_plane_subgraph_partition/instance/reecn3382/raw'
const exampleSolutionUrl = process.env.VUE_APP_API_URL + 'min_conv_partition/instances/euro-night-0001000/solutions/184/raw'
</script>

<template>
  <v-container>

    <h1 class="text-h3 mb-4">Minimum Partition into Plane Subgraphs</h1>


    <p>
      As in previous years, the objective will be to compute good solutions to instances of a difficult geometric
      optimization problem. The specific problem chosen for the 2022 Challenge is Minimum Plane Partition, as follows.
    </p>

    <v-divider class="my-5"></v-divider>

    <h3>Description</h3>
    <p>
      Given a geometric graph
      <MathFormula formula="G = (V, E)"/>
      , with vertices represented by points in the plane, and edges by straight-line connections between vertices.

      The task is to partition
      <MathFormula formula="E"/>
      E
      into as few subsets
      <MathFormula formula="E_1,\dots,E_k"/>
      as possible, such that each subgraph
      <MathFormula formula="G_i = (V, E_i)"/>
      is plane: In the given geometric representation, line segments representing edges may touch at end points if and
      only if the corresponding edges are incident in
      <MathFormula formula="G_i"/>; no edges may cross, i.e., share points that are not segment end points.
    </p>

    <v-divider class="my-5"></v-divider>

    <h3>Example Instance</h3>

    <MinimumSubgraphPartitionVisualization
        :url="exampleInstanceUrl"/>

    <v-divider class="my-5"></v-divider>

    <h3>References</h3>

    <p>
      [1] Oswin Aichholzer, Thomas Hackl, Matias Korman, Marc van Kreveld, Maarten Löffler, Alexander Pilz, Bettina
      Speckmann, Emo Welzl. Packing plane spanning trees and paths in complete geometric graphs Information Processing
      Letters, Volume 124, August 2017, Pages 35-41
    </p>

    <p>
      [2] Marek Chrobak, Takao Nishizeki. Improved edge-coloring algorithms for planar graphs. Journal of Algorithms,
      Volume 11, Issue 1, March 1990, Pages 102-116.
    </p>

  </v-container>
</template>

<style scoped>

</style>