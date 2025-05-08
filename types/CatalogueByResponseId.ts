export interface CatalogueBySessionIDResponse {
    err_code: number;
    err_msg: string;
    data: CatalogueBySessionIDItem;
}

export interface CatalogueBySessionIDItem {
    total: number;
    has_more: boolean;
    set: CatalogueBySessionIDItemSet[];
    max_set: number;
    max_set_size: number;
}

export interface CatalogueBySessionIDItemSet {
    set_id: number;
    uid: number;
    name: string;
    cnt: number;
    has_in_fulfillment_free_sample: boolean;
    has_expired_campaign: boolean;
}
