<script setup>
import ProblemCard from "@/components/home/ProblemCard.vue";
import mwtImg from "@/assets/mwt.png";
import {problemList} from "@/data/problems";

const latestProblem = problemList[0];
const firstYear = Math.min(...problemList.map((p) => p.year));

function scrollToProblems() {
  document.getElementById('problems').scrollIntoView({behavior: 'smooth'})
}
</script>

<template>
  <section class="hero bg-hero">
    <v-container>
      <div class="hero-content">
        <div class="hero-text">
          <v-chip :to="'/' + latestProblem.id" variant="tonal" color="white" size="small" class="mb-6" prepend-icon="mdi-new-box">
            Latest: {{ latestProblem.name }} ({{ latestProblem.year }})
          </v-chip>
          <h1 class="hero-title mb-5">CG:SHOP Instances</h1>
          <p class="hero-lead mb-8">
            A curated collection of challenging benchmark instances and solutions from the Computational Geometry
            Challenges. Download instances, inspect them in interactive visualizations, and compare your results
            against the best known solutions.
          </p>
          <div class="d-flex flex-wrap ga-3">
            <v-btn size="large" color="secondary" variant="flat" append-icon="mdi-arrow-down"
                   @click="scrollToProblems">
              Explore the problems
            </v-btn>
            <v-btn size="large" variant="outlined" color="white" prepend-icon="mdi-database-search-outline"
                   :to="{name: 'instances', params: {problem: latestProblem.id}}">
              Browse instances
            </v-btn>
          </div>

          <div class="hero-stats d-flex flex-wrap mt-10">
            <div>
              <div class="stat-value">{{ problemList.length }}</div>
              <div class="stat-label">optimization problems</div>
            </div>
            <div>
              <div class="stat-value">{{ firstYear }}–{{ latestProblem.year }}</div>
              <div class="stat-label">CG:SHOP challenges</div>
            </div>
            <div>
              <div class="stat-value">JSON</div>
              <div class="stat-label">open formats &amp; API</div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </section>

  <section class="py-16">
    <v-container>
      <v-row class="align-center">
        <v-col cols="12" lg="7">
          <div class="eyebrow mb-2">Background</div>
          <h2 class="text-headline-large font-weight-bold mb-5">Computational Geometry in practice</h2>
          <div class="intro-text">
            <p>
              Computational Geometry studies algorithms for solving geometric problems on a computer, with
              applications in robotics, operations research, integrated circuit design, mesh generation, computer
              vision and shape reconstruction. Many of these problems are optimization problems: find a set of
              geometric objects that maximizes or minimizes a given objective function.
            </p>
            <p>
              In the over 40 years since the beginning of the field, a wide range of such problems has been
              investigated, mainly from a theoretical point of view. Many of them are NP-hard, and positive results
              typically mean polynomial-time, constant-factor approximation algorithms, without much regard for
              practical solution quality, realistic running times, or even exact solutions.
            </p>
            <p>
              The CG:SHOP Challenges close this gap by posing one hard geometric optimization problem each year.
              This collection preserves the resulting instances and solutions for further research.
            </p>
          </div>
        </v-col>
        <v-col cols="12" lg="5" class="d-none d-lg-flex justify-center">
          <v-img :src="mwtImg" max-width="380" alt="Minimum weight triangulation illustration"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </section>

  <section id="problems" class="bg-surface-muted py-16">
    <v-container>
      <div class="text-center mb-12">
        <div class="eyebrow mb-2">The collection</div>
        <h2 class="text-headline-large font-weight-bold">Our problems</h2>
        <p class="text-muted mt-3 mx-auto section-lead">
          Each problem comes with a formal definition, a description of the instance format and the full set of
          challenge instances.
        </p>
      </div>
      <v-row>
        <v-col v-for="problem in problemList" :key="problem.id" lg="4" sm="6" cols="12">
          <ProblemCard :problem="problem"/>
        </v-col>
      </v-row>
    </v-container>
  </section>

  <section class="py-16">
    <v-container>
      <v-card variant="flat" class="generators pa-8 pa-md-10" color="primary">
        <v-row class="align-center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center mb-3">
              <v-icon icon="mdi-cog-transfer-outline" size="32" class="me-3"></v-icon>
              <h2 class="text-headline-medium font-weight-bold">Instance generators</h2>
            </div>
            <p class="generators-text">
              The instances are produced by generators tailored to each problem. They are designed to be
              challenging, representative of the problem space, scalable and reproducible, and can be parameterized,
              for example by the number, size and shape of the objects, to study algorithms under different
              conditions.
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-md-end">
            <v-btn size="large" color="white" variant="flat" class="text-primary"
                   href="https://gitlab.ibr.cs.tu-bs.de/hip/hip-generators" prepend-icon="mdi-gitlab">
              Generators on GitLab
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </section>
</template>

<style scoped>
.hero {
  margin-top: -64px;
  padding-top: 64px;
  position: relative;
  overflow: hidden;
}

/* The decorative illustration sits on the left on large screens. */
@media (min-width: 1280px) {
  .hero::before {
    content: "";
    position: absolute;
    inset: 64px 50% 0 0;
    background: url("@/assets/hero.svg") no-repeat center / contain;
    opacity: 0.95;
  }

  .hero-content {
    padding-left: 48%;
  }
}

.hero-content {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  padding-top: 48px;
  padding-bottom: 72px;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.hero-lead {
  font-size: 1.125rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
  max-width: 56ch;
}

.hero-stats {
  gap: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
}

.eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-secondary));
}

.intro-text {
  line-height: 1.75;
  color: var(--cg-text-muted);
  max-width: 68ch;
}

.intro-text p + p {
  margin-top: 1em;
}

.section-lead {
  max-width: 60ch;
}

.generators {
  background-image: radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.12), transparent 50%);
}

.generators-text {
  line-height: 1.7;
  opacity: 0.85;
  max-width: 70ch;
}
</style>
