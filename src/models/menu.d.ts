declare namespace Menu {
    interface MenuOptions {
        /** 路由访问路径 */
        path: string;
        /** 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选) */
        name: string;
        /** 路由重定向地址 */
        redirect?: string;
        /** 视图文件路径 */
        component?: string | (() => Promise<unknown>);
        /** 菜单级别 */
        level?: number;
        /** 菜单顺序 */
        orderId?: number;
        /** 路由元信息 */
        meta: MetaProps;
        /** 多级路由嵌套 */
        children?: MenuOptions[];
    }

    interface MetaProps {
        /** 菜单和面包屑对应的图标 */
        icon?: string;
        /** 路由标题 (用作 document.title || 菜单的名称) */
        title: string;
        /** 菜单栏高亮,默认激活菜单的 index */
        active?: string;
        /** 此菜单类型，MENU=菜单，LINK=外链，BUTTON=按钮 */
        type: string;
        /** 是否在菜单中隐藏 */
        isHide?: boolean;
        /** 菜单是否全屏 (示例：数据大屏页面) */
        isFull?: boolean;
        /** 菜单是否固定在标签页中 (首页通常是固定项) */
        isAffix?: boolean;
        /** 是否缓存路由 */
        isKeepAlive?: boolean;
        /** 面包屑菜单中是否显示 */
        isBreadcrumb?: boolean;
        /** 标签，会在菜单栏中显示红色角标 */
        tag?: string;
        /** 角色权限 */
        role?: [];
    }

    interface MenuBaseFlat {
        /** PID */
        pid: number | undefined;
        /** 路由访问路径 */
        path: string;
        /** 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选) */
        name: string;
        /** 路由重定向地址 */
        redirect?: string;
        /** 视图文件路径 */
        component?: string | (() => Promise<unknown>);
        /** 菜单级别 */
        level?: number;
        /** 菜单顺序 */
        orderId?: number;
        /** 菜单和面包屑对应的图标 */
        icon?: string;
        /** 路由标题 (用作 document.title || 菜单的名称) */
        title: string;
        /** 菜单栏高亮,默认激活菜单的 index */
        active?: string;
        /** 此菜单类型，MENU=菜单，LINK=外链，BUTTON=按钮 */
        type: string;
        /** 是否在菜单中隐藏 */
        isHide?: boolean;
        /** 菜单是否全屏 (示例：数据大屏页面) */
        isFull?: boolean;
        /** 菜单是否固定在标签页中 (首页通常是固定项) */
        isAffix?: boolean;
        /** 是否缓存路由 */
        isKeepAlive?: boolean;
        /** 面包屑菜单中是否显示 */
        isBreadcrumb?: boolean;
        /** 标签，会在菜单栏中显示红色角标 */
        tag?: string;
    }

    interface MenuFlat extends MenuBaseFlat {
        /** ID */
        id: number;
        /** 菜单MD5 */
        md5: string;
    }
}
