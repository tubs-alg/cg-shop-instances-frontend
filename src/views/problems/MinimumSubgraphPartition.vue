<script setup>
import MathFormula from "@/components/math/MathFormula.vue";
import MinimumSubgraphPartitionVisualization
  from "@/components/visualizations/MinimumSubgraphPartitionVisualization.vue";
import urlJoin from "url-join";
import Problems from "@/data/problems";
import InstanceSchema from "@/components/instances/InstanceSchema.vue";
import ProblemsHeader from "@/components/problems/ProblemsHeader.vue";


const exampleInstanceUrl = urlJoin(process.env.VUE_APP_API_URL, 'min_plane_subgraph_partition/instances/vispecn2518/raw')
const exampleSolutionUrl = urlJoin(process.env.VUE_APP_API_URL, 'min_plane_subgraph_partition/instances/vispecn2518/solutions/63bd6d8b2515e0e1f65872db27dc3d37/raw')
</script>

<template>
  <v-container>

    <ProblemsHeader :problem="Problems.MinimumPlaneSubgraphPartition"/>

    <p>
      As in previous years, the objective of the CG:SHOP Challenge 2022 was
      to compute good solutions to instances of a difficult geometric
      optimization problem. The specific problem chosen for the 2022 Challenge was
      <strong>Minimum Plane Partition</strong>, as follows.
    </p>

    <v-divider class="my-5"></v-divider>

    <h3>Description</h3>
    <p>
      Given a geometric graph
      <MathFormula formula="G = (V, E)"/>
      , with vertices represented by points in the plane, and edges by straight-line connections between vertices.
      The task is to partition
      <MathFormula formula="E"/>
      into as few subsets
      <MathFormula formula="E_1,\dots,E_k"/>
      as possible, such that each subgraph
      <MathFormula formula="G_i = (V, E_i)"/>
      is plane: In the given geometric representation, line segments representing edges may touch at end points if and
      only if the corresponding edges are incident in
      <MathFormula formula="G_i"/>; no edges may cross, i.e., share points that are not segment end points.
    </p>

    <v-expansion-panels class="mt-5">
      <v-expansion-panel
          title="Instance Schema"
      >
        <v-expansion-panel-text>
          <InstanceSchema :problem-id="Problems.MinimumPlaneSubgraphPartition.id"/>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-divider class="my-5"></v-divider>

    <h3>Example Instance and Solution</h3>

    <MinimumSubgraphPartitionVisualization
        :url="exampleInstanceUrl" :solution-url="exampleSolutionUrl" />

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