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
