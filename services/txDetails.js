const axios = require("axios");
const { default: BigNumber } = require("bignumber.js");
const fs = require("fs");
const { subgraphs } = require("./common");

const apiKey = process.env.ETHERSCAN_API_KEY;

const mevBuilders = [
  "0x5F927395213ee6b95dE97bDdCb1b2B1C0F16844F",
  "0xc9D945721ed37c6451E457b3C7F1e0ceC42417fb",
  "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
  "0x7aDc0e867EBc337E2d20c44DB181c067fA08637b",
  "0x965Df5Ff6116C395187E288e5C87fb96CfB8141c",
  "0xf573d99385C05c23B24ed33De616ad16a43a0919",
  "0xF2f5C73fa04406b1995e397B55c24aB1f3eA726C",
  "0x199D5ED7F45F4eE35960cF22EAde2076e95B253F",
  "0x3b64216AD1a58f61538b4fA1B27327675Ab7ED67",
  "0xbd3Afb0bB76683eCb4225F9DBc91f998713C3b01",
  "0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990",
  "0xAAB27b150451726EC7738aa1d0A94505c8729bd1",
  "0xFeebabE6b0418eC13b30aAdF129F5DcDd4f70CeA",
  "0x5124fcC2B3F99F571AD67D075643C743F38f1C34",
  "0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5",
  "0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a",
  "0xc83dad6e38BF7F2d79f2a51dd3C4bE3f530965D6",
  "0x7316b4E0f0D4B19b4aC13895224cD522D785e51D",
  "0xd2090025857B9C7B24387741f120538E928A3a59",
  "0x57865ba267D48671A41431F471933aEC32a7c7d1",
  "0x000E633ddeF00DA46aBd5044779257a64ead9bce",
  "0x036C9c0aaE7a8268F332bA968dac5963c6aDAca5",
  "0x089780A88f35B58144Aa8a9BE654207A1aFe7959",
  "0x0Aa8EBb6aD5A8e499E550ae2C461197624c6e667",
  "0x0b1Ddf6D1DA69532Ad4198470679b0b49176c68f",
  "0x11a8961fbD55e67Fe4Ab99c7ca47616Dcf3D0010",
  "0x1324c0fB6F45f3bF1AAA1fCdC08f17431F53DeD7",
  "0x14F1a856A821B3CE5F59d3bA813D614546125C15",
  "0x185A5012067d8F0f6ab2de1C78B96f15Aa552043",
  "0x195d0F5F00833bcE2F40920DE0DB1D92a8808886",
  "0x1B63142628311395CEaFeEa5667e7C9026c862Ca",
  "0x1b887Aa026f7A90a0f7173C2f0722d263c7CeC45",
  "0x1d0124FeE8Dbe21884Ab97adCCBF5C55d768886e",
  "0x1e54945FBf1872e34D76B7d72151B861704Df8B2",
  "0x229b8325bb9Ac04602898B7e8989998710235d5f",
  "0x25D88437dF70730122b73Ef35462435d187C466f",
  "0x29F94b27Fe0B410e4546b6021E4044ff985dc252",
  "0x333333f332a06ECB5D20D35da44ba07986D6E203",
  "0x3Bee5122E2a2FbE11287aAfb0cB918e22aBB5436",
  "0x3b7fAEc3181114A99c243608BC822c5436441FfF",
  "0x3B6c26116749a6F9D194172d56299377E61bB0aE",
  "0x3c496DF419762533607f30BB2143aFF77bEBc36A",
  "0x3Ca601b21D62790308298E3274Fd852669Fdfc08",
  "0x3E3753491f224571dd8d7E925B73cc685ab0aae4",
  "0x418211EFaf54e6A9b376f6Bfd9E0AE304E064CBb",
  "0x4675C7e5BaAFBFFbca748158bEcBA61ef3b0a263",
  "0x473780deAF4a2Ac070BBbA936B0cdefe7F267dFc",
  "0x47fE0AEe392D59Ccaa7Cc3B162F629eCb0f2671F",
  "0x4A55474EACb48CEFe25D7656Db1976AA7AE70E3C",
  "0x5416f0dd6C29bFF6a4f32BaFB5c5dA6365472973",
  "0xd1A0b5843F384f92a6759015c742fc12d1d579a1",
  "0xcDBF58a9A9b54a2C43800c50C7192946dE858321",
  "0xcDA9D71bdfAe59b89Cee131eD3079f8AC4c77062",
  "0xC4b7a6008d8e2C2E1b5F8B743E71d2c0495cd777",
  "0xc1612dc56C3E7e00D86c668dF03904B7E59616C5",
  "0xBaF6dC2E647aeb6F510f9e318856A1BCd66C5e19",
  "0xb646D87963Da1FB9D192Ddba775f24f33e857128",
  "0xb4c9E4617a16Be36B92689b9e07e9F64757c1792",
  "0xae08c571e771F360c35f5715E36407ECc89D91ed",
  "0xaC7EA48093B61f2E217b9d077d69D9d55CA1B106",
  "0xA7FdCa7AA0B69927a34ec48DdcFe3d4C66fF0d94",
  "0x9D8e2dc5615c674F329d18786D52AF10a65Af08b",
  "0x8D5998A27b3CdF33479B65B18F075E20a7aa05b9",
  "0x7e2a2FA2a064F693f0a55C5639476d913Ff12D05",
  "0x7dA0aEf1B75035cbf364a690411BCCa7E7859dF8",
  "0x7AdE2D98420d1735EA2Ad3C17Ef46bF11500Fc4f",
  "0x795e17B08f45cd06E833138a2236Fa8C7aA0b3AC",
  "0x77777A6C097a1cE65C61A96a49bd1100F660eC94",
  "0x70B6c88f608AC228Fd767d05094967eb91d02583",
  "0x6aF43cC73c4a871274767887e8E39Eeb540582A3",
  "0x5F525f637759FCa7C9d1C0C4f9d479D6E8D8ceF5",
  "0x5c8D0eeD35a9e632BB8c0AbE4662B6aB3326850b",
  "0x5A266F52802e846ddf93B87e520404B4fe778411",
  "0x57af10eD3469b2351AE60175d3C9B3740E1Bb649",
  "0x5638cbdC72bd8554055883D309CFc70357190CF3",
  "0xf0Ef0B3D1CE0a2C303e76200213B3AD5dE61a4B7",
  "0x9FE3bC4A1A4116c6Dc1fFD61226E262c3f2bc561",
  "0x8E57bC446f76B2054089CC5c8fA6F0F5B72fC59a",
  "0x24b1D27B0f6B5A2Aa052Acf59817a8D9e7A8600A",
  "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
  "0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326",
  "0xCE0BaBc8398144Aa98D9210d595E3A9714910748",
  "0xEeEE8Db5fC7d505e99970945a9220Ab7992050E3",
  "0xE821377b30C63a873Be0eb7fE0c6f31911285d38",
  "0xd11D7D2cb0aFF72A61Df37fD016EE1bd9F180633",
  "",
];

async function fundsMoved(hash) {
  const apiUrl = `https://api.etherscan.io/api?module=account&action=txlistinternal&txhash=${hash}&apikey=${apiKey}`;

  const response = await axios.get(apiUrl);
  const internalTransactions = response.data.result;

  let fundsMovedToBuilder = new BigNumber("0");
  if (internalTransactions.length > 0) {
    console.log("Internal Transactions:");
    internalTransactions.forEach((transaction) => {
      if (
        mevBuilders
          .map((el) => el.toLowerCase())
          .includes(transaction.to.toLowerCase())
      ) {
        fundsMovedToBuilder = fundsMovedToBuilder.plus(transaction.value);
      }
      console.log(
        `From: ${transaction.from}, To: ${transaction.to}, Value: ${transaction.value}`
      );
    });
  } else {
    console.log("No internal transactions found.");
  }
  return fundsMovedToBuilder;
}

async function groupWithDate(fileName) {
  const filePath = `liquidationLast2Years/${fileName}.json`;
  const rawData = fs.readFileSync(filePath);
  const mainList = JSON.parse(rawData);

  const listSize = mainList.length;
  console.log("list size ", listSize);

  const start = 0; //parseInt((3 * listSize) / 4);
  const end = listSize; //parseInt((4 * listSize) / 4);
  console.log({ start, end });
  const list = mainList.slice(start, end);

  const groupedData = {};
  let i = 0;
  while (i < list.length) {
    const date = new Date(
      Number(list[i].timestamp) * 1000
    ).toLocaleDateString();
    groupedData[date] = groupedData[date] || [];
    const funds = await fundsMoved(list[i].hash);
    groupedData[date].push({
      user: list[i].liquidatee.id,
      hash: list[i].hash,
      liquidatedCollateral: list[i].amountUSD,
      sentToBuilder: funds?.toString(),
    });

    i += 1;
  }

  // sort dates to asc

  const dates = Object.keys(groupedData);
  const sortedDateStrings = dates.sort((a, b) => new Date(a) - new Date(b));

  let j = 0;
  const finalList = [];
  while (j < sortedDateStrings.length) {
    const totalLiquidated = groupedData?.[sortedDateStrings[j]].reduce(
      (acc, item) => acc.plus(item?.liquidatedCollateral),
      new BigNumber(0)
    );
    const totalSentToBuilder = groupedData?.[sortedDateStrings[j]].reduce(
      (acc, item) => acc.plus(item?.sentToBuilder),
      new BigNumber(0)
    );
    const liquidations = groupedData?.[sortedDateStrings[j]].map((el) => {
      return {
        hash: el?.hash,
        liquidatedCollateral: el?.liquidatedCollateral,
        sentToBuilder: el?.sentToBuilder,
      };
    });

    finalList.push({
      date: sortedDateStrings[j],
      totalLiquidated: totalLiquidated?.toString(),
      totalSentToBuilder: totalSentToBuilder?.toString(),
      liquidations: liquidations,
    });

    j += 1;
  }

  console.log({ start, end });

  fs.writeFile(
    `liquidationLast2Years/processedData/${fileName}.json`,
    JSON.stringify(finalList),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("JSON file has been successfully written.");
      }
    }
  );
}

// format funds move to builders in eth unit
async function formatFiles(fileName) {
  const filePath = `liquidationLast2Years/processedData/${fileName}.json`;
  const rawData = fs.readFileSync(filePath);
  const mainList = JSON.parse(rawData);

  const newList = mainList.slice(0, 50).map((el) => {
    return {
      ...el,
      totalSentToBuilder: new BigNumber(el?.totalSentToBuilder)
        .div("1000000000000000000")
        .toString(),
      liquidations: el?.liquidations.map((el2) => {
        return {
          ...el2,
          sentToBuilder: new BigNumber(el2.sentToBuilder)
            .div("1000000000000000000")
            .toString(),
        };
      }),
    };
  });

  //   console.log(JSON.stringify(newList));

  fs.writeFile(
    `liquidationLast2Years/processedData/${fileName}.json`,
    JSON.stringify(newList),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("JSON file has been successfully written.");
      }
    }
  );
}

async function processFiles() {
  const subgraphNames = [
    "aaveV3Eth",
    "aaveV2Eth",
    "maker",
    "compundV3Mainnet",
    "InverseFinanceEthereum",
  ];

  let i = 0;
  while (i < subgraphNames.length) {
    console.log("processing ", subgraphNames[i]);
    await groupWithDate(subgraphNames[i]);

    await formatFiles(subgraphNames[i]);
    i += 1;
  }

  console.log("all files processed");
}

processFiles();
