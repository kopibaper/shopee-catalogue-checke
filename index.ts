import fs from 'fs';
import { CatalogueBySessionIDResponse } from './types/CatalogueByResponseId';
import { CatalogInfo, CatalogueInfoItem } from './types/CatalogueBySetId';
import { CreateCatalogueResponse } from './types/CreateCatalogueResponse';
// get cookies from 'cookies.txt' on current directory
const cookies = fs.readFileSync('cookies.txt', 'utf8');
const urls = fs.readFileSync('urls.txt', 'utf8').split('\n');
// get all urls from 'urls.txt' on current directory

const parseShopeeUrl = (url: string) => {
    // Define the regex pattern to extract shop_id and item_id
    const pattern = /\/product\/(\d+)\/(\d+)|i\.(\d+)\.(\d+)/;

    // Match the pattern against the URL
    const match = url.match(pattern);

    if (match) {
        let shopId, itemId;

        // Extract shop_id and item_id based on the matched groups
        if (match[1] && match[2]) {
            // Matched "/product/{shop_id}/{item_id}"
            shopId = match[1];
            itemId = match[2];
        } else if (match[3] && match[4]) {
            // Matched "i.{shop_id}.{item_id}"
            shopId = match[3];
            itemId = match[4];
        } else {
            return null; // Return null if no valid match is found
        }

        // Return the parsed values as an object
        return { shop_id: shopId, item_id: itemId };
    }

    // If no match is found, return null
    return null;
}


const createNewCatalogue = async (sessionId: string, cookies: string, name: string, items: { item_id: number; shop_id: number; }[]) => {
    const create = await fetch(`https://live.shopee.co.id/api/v1/session/${sessionId}/product_set`, {
        //  const create = await fetch("https://47d17093-af69-41d9-9eb7-ee2d576c15d8.mock.pstmn.io", {
        method: 'POST',
        headers: {
            'Host': 'live.shopee.co.id',
            'Cookie': cookies,
            'content-type': 'application/json',
            // 'af-ac-enc-sz-token': 'ShsFVQ6OO+d6g3Fsi3mdDg==|BDrGgGp2+GA3BXOAxRL+tMCsPqUO9Kf33SUrzjWDcI0FZNE1R9b6c+bdrP53jYdjwFCVPGx7qFCD+r+sUhJJCg==|MsCrBkvAHDDcji6f|08|2',
            'client-info': 'device_id=8B5D93A4D9DF4BA8947303DF3CF62297;device_model=iPhone12%2C3;os=1;os_version=18.1.1;client_version=34436;platform=4;app_type=1;language=id',
            // 'f90717df': 'NK0HtxTow6w0yd3rsXKdm1dUpSb=',
            // 'd40d773': 'aDcUquE4zwcFohbxIRJWBeK3exw=',
            // '47a4c600': 'HWsDY9CNc7fI0w8nqj++iEo4Say=',
            // 'x-sap-type': '2',
            'x-livestreaming-auth': 'ls_ios_v1_20001_1740067943_8B5D93A4D9DF4BA8947303DF3CF62297-1740067943488-892551|bHT9tda0H0JxoHST748Hpf0ucTgrZj0CFlSCh6leRwE=',
            // 'x-ls-sz-token': 'ShsFVQ6OO+d6g3Fsi3mdDg==|BDrGgGp2+GA3BXOAxRL+tMCsPqUO9Kf33SUrzjWDcI0FZNE1R9b6c+bdrP53jYdjwFCVPGx7qFCD+r+sUhJJCg==|MsCrBkvAHDDcji6f|08|2',
            // 'client-request-id': '6050bffa-c67c-4bb7-92b4-7b7d0c1028b3.3511',
            'x-livestreaming-source': 'shopee',
            'user-agent': 'language=id app_type=1 platform=native_ios appver=34436 os_ver=18.1.1 Cronet/102.0.5005.61',
            // '57ee0b33': 'pLTqGc0RejjsY1QTmZ5H/toFKvO/plunVYzoq3jjmCSTLGoeJu2LOHggRe1PAQeGkSz4+FTyEdAijrXcW4s9jjcJBDacVVOQ5kT/jVpJsz7LWZxFw2F4HNndm6cZ5JTz5j8uEkOragESprirVOWPxVAc8FKijAtvHtFa2JXD3t8tUaIL0wRO3ka5SZlNgFJECMffgdB9Gn4bP+w5/4XXA2xEQoROx9pNR6WlD4PynxTftXKj+IEkUB76D16MfhMQ2Dh5ffkMoq6AGO3ZrQrRzmkTAAfkJDbWHX5Fac/ybAvD6z9NVq8oMBMGclXMtQyo//OpM4Ksi+1bABBCeaDNsu5JxC49kgYgpER00gMgQDuQP4AajNRzrS8/TyCgvKU93sJ0UAfozzMd8hlMvXPQLT8fF/wXiQgDFbVi7uwWiNxBiVpED25GNEv9nP+Mg0KTwnhcpMn3+f+mQ128iyliVf/wH+3vNwygyJOtg/g1GfwCIEtWiQImP/S67zSpZ06HKSpiFmXcn4uq5DaCkfBdipg0O9ov8gDl68Ci9vVsRSteTN5WAVDk22T3CxYX+o7Xuyo/e43iMadZWwdw2z8u6E/8CuosCRo8P/l8Z2vPc2Ljy5Fci9rbhmTIo4SuTztKNiO/Y2yV9uD3utc3lHuvU0lMHOkGgN9Z+8C0Hbew4Sdz1RcH4ElAh0aT8nO=',
            'x-shopee-client-timezone': 'Asia/Jakarta',
            // 'x-sap-ri': '6754b767f14622a2c525c52101bf81a02a085cda4cc1d07ad67a',
            'accept': '*/*',
            'accept-language': 'id-ID,id,en-US,en'
        },
        body: JSON.stringify({
            'name': name,
            'items': items
        })
    }).then(res => res.json())


    return create
}

// step 1: get last session Id using cookeis 
const getLastSessionId = async (cookies: string) => {
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
            "cookie": cookies,
            "Referer": "https://creator.shopee.co.id/insight/live/list",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    }).then(async res => await res.json());
    return res.data.list[0].sessionId;

}

const deleteCatalogue = async (set_id: number, sessionId: string, cookies: string) => {
    const deleteKatalog = await fetch(`https://live.shopee.co.id/api/v1/session/${sessionId}/product_set/${set_id}`, {
        method: 'DELETE',
        headers: {
            'Host': 'live.shopee.co.id',
            'Cookie': cookies,
            // 'x-ls-sz-token': 'ShsFVQ6OO+d6g3Fsi3mdDg==|BDrGgGp2+GA3BXOAxRL+tMCsPqUO9Kf33SUrzjWDcI0FZNE1R9b6c+bdrP53jYdjwFCVPGx7qFCD+r+sUhJJCg==|MsCrBkvAHDDcji6f|08|2',
            'content-type': 'application/json',
            // 'client-request-id': 'b716f9ab-9229-4f90-8d32-a72e4105cc31.5032',
            // 'x-livestreaming-source': 'shopee',
            // 'x-livestreaming-auth': 'ls_ios_v1_20001_1740070415_8B5D93A4D9DF4BA8947303DF3CF62297-1740070415114-886477|rHjyCp5fnFypXhm1aga88YiPCH+mZ55Joz+gB5tQN8c=',
            'user-agent': 'language=id app_type=1 platform=native_ios appver=34436 os_ver=18.1.1 Cronet/102.0.5005.61',
            'x-sap-type': '2',
            // 'af-ac-enc-sz-token': 'ShsFVQ6OO+d6g3Fsi3mdDg==|BDrGgGp2+GA3BXOAxRL+tMCsPqUO9Kf33SUrzjWDcI0FZNE1R9b6c+bdrP53jYdjwFCVPGx7qFCD+r+sUhJJCg==|MsCrBkvAHDDcji6f|08|2',
            'x-shopee-client-timezone': 'Asia/Jakarta',
            'client-info': 'device_id=8B5D93A4D9DF4BA8947303DF3CF62297;device_model=iPhone12%2C3;os=1;os_version=18.1.1;client_version=34436;platform=4;app_type=1;language=id',
            'accept': '*/*',
            'accept-language': 'id-ID,id,en-US,en'
        }
    }).then(res => res.json())


    return deleteKatalog
}
// get catalogue from sessionId

const getCatalogue = async (sessionId: string, cookies: string) => {
    const headers = {
        'Host': 'live.shopee.co.id',
        'Cookie': cookies,
        'referer': 'https://live.shopee.co.id/p/product-select?session=119800737&from_source=create%20stream',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Beeshop locale=id version=34436 appver=34436 rnver=1740046106 shopee_rn_bundle_version=6046007 Shopee language=id app_type=1 platform=web_ios os_ver=18.1.1',
        'x-livestreaming-source': 'shopee',
        'sec-fetch-dest': 'empty',
        'client-info': 'os=1;platform=6;scene_id=17;language=id;device_id=8B5D93A4D9DF4BA8947303DF3CF62297'
    };

    const response = await fetch(`https://live.shopee.co.id/api/v1/session/${sessionId}/product_set?keyword=&offset=0&limit=10`, { headers });
    return await response.json();
}

const getCatalogueBySetId = async (set_id: string, sessionId: string, cookies: string) => {
    const katalog = await fetch(`https://live.shopee.co.id/api/v1/session/${sessionId}/product_set/${set_id}`, {
        headers: {
            'Host': 'live.shopee.co.id',
            'Cookie': cookies,
            'content-type': 'application/json',

            'x-livestreaming-source': 'shopee',
            'user-agent': 'language=id app_type=1 platform=native_ios appver=34436 os_ver=18.1.1 Cronet/102.0.5005.61',
            'x-shopee-client-timezone': 'Asia/Jakarta',
            // 'x-sap-ri': '8a54b7670f3213da29f514200157358d7afdd410918b223c286c',
            'accept': '*/*',
            'accept-language': 'id-ID,id,en-US,en'
        }
    });
    const data: CatalogInfo = await katalog.json()
    return data
}
const main = async () => {
    // checking if cookies is valid
    const sessionId = await getLastSessionId(cookies);
    if (!sessionId) {
        console.log('Cookies is invalid');
        return;
    }
    const catalogue: CatalogueBySessionIDResponse = await getCatalogue(sessionId, cookies);

    //split urls by 100

    const urlsChunks = urls.reduce<string[][]>((acc, url, index) => {
        const chunkIndex = Math.floor(index / 100);
        if (!acc[chunkIndex]) {
            acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(url);
        return acc;
    }, []);
    let finalData: CatalogueInfoItem[] = []
    await Promise.all(urlsChunks.map(async (urls, index) => {
        console.log(`Executing batch #${index + 1} of ${urlsChunks.length} urls`);

        // create new catalogue based on current urls
        const items = urls
            .map((url) => {
                const parsed = parseShopeeUrl(url);
                if (parsed) {
                    return {
                        item_id: parseInt(parsed.item_id),
                        shop_id: parseInt(parsed.shop_id),
                    } as const;
                }
                return null;
            })
            .filter((item): item is { item_id: number; shop_id: number; } => item !== null);
        //create catalogue  
        // limit to 6 character
        const randomString = Math.random().toString(36).substring(2, 8);
        const catalogue: CreateCatalogueResponse = await createNewCatalogue(sessionId, cookies, `Catalogue ${randomString}`, items);
        // console.log(catalogue);

        //get catalogue by set id
        const catalogueBySetId: CatalogInfo = await getCatalogueBySetId(catalogue.data.set_id.toString(), sessionId, cookies);
        // save data to sample folder
        // fs.writeFileSync(`sample/${catalogue.data.set_id}.json`, JSON.stringify(catalogueBySetId, null, 2));

        // push catalogueBySetId.data.items to finalData
        finalData.push(...catalogueBySetId.data.items);
        // console.log(catalogueBySetId);

        //clean up
        const tryDelete = await deleteCatalogue(catalogue.data.set_id, sessionId, cookies);
        // console.log(tryDelete);
    }));

    console.log(finalData);
}

main();