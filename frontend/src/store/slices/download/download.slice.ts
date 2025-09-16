import { IDownload, IDownloadHomeWork, IDownloadStudyMaterial, IDownloadSummerTasks, IDownloadSyllabus, IDownloadTimeTable } from "./types";

import { CommonApiResponse } from "@/store/commonApiResponse";
import { RootState } from "@/store/store";
import { api } from "@/store/service/rtk-service";
import { apiRoutes } from "@/store/routes";
import { createSlice } from "@reduxjs/toolkit";

interface DownloadCenterState {
    timetables: IDownload[];
    homeworks: IDownload[];
    studyMaterials: IDownload[];
    syllabuses: IDownload[];
    otherSummerTasks: IDownload[];
    loading: boolean;
    error: string | null;
}

const initialState: DownloadCenterState = {
    timetables: [],
    homeworks: [],
    studyMaterials: [],
    syllabuses: [],
    otherSummerTasks: [],
    loading: false,
    error: null,
};

// ✅ Inject RTK Query endpoints
export const downloadApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTimetable: builder.query<CommonApiResponse<IDownloadTimeTable>, void>({
            query: () => apiRoutes.download.timeTable,
        }),
        getHomework: builder.query<CommonApiResponse<IDownloadHomeWork>, void>({
            query: () => apiRoutes.download.assignment,
        }),
        getStudyMaterial: builder.query<CommonApiResponse<IDownloadStudyMaterial>, void>({
            query: () => apiRoutes.download.studyMaterial,
        }),
        getSyllabus: builder.query<CommonApiResponse<IDownloadSyllabus>, void>({
            query: () => apiRoutes.download.syllabus,
        }),
        getOtherSummerTasks: builder.query<CommonApiResponse<IDownloadSummerTasks>, void>({
            query: () => apiRoutes.download.other,
        }),
    }),
});

// ✅ Slice
const downloadCenterSlice = createSlice({
    name: "downloadCenter",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                downloadApi.endpoints.getTimetable.matchFulfilled,
                (state, { payload }) => {
                    state.timetables = payload.data.list;
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                downloadApi.endpoints.getHomework.matchFulfilled,
                (state, { payload }) => {
                    state.homeworks = payload.data.list;
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                downloadApi.endpoints.getStudyMaterial.matchFulfilled,
                (state, { payload }) => {
                    state.studyMaterials = payload.data.list;
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                downloadApi.endpoints.getSyllabus.matchFulfilled,
                (state, { payload }) => {
                    state.syllabuses = payload.data.list;
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                downloadApi.endpoints.getOtherSummerTasks.matchFulfilled,
                (state, { payload }) => {
                    state.otherSummerTasks = payload.data.list;
                    state.loading = false;
                    state.error = null;
                }
            );
    },
});

// ✅ Export hooks for components
export const {
    useGetTimetableQuery,
    useGetHomeworkQuery,
    useGetStudyMaterialQuery,
    useGetSyllabusQuery,
    useGetOtherSummerTasksQuery,
} = downloadApi;

export default downloadCenterSlice.reducer;

// ✅ Selectors
export const selectDownloadCenter = (state: RootState) => state.downloadCenter;
export const selectTimetables = (state: RootState) =>
    state.downloadCenter.timetables;
export const selectHomeworks = (state: RootState) =>
    state.downloadCenter.homeworks;
export const selectStudyMaterials = (state: RootState) =>
    state.downloadCenter.studyMaterials;
export const selectSyllabuses = (state: RootState) =>
    state.downloadCenter.syllabuses;
export const selectOtherSummerTasks = (state: RootState) =>
    state.downloadCenter.otherSummerTasks;
