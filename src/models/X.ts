/**
 * ENUM枚举
 */
export interface OptionEnumModel {
    label: string;
    value: string;
    disabled: boolean;
}

export type OptionEnumModelList = OptionEnumModel[];

export interface OptionExtendEnumModel extends OptionEnumModel {
    name: string;
    md5: string;
    desc: string;
}

export interface GroupOptionEnumModel {
    label: string;
    options: OptionExtendEnumModel[];
}

/**
 * 通用模型
 */
export interface PageableModel {
    page: number;
    pageSize: number;
}

export interface RequestStatusModel {
    md5: string;
    value: boolean;
}

export interface RequestMd5Model {
    md5: string;
}

export interface RequestMd5Models {
    md5: string[];
}

export interface RequestIDModel {
    id: (string | number)[];
}

export interface RequestIDModels {
    id: (string | number)[];
}

export interface FormDownloadModel {
    name: string;
    type: string;
    format: string;
}

export interface RequestDownloadModel {
    api: string;
    name: string;
    type: string;
    md5: string[];
}
