import { ConnectWallet, useAddress, useContract, useContractRead, useContractWrite, Web3Button } from "@thirdweb-dev/react";
import { useState, useEffect } from 'react'
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Link from 'next/link'


const pixelAddress = "0x711fB2d96d88004AdCa2C06758D033B36E21e813"
const linkToContract = "https://testnet.bscscan.com/address/0x711fB2d96d88004AdCa2C06758D033B36E21e813"

import {
    contractAddress, contractAbi
} from "../contract"

const Home: NextPage = () => {

    const address = useAddress();
    const { contract } = useContract(pixelAddress);

    const [addressTo, setAddressTo] = useState("")
    const [amountErc, setAmountErc] = useState("")
    const [addressBal, setAddressBal] = useState("")
    const [status, setStatus] = useState("User Balance:")
    const [status1, setStatus1] = useState("Finish both transaction")
    const [isLoading, setIsLoading] = useState(false);

    const { data,  } = useContractRead(contract, "checkUserBalance", addressBal)

    const myBal = useContractRead(contract, "checkUserBalance",address)
    const { mutateAsync: transferPixel,  } = useContractWrite(contract, "transferPixel")

    const { contract: tokenContract } = useContract(
        contractAddress,
        contractAbi
    );

    const myFunction = () => {

        if (address) {
                  return (
                    <>
                          <div className={styles.card}>                             
                              <h4>
                                  Your Balance: {myBal?.data?.toString()} Pixel
                                </h4>                                
                              <p>
                                <label htmlFor="addressTo">Address To Send :</label>
                                <input className={styles.card1} type="text" value={addressTo} id="addressTo" name="addressTo" placeholder="Address to Send Pixel Token" onChange={e => setAddressTo(e.target.value)} required />
                              </p>
                              <p>
                                <label htmlFor="amountErc">Amount To Send :</label>
                                  <input className={styles.card1} type="text" value={amountErc} id="amountErc" name="amountErc" placeholder="Amount to send" onChange={e => setAmountErc(e.target.value)} required />
                              </p>
                              {isLoading ? (
                                  <button className={styles.myBtn}>Sending ...</button>
                              ) : (<Web3Button
                                  contractAddress={contractAddress}
                                  contractAbi={contractAbi}
                                  action={async (contract) => {
                                     
                                      await contract.call("increaseAllowance", pixelAddress, amountErc)
                                      setIsLoading(true)
                                      sendTokens()
                                  }}
                              >
                                  Send Now
                              </Web3Button>
                                      )}
                         
                              <span>{status1}</span>
                          </div>
                          <div className={styles.card}>
                              <p>
                                  <label htmlFor="addressBal">Address To check :</label>
                                  <input className={styles.card1} type="text" value={addressBal} id="addressBal" name="addressBal" placeholder="Address to Check Pixel Bal" onChange={e => setAddressBal(e.target.value)} required />
                              </p>                        
                       
                              <Web3Button
                                  contractAddress={pixelAddress}
                                  action={(contract) => {
                                      checkUserBal()
                                  }}
                              >
                                  Check Balance
                              </Web3Button>
                              <span >{status} Pixel</span>
                          </div>
        
                          <Link href={linkToContract} target="_blank">
                            <div className={styles.card} >
                                <h3>View Contract On bscscan &rarr;</h3>
                            
                            </div>
                        </Link>
                    </>
                )
            }
        

        else {
            return (
                <>
                    <h2>Connecting... </h2>
                    <p>
                        Connect you wallet with mumbai testnet now.
                    </p>
                </>
            )
        }
    }

    const checkUserBal = async () => {
        try {
          
            setStatus("User Balance:" + data)
        }
        catch (e) {
            ``
            //console.log(err.reason);
            setStatus(e.reason)
            //console.error("contract call failure", err.reason);
        }
    }

    const sendTokens = async () => {
        try {
            if (!address || !amountErc) {
                setStatus1("Fill Alll details")
            }
            const data = await transferPixel([addressTo, amountErc]);
         
        } catch (e) {
            ``
            console.log(e.reason);
            setStatus1(e.reason)
            //console.error("contract call failure", err.reason);
        }
        setIsLoading(false);
    }





    return (
        <div className={styles.container}>
            <main className={styles.main}>
               
                <Link href="/">
                    <div className={styles.card} >
                        <h2 className={styles.title}>
                            Pixel
                        </h2>
                    </div>
                </Link>

                <p className={styles.description}>
                    Get started by connecting your wallet
                </p>

                <div className={styles.connect}>
                    <ConnectWallet />
                </div>

                <div className={styles.grid}>
                    <div className={styles.grid}>

                         {myFunction()}
                    </div> 

                </div>
            </main>
            
        </div>
    );
};

export default Home;

