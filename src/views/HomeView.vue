<template>
  <div class="hero">
    <div class="gradient">
      <v-container>
        <v-row>
          <v-col lg="8">
            <h1 class="title font-weight-light">CG:SHOP Instances Collection</h1>
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
            <router-link :to="{name: 'instances'}">
              <v-btn rounded variant="outlined" color="white" class="ms-3">
                <v-icon class="me-2">mdi-magnify</v-icon>
                Start exploring
              </v-btn>
            </router-link>
          </v-col>
          <v-col lg="4">
            <v-img :src="require('@/assets/hero.png')" max-height="400"></v-img>
          </v-col>
        </v-row>

      </v-container>
    </div>
  </div>

  <div class="py-15">
    <v-container>
      <v-row>
        <v-col lg="4">
          <ProblemCard link="/mpp" title="Maximum Polygon Packing"
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


  <div class="bg-off-color py-15">
    <v-container>
      <v-row align="center">
        <v-col lg="6">
          <v-img :src="require('@/assets/benchmarks.png')" width="50%" class="mx-auto"></v-img>
        </v-col>
        <v-col lg="6">
          <h2 class="mt-n1 text-h3 font-weight-light mb-4">
            About the Project
          </h2>
          Historically, the analysis of hard instances of difficult optimization problems has contributed a lot to
          scientific progress, e.g., for the Traveling Salesman Problem.
          Moreover, many practical studies require access to a wide range of instance types and sizes of established
          and
          reproducible quality.
          However, for many optimization problems, it is not straightforward to find hard natural instances of
          sufficient
          quality, quantity and scalability.
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
  font-weight: 200;
  font-size: 54px;
}

.hero {
  margin-top: -64px;
  background-color: #2c3e50;
  color: white;
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
