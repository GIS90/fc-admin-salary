/**
 * Set
 * */
let setterProfileModel = {
    rtxId: 35,
    userName: 20,
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
    remark: 10
}

let systemDictEnumModel = {
    name: 25,
    key: 25,
    value: 25,
    description: 255
}

let systemDepartModel = {
    label: 30,
    description: 255
}

let systemXtcsModel = {
    key: 35,
    remark: 35,
    value: 255
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
    systemXtcsModel,
}
