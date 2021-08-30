import { Context } from 'koa';
import { fileDownloadAction } from './controller/file/FileDownloadAction';
import { fileUploadAction } from './controller/file/FileUploadAction';
import { mentorInfo } from './controller/mentor/mentorInfo';
import { mentorLoginAction } from './controller/mentor/mentorLoginAction';
import { updateMentorInfoAction } from './controller/mentor/updateMentorInfo';
import { paperSendAction } from './controller/paper/PaperSendAction';
import { paperTemplateGetAllAction } from './controller/paper/PaperTemplateGetAllAction';
import { paperTemplateGetOneAction } from './controller/paper/PaperTemplateGetOneAction';
import { paperTemplateRemoveAction } from './controller/paper/PaperTemplateRemoveAction';
import { paperTemplateAddAction } from './controller/paper/PaperTemplateSaveAction';
import { scoreSubmitAction } from './controller/paper/ScoreSubmitAction';
import { pingAction } from './controller/PingAction';
import { questionAddAction } from './controller/question/QuestionAddAction';
import { questionEditAction } from './controller/question/QuestionEditAction';
import { questionGetAllAction } from './controller/question/QuestionGetAllAction';
import { questionRemoveAction } from './controller/question/QuestionRemoveAction';
import { studentGetAllAction } from './controller/student-manage/StudentGetAllAction';
import { studentRemoveAction } from './controller/student-manage/StudentRemoveAction';
import { studentSaveAction } from './controller/student-manage/StudentSaveAction';
import { leaveMessageAction } from './controller/student/leaveMessageAction';
import { messageGetAllAction } from './controller/student/messageGetAllAction';
import { paperGetAllAction } from './controller/student/paperGetAllAction';
import { paperGetOneAction } from './controller/student/paperGetOneAction';
import { paperSubmitAction } from './controller/student/paperSubmitAction';
import { questionCollectAction } from './controller/student/questionCollectAction';
import { questionCollectGetAllAction } from './controller/student/questionCollectGetAllAction';
import { studentLoginAction } from './controller/student/studentLoginAction';
import { updateStudentInfoAction } from './controller/student/updateStudentInfoAction';
import { updateStudentPassword } from './controller/student/updateStudentPassword';
import { updateMentorPassword } from './controller/mentor/updateMentorPassword';
import { userInfo } from './controller/student/userInfo';
import { adminInfo } from './controller/admin/adminInfo';
import { adminLogin } from './controller/admin/adminLogin';
import { teacherGetAllAction } from './controller/admin/mentorGetAll';
import { mentorSaveAction } from './controller/admin/mentorSaveAction';
import { mentorRemoveAction } from './controller/admin/mentorRemoveAction';
import { updateAdminInfo } from './controller/admin/updateAdminInfo';
import { updateAdminPassword } from './controller/admin/updateAdminPassword';
import { messageReply } from './controller/message/messageReply';
import { messageGetAll } from './controller/message/messageGetAll';
import { getNotice } from './controller/notice/getNotice';
import { postNotice } from './controller/notice/postNotice';
import { deleteNotice } from './controller/notice/deleteNotice';
import { carouselPost } from './controller/carousel/CarouselPost';
import { carouselDelete } from './controller/carousel/CarouselDelete';
import { CarouselGetAll } from './controller/carousel/CarouselGetAll';
import { questionCollectDelete } from './controller/student/questionCollectDelete';

type RouteItem = {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  action: (context: Context) => void;
};
/**
 * All application routes.
 */
export const AppRoutes: RouteItem[] = [
  {
    path: '/ping',
    method: 'get',
    action: pingAction,
  },
  {
    path: '/mentor/login',
    method: 'post',
    action: mentorLoginAction,
  },
  {
    path: '/mentor/me',
    method: 'get',
    action: mentorInfo,
  },
  {
    path: '/mentor/updateInfo',
    method: 'post',
    action: updateMentorInfoAction,
  },
  {
    path: '/mentor/updatePassword',
    method: 'post',
    action: updateMentorPassword,
  },
  {
    path: '/mentor/question',
    method: 'post',
    action: questionAddAction,
  },
  {
    path: '/mentor/question',
    method: 'delete',
    action: questionRemoveAction,
  },
  {
    path: '/mentor/question',
    method: 'put',
    action: questionEditAction,
  },
  {
    path: '/mentor/question',
    method: 'get',
    action: questionGetAllAction,
  },
  {
    path: '/file/upload',
    method: 'post',
    action: fileUploadAction,
  },
  {
    path: '/file/download',
    method: 'get',
    action: fileDownloadAction,
  },
  {
    path: '/mentor/papertemplate',
    method: 'post',
    action: paperTemplateAddAction,
  },
  {
    path: '/mentor/papertemplates',
    method: 'get',
    action: paperTemplateGetAllAction,
  },
  {
    path: '/mentor/papertemplate',
    method: 'get',
    action: paperTemplateGetOneAction,
  },
  {
    path: '/mentor/papertemplate',
    method: 'delete',
    action: paperTemplateRemoveAction,
  },
  {
    path: '/mentor/paper',
    method: 'get',
    action: paperGetOneAction,
  },
  {
    path: '/student/me',
    method: 'get',
    action: userInfo,
  },
  {
    path: '/mentor/student',
    method: 'post',
    action: studentSaveAction,
  },
  {
    path: '/mentor/student',
    method: 'get',
    action: studentGetAllAction,
  },
  {
    path: '/mentor/student',
    method: 'delete',
    action: studentRemoveAction,
  },
  {
    path: '/mentor/send_paper',
    method: 'post',
    action: paperSendAction,
  },
  {
    path: '/mentor/submit_score',
    method: 'post',
    action: scoreSubmitAction,
  },
  {
    path: '/mentor/carousel',
    method: 'post',
    action: carouselPost,
  },
  {
    path: '/mentor/carousel',
    method: 'delete',
    action: carouselDelete,
  },
  {
    path: '/student/login',
    method: 'post',
    action: studentLoginAction,
  },
  {
    path: '/student/updateInfo',
    method: 'post',
    action: updateStudentInfoAction,
  },
  {
    path: '/student/updatePassword',
    method: 'post',
    action: updateStudentPassword,
  },
  {
    path: '/student/papers',
    method: 'get',
    action: paperGetAllAction,
  },
  {
    path: '/student/paper',
    method: 'get',
    action: paperGetOneAction,
  },
  {
    path: '/student/paper_submit',
    method: 'post',
    action: paperSubmitAction,
  },
  {
    path: '/student/question_collect',
    method: 'get',
    action: questionCollectGetAllAction,
  },
  {
    path: '/student/question_collect',
    method: 'post',
    action: questionCollectAction,
  },
  {
    path: '/student/question_collect',
    method: 'delete',
    action: questionCollectDelete,
  },
  {
    path: '/student/messages',
    method: 'get',
    action: messageGetAllAction,
  },
  {
    path: '/student/leave_message',
    method: 'post',
    action: leaveMessageAction,
  },
  {
    path: '/student/notice',
    method: 'get',
    action: getNotice,
  },
  {
    path: '/student/carousel',
    method: 'get',
    action: CarouselGetAll,
  },
  {
    path: '/admin/me',
    method: 'get',
    action: adminInfo,
  },
  {
    path: '/admin/login',
    method: 'post',
    action: adminLogin,
  },
  {
    path: '/admin/mentor',
    method: 'get',
    action: teacherGetAllAction,
  },
  {
    path: '/admin/mentor',
    method: 'post',
    action: mentorSaveAction,
  },
  {
    path: '/admin/mentor',
    method: 'delete',
    action: mentorRemoveAction,
  },
  {
    path: '/admin/updateInfo',
    method: 'post',
    action: updateAdminInfo,
  },
  {
    path: '/admin/updatePassword',
    method: 'post',
    action: updateAdminPassword,
  },
  {
    path: '/mentor/message',
    method: 'get',
    action: messageGetAll,
  },
  {
    path: '/mentor/reply',
    method: 'post',
    action: messageReply,
  },
  {
    path: '/mentor/notice',
    method: 'post',
    action: postNotice,
  },
  {
    path: '/mentor/notice',
    method: 'delete',
    action: deleteNotice,
  },
];
