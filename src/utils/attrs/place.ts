/**
 * Set
 * */
let setterProfileModel = {
    rtxId: "请输入用户RTX-ID，唯一标识",
    userName: "请输入用户昵称",
    sex: "请选择用户性别",
    email: "请输入用户Email",
    phone: "请输入用户电话，格式为11位数字",
    introduction: "请输入用户个性签名",
    role: "请选择用户系统菜单权限"
}

let setterProfilePassword = {
    userPassword: "请输入当前密码",
    newPassword: "请输入新密码",
    confirmNewPassword: "请再次输入新密码"
}


let downloadFormModel = {
    type: "请选择数据的下载类型",
    name: "请输入下载文件的名称",
    format: "请选择下载文件的类型"
}

let systemRoleModel = {
    engname: "请输入角色唯一标识",
    chnname: "请输入角色名称",
    introduction: "请输入角色相关描述"
}

let systemMenuModel = {
    id: "请输入菜单ID",
    title: "请输入菜单显示标题",
    pid: "请选择上级菜单",
    name: "请输入菜单名称",
    icon: "请选择菜单图标",
    path: "请输入菜单路由地址，以/开头",
    level: "请选择菜单级别",
    order_id: "请输入菜单顺序编号",
    component: "请输入菜单组件路径，以/开头",
    redirect: "请输入菜单重定向地址，以/开头",
    tag: "请输入菜单TAG"
}

let systemDictKeyModel = {
    key: "请输入数据字典分类唯一标识，建议采用英文+中划线",
    value: "请输入数据字典分类名称"
}

let systemDictEnumModel = {
    key: "请输入数据字典枚举唯一标识，建议采用英文+中划线",
    value: "请输入数据字典枚举名称",
    remark: "请输入数据字典枚举描述",
    name: "请选择数据字典分类标识"
}

let systemDepartModel = {
    label: "请输入部门节点名称",
    description: "请输入部门节点描述",
    manage_rtx: "请选择部门节点管理员，支持多选",
    pnode: "请选择上级部门节点"
}

let systemAvatarModel = {
    name: "请输入图片名称",
    type: "请选择图片类型",
    tag: "请输入图片标签，多个标签用英文逗号分隔",
    summary: "请输入图片备注说明",
    url: "点击或拖拽上传图片"
}

let systemXtcsModel = {
    key: "请输入系统参数名称",
    remark: "请输入系统参数说明",
    value: "请输入系统参数值",
    type: "请选择系统参数类型"
}

let systemReportModel = {
    name: "请输入报表名称",
    table:  "请输入报表数据表名",
    remark: "请输入报表描述"
}

let systemApiModel = {
    blueprint: "请输入API接口Blueprint",
    apiname: "请输入API接口View方法名称",
    endpoint: "请输入API接口Endpoint",
    path: "请输入API接口Path，与request表关联",
    method: "请选择接口请求方式",
    short: "请输入API接口简述",
    long: "请输入API接口详细描述"
}

let systemRedisConfigModel = {
    name: "请输入Redis配置名称",
    host: "请输入Redis主机地址",
    password: "无密码请留空",
    summary: "请输入配置说明"
}

let systemRedisRuleModel = {
    name: "请输入清理规则名称",
    pattern: "前缀匹配填写前缀；通配符支持*和?；正则填写表达式",
    summary: "请输入规则说明"
}

let salaryDtalkModel = {
    name: "请输入文件名称（.xls、.xlsx）",
    title: "请输入当前Sheet的消息标题，为空时默认使用时间+自动化提醒",
    setSheet: "请选择需要发送消息的Sheet，支持多选",
    column: "请选择消息列头，支持多选"
}

// 工资->消息通知->钉钉绩效->Robot配置
let salaryDtalkRobotModel = {
    name: "请输入消息机器人名称",
    key: "请输入AppKey",
    secret: "请输入AppSecret",
    agentId: "请输入AgentId（选填）",
    description: "请输入消息机器人描述"
}

let salaryQywxModel = {
    name: "请输入文件名称（.xls、.xlsx）",
    title: "请输入当前Sheet的消息标题，为空时默认使用时间+自动化提醒",
    setSheet: "请选择需要发送消息的Sheet，支持多选",
    column: "请选择消息列头，支持多选"
}

// 工资->消息通知->企微绩效->Robot配置
let salaryQywxRobotModel = {
    name: "请输入消息机器人名称",
    key: "请输入企业ID（CorpID）",
    secret: "请输入应用密钥（Secret）",
    agentId: "请输入应用ID（AgentId）",
    description: "请输入消息机器人描述"
}

let salaryEmailModel = {
    name: "请输入文件名称（.xls、.xlsx）",
    title: "请输入当前Sheet的邮件标题，为空时默认使用时间+自动化提醒",
    setSheet: "请选择需要发送邮件的Sheet，支持多选",
    column: "请选择消息列头，支持多选"
}

// 工资->消息通知->邮件通知->邮件服务配置
let salaryEmailRobotModel = {
    name: "请输入邮件服务名称",
    key: "请输入SMTP服务器地址:端口，例如 smtp.qq.com:465",
    secret: "请输入邮箱密码或授权码",
    agentId: "请输入发件邮箱地址",
    description: "请输入邮件服务描述"
}

export default {
    setterProfileModel,
    setterProfilePassword,
    downloadFormModel,
    systemRoleModel,
    systemMenuModel,
    systemDictKeyModel,
    systemDictEnumModel,
    systemDepartModel,
    systemAvatarModel,
    systemXtcsModel,
    systemReportModel,
    systemApiModel,
    systemRedisConfigModel,
    systemRedisRuleModel,
    salaryDtalkModel,
    salaryDtalkRobotModel,
    salaryQywxModel,
    salaryQywxRobotModel,
    salaryEmailModel,
    salaryEmailRobotModel,
}
