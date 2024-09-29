import { ethers } from 'ethers';
import abi from './healthdata.json';
import { useEffect, useState } from 'react';

const address = "ADMIN_ADDRESS";

function Contract() {
    const [acc, setAcc] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);

    async function loadBlockchain() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        setAcc(account);

        window.ethereum.on('accountsChanged', async () => {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = ethers.utils.getAddress(accounts[0]);
            setAcc(account);
        });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const contract = new ethers.Contract(address, abi, provider.getSigner());
        setContract(contract);
    }

    useEffect(() => {
        loadBlockchain();
    }, []);

    return { acc, provider, contract };
}

export default Contract;
