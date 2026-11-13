/**
 * @file cache.ts
 * @brief localStorage 通用缓存方法（key 由调用方传入）
 *
 * @date  Fri Nov 13 2026 17:43:21
 * @author PyGo²
 * @org   福建博思软件股份有限公司
 */

/**
 * @description 读取本地缓存
 * @param {String} key 缓存键
 * @return {String | null} 缓存值（不存在或存储不可用时返回 null）
 * */
export const getCache = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        return null;
    }
};

/**
 * @description 写入本地缓存
 * @param {String} key 缓存键
 * @param {String} value 缓存值
 * @return void
 * */
export const setCache = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        // 存储不可用（隐私模式/空间不足）时静默失败
    }
};

/**
 * @description 移除本地缓存
 * @param {String} key 缓存键
 * @return void
 * */
export const removeCache = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        // 存储不可用时静默失败
    }
};
