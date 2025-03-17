import axios from "axios";

const BASE_URL = 'http://localhost:3001/api';
export const filters = {
    jobId:'',
    clientName: ''
}
export class GeneratePDFService {
    
    static async FilterToPDF(filters) {
        const response = await axios.post(`${BASE_URL}/generatepdf`,filters);
        return response.data;
    }
}