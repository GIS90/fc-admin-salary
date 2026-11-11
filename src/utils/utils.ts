/**
 * @file utils.ts
 * @brief 
 *        
 * @date  Wed Nov 04 2026 17:19:30
 * @author PyGo²
 * @org   福建博思软件股份有限公司
 */

// 请求方式 → el-tag 类型映射（el-tag 只接受 primary/success/info/warning/danger）
const METHOD_TAG_TYPE: Record<string, "primary" | "success" | "info" | "warning" | "danger"> = {
    GET: "success",
    POST: "primary",
    PUT: "warning",
    PATCH: "info",
    DELETE: "danger"
};

/**
 * 根据请求方式获取 el-tag 的 type，未匹配到的默认 info
 * @param method 请求方式，如 GET / POST
 */
export function methodTagType(method?: string) {
    return METHOD_TAG_TYPE[(method || "").toUpperCase()] ?? "info";
}

// 图片标签颜色（按标签文本哈希取色，同一标签颜色固定）
const TAG_COLORS = ["primary", "success", "warning", "danger", "info"] as const;

/**
 * 图片标签 el-tag 颜色（按标签文本哈希取色，同一标签颜色固定）
 * @param tag 标签文本
 */
export function avatarTagColor(tag: string): typeof TAG_COLORS[number] {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
    }
    return TAG_COLORS[hash % TAG_COLORS.length];
}
