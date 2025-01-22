import { environment } from "../src/environment/environment";

type httpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class GenericRequest {
    
    async genericRequest(endpoint: string, method: httpMethods, body?: any) {

        const url = `${environment.apiUrl}/${endpoint}`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return await response.json();
    }
}