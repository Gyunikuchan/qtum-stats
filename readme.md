# Crypto-Stats

### Summary
Gathers decentralization statistics for various public cryptocurrency networks.<br/>
These are pretty raw metrics that are incapable of tell the full story on its own.<br/>

|Metric|Description|
|:---|:---|
|Total Blocks|The amount of activity within the period|
|Total Nodes|The number of full nodes capable of producing and validating<br/>A higher number here gives better assurances that the network is unstoppable|
|Total Producers|Unique addresses that managed to produce blocks<br/>A higher number here means that the network is harder to censor (your transactions will be published fairly and timely)|
|Total Validators|Unique addresses that participated in validation|
|No of validators to take over network|The minimum number of the top addresses needed for collusion<br/>A higher number here helps to guard against network attacks (e.g. double spends, network stoppage)|
|Wealth held by top 100 (%)|Percentage of wealth held by the top 100 addresses|
|No of accounts to take over network with wealth|The minimum number of the top addresses needed for collusion<br/>Similar to "No of validators to take over network" but relevant only to staking consensus and includes all potential validators|

### Why?
The key propositions of a public DLT network is that it is **trustless** and **permissionless**.<br/>
Without these properties, using private/consortium/trusted networks makes a lot more sense.<br/>

### Other Considerations
- A single entity can control multiple addresses<br/>
- Some consensus are easier/cheaper to game (e.g. buying votes)<br/>
- Some networks have higher barriers to entry in governance or in execution<br/>
- Some networks have claims/properties we assume to be true, but may not be so in practice<br/>
- Some of the wealthiest addresses are exchanges, but they still poses a potential threat should they misbehave<br/>
- While wealth inequality in non-staking networks should not directly affect the network, price manipulation may be a concern<br/>

---
## How to run
`npm i`<br/>
`npm start`<br/>

---
## Results
### Period: 1 week (Sat May 26 2018 20:12:33 GMT+0800 - Sat May 26 2018 20:22:33 GMT+0800)

> |Name|Consensus|Total Blocks|Total Nodes|Total Producers|Total Validators|**No of validators to take over network**|Wealth held by top 100 (%)|**No of accounts to take over network with wealth**|
> |:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
> |[Ethereum](results/ethereum.results.md)|PoW|38|15658|11|11|**2**|34.537|**-**|
> |[Qtum](results/qtum.results.md)|MPoS|3|6743|3|3|**1**|73.072|**24**|
> |[Neo](results/neo.results.md)|dBFT|16|7*|1|7*|**3**|?|**?**|

> *Not dynamically updated
