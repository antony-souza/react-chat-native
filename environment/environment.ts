class Environment {
    public readonly apiUrl:string = 'http://10.0.2.2:7920';
    public readonly auth: string = 'auth/login';
}

export const environment = new Environment();