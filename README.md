

*I AM NOT RESPONSIBLE FOR ANY LOSSES INCURRED USING THIS AND I DO NOT HAVE A LIVE VERSION OF THIS, THIS IS PURELY FOR EDUCATIONAL PURPOSES*

--------------------------------------------------------------------------------------

Welcome to the Weather Betting Platform! This decentralized application (dApp) allows users to place bets on weather events at various locations. The platform uses Solana smart contracts to manage bets, calculate odds, and handle payouts, with Chainlink oracles providing the necessary weather data.

**Table of Contents**

1. [Overview](#overview)
2. [Smart Contracts](#smart-contracts)
   - [Bet Program](#bet-program)
   - [Oracle Program](#oracle-program)
3. [Oracle Integration](#oracle-integration)
4. [Frontend Integration with Shadac UI Components](#frontend-integration-with-shadac-ui-components)
5. [Getting Started](#getting-started)
6. [Deployment](#deployment)
7. [License](#license)

---

 **Overview**

The Weather Betting Platform allows users to bet on weather conditions using Solana smart contracts. Bets are placed on specific outcomes, and payouts are determined based on the outcome reported by an external oracle service.

Example: https://drive.google.com/file/d/1VVkEy_Hy8t9nsmZMCZvfzGaXHNfE9h5E/view?usp=sharing 

 **Bet Program**

The Bet Program handles the betting logic, including creating bets, placing bets, and settling bets. It is responsible for:

- **Creating Bets**: Initializes a new bet with details such as location and event timestamp.
- **Placing Bets**: Allows users to place bets and updates the total stakes for each side.
- **Settling Bets**: Calculates payouts based on the final outcome and distributes funds to users.

**Key Components:**
- `BetAccount`: Stores bet details including total stakes and settlement status.
- `UserStakes`: Tracks individual user stakes on each side of the bet.


 **Oracle Program**

The Oracle Program integrates with external data sources to provide weather data. It includes functions for updating and retrieving weather information.

**Key Components:**
- `OracleAccount`: Stores the latest weather data and the address of the oracle service.

**Oracle Integration**

 **Chainlink Integration**

Chainlink provides the external weather data used to settle bets. Integration involves:

1. **Fetching Data**: Off-chain services or workers fetch weather data from Chainlink.
2. **Updating Smart Contracts**: The fetched data is sent to the Solana smart contracts for settlement.

 **Off-Chain Worker**

The off-chain worker script interacts with Chainlink and the Solana blockchain.


 **Frontend Integration with Shadac UI Components**

 **Shadac UI Components**

Shadac UI provides components to build a responsive and interactive frontend for your dApp. Use the following components:

- **Betting Form**: For placing bets.
- **Bet Status**: To show current bet information and status.
- **Odds Display**: To show the odds based on stakes and oracle data.



 **Connecting to the Solana Blockchain**

Use the `@solana/web3.js` library to interact with the Solana blockchain. Ensure your frontend connects to the wallet and interacts with smart contracts to perform actions like placing bets and checking results.

 **Getting Started**

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo/weather-betting-platform.git
   cd weather-betting-platform
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   - Set up your Solana wallet and network configuration.
   - Update configuration files for Chainlink oracles and Solana program IDs.

4. **Run the Application:**
   ```bash
   npm start
   ```

 **Deployment**

1. **Deploy Smart Contracts:**
   - Compile and deploy your Solana smart contracts using Anchor CLI.
   - Update program IDs in your frontend and backend scripts.

2. **Deploy Off-Chain Worker:**
   - Host your off-chain worker on a server or cloud platform.

3. **Deploy Frontend:**
   - Deploy your frontend application to a hosting provider.

 **Contributing**

Please contribute and create forks of this, to continue to improve it 

 
**License**

This project is licensed under the MIT License. 

