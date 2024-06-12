import axios from 'axios';
import Problems from "@/data/problems";


class InstancesService {

    constructor(problem) {
        this.problem = problem
    }

    baseUrl() {
        for (let key in Problems) {
            if (Problems[key].id === this.problem) {
                return process.env.VUE_APP_API_URL + Problems[key].endpoint
            }
        }
        throw new Error("Problem not found")
    }

    getInstanceSchema(format) {
        return axios.get(this.baseUrl() + "instance_schema/" + format)
    }

    getProblem() {
        return axios.get(this.baseUrl() + "problem")
    }

    getInstance(id) {
        return axios.get(this.baseUrl() + "instances/" + id)
    }

    getSolutions(id) {
        return axios.get(this.baseUrl() + "instances/" + id + "/solutions")
    }

    getInstanceRaw(id) {
        return axios.get(this.getInstanceRawUrl(id))
    }

    getInstanceRawUrl(id) {
        return this.baseUrl() + "instances/" + id + "/raw";
    }

    getSolutionRawUrl(instanceId, solutionId) {
        return this.baseUrl() + "instances/" + instanceId + "/solutions/" + solutionId + "/raw";
    }

    getInstances(search, filters, paginationData) {
        let params = {
            search: search,
            limit: paginationData.limit,
            offset: paginationData.offset,
            sort: paginationData.sort,
            add_total_count: paginationData.add_total_count
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