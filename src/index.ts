import fs from 'fs';
import type { CatalogInfo, CatalogueInfoItem } from './types/CatalogueBySetId';
import type { CreateCatalogueResponse } from './types/CreateCatalogueResponse';
import type { CatalogueBySessionIDResponse } from './types/CatalogueByResponseId';

export interface ShopeeCatalogueCheckerOptions {
    cookies: string;
    urls: string[];
    batchSize?: number;
}

export class ShopeeCatalogueChecker {
    private cookies: string;
    private urls: string[];
    private batchSize: number;

    constructor(options: ShopeeCatalogueCheckerOptions) {
        this.cookies = options.cookies;
        this.urls = options.urls;
        this.batchSize = options.batchSize || 100;
    }

    private async getLastSessionId(): Promise<string> {
        const res = await fetch("https://creator.shopee.co.id/supply/api/lm/sellercenter/realtime/sessionList?page=1&pageSize=10&name=&orderBy=&sort=", {
            "headers": {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "language": "en",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-env": "live",
                "x-region": "id",
                "x-region-domain": "co.id",
                "x-region-timezone": "+0700",
                "x-traceid": "pNoJyQk-5XE9VFjYVN8QF",
                "cookie": this.cookies,
                "Referer": "https://creator.shopee.co.id/insight/live/list",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        }).then(async res => await res.json());
        return res.data.list[0].sessionId;
    }

    private async getCatalogueBySetId(set_id: string, sessionId: string): Promise<CatalogInfo> {
        const katalog = await fetch(`https://live.shopee.co.id/api/v1/session/${sessionId}/product_set/${set_id}`, {
            headers: {
                'Host': 'live.shopee.co.id',
                'Cookie': this.cookies,
                'content-type': 'application/json',
                'x-livestreaming-source': 'shopee',
                'user-agent': 'language=id app_type=1 platform=native_ios appver=34436 os_ver=18.1.1 Cronet/102.0.5005.61',
                'x-shopee-client-timezone': 'Asia/Jakarta',
                'client-info': 'device_id=8B5D93A4D9DF4BA8947303DF3CF62297;device_model=iPhone12%2C3;os=1;os_version=18.1.1;client_version=34436;platform=4;app_type=1;language=id',
                'accept': '*/*',
                'accept-language': 'id-ID,id,en-US,en'
            }
        });
        return await katalog.json();
    }

    private async createNewCatalogue(sessionId: string, name: string, items: { item_id: number; shop_id: number; }[]): Promise<CreateCatalogueResponse> {
        const create = await fetch(`https://live.shopee.co.id/api/v1/session/${sessionId}/product_set`, {
            method: 'POST',
            headers: {
                'Host': 'live.shopee.co.id',
                'Cookie': this.cookies,
                'content-type': 'application/json',
                'client-info': 'device_id=8B5D93A4D9DF4BA8947303DF3CF62297;device_model=iPhone12%2C3;os=1;os_version=18.1.1;client_version=34436;platform=4;app_type=1;language=id',
                'x-livestreaming-source': 'shopee',
                'user-agent': 'language=id app_type=1 platform=native_ios appver=34436 os_ver=18.1.1 Cronet/102.0.5005.61',
                'x-shopee-client-timezone': 'Asia/Jakarta',
                'accept': '*/*',
                'accept-language': 'id-ID,id,en-US,en'
            },
            body: JSON.stringify({
                'name': name,
                'items': items
            })
        }).then(res => res.json());
        return create;
    }

    private async deleteCatalogue(set_id: number, sessionId: string): Promise<any> {
        const deleteKatalog = await fetch(`https://live.shopee.co.id/api/v1/session/${sessionId}/product_set/${set_id}`, {
            method: 'DELETE',
            headers: {
                'Host': 'live.shopee.co.id',
                'Cookie': this.cookies,
                'content-type': 'application/json',
                'user-agent': 'language=id app_type=1 platform=native_ios appver=34436 os_ver=18.1.1 Cronet/102.0.5005.61',
                'x-sap-type': '2',
                'x-shopee-client-timezone': 'Asia/Jakarta',
                'client-info': 'device_id=8B5D93A4D9DF4BA8947303DF3CF62297;device_model=iPhone12%2C3;os=1;os_version=18.1.1;client_version=34436;platform=4;app_type=1;language=id',
                'accept': '*/*',
                'accept-language': 'id-ID,id,en-US,en'
            }
        }).then(res => res.json());
        return deleteKatalog;
    }

    private parseShopeeUrl(url: string) {
        const pattern = /\/product\/(\d+)\/(\d+)|i\.(\d+)\.(\d+)/;
        const match = url.match(pattern);

        if (match) {
            let shopId, itemId;

            if (match[1] && match[2]) {
                shopId = match[1];
                itemId = match[2];
            } else if (match[3] && match[4]) {
                shopId = match[3];
                itemId = match[4];
            } else {
                return null;
            }

            return { shop_id: shopId, item_id: itemId };
        }

        return null;
    }

    public async check(): Promise<CatalogueInfoItem[]> {
        const sessionId = await this.getLastSessionId();
        if (!sessionId) {
            throw new Error('Invalid cookies or no active session found');
        }

        const urlsChunks = this.urls.reduce<string[][]>((acc, url, index) => {
            const chunkIndex = Math.floor(index / this.batchSize);
            if (!acc[chunkIndex]) {
                acc[chunkIndex] = [];
            }
            acc[chunkIndex].push(url);
            return acc;
        }, []);

        let finalData: CatalogueInfoItem[] = [];
        await Promise.all(urlsChunks.map(async (urls, index) => {
            console.log(`Executing batch #${index + 1} of ${urlsChunks.length} urls`);

            const items = urls
                .map((url) => {
                    const parsed = this.parseShopeeUrl(url);
                    if (parsed) {
                        return {
                            item_id: parseInt(parsed.item_id),
                            shop_id: parseInt(parsed.shop_id),
                        };
                    }
                    return null;
                })
                .filter((item): item is { item_id: number; shop_id: number; } => item !== null);

            const randomString = Math.random().toString(36).substring(2, 8);
            const catalogue = await this.createNewCatalogue(sessionId, `Catalogue ${randomString}`, items);

            const catalogueBySetId = await this.getCatalogueBySetId(catalogue.data.set_id.toString(), sessionId);
            finalData.push(...catalogueBySetId.data.items);

            await this.deleteCatalogue(catalogue.data.set_id, sessionId);
        }));

        return finalData;
    }
}

// Example usage
if (require.main === module) {
    const cookies = fs.readFileSync('cookies.txt', 'utf8');
    const urls = fs.readFileSync('urls.txt', 'utf8').split('\n');

    const checker = new ShopeeCatalogueChecker({ cookies, urls });
    checker.check().then(data => {
        console.log(data);
    }).catch(error => {
        console.error('Error:', error);
    });
} 