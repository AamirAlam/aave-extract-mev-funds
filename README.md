# Extract builder funds from aave markets

## how to use 


Install dependencies 

run `yarn`

### 1. Extract liquidations from the subgraph  
run  `node services/extractLiquidations.js `

this will extract all liquidation data from defined lending markets in the script 

### 2. Find funds moved to builder addresses 
run ` node services/txDetails.js `

this will extract funds moved to builder addresses by looking into each trx internal transfers 
