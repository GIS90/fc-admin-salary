// - - - - - - - - - - - - - - - - - - - - - [文档工具] - - - - - - - - - - - - - - - - - - - - - -
/**
 * PDF转WORD>基础模型
 */
export interface __Pdf2WordModelBase {
    md5: string;
    mode: boolean;
    start: number;
    end: number;
    pages: string;
}

/**
 * PDF转WORD>列表
 */
export interface Pdf2WordModelList extends __Pdf2WordModelBase {
    id: number;
    name: string;
    storeName: string;
    transferName: string;
    transfer: string;
    transferTime: string;
    storeUrl: string;
    transferUrl: string;
    createRtx: string;
    createTime: string;
}

/**
 * PDF转WORD>详情
 */
export interface Pdf2WordModelDetail extends __Pdf2WordModelBase {}