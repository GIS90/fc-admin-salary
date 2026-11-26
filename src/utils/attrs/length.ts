/**
 * Set
 * */
let setterProfileModel = {
    rtxId: 35,
    userName: 30,
    sex: 2,
    email: 80,
    phone: 11,
    introduction: 255
}

let setterProfilePassword = {
    min: 8,
    max: 36
}

let downloadFormModel = {
    name: 55
}

let systemRoleModel = {
    engname: 35,
    chnname: 35,
    introduction: 255
}

let systemMenuModel = {
    title: 35,
    name: 55,
    path: 255,
    component: 255,
    redirect: 255,
    tag: 4
}

let systemDictKeyModel = {
    key: 25,
    value: 10
}

let systemDictEnumModel = {
    name: 25,
    key: 25,
    value: 25,
    remark: 255
}

let systemDepartModel = {
    label: 30,
    description: 255
}

let systemAvatarModel = {
    name: 35,
    type: 35,
    tag: 55,
    summary: 255,
    url: 120
}

let systemXtcsModel = {
    key: 35,
    remark: 35,
    value: 255
}

let systemReportModel = {
    name: 35,
    table: 35,
    remark: 200
}

let systemApiModel = {
    blueprint: 25,
    apiname: 35,
    endpoint: 65,
    path: 65,
    short: 35,
    long: 255
}

let systemRedisConfigModel = {
    name: 55,
    host: 120,
    password: 120,
    summary: 255
}

let systemRedisRuleModel = {
    name: 55,
    pattern: 255,
    summary: 255
}

let salaryDtalkModel = {
    name: 80,
    title: 50
}

// 工资->消息通知->钉钉绩效->Robot配置
let salaryDtalkRobotModel = {
    name: 30,
    key: 30,
    secret: 80,
    agentId: 30,
    description: 120
}

let salaryQywxModel = {
    name: 80,
    title: 50
}

// 工资->消息通知->企微绩效->Robot配置
let salaryQywxRobotModel = {
    name: 30,
    key: 30,
    secret: 80,
    agentId: 30,
    description: 120
}

let salaryEmailModel = {
    name: 80,
    title: 50
}

// 工资->消息通知->邮件通知->邮件服务配置
let salaryEmailRobotModel = {
    name: 30,
    key: 120,
    secret: 120,
    agentId: 120,
    description: 120
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
