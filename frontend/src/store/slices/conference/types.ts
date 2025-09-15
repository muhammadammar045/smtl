// types.ts

export interface ConferenceSetting {
    id: string;
    zoom_api_key: string;
    zoom_api_secret: string;
    use_teacher_api: string;
    use_zoom_app: string;
    created_at: string;
}

export interface Conference {
    // Define the fields here if/when conferences array contains objects
    // Example:
    // id: string;
    // topic: string;
    // start_time: string;
    // duration: number;
    // etc.
}


export interface LiveClasses {
    conference_setting: ConferenceSetting;
    conferences: Conference[];
    responses: any | null;
}
