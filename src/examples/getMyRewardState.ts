import { managerStrings } from "../contractStrings"
import { newAlgofiMainnetClient } from "../v1/client"
import * as sdk from "./../index";

(async function () {
    const client = await sdk.newAlgofiMainnetClient();
    const utils = require("./exampleUtils")
    const address = "put ur addy here"
    const userState = await client.getUserState(address);
    // console.log(userState.storageAddress) //algofi makes you an addy for storage
    await utils.printUserState(client, "markets", address)
    console.log(await client.manager.rewardsProgram.getStorageUnrealizedRewards(userState.storageAddress, client.manager,
        [client.markets["USDC"], client.markets["ALGO"], client.markets["STBL"]]))
    await sdk.readGlobalState(client.algod, "3EPGHSNBBN5M2LD6V7A63EHZQQLATVQHDBYJQIZ6BLCBTIXA5XR7ZOZEB4", client.manager.managerAppId)
})()

  // new TextEncoder().encode("Manager: Claim r").forEach(i => console.log(i.toString(16)))
  // new TextDecoder().decode()
