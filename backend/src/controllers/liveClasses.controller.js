import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import StudentModel from "../models/student.model.js";
import ConferenceModel from "../models/conference.model.js";
import ZoomFunctions from "../models/zoom.model.js";
import { getMeetingDetails } from "../utils/zoom/zoom.js";

const getStudentConferences = asyncHandler(async (req, res) => {
    const studentId = req.user.student_id;
    const sessionId = req.user?.settings?.sessionId;

    const studentInfo = await StudentModel.getRecentRecord(
        studentId,
        sessionId
    );
    if (!studentInfo) {
        throw new ApiError(404, "Student record not found");
    }

    const { class_id, section_id, campus_id, program_applied_for } =
        studentInfo;

    const conferenceSetting = {}; // pull from env/config if needed

    const conferences = await ConferenceModel.getByClassSection(
        class_id,
        section_id,
        campus_id,
        program_applied_for,
        sessionId
    );

    const responses = {};

    for (const conf of conferences) {
        const live = await ConferenceModel.getById(conf.id);

        let zoomApiKey, zoomApiSecret;

        if (live.api_type === "global") {
            const zoomSetting = await ZoomFunctions.getGlobalSetting();
            zoomApiKey = zoomSetting.zoom_api_key;
            zoomApiSecret = zoomSetting.zoom_api_secret;
        } else {
            const staffZoom = await ZoomFunctions.getZoomCredentials(
                live.class_id
            );
            zoomApiKey = staffZoom.zoom_api_key;
            zoomApiSecret = staffZoom.zoom_secret_key;
        }

        const meetingId = JSON.parse(live.return_response)?.id;

        if (zoomApiKey && zoomApiSecret && meetingId) {
            const response = await getMeetingDetails(
                meetingId,
                zoomApiKey,
                zoomApiSecret
            );
            responses[conf.id] = response?.status || "unknown";
        } else {
            responses[conf.id] = "missing_credentials";
        }
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {
                conferences,
                responses,
                conferenceSetting,
            },
            "Student conferences fetched successfully"
        )
    );
});

export { getStudentConferences };
