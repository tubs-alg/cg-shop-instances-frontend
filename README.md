# CG:SHOP Instances Project Frontend

This repository contains the frontend for the CG:SHOP Instances Collection.
It runs in conjunction with a backend API server and is currently hosted at
[https://cgshop.ibr.cs.tu-bs.de/instances/](https://cgshop.ibr.cs.tu-bs.de/instances/).

## Project setup

The frontend is a Vue.js project that uses the Vuetify Material Design framework. It is built with the Vue CLI and
requires Node.js and npm to be installed on your system.

To install the dependencies, run the following command in the project directory:

```
npm install
```

After the dependencies have been installed, you can run the development server with the following command:

```
npm run serve
```

The development server will be available at [http://localhost:8080/](http://localhost:8080/).

## Deployment
To build the project for deployment, run the following command:
```
npm run build
```

This will create a `dist` directory containing the built project. The contents of this directory can be copied to a
web server to deploy the project.

### Docker

We provide a Dockerfile to build a docker image for the frontend. 
The Dockerfile copies the `dist` directory into the mounted directory.

Build from docker image:
```
docker build -t cgshop-frontend:latest .
docker run -it --mount type=bind,source=/path/to/dist,target=/app/dist cgshop-frontend:latest
```

### Lints and fixes files
```
npm run lint
```

## Instances

The instances in the CG:SHOP collection are generated by a variety of different algorithms, each tailored to the
specific problem at hand. The generators are designed to produce instances that are challenging and
representative
of the problem space, while also being scalable and reproducible. The instances are generated with a variety of
parameters, such as the number of objects and the size and shape of the objects.


## Issues

If you encounter any issues with the frontend, please report them in the issue tracker of this repository.
