import axios from "axios";

const BASE_URL = 'http://localhost:3001/api'
export class LoginService {
    static async SignIn(email, pass) {
        const response = (await axios.post(`${BASE_URL}/signin`, { email, pass })).data;
        return response;

    }
}