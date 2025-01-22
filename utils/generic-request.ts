import { environment } from "../src/environment/environment";

type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

class GenericRequest {
    
    async genericRequest(endpoint: string, method: method, body?: any) {

        const url = `${environment.apiUrl}/${endpoint}`;

        const response = await fetch(url, {
            method: method,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return await response.json();
    }
}

export const genericRequest = new GenericRequest();