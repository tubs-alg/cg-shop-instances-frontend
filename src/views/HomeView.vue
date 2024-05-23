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
            Computational Geometry can be viewed as the study of algorithms for solving geometric problems on a computer.
            Applications for these geometric problems are numerous, including a variety of fields such as Robotics (motion
            planning and visibility problems), Operations Research (geometric location and search, route planning), Integrated
            Circuit Design (IC geometric design and verification), Computer-Aided Engineering (CAE), Mesh Generation,
            Computer Vision and Shape Reconstruction. These problems are often cast as optimization problems in which one
            is required to find a set of specific geometric objects that maximizes or minimizes a given objective function.
            In the over 40 years since the beginning of Computational Geometry, a wide range of optimization problems
            have been proposed and investigated by computational geometers, mainly from a theoretical point of view. Many
            of those tasks belong to the NP-hard class of problems, for which the existence of polynomial-time algorithms
            implies P=NP. While Computational Geometry has considered a wide spectrum of NP-hard optimization problems,
            positive results typically imply polynomial-time, constant-factor approximation algorithms, without much regard
            for practical solution quality, realistic running times, or even exact solutions.
          </p>
        </v-col>
        <v-col lg="6">
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
        <v-row>
          <v-col lg="4">
            <ProblemCard link="/mpp" title="Maximum Polygon Packing"
                         :img="require('@/assets/problems/mpp.png')"
                         description="Optimal packing problems have an extensive history in Computational Geometry.
                       They are also relevant in many practical contexts."/>
          </v-col>
          <v-col lg="4">

          </v-col>
          <v-col lg="4">

          </v-col>

        </v-row>

      </v-container>
  </div>

  <div class="py-15">

    <v-container>
      <h3 class="text-h3 mb-10 font-weight-light text-center">Roadmap</h3>

      <v-row>
        <v-col lg="4" class="text-center">
          <v-card rounded="circle" height="64" width="64" class="mx-auto  mb-4" color="pink-lighten-1">
            <v-icon size="64">mdi-flag-checkered</v-icon>
          </v-card>
          <h2 class="mt-n1 headline font-weight-light mb-4">
            Our goal
          </h2>
          <div>
            The CG:SHOP Instances Collection (BIP) is a library of sample instances for geometric problems from various
            sources and
            of various types.
            The main goal is to facilitate and encourage practical work on a wide range of geometric optimization
            problems by
            providing a large collection of challenges of self-refining difficulty.
          </div>
        </v-col>

        <v-col lg="4" class="text-center">
          <v-card rounded="circle" height="64" width="64" class="mx-auto  mb-4" color="primary">
            <v-icon size="64">mdi-blur</v-icon>
          </v-card>
          <h2 class="mt-n1 headline font-weight-light mb-4">
            Generators
          </h2>
          <div>
            As part of BIP, we collect, grow and present a large collection of specific instances and
            <a class="text-decoration-none" href="https://gitlab.ibr.cs.tu-bs.de/hip/hip-generators">instance
              generators</a>.

            We also accommodate the need for quality control by providing a spectrum of instance generators that allow
            precise
            reproduction, only based on compact generator seeds.
          </div>
        </v-col>
        <v-col lg="4" class="text-center">
          <v-card rounded="circle" height="64" width="64" class="mx-auto mb-4 pa-2" color="blue">
            <v-icon size="48">mdi-share-variant</v-icon>
          </v-card>
          <h2 class="mt-n1 headline font-weight-light mb-4">
            Sharing results
          </h2>
          <div>
            Our platform also facilitates sharing and validating experimental achievements by allowing comparison and
            reproduction of results, encouraging work on challenges and also helping researchers and developers to
            connect and
            collaborate, thus pushing the frontiers of solvable instances.
            By competing and sharing results with the rest of the world, the ongoing work by researchers will make the
            hard
            and interesting instances for each problem emerge.
          </div>
        </v-col>
      </v-row>

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

.hero .hero-img {
  background-image: url("@/assets/hero.svg");
  background-size: contain;
  background-position: center left;

  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-left: 500px
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
