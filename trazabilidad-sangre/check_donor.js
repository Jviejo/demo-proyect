const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:8545');

const abiTracker = require('./src/lib/contracts/BloodTracker').abi;
const contractAddress = process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const donorAddress = '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc';

async function checkDonor() {
  const contract = new web3.eth.Contract(abiTracker, contractAddress);
  
  console.log('Checking donor:', donorAddress);
  
  const donor = await contract.methods.donors(donorAddress).call();
  console.log('Donor data:', donor);
  console.log('Balance:', donor.balance);
  
  // Ver eventos de donación
  const events = await contract.getPastEvents('Donation', {
    filter: { from: donorAddress },
    fromBlock: 0,
    toBlock: 'latest'
  });
  
  console.log('\nDonation events:', events.length);
  events.forEach(e => {
    console.log('Event:', e.returnValues);
  });
}

checkDonor().catch(console.error);
