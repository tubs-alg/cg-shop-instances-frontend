<template>
  <div class="hero">
    <div class="gradient">

      <v-container>
        <div class="hero-img">

          <div>
            <h1 class="text-h2 mb-5">CG:SHOP Instances</h1>
            <div>
              Welcome to the CG:SHOP Instances Collection, where scientific progress meets practicality. We curate a
              diverse
              range of high-quality, challenging optimization problem instances, empowering researchers with the tools
              they
              need for groundbreaking discoveries. Unlock the potential of your studies with our comprehensive
              collection.
            </div>
            <br>
            <v-btn rounded variant="outlined">Learn More</v-btn>
          </div>
        </div>
      </v-container>
    </div>
  </div>

  <div class="py-15">

    <v-container>

      <v-row justify="center" align="center">
        <v-col lg="6">
          <h2>Computational Geometry</h2>
          <p class="text-justify">
            Computational Geometry can be viewed as the study of algorithms for solving geometric problems on a
            computer.
            Applications for these geometric problems are numerous, including a variety of fields such as Robotics
            (motion
            planning and visibility problems), Operations Research (geometric location and search, route planning),
            Integrated
            Circuit Design (IC geometric design and verification), Computer-Aided Engineering (CAE), Mesh Generation,
            Computer Vision and Shape Reconstruction. These problems are often cast as optimization problems in which
            one
            is required to find a set of specific geometric objects that maximizes or minimizes a given objective
            function.
            In the over 40 years since the beginning of Computational Geometry, a wide range of optimization problems
            have been proposed and investigated by computational geometers, mainly from a theoretical point of view.
            Many
            of those tasks belong to the NP-hard class of problems, for which the existence of polynomial-time
            algorithms
            implies P=NP. While Computational Geometry has considered a wide spectrum of NP-hard optimization problems,
            positive results typically imply polynomial-time, constant-factor approximation algorithms, without much
            regard
            for practical solution quality, realistic running times, or even exact solutions.
          </p>
        </v-col>
        <v-col lg="6" class="d-none d-lg-block">
          <v-img class="mx-auto" max-width="60%" :src="require('@/assets/mwt.png')"></v-img>
        </v-col>
      </v-row>


    </v-container>
  </div>

  <div class="bg-off-color py-15">

    <v-container>
      <h2 class="text-h3 font-weight-light mb-10 text-center">
        Our Problem Collection
      </h2>
      <v-row justify="center">
        <v-col lg="4" md="6" cols="12">
          <ProblemCard link="/mpp" title="Maximum Polygon Packing"
                       :img="require('@/assets/problems/mpp.png')"
                       description="Optimal packing a set of objects into a given container."/>
        </v-col>
        <v-col lg="4" md="6" cols="12">
          <ProblemCard link="/mcp" title="Minimum Convex Partition"
                       :img="require('@/assets/problems/mcp.png')"
                       description="Partition a point set into a smallest set of convex faces."/>
        </v-col>

        <v-col lg="4" md="6" cols="12">
          <ProblemCard link="/mapf" title="Multi Agent Path Finding"
                       :img="require('@/assets/problems/mapf.png')"
                       description="Compute a set of feasible trajectories a given set of robots and targets."/>
        </v-col>

        <v-col lg="4" md="6" cols="12">
          <ProblemCard link="/mcpc" title="Minimum Coverage by Convex Polygons"
                       :img="require('@/assets/problems/mcpc.png')"
                       description="Compute a minimum coverage of a polygon by convex polygons."/>
        </v-col>

        <v-col lg="4" md="6" cols="12">
          <ProblemCard link="/mpsp" title="Minimum Partition into Plane Subgraphs"
                       :img="require('@/assets/problems/mpsp.png')"
                       description="Partition a graph into minimum plane subgraphs."/>
        </v-col>

        <v-col lg="4" md="6" cols="12">
          <ProblemCard link="/nonobt_triang" title="Minimum Non-Obtuse Triangulation"
                       :img="require('@/assets/problems/nonobt_triang.png')"
                       description="Find a feasible non-obtuse triangulation using a minimum number of Steiner points"/>
        </v-col>
      </v-row>

    </v-container>
  </div>

  <div class="py-5">
    <v-container>
      <h2>Generators</h2>

      <p>
        The instances in the CG:SHOP collection are generated by a variety of different algorithms, each tailored to the
        specific problem at hand. The generators are designed to produce instances that are challenging and
        representative
        of the problem space, while also being scalable and reproducible. The instances are generated with a variety of
        parameters, such as the number of objects and the size and shape of the objects.
        This allows researchers to study the performance of algorithms under different conditions.
        The generators are available in our
        <a class="text-decoration-none" href="https://gitlab.ibr.cs.tu-bs.de/hip/hip-generators">GitLab</a>.
      </p>
    </v-container>
  </div>

</template>

<script>
import ProblemCard from "@/components/home/ProblemCard.vue";

export default {
  name: 'HomeView',
  components: {ProblemCard}
}
</script>

<style>
.title {
  font-weight: 300;
  font-size: 54px;
}

.hero {
  margin-top: -64px;
  background-color: #384047;
  color: white;
}

@media (min-width: 960px) {


  .hero .hero-img {
    background-image: url("@/assets/hero.svg");
    background-size: contain;
    background-position: center left;
    padding-left: 500px
  }
}


.hero .hero-img {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: end;
}


.hero .gradient {
  background-size: cover !important;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.65) 100%), no-repeat center center scroll;
  padding-top: 64px;
  padding-bottom: 64px;
}

.bg-off-color {
  background-color: #F8F5F4;
}

.text-base {
  color: #2c3e50;
}
</style>
