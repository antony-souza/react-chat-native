import { environment } from "../src/environment/environment";


type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

class HttpClient {
    
    async genericRequest(endpoint: string, method: method, body?: any) {
        let headers: Record<string, string> = {};
        const url = `${environment.apiUrl}/${endpoint}`;

        if (body instanceof FormData) {
            headers = {
                'Accept': 'application/json',
            };
        } else {
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };
        }
        
        const response = await fetch(url, {
            method: method,
            mode: 'cors',
            headers: headers,
            body: body instanceof FormData ? body : JSON.stringify(body),
        });

        return await response.json();
    }
}

export const httpClient = new HttpClient();