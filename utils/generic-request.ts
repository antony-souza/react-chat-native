import { environment } from "../src/app/environment/environment";

type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

class HttpClient {
    
    async genericRequest(endpoint: string, method: method, body?: any) {

        const url = `${environment.apiUrl}/${endpoint}`;

        const response = await fetch(url, {
            method: method,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined
        });

        return await response.json();
    }
}

export const httpClient = new HttpClient();