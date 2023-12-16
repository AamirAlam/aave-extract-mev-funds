const { default: BigNumber } = require("bignumber.js");
const fs = require("fs");
const { GraphQLClient, gql } = require("graphql-request");
const { subgraphs } = require("./common");

function BN(value) {
  return new BigNumber(value);
}
async function querySubgraph(subgraphUrl, query) {
  try {
    const client = new GraphQLClient(subgraphUrl, { headers: {} });

    const response = await client.request(query);

    return response;
  } catch (error) {
    console.log("fetch error ", error);
    return null;
  }
}

// timestamp_lt: "1701327139"
// orderBy: amountUSD
// orderDirection: desc
// where: { timestamp_gt: "${startTime}",  }
// timestamp_gt: "${startTime}",
async function extractLiquidations(graphUrl, startTime, endTime, lastDocId) {
  let query = "";

  if (!lastDocId) {
    query = gql`
      query {
        liquidates(first: 1000  where: { timestamp_gt: "${startTime}",  }) {
          id
          amount
          amountUSD
          blockNumber
          hash
          timestamp
          liquidatee {
            id
          }
        }
      }
    `;
  } else {
    query = gql`
    query {
      liquidates(
        first: 1000
        where: { id_gt: "${lastDocId}",  timestamp_gt: "${startTime}"}
      ) {
        id
        amount
        amountUSD
        blockNumber
        hash
        timestamp
        liquidatee {
          id
        }
      }
    }
  `;
  }

  try {
    const result = await querySubgraph(graphUrl, query);
    console.log("fetched ", result?.liquidates?.length);

    // console.log("trades");
    return result?.liquidates;
  } catch (error) {
    console.log("something went wrong ", error);
    return [];
  }
}

async function extract(graphUrl, startTime, endTime) {
  const liquidations = [];

  let lastId;
  while (true) {
    if (!lastId) {
      const items = await extractLiquidations(
        graphUrl,
        startTime,
        endTime,
        null
      );

      if (items?.length === 0) {
        break;
      }
      liquidations.push(...items);
      lastId = items[items.length - 1].id;

      if (items.length < 1000) {
        break;
      }

      //   break;
    } else {
      const items = await extractLiquidations(
        graphUrl,
        startTime,
        endTime,
        lastId
      );

      if (items?.length === 0) {
        break;
      }
      liquidations.push(...items);
      lastId = items[items.length - 1].id;

      if (items.length < 1000) {
        break;
      }
    }
  }

  console.log("total liquidations fetched ", liquidations.length);
  return liquidations;
}

async function main() {
  // fetch liquidations data
  const startTime = 1639454250; // 14 dec 2022
  const endTime = 1702546050; // 12 dec 2023

  const subgraphNames = Object.keys(subgraphs);

  let start = 0;
  while (start < subgraphNames.length) {
    const results = await extract(
      subgraphs[subgraphNames[start]],
      startTime,
      endTime
    );
    fs.writeFile(
      `liquidationLast2Years/${subgraphNames[start]}.json`,
      JSON.stringify(results),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing JSON file:", err);
        } else {
          console.log("JSON file has been successfully written.");
        }
      }
    );

    start += 1;
  }

  // compute stats

  start = 0;
  const statsObject = {};
  while (start < subgraphNames.length) {
    try {
      const data = fs.readFileSync(
        `liquidationLast2Years/${subgraphNames[start]}.json`
      );
      const dataJson = JSON.parse(data);
      console.log("data ", dataJson?.length);
      const totalAmountUSD = dataJson.reduce((accumulator, item) => {
        return accumulator + parseFloat(item.amountUSD);
      }, 0);

      statsObject[`${subgraphNames[start]}`] = {
        totalLiquidations: dataJson.length,
        totalAmountUSD: totalAmountUSD,
      };
    } catch (error) {
      // console.log("err ", error);
      // console.log(
      //   "failed to read file ",
      //   `liquidationData/${subgraphNames[start]}.json`
      // );
    }

    start += 1;
  }

  console.log(statsObject);

  fs.writeFile(
    `liquidationLast2Years/TotalStats.json`,
    JSON.stringify(statsObject),
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

main();
