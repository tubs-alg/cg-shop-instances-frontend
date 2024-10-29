<script setup>
import MathFormula from "@/components/math/MathFormula.vue";
import MinimumCoverageByConvexPolygonsVisualization
  from "@/components/visualizations/MinimumCoverageByConvexPolygonsVisualization.vue";
import urlJoin from "url-join";
import Problems from "@/data/problems";
import InstanceSchema from "@/components/instances/InstanceSchema.vue";
import ProblemsHeader from "@/components/problems/ProblemsHeader.vue";

const exampleInstanceUrl = urlJoin(process.env.VUE_APP_API_URL, 'min_conv_poly_coverage/instances/ccheese142/raw')
</script>

<template>
  <v-container>

    <ProblemsHeader :problem="Problems.MinimumConvexPolygonCoverage"/>

    <p>
      The Fifth Computational Geometry Challenge, was part of CG Week in Dallas, TX, USA, June 12-15, 2023.
      As in previous years, the objective was to compute good solutions to instances of a difficult geometric
      optimization problem. The specific problem chosen for the 2023 Challenge was
      <strong>Minimum Coverage by Convex Polygons</strong>, as follows.
    </p>

    <v-divider class="my-5"></v-divider>

    <h3>Description</h3>
    <p>
      Given a geometric region,
      <MathFormula formula="P"/>
      , in the plane, which may be a simple polygon or a polygon with holes. The task is to cover
      <MathFormula formula="P"/>
      with a collection,
      <MathFormula formula="C_1,\dots,C_k"/>
      of convex polygons, each contained within
      <MathFormula formula="P"/>.
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
      Minimize <MathFormula formula="k"/>, the number of convex polygons in the cover.
    </p>

    <p style="clear: both;"></p>

    <v-divider class="my-5"></v-divider>

    <h3>Motivation</h3>
    <p>
      Optimal coverage problems have an extensive history in
      Computational Geometry. In fact, the well-known SoCG logo
      shows that an optimal solution to the Minimum Cover by
      rectangles may include (rotated) rectangles whose vertices
      are not among those of the input polygon <MathFormula formula="P"/>, even in the case
      that <MathFormula formula="P"/> is an orthogonal simple polygon. (See reference [1]
      and
      <a href="https://www.computational-geometry.org/logo.html">
        https://www.computational-geometry.org/logo.html
      </a>
      .) It is also relevant in practical contexts, such as
      surveillance and robot navigation.
      The Minimum Cover by Convex Polygons problem is not only
      NP-hard [2], but was recently shown to be <MathFormula formula="\exists\mathbb{R}"/>-complete [3],
      which most likely implies that it is not in the class NP.
      The contributors with the most outstanding solutions were
      recognized at CG Week 2023 and invited to present their
      results, both at the event and in the proceedings.
    </p>

    <v-divider class="my-5"></v-divider>

    <h3>References </h3>
    <p>
      [1] Joseph O'Rourke. "The complexity of computing minimum convex covers for polygons," Proc. 20th Allerton Conf. Commun. Control Comput., 1982, pp. 75-84.
    </p>
    <p>
      [2] Joseph C. Culberson and Robert A. Reckhow. "Covering polygons is hard". Journal of Algorithms 17.1 (1994), pp. 2--44.
    </p>
    <p>
      [3] Mikkel Abrahamsen. Covering polygons is even harder. FOCS 2021: 375-386.
    </p>

  </v-container>
</template>

<style scoped>

</style>