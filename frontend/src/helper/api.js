import axios from "axios";

const userId = "userId";
const token = "token";
export default class Api {
    constructor() {
        this.api_token = null;
        this.client = null;
        this.api_url = "http://localhost:9428";
        this.headers = {
            Accept: "application/json",
        };

        //this.api_url = process.env.REACT_APP_API_ENDPOINT;
    }

    getHeaders(){
        this.api_token = window.localStorage.getItem(token)
        this.user_id = window.localStorage.getItem(userId)

        if (this.api_token) {
            this.headers.Authorization = `Bearer ${this.api_token} ${this.user_id}`;
        }

        return this.headers;
    }

    getConfig(){
        return {
            baseURL: this.api_url,
            timeout: 31000,
            headers: this.getHeaders()
        }
    }


    async subscribe(email,password,firstName,lastName) {
        try {
            return axios.post(`${this.api_url}/api/auth/signup`,{
                "email": email,
                "password": password,
                "firstName": firstName,
                "lastName":lastName
            },this.getConfig()).then((response) => {
                if (response == null) return false;
                this.setCredentials(response["data"]);

                return response;
            }).catch((error)=>{
                console.log(error);
            });

        } catch (e) {
            alert(e.message);
            return false;
        }
    }

    setCredentials(response) {
        console.log("saving token",response[token])
        localStorage.setItem(token, response[token])
        console.log("saving userId",response[userId])
        localStorage.setItem(userId, response[userId])
    }
    getUserId(){
        return localStorage.getItem(userId)
    }
    async login(email,password) {
        try {
            return axios.post(`${this.api_url}/api/auth/login`,{
                "email": email,
                "password": password
            },this.getConfig()).then((response) => {
                if (response == null) return false;
                response = response["data"]
                console.log("saving credentials",response)
                this.setCredentials(response)
                return response;
            }).catch((error)=>{
                console.log(error);
            });

        } catch (e) {
            alert(e.message);
            return false;
        }
    }
    logout(){
        localStorage.removeItem(token)
    }
    async getUserInfo(){
        return axios.get(`${this.api_url}/api/auth/${this.getUserId()}`,this.getConfig()).then((response) => {
            console.log("User info gotten",response["data"])
            return response["data"];
        }).catch((error)=>{
            console.log(error);
        });
    }
    getUserList = (params) => {
        return this.init().get("/users", { params: params });
    };

    addNewUser = (data) => {
        return this.init().post("/users", data);
    };
}
