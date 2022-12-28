import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import "../assets/css/minting.css";
import { FormGroup, Label, Input, Card, CardBody, Button } from "reactstrap";

import useMetamask from "../hooks/useMetamask"

// 이름 링크 설명 블록체인 
function Minting() {

  
    const [imgSrc, setImgSrc] = useState("");
    const [nftName, setNftName] = useState("");
    const [description, setDescription] = useState("");

    const [image_url, setImageUrl] = useState(""); // 서버에서 받아오는 이미지

    // imgPreView
    const [imgBase64, setImgBase64] = useState(''); 
    const [imgFile, setImgFile] = useState(null);

    const handleChangeFile = (e) => {
      let reader = new FileReader();

      reader.onload = () =>{
        const base64 = reader.result;
        if(base64) {
          setImgBase64(base64.toString());
        }
      }
      if(e.target.files[0]){
        reader.readAsDataURL(e.target.files[0]);
        setImgFile(e.target.files[0])
      }
    }

    //Web3 관련
    const [accessToken, setAccessToken] = useState("");
    const [isLogin, setIsLogin] = useState(false);
    const web3 = useMetamask();
    
    // const loginHandler = async()=> {
    // const account = await web3 
    //   .request({
    //     method: "eth_requestAccounts",
    //   })
    //   .then((result)=> result)
    //   .catch((err)=>err);
    //   console.log(account);

    // }

    const loginHandler = async () => {
      // 현재 클라이언트 웹페이지에 계정을 연동하는 것 까지는 구현되었으나
      // 서버에서 신원인증 토큰을 발급받는 부분은 구현이 안 되어 있습니다.
  
      const account = await web3
        .request({
          method: "eth_requestAccounts",
        })
        .then((result) => result)
        .catch((err) => err);
  
      const dataToSign = await axios.get("http://localhost:4000/user/datatosign")
      .then(result=>result.data)
      .catch(err=>err);
      
      const signature = await web3.request({method:"personal_sign", params:[dataToSign, account[0]]})
      .then(result=>result)
      .catch(console.log)
  
      if (!signature) return;
  
      const loginResult = await axios
      .post("http://localhost:4000/user/login", {
        dataToSign, signature, address: account[0]
      }, {withCredentials: true})
      .then(result=>{
        return result.data;
      })
      .catch(console.log)
  
      if (!loginResult) return;
  
      setIsLogin(true);
      setAccessToken(loginResult.data.accessToken);
    };
    
    const logoutHandler = async ()=>{
      const result = await axios.post("http://localhost:4000/user/logout",{}, {withCredentials:true})
      .then(result=>{
        return result.data;
      })
      .catch(console.log)
  
      if (!result) return;
  
      setIsLogin(false);
      setAccessToken("");
    }
  
    useEffect(()=>{
      (async()=>{
        const result = await axios.post("http://localhost:4000/user/verify",{},{withCredentials:true})
        .then(result=>{return result.data})
        .catch(console.log);
  
        if (!result) return;
  
        setIsLogin(true);
        setAccessToken(result.data.accessToken);
      })()
    },[])
  
    // Goerli network가 아니라면 전환
    // const chainId = async window.ethereum.request({ method: "eth_chainId" })
    // console.log("chainId: ", chainId);
    // if(chainId !== '0x5') // 0x5 가 Goerli
    //   await window.ethereum.request({
    //     method: "wallet_switchEthereumChain",
    //     params: [{chainId: '0x5'}]
    //   });
    // };



      async function Minting(){
        // metamask연결 > accounts[0]이 연결된 account
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        console.log(accounts[0]);
      }
      
      const handleSubmit = (e) => {
        e.preventDefault();

        if(!nftName || !description || !imgSrc) return
        console.log("Creating NFT...")


      }


      const resetForm = () =>{
        setNftName('')
        setDescription('')
        setImgSrc(null)
      }

      

    return(
      <>

    <>
      <div className='content-center'>
        <div className="md:grid md:grid-cols-3 md:gap-6 align-content: center">
          <div className="col-start1 col-end-3 ">
            <div className="px-4 sm:px-0 align-content: center">
              <h3 className="text-lg font-medium leading-6 text-gray-900 text-left">Create NFT</h3>
              <p className="mt-1 text-l text-gray-600 text-left">
                Required fields
              </p>
            </div>
          </div>
          <div className="col-start-2 col-span-1">
            <form action="#" method="POST"> 
            {/* 포스트 요청 주소 및 포스트맨 확인 */}
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label 
                      onChange={(e)=> setNftName(e.target.value)} value = {nftName}
                      htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">

                        <input
                          type="text"
                          name="company-website"
                          id="company-website"
                          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="NFT name"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label onChange={(e)=> setDescription(e.target.value)} value = {description}  
                    htmlFor="about" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="The description of NFT"
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your NFT. URLs are hyperlinked.
                    </p>
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="collection" className="block text-sm font-medium text-gray-700">
                        Collection
                      </label>
                      <select
                        id="collection"
                        name="collection"
                        autoComplete="collection-name"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option>Ethereum</option>
                        <option>Klaytn</option>
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="collection" className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <select
                        id="collection"
                        name="collection"
                        autoComplete="collection-name"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        
                        <option>1.0 Eth (Goerli) </option>
                      </select>
                    </div>

                  <div className="Minting" onChange={handleChangeFile}>
                    <label className="block text-sm font-medium text-gray-700">Main Image</label>
                    
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      

                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <input type="file" name="imgFile" id="imgFile" onChange={handleChangeFile}/>
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1"></p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    loginHandler={loginHandler} isLogin={isLogin}
                    onClick={handleSubmit} // 서버쪽으로 넘어가야함
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Make own your NFT
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>


    </>


    </>
  )
}


export default Minting;
