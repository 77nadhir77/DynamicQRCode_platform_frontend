export interface User{
    id:number,
    username:string,
    role?: 'admin' | "user" 
    iot?: number,
    exp?: number,
}