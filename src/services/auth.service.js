import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

class AuthService {
    login(user) {
        return axios
            .post(API_URL + 'login', {
                username: user.username,
                password: user.password
            })
            .then(response => {
                if (response.data.access) {
                    let userData = {
                        username: user.username,
                        access: response.data.access,
                        refresh: response.data.refresh,
                    }

                    localStorage.setItem('user', JSON.stringify(userData));

                    return userData;
                }

                return response.data;
            });
    }

    loginRefresh() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            return axios.post(API_URL + 'login/refresh', {
                "refresh": user.refresh
            }).then(function (response) {
                user.access = response.data.access;
                localStorage.setItem('user', JSON.stringify(user));
            }).catch(function (){
                localStorage.setItem("user", JSON.stringify({}))
            });
        }

    }

    logout() {
        localStorage.removeItem('user');
    }

    register(user) {
        return axios.post(API_URL + 'register', {
            username: user.username,
            email: user.email,
            password: user.password
        });
    }
}

export default new AuthService();