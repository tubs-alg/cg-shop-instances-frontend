import axios from 'axios';

class InstancesService {
    getFilters(problem) {
        return axios.get(process.env.VUE_APP_API_URL + "instances/filters/" + problem)
    }

    getProblems() {
        return axios.get(process.env.VUE_APP_API_URL + "problems")
    }

    getInstance(problem, identifier) {
        return axios.get(process.env.VUE_APP_API_URL + "instances/get/" + problem + "/" + identifier)
    }

    getInstances(problem, search, filters, page) {
        let params = {
            identifier: search,
            page: page
        }

        filters.forEach((filter) => {
            params[filter.key] = filter.value
        });

        return axios.get(process.env.VUE_APP_API_URL + "instances/get/" + problem, {
            params: params,
            paramsSerializer: {
                indexes: null, // no brackets at all
            }
        })
    }
}

export default new InstancesService();