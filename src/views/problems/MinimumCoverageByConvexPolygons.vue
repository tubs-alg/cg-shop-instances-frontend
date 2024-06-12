<script setup>
import MathFormula from "@/components/math/MathFormula.vue";
import MinimumCoverageByConvexPolygonsVisualization
  from "@/components/visualizations/MinimumCoverageByConvexPolygonsVisualization.vue";
import urlJoin from "url-join";
import Problems from "@/data/problems";
import InstanceSchema from "@/components/instances/InstanceSchema.vue";

const exampleInstanceUrl = urlJoin(process.env.VUE_APP_API_URL, 'min_conv_poly_coverage/instances/ccheese142/raw')
</script>

<template>
  <v-container>

    <h1 class="text-h3 mb-4">Minimum Coverage by Convex Polygons</h1>


    <p>
      The Maximum Polygon Packing Problem was part of the Sixth Computational Geometry Challenge,
      and is discussed during CG Week in Athens, Greece, June 10-14, 2024.
    </p>
    <p>
      As in previous years, the objective was be to compute good solutions
      to instances of a difficult geometric optimization problem.
      The specific problem chosen for the 2024 Challenge is
      <strong>Maximum Polygon Packing</strong>, as follows.
    </p>

    <v-divider class="my-5"></v-divider>

    <h3>Description</h3>
    <p>
      Given a convex region,
      <MathFormula formula="P"/>
      ,
      in the plane, and a collection
      of simple polygons,
      <MathFormula formula="Q_1,…, Q_n"/>
      ,
      each
      <MathFormula formula="Q_i"/>
      with a respective value of
      <MathFormula formula="c_i"/>
      ,
      the task is to find a subset
      <MathFormula formula="S"/>
      of
      <MathFormula formula="\{1,...,n\}"/>
      and a feasible packing within
      <MathFormula formula="P"/>
      of the polygons
      <MathFormula formula="Q_i"/>
      (without rotation) for
      <MathFormula formula="i \in S"/>
      .
    </p>

    <v-expansion-panels class="mt-5">
      <v-expansion-panel
          title="Instance Schema"
      >
        <v-expansion-panel-text>
          <InstanceSchema :problem-id="Problems.MinimumConvexPolygonCoverage.id"/>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-divider class="my-5"></v-divider>

    <h3>Example Instance</h3>

    <MinimumCoverageByConvexPolygonsVisualization
        :url="exampleInstanceUrl"/>

    <v-divider class="my-5"></v-divider>

    <h3>Objective</h3>
    <p>
      Maximize the total value
      <MathFormula formula=" \sum_{i \in S} c_i"/>
      of the packed polygons.
    </p>

    <p style="clear: both;"></p>

    <v-divider class="my-5"></v-divider>

    <h3>Motivation</h3>
    <p>
      Optimal packing problems have an extensive history in Computational Geometry.
      They are also relevant in many practical contexts.
    </p>
    <p>
      Even the one-dimensional version of the problem (the Knapsack Problem)
      is NP-hard; furthermore, some geometric variants have been shown to be
      \(\exists R\)-complete [1], which most likely implies that they are not in the class NP.
    </p>
    <!--<p>
    Details of the competition (such as benchmark instances, data formats,
    specific constraints on feasible packings, such as integer coordinates,
    as well as rules for submission and evaluation) will be announced in the
    coming  weeks. Appropriate steps will be undertaken (e.g., by restricting
    the  classes of feasible subsets) to ensure straightforward, automated
    verification of solutions, but also ensure original algorithmic contributions.
    </p>-->
    <p>
      The contributors with the most outstanding solutions will be recognized
      at CG Week 2024 and invited to present their results, both at the event
      and in the proceedings.
    </p>
    <p>
      We are looking forward to your contributions and welcome questions
      and comments!
    </p>

    <p style="clear: both;"></p>

    <v-divider class="my-5"></v-divider>

    <h3>Instances</h3>
    <p>
      A large number and variety of input polygonal regions P are
      provided for the competition.
      You can download them under <b>Download</b> above.
      Make sure to download the actual challenge instances and not the example instances, as only those are evaluated.
    </p>

    <v-divider class="my-5"></v-divider>

    <h3>References </h3>
    <p>
      [1] M. Abrahamsen, T. Miltzow and N. Seiferth,
      "Framework for ER-Completeness of Two-Dimensional Packing Problems,“
      2020 IEEE 61st Annual Symposium on Foundations of Computer Science (FOCS), 2020,
      pp. 1014-1021, doi: 10.1109/FOCS46700.2020.00098.
    </p>

  </v-container>
</template>

<style scoped>

</style>