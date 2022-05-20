import * as sdk from "./../index"
(async function () {
    const client = await sdk.newAlgofiMainnetClient();
    const rewardsProgram = client.manager.rewardsProgram;
    console.log(rewardsProgram)
    console.log(`Reward days remaning:`, rewardsProgram.rewardsAmount / rewardsProgram.rewardsPerSecond / 60 / 60 / 24);
    let accounts = [];
    let next = null;
    while (true) {
        const appData = await client.indexerClient.searchAccounts().exclude("assets,created-assets").applicationID(465818260).nextToken(next).do();
        console.log(accounts.length);
        next = appData['next-token'];
        accounts = accounts.concat(appData.accounts);
        if (!next) {
            break;
        }
        await sleep(200);
    }
    const userPendingRewardsKey = uint8ToB64(textToUint8("upr"));
    console.log(`final accounts length`, accounts.length);
    const algoFiLocalStates = accounts.map(account => account['apps-local-state']?.find(thing => thing.id === 465818260));
    const allUsersPendingRewardsKvp = algoFiLocalStates.filter(Boolean).map(thing => thing['key-value']?.find(entry => entry.key === userPendingRewardsKey));
    console.log(`this many Algos are already reserved:`, allUsersPendingRewardsKvp.filter(Boolean).reduce((acc, curr) => acc + curr.value.uint, 0) / 1e6);
})()

const sleep = (time) => new Promise(res => setTimeout(res, time))

export const atob = globalThis.atob || ((src: string) => {
    return Buffer.from(src, 'base64').toString('binary');
})

export const btoa = globalThis.btoa || ((src: string) => {
    return Buffer.from(src, 'binary').toString('base64');
})

export function b64ToUint8(b64: string): Uint8Array {
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

export function textToUint8(text: string): Uint8Array {
    return Uint8Array.from(text, c => c.charCodeAt(0));
}

export function uint8ToB64(bytes: Uint8Array): string {
    return btoa(uint8ToBinaryString(bytes));
}

export function uint8ToBinaryString(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => String.fromCharCode(b)).join('');
}