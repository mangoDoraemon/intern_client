const getters = {

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  email: state => state.user.email,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  socialId:state => state.user.socialId,
  roleId:state => state.user.roleId,
  id:state =>state.user.id,
  roleName:state =>state.user.roleName,
  teacherNumber:state =>state.user.teacherNumber,
  companyNumber:state =>state.user.companyNumber,
  studentNumber:state =>state.user.studentNumber,
  yesOrNo:state =>state.user.yesOrNo,
}
export default getters
