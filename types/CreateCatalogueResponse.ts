export interface CreateCatalogueResponse {
    err_code: number;
    err_msg:  string;
    data:     CreateCatalogueData
}

export interface CreateCatalogueData {
    set_id: number;
}
