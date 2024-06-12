<script setup>
import MathFormula from "@/components/math/MathFormula.vue";
import MinimumConvexPartitionVisualization from "@/components/visualizations/MinimumConvexPartitionVisualization.vue";
import urlJoin from "url-join";
import Problems from "@/data/problems";
import InstanceSchema from "@/components/instances/InstanceSchema.vue";

const exampleInstanceUrl = urlJoin(process.env.VUE_APP_API_URL, 'min_conv_partition/instances/euro-night-0001000/raw')
const exampleSolutionUrl = urlJoin(process.env.VUE_APP_API_URL, 'min_conv_partition/instances/euro-night-0001000/solutions/2be919d7be7914f6989deba46be4fcb2/raw')
</script>

<template>
  <v-container>

    <h1 class="text-h3 mb-4">Minimum Convex Partition</h1>


    <p>
      The Minimum Convex Partition Problem was part of the Second Computational Geometry Challenge,
      and is discussed during CG Week in 2020.
    </p>

    <v-divider class="my-5"></v-divider>

    <h3>Description</h3>
    <p>
      Given a set
      <MathFormula formula="S"/>
      of
      <MathFormula formula="n"/>
      points in the plane. The objective is to compute a plane graph with vertex set
      <MathFormula formula="S"/>
      (with each point in
      <MathFormula formula="S"/>
      having positive degree)
      that partitions the convex hull of
      <MathFormula formula="S"/>
      into the smallest possible number of convex faces. Note that collinear points are allowed on face boundaries,
      so all internal angles of a face are at most
      <MathFormula formula="\pi"/>.
      The complexity of this problem is still unknown, but approximation algorithms have been proposed; e.g., see
      Christian Knauer and Andreas Spillner: Approximation Algorithms for the Minimum Convex Partition Problem, SWAT
      2006, pp. 232-241.
    </p>

    <v-expansion-panels class="mt-5">
      <v-expansion-panel
          title="Instance Schema"
      >
        <v-expansion-panel-text>
          <InstanceSchema :problem-id="Problems.MinimumConvexPartition.id"/>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-divider class="my-5"></v-divider>

    <h3>Example Instance</h3>

    <MinimumConvexPartitionVisualization
        :solution-url="exampleSolutionUrl"
        :url="exampleInstanceUrl"/>


    <v-divider class="my-5"></v-divider>

    <h3>References</h3>

    <p>
      [1] Christian Knauer and Andreas Spillner: Approximation Algorithms for the Minimum Convex Partition Problem, SWAT
      2006, pp. 232-241.
    </p>

  </v-container>
</template>

<style scoped>

</style>