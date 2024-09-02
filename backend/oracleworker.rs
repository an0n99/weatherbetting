const fetch = require('node-fetch');
const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const { Program, Provider, AnchorProvider, web3 } = require('@project-serum/anchor');
const { ChainlinkClient } = require('@chainlink/client');

const connection = new Connection('https://api.mainnet-beta.solana.com');
const wallet = Keypair.generate(); // Replace with actual wallet
const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
const programId = new PublicKey('OracleProgramIDHere'); // Replace with your program ID
const program = new Program(idl, programId, provider);

async function fetchWeatherData() {
  const response = await fetch('https://api.chainlink.com/weather-data'); // Replace with actual Chainlink endpoint
  const data = await response.json();
  return data.weather_data; // Adjust according to the actual data structure
}

async function updateOracleAccount() {
  const weatherData = await fetchWeatherData();

  await program.rpc.updateWeatherData(new anchor.BN(weatherData), {
    accounts: {
      oracleAccount: new PublicKey('OracleAccountAddressHere'), // Replace with actual oracle account address
    },
  });
}

updateOracleAccount().then(() => console.log('Oracle account updated'));
