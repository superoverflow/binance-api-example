import React from "react";
import axios from "axios";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import CryptoJS from 'crypto-js'


const queryClient = new QueryClient();

const API_KEY = "API_KEY"
const API_SECRET = "API_SECRET"

const signMessage = (message, api_secret) => {
  const signature = CryptoJS.HmacSHA256(message, api_secret).toString();
  return signature;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
};

const Example = () => {
  const { data, isLoading } = useQuery("account", async () => {
    const timeUrl = "https://api.binance.com/api/v3/time"
    const { data: serverTimeData } = await axios.get(timeUrl);
    const serverTime = serverTimeData.serverTime;

    const apiParam = `timestamp=${serverTime}`
    const apiSignature = signMessage(apiParam, API_SECRET)
    const accountUrl = "https://api.binance.com/api/v3/account"
    const requestUrl = `${accountUrl}?${apiParam}&signature=${apiSignature}`
    const requestConfig = {
      method: "GET",
      url: requestUrl,
      headers: {
        "X-MBX-APIKEY": API_KEY,
      }
    }
    const { data: accountResponse } = await axios(requestConfig)
    console.log(accountResponse)
    return accountResponse
  });

  if (isLoading) return <div> Loading ... </div>;

  return <div>{`Account Info ${data}`}</div>;
};
