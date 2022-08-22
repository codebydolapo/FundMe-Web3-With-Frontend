import { ethers } from './ethers-5.6.esm.min.js';
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connect_metamask');
const fundButton = document.getElementById('fund_button');
const amountField = document.getElementById('amount');
const balanceAmt = document.getElementById('balanceAmt');
const balance = document.getElementById('balance');
const form = document.getElementById('form');


function connected() {
    if (window.ethereum) {
        window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerText = 'Connected'
    }

}

connectButton.addEventListener('click', () => connected())

async function fund() {
    //alert('hello')
    const ethAmount = amountField.value;
    if (window.ethereum) {
        window.ethereum.request({ method: "eth_requestAccounts" }) //opens metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum); //creates http interface
        const signer = provider.getSigner(); //gets digital signature
        try {
            const contract = new ethers.Contract(contractAddress, abi, signer); //gets contract instance
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) }); //calls fund function
            await txCompletionHandler(transactionResponse, provider) //handles hash
            getBalance() //gets balance
            amountField.value = ''
        }
        catch (error) {
            console.log(error);
        }
    }
}

function txCompletionHandler(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => { //returns nre promise
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed With ${transactionReceipt.confirmations}`)
        })
        resolve() //resolve function
    })
}

async function getBalance() {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum) //creates metamask http interface
        const etherBalance = await provider.getBalance(contractAddress) //gets balance off blockchain
        balanceAmt.innerText = `${ethers.utils.formatEther(etherBalance)}ETh` //FORMATS BALANCE FIGURE
    }
}

function handleSubmit(e) {
    e.preventDefault()
}

form.addEventListener('submit', () => { handleSubmit() })

fundButton.addEventListener('click', ()=>fund())
// fundButton.onclick = () => fund()

//console.log('hello')

async function withdraw(){
    //alert('hello')
    if(window.ethereum){
        window.ethereum.request({ method: "eth_requestAccounts" }) 
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        try{
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const transactionResponse = await contract.withdraw();
            await txCompletionHandler(transactionResponse, provider) //handles hash
            getBalance() //gets balance
        }
        catch(error){
            console.log(error)
        }
    }
}

balance.addEventListener('click', ()=>withdraw())