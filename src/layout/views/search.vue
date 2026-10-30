<template>
    <div class="fc-search">
        <!--搜索框-->
        <div class="fc-search-head">
            <el-input ref="searchInputRef" v-model="searchStr" class="fc-search-input"
                placeholder="输入内容、支持按首字母搜索" size="large" prefix-icon="Search" :trigger-on-focus="false"
                @input="inputChange" />
            <div class="fc-search-close" @click="emit('close')">
                <el-icon>
                    <Close />
                </el-icon>
            </div>
        </div>

        <!--内容区-->
        <div class="fc-search-body">
            <!--搜索历史-->
            <div class="fc-search-result" v-if="searchStore.list.length > 0 && !searchStr">
                <div class="fc-search-history-label">搜索历史</div>
                <ul>
                    <el-scrollbar max-height="366px" always>
                        <li v-for="(item, index) in searchStore.list" :key="item.path"
                            :class="{ 'is-active': index === activeIndex }" @mouseenter="activeIndex = index"
                            @click="selectMenu(item)">
                            <el-icon>
                                <component :is="item.meta.icon || 'Memo'" />
                            </el-icon>
                            <span class="title">{{ item.meta.title }}</span>
                            <div class="fc-search-item-actions" @click.stop>
                                <el-tooltip content="复制链接" placement="top">
                                    <el-icon class="action-icon" @click="copyLink(item)">
                                        <Link />
                                    </el-icon>
                                </el-tooltip>
                                <el-tooltip content="新窗口打开" placement="top">
                                    <el-icon class="action-icon" @click="openNewWindow(item)">
                                        <TopRight />
                                    </el-icon>
                                </el-tooltip>
                            </div>
                            <el-icon class="close-icon" @click.stop="historyClose(index)">
                                <Close />
                            </el-icon>
                        </li>
                    </el-scrollbar>
                </ul>
            </div>
            <!--搜索结果-->
            <div class="fc-search-result" v-else-if="searchStr">
                <div class="fc-search-empty" v-if="result.length <= 0">
                    <p>暂无搜索结果</p>
                </div>
                <ul v-else>
                    <el-scrollbar max-height="366px" always>
                        <li v-for="(item, index) in result" :key="item.path"
                            :class="{ 'is-active': index === activeIndex }" @mouseenter="activeIndex = index"
                            @click="selectMenu(item)">
                            <el-icon>
                                <component :is="item.meta.icon || 'Memo'" />
                            </el-icon>
                            <span class="title">{{ item.meta.title }}</span>
                            <div class="fc-search-item-actions" @click.stop>
                                <el-tooltip content="复制链接" placement="top">
                                    <el-icon class="action-icon" @click="copyLink(item)">
                                        <Link />
                                    </el-icon>
                                </el-tooltip>
                                <el-tooltip content="新窗口打开" placement="top">
                                    <el-icon class="action-icon" @click="openNewWindow(item)">
                                        <TopRight />
                                    </el-icon>
                                </el-tooltip>
                            </div>
                        </li>
                    </el-scrollbar>
                </ul>
            </div>
            <!--空状态-->
            <div class="fc-search-empty" v-else>
                <el-icon class="fc-search-empty-icon">
                    <Search />
                </el-icon>
                <p>输入搜索关键字开始搜索吧~</p>
            </div>
        </div>

        <!--快捷键提示-->
        <div class="fc-search-footer">
            <span class="fc-search-command"><kbd>↵</kbd>选择</span>
            <span class="fc-search-command"><kbd>
                    <el-icon>
                        <TopRight />
                    </el-icon>
                </kbd>新窗口</span>
            <span class="fc-search-command"><kbd>↑</kbd><kbd>↓</kbd>切换</span>
            <span class="fc-search-command"><kbd>ESC</kbd>退出</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import type { ElInput } from "element-plus";
import { useMenuStore } from "@/store/modules/menu";
import { useSearchStore } from "@/store/modules/search";
import { useAuthStore } from "@/store/modules/auth";
import { ElMessage } from "element-plus";
import menuTool from "@/utils/menuRoute"
import router from '@/router'
import { staticRoutes } from '@/router';

const emit = defineEmits(['selectMenu', 'close'])

const menuStore = useMenuStore()
const searchStore = useSearchStore()
const authStore = useAuthStore()
const searchStr = ref('')
const menuList = ref<Menu.MenuOptions[]>([])
const result = ref<Menu.MenuOptions[]>([])
const searchInputRef = ref<InstanceType<typeof ElInput>>();
const activeIndex = ref(0); // 键盘选中项下标

// 当前可操作列表：有输入时为搜索结果，否则为搜索历史
const currentList = computed<Menu.MenuOptions[]>(() => {
    return searchStr.value ? result.value : searchStore.list
})

onMounted(() => {
    filterMenu()
    nextTick(() => {
        searchInputRef.value!.focus()
    })
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

// 上下键切换、回车选择
const handleKeydown = (e: KeyboardEvent) => {
    const list = currentList.value;
    if (!list || list.length === 0) return;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex.value = (activeIndex.value + 1) % list.length;
        scrollActiveIntoView();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex.value = (activeIndex.value - 1 + list.length) % list.length;
        scrollActiveIntoView();
    } else if (e.key === 'Enter') {
        const item = list[activeIndex.value];
        if (item) {
            e.preventDefault();
            selectMenu(item);
        }
    }
};

// 选中项滚动到可视区域
const scrollActiveIntoView = () => {
    nextTick(() => {
        const el = document.querySelector('.fc-search-result li.is-active') as HTMLElement | null;
        el?.scrollIntoView({ block: 'nearest' });
    })
};

const filterMenu = () => {
    let staticMenu: Menu.MenuOptions[] = []
    staticRoutes.forEach(item => {
        if (item.meta?.isHide || item.meta?.type == 'BUTTON') return false
        if (item.meta?.role && !item.meta.role.some(role => authStore.userInfo.roles?.includes(role))) return false;
        const menuOptions: Menu.MenuOptions | null = {
            path: item.path,
            name: item.name as string,
            meta: {
                ...item.meta,
            } as Menu.MetaProps,
        };
        staticMenu.push(menuOptions)
    })
    let apiMenu = menuTool.getFlatMenuList(menuStore.list)
    menuList.value = [...staticMenu, ...apiMenu]
}

const inputChange = (value: string) => {
    activeIndex.value = 0;
    if (value) {
        result.value = findRoutesByTitleKeyword(value)
    } else {
        result.value = []
    }
}

function findRoutesByTitleKeyword(keyword: string): Menu.MenuOptions[] {
    return menuList.value.filter((route) => route.meta.title.includes(keyword));
}

const selectMenu = (item: Menu.MenuOptions) => {
    if (!searchStore.list.some(historyItem => historyItem.name === item.name)) {
        searchStore.list.push(item)
    }
    // 先关闭弹窗，再执行跳转
    emit('selectMenu')
    if (item.meta.type == 'LINK') {
        setTimeout(() => {
            let a = document.createElement("a") as HTMLAnchorElement;
            a.style.display = "none"
            a.target = "_blank"
            a.href = item.path
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        }, 10);
        return
    }
    router.push({ path: item.path })
}

// 菜单完整访问地址
const resolveMenuUrl = (item: Menu.MenuOptions) => {
    if (/^(https?:)?\/\//.test(item.path)) return item.path;
    return `${location.origin}${location.pathname}#${item.path}`;
};

// 复制菜单链接
const copyLink = async (item: Menu.MenuOptions) => {
    const url = resolveMenuUrl(item);
    try {
        await navigator.clipboard.writeText(url);
    } catch {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    }
    ElMessage.success("链接已复制");
};

// 新窗口打开菜单
const openNewWindow = (item: Menu.MenuOptions) => {
    window.open(resolveMenuUrl(item), "_blank");
};

const historyClose = (index: number) => {
    searchStore.list.splice(index, 1);
}
</script>

<style scoped>
.fc-search {
    display: flex;
    flex-direction: column;
}

/* 搜索框 */
.fc-search-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
}

.fc-search-input {
    flex: 1;
}

.fc-search-input :deep(.el-input__wrapper) {
    padding: 0;
    background: transparent;
    box-shadow: none;
}

.fc-search-input :deep(.el-input__inner) {
    height: 40px;
    font-size: 16px;
}

.fc-search-input :deep(.el-input__prefix) {
    margin-right: 10px;
    font-size: 18px;
    color: var(--el-text-color-placeholder);
}

.fc-search-close {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    background: var(--el-fill-color-light);
    border-radius: 8px;
    transition: background-color 0.2s;
}

.fc-search-close:hover {
    color: var(--el-text-color-regular);
    background: var(--el-fill-color);
}

/* 内容区 */
.fc-search-body {
    min-height: 260px;
    padding: 0 20px;
}

.fc-search-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 260px;
    color: var(--el-text-color-placeholder);
}

.fc-search-empty-icon {
    font-size: 52px;
    color: var(--el-text-color-placeholder);
}

.fc-search-empty p {
    margin-top: 16px;
    font-size: 14px;
    color: var(--el-text-color-placeholder);
}

/* 结果 / 历史 */
.fc-search-result {
    margin-top: 15px;
}

.fc-search-history-label {
    margin: 15px 0;
    font-size: 14px;
    color: var(--el-text-color-regular);
}

.fc-search-result li {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 15px;
    margin-bottom: 5px;
    font-size: 14px;
    list-style: none;
    cursor: pointer;
    background: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
}

.fc-search-result li i {
    margin-right: 15px;
    font-size: 20px;
}

/* 行内操作：复制链接 / 新窗口 */
.fc-search-item-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
}

.fc-search-item-actions .action-icon {
    padding: 8px;
    font-size: 36px;
    color: var(--el-text-color-placeholder);
    background: var(--el-fill-color-light);
    border-radius: 50%;
    transition: color 0.2s, background-color 0.2s;
}

.fc-search-item-actions .action-icon:hover {
    color: var(--el-color-primary);
    background: var(--el-fill-color);
}

.fc-search-result li:hover {
    color: #fff;
    background: var(--el-color-primary);
    border-color: var(--el-color-primary);
}

.fc-search-result li.is-active {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-5);
}

.fc-search-result .close-icon {
    margin-left: 10px;
    font-size: 15px;
}

.fc-search-command kbd .el-icon {
    font-size: 12px;
}

/* 快捷键提示 */
.fc-search-footer {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 12px 20px;
    border-top: 1px solid var(--el-border-color-lighter);
}

.fc-search-command {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
}

.fc-search-command kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    font-family: inherit;
    font-size: 12px;
    color: var(--el-text-color-regular);
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 6px;
}
</style>
