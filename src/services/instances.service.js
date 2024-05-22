import axios from 'axios';
import Problems from "@/data/problems";


class InstancesService {

    constructor(problem) {
        this.problem = problem
    }

    baseUrl() {
        if (this.problem === Problems.MaximumPolygonPacking.id) {
            return process.env.VUE_APP_API_URL + Problems.MaximumPolygonPacking.endpoint
        }

        return process.env.VUE_APP_API_URL;
    }

    getProblem() {
        return axios.get(this.baseUrl() + "problem")
    }

    getInstance(id) {
        return axios.get(this.baseUrl() + "instance/" + id)
    }

    getSolutions(id) {
        return axios.get(this.baseUrl() + "instances/" + id + "/solutions")
    }

    getInstanceRaw(id) {
        return axios.get(this.getInstanceRawUrl(id))
    }

    getInstanceRawUrl(id) {
        return this.baseUrl() + "instance/" + id + "/raw";
    }

    getSolutionRawUrl(instanceId, solutionId) {
        return this.baseUrl() + "instances/" + instanceId + "/solutions/" + solutionId + "/raw";
    }

    getInstances(search, filters, paginationData) {
        let params = {
            search: search,
            limit: paginationData.limit,
            offset: paginationData.offset,
            sort: paginationData.sort
        }

        Object.keys(filters).forEach((key) => {
            params[key] = filters[key]
        });

        return axios.get(this.baseUrl() + "instances", {
            params: params,
            paramsSerializer: {
                indexes: null, // no brackets at all
            }
        })
    }
}

export default InstancesService;