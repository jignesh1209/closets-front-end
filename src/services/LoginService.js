import axios from "axios";
//const BASE_URL = 'https://d203-49-36-91-66.ngrok-free.app/api/user'
const BASE_URL = 'http://192.168.29.137:3001/api/user'
export class LoginService {
    static async SignIn(email, pass) {
        const response = (await axios.post(`${BASE_URL}/signin`, { email, pass }, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      })
	  ).data;
        return response;

    }
}