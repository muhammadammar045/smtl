import { Student } from "../attendance/types";

export interface Route {
    route_id: number,
    route_name: string
}
export interface Transport {
    liststudent: Student,
    listroute: Route[]
}
