export interface IDownload {
    id: string;
    campus_id: string;
    title: string;
    type: string;
    is_public: string;
    class_id: string;
    cls_sec_id: string;
    file: string;
    created_by: string;
    note: string;
    is_active: string;
    created_at: string;
    updated_at: string;
    date: string;
    resources_links: string;
    class_section_id: string | null;
    class: string | null;
    section: string | null;
}

export interface IDownloadStudyMaterial {
    title: string;
    study_material: IDownload[]
}
export interface IDownloadSyllabus {
    title: string;
    syllabus: IDownload[]
}
export interface IDownloadSummerTasks {
    title: string;
    downloads: IDownload[]
}


export interface IDownloadSyllabus {
    title: string;
    syllabus: IDownload[]
}
export interface IDownloadSyllabus {
    title: string;
    syllabus: IDownload[]
}