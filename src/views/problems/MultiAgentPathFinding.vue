<script setup>
import MathFormula from "@/components/math/MathFormula.vue";
import MultiAgentPathFindingVisualization from "@/components/visualizations/MultiAgentPathFindingVisualization.vue";
import urlJoin from "url-join";
import Problems from "@/data/problems";
import InstanceSchema from "@/components/instances/InstanceSchema.vue";

const exampleInstanceUrl = urlJoin(process.env.VUE_APP_API_URL, 'min_makespan_mapf/instances/buffalo_000_25x25_20_63/raw')
const exampleSolutionUrl = urlJoin(process.env.VUE_APP_API_URL, 'min_makespan_mapf/instances/buffalo_000_25x25_20_63/solutions/df43f274b04336eded288f63e8846262/raw')
</script>

<template>
  <v-container>

    <h1 class="text-h3 mb-4">Multi Agent Path Finding</h1>


    <p>
      The Third Computational Geometry Challenge was on Multi Agent Path Finding,
      as part of CG Week in Buffalo, USA, June
      7-11, 2021.
    </p>
    <p>
      As in previous years, the objective was be to compute good solutions to instances of a difficult geometric
      optimization problem. The specific problem chosen for the 2021 Challenge is Multi Agent Path Finding, as
      follows.
    </p>

    <v-divider class="my-5"></v-divider>

    <h3>Description</h3>
    <p>
      Given a set of
      <MathFormula formula="n"/>
      axis-aligned unit-square robots in the plane, a set
      <MathFormula formula="S=\{s_1,\dots,s_n\}"/>
      of
      <MathFormula formula="n"/>
      distinct start pixels (unit squares) of the integer grid, and a set
      <MathFormula formula="T=\{t_1,\dots,t_n\}"/>
      of
      <MathFormula formula="n"/>
      distinct target pixels of the integer grid. During each unit of time, each robot can move (at unit speed) in a
      direction (north, south, east or west) to an adjacent pixel, provided the robot remains disjoint from all other
      robots during the motions.

      This condition has to be satisfied at all times, not just when robots are at pixel positions. For example, if
      there are robots at each of the two adjacent pixels
      <MathFormula formula="(x,y)"/>
      and
      <MathFormula formula="(x+1,y)"/>
      , then the robot at
      <MathFormula formula="(x,y)"/>
      can move east into position
      <MathFormula formula="(x+1,y)"/>
      only if the robot at
      <MathFormula formula="(x+1,y)"/>
      moves east at the same time, so that the two robots remain in contact, during the movement, but never overlap.

      In addition, for some instances, there may be given a set of obstacles, consisting of a number of stationary,
      blocked pixels that cannot be used by robots at any time.

      The task is to compute a set of feasible trajectories for all
      <MathFormula formula="n"/>
      robots, with the trajectory for robot
      <MathFormula formula="i"/>
      moving it from
      <MathFormula formula="s_i"/>
      to
      <MathFormula formula="t_i"/>
      .
    </p>

    <v-expansion-panels class="mt-5">
      <v-expansion-panel
          title="Instance Schema"
      >
        <v-expansion-panel-text>
          <InstanceSchema :problem-id="Problems.MultiAgentPathFinding.id"/>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-divider class="my-5"></v-divider>

    <h3>Example Instance</h3>

    <MultiAgentPathFindingVisualization :url="exampleInstanceUrl" :solution-url="exampleSolutionUrl"/>

    <v-divider class="my-5"></v-divider>

    <h3>References</h3>

    <p>
      [1] E.D. Demaine, S.P. Fekete, P. Keldenich, H. Meijer, C. Scheffer.
      Coordinated Motion Planning: Reconfiguring a Swarm of Labeled Robots with Bounded Stretch.
      SIAM Journal on Computing, Vol. 48, No. 6, pp. 1727-1762, 2019.
    </p>

    <p>
      [2] A.T. Becker, S.P. Fekete, P. Keldenich, M. Konitzny, L. Lin, C. Scheffer.
      Coordinated Motion Planning: The Video.
      In: Proceedings of the 34th International Symposium on Computational Geometry (SoCG 2018), pp. 74:1-74:6.
    </p>

  </v-container>
</template>

<style scoped>

</style>