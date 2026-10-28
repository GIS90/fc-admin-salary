/**
 * 按钮
 * */
export let buttonField = {
    type: "primary", // 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
    size: "default", // 大小：large | default | small
    plain: true, // 是否为朴素按钮
    text: false, // 是否为文字按钮
    bg: false, // 是否显示文字按钮背景颜色
    link: false, // 是否为链接按钮
    round: false, // 是否为圆角按钮
    circle: false, // 是否为圆形按钮
}

/**
 * 输入框 > Input
 * */
export let inputField = {
    type: "text",
    size: "default", // 大小：large | default | small
    showWordLimit: true, // 统计字数
    clearable: true, // 清除按钮
    prefixIcon: "EditPen", // 前缀图标
    suffixIcon: "EditPen", // 后缀图标
}

/**
 * 输入框 > TextArea
 * */
let _textAreaField= {
    type: "textarea",
    rows: 5,
    autosize: { minRows: 5, maxRows: 8 }
}
export const textAreaField = { ...inputField, ..._textAreaField };

/**
 * 数字输入框 > Input
 * */
export let inputNumberField = {
    min: 1, // 最小值
    max: 1000000, // 最大值
    step: 1, // 计数器步长
    stepStrictly: false, // 是否只能输入 step 的倍数
    precision: 0, // 数值精度
    size: "default", // 大小：large | default | small
    controls: true, // 是否使用控制按钮
    controlsPosition: "", // 控制按钮位置'' | 'right'
}

/**
 * 选择器 > 单选
 * */
export let selectSingleField = {
    size: "default", // 大小：large | default | small
    clearable: true, // 清除按钮
    filterable: true, // 筛选
    allowCreate: false, // 创建新条目
    noMatchText: "暂无搜索匹配的选项", // 搜索条件无匹配时显示的文字
    noDataText: "暂无选项", // 无选项时显示的文字
}

/**
 * 选择器 > 单选
 * */
let _selectMultiField = {
    multiple: true, // 多选
    collapseTags: true, // 折叠标签
    collapseTagsTooltip: true, // 鼠标悬停显示折叠标签
    maxCollapseTags: 6, // 最大折叠
    limit: 0 // 多选的个数
}
export const selectMultiField = {...selectSingleField, ..._selectMultiField}


/**
 * Form
 * */
export let formField = {
    size: 'default', // 'large' | 'default' | 'small'
    labelPosition: "right", // 'left' | 'right' | 'top'
    labelWidth: "auto",
    hideRequiredAsterisk: false, // 是否隐藏必填字段标签旁边的红色星号
    requireAsteriskPosition: "left", // 星号的位置'left' | 'right'
    inlineMessage: false, // 是否以行内形式展示校验信息
}

/**
 * Fc-Table
 * */
export let tableField = {
    sot: true, // 当内容过长被隐藏时显示 tooltip
}

/**
 * Dialog
 * */
export let dialogField = {
    title: '操作', // 默认名字
    width: '50%', // 宽度
    fullScreen: false, // 是否为全屏 Dialog
    top: '5%', // Dialog CSS 中的 margin-top 值
    modal: true, // 遮罩层
    lockScroll: true, // 是否在 Dialog 出现时将 body 滚动锁定
    openDelay: 0, // Dialog 打开的延时时间，单位毫秒
    closeDelay: 0, // Dialog 关闭的延时时间，单位毫秒
    closeOnClickModal: false, // 是否可以通过点击 modal 关闭 Dialog
    closeOnPressEscape: true, // 是否可以通过按下 ESC 关闭 Dialog
    showClose: false, // 是否显示关闭按钮
    draggable: false, // 是否显示关闭按钮
    overflow: false, // 拖动范围可以超出可视区
    center: false, // 是否让 Dialog 的 header 和 footer 部分居中排列
    alignCenter: false // 是否水平垂直对齐对话框
}

/**
 * Drawer
 * */
export let drawerField = {
    direction: 'rtl', //  打开的方向：'rtl' | 'ltr' | 'ttb' | 'btt'
    size: '35%', // 默认尺寸
    lockScroll: true, // 是否在 Drawer 出现时将 body 滚动锁定
    showClose: true, // 是否显示关闭按钮
    closeOnClickModal: true, // 是否可以通过点击 modal 关闭 Drawer
    closeOnPressEscape: true, // 是否可以通过按下 ESC 关闭 Drawer
    openDelay: 100, // Drawer 打开的延时时间，单位毫秒
    modal: true, // 是否需要遮罩层
    withHeader: false, // 控制是否显示 header 栏
    destroyOnClose: true // 控制是否在关闭 Drawer 之后将子元素全部销毁
}

/**
 * Tree
 * */
export let treeField = {
    emptyText: "暂无数据",
    nodeKey: "id", // 节点ID字段
    highlightCurrent: true, // 是否开启高亮选中功能
    defaultExpandAll: false, // 是否默认展开所有节点
    expandOnClickNode: false, // 是否在点击节点的时候展开或者收缩节点
    checkOnClickNode: false, // 是否在点击节点的时候选中节点
    autoExpandParent: true, // 如果为 true,在点击节点的时候将自动展开父节点
    showCheckbox: true, // 是否显示多选框
    checkStrictly: false, // 是否严格的遵循父子不互相关联的做法
    indent: 18, // 树节点的缩进宽度
    draggable: false, // 是否开启拖拽节点功能
    renderAfterExpand: true, // 是否在第一次展开某个树节点后才渲染其子节点
}

/**
 * Pop-confirm 气泡确认框
 * */
export let PopConfirmField = {
    title: "确定要删除吗？", // 标题
    confirmText: "确定", // 确认按钮文字
    confirmType: "danger", // 确认按钮类型
    cancelText: "取消", // 取消按钮文字
    cancelType: "text", // 取消按钮类型
    icon: "QuestionFilled", // 图标
    iconColor: "#f90", // 图标颜色
    hideColor: false, // 隐藏图标
    hideAfter: 200, // 关闭时的延迟
    width: 160, // 最小宽度
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * fc-table
 * */
export let fcTableField = {
    rowKey: "id",
    stripe: false, // 条纹
    border: true, // 边框
    pagination: true, // 翻页
    showBottomView: true, // 底部视图，设置false不展示按钮操作
    showRefreshBtn: true, // 刷新
    showColumnBtn: true, // 列设置
    showDownloadBtn: true, // 下载
    emptyText: "暂无数据", // 空数据显示内容
}

/**
 * fc-tree-filter
 * */
export let fcTreeFilterField = {
    name: "id",
    border: false, // 边框
    multiple: false, // 多选
    showSearch: false, // 过滤器
    showAll: false, // 是否新增全部选项
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * 时间范围选择器：el-date-picker
 * */

const shortcuts = [
    {
        text: '最近一周',
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 6); // 减去6
            return [start, end]
        },
    },
    {
        text: '最近一个月',
        value: () => {
            const end = new Date();
            let start = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate());
            if (start.getDate() !== end.getDate()) {
                start.setDate(0); // 如果当前日期不是该月最后一天，则调整为上个月的实际最后一天
            }
            return [start, end];
        },
    },
    {
        text: '最近六个月',
        value: () => {
            const end = new Date();
            let start = new Date(end.getFullYear(), end.getMonth() - 6, end.getDate());
            if (start.getDate() !== end.getDate()) {
                start.setDate(0); // 如果当前日期不是该月最后一天，则调整为上个月的实际最后一天
            }
            return [start, end];
        },
    },
    {
        text: '最近一年',
        value: () => {
            const end = new Date();
            let start = new Date(end.getFullYear(), end.getMonth() - 12, end.getDate());
            if (start.getDate() !== end.getDate()) {
                start.setDate(0); // 如果当前日期不是该月最后一天，则调整为上个月的实际最后一天
            }
            return [start, end];
        },
    },
];

export let dateRangePickerField = {
    size: "default",
    type: "daterange", // 日期类型
    format: "YYYY-MM-DD", // 显示日期格式
    valueFormat: "YYYY-MM-DD", // 绑定值日期格式
    editable: true, // 是否可输入
    clearable: true, // 清除按钮
    startPlaceholder: "起始日期",
    endPlaceholder: "结束日期",
    rangeSeparator: "至", // 日期区间的分隔符
    unlinkPanels: false, // 是否两个日期面板之间的联动
    shortcuts: shortcuts, // 快捷选项
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
