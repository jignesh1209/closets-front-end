import axios from "axios";

const BASE_URL = 'http://localhost:3001/api/pdf';
export const filters = {
    jobId:'',
    clientName: ''
}
export class GeneratePDFService {
    
    static async FilterToPDF(filters) {
        const response = await axios.post(`${BASE_URL}/savefilter`,filters);
        return response.data;
    }
}