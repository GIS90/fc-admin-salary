import { ComponentPublicInstance, Ref } from "vue";
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import FcFilterTable from "@/components/fcFilterTable/index.vue";

/** 列筛选器配置 */
export interface ColumnFilterProps {
    type: "input" | "select" | "daterange" | "boolean" | "number";
    field?: string;
    options?: Array<{ label: string; value: any }>;
    placeholder?: string;
    multiple?: boolean;
    valueFormat?: string;
    shortcuts?: any[];
}

/** 以下是表格列设置类型 */
export type TypeProps = "index" | "selection" | "radio" | "expand" | "sort";

export interface ColumnProps<T = any>
    extends Partial<Omit<TableColumnCtx<T>, "type" | "children" | "renderCell" | "renderHeader">> {
    type?: TypeProps;
    tag?: boolean | Ref<boolean>;
    isHide?: boolean | Ref<boolean>;
    filter?: ColumnFilterProps;
}

export type FcFilterTableInstance = Omit<InstanceType<typeof FcFilterTable>, keyof ComponentPublicInstance>;
