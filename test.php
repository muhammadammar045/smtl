<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Notification extends Student_Controller
{

    function __construct()
    {
        parent::__construct();
    }

    function index()
    {
        $this->session->set_userdata('top_menu', 'User');


        $data['title'] = 'Notifications';
        $student_id = $this->customlib->getStudentSessionUserID();
        $student = $this->student_model->get_for_parent($student_id);

        // print_r($student);die();
        $student_id = $student['id'];
        $campus_id = $student['campus_main_id'];

        //   echo "<pre>";
        //  print_r($student);
        //die();
        $notifications = $this->notification_model->getNotificationForStudent($student_id, $campus_id);



        $data['notificationlist'] = $notifications;
        $this->load->view('layout/student/header', $data);
        $this->load->view('user/notification/notificationList', $data);
        $this->load->view('layout/student/footer', $data);
    }

    public function notification_api()
    {
        // Set top menu (if still needed for tracking)
        $this->session->set_userdata('top_menu', 'User');

        // Get student from session
        $student_id = $this->customlib->getStudentSessionUserID();
        $student = $this->student_model->get_for_parent($student_id);

        if (!$student) {
            return ApiError(404, 'Student not found');
        }

        // Extract IDs
        $student_id = $student['id'];
        $campus_id = $student['campus_main_id'];

        // Get notifications
        $notifications = $this->notification_model->getNotificationForStudent($student_id, $campus_id);

        // Send JSON response
        return ApiResponse(200, ['notificationList' => $notifications], 'Notifications fetched successfully');
    }

    function updatestatus()
    {
        $notification_id = $this->input->post('notification_id');
        $student_id = $this->customlib->getStudentSessionUserID();
        $data = $this->notification_model->updateStatus($notification_id, $student_id);
        $array = array('status' => "success", 'data' => $data);
        echo json_encode($array);
    }
}
