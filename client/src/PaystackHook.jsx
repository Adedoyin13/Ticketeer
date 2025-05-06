import React from "react";
import logo from './assets/ticketeer-Logo.png'
import { usePaystackPayment } from "react-paystack";
import "./App.css";
import { useSelector } from "react-redux";

// const {user} = useSelector((state) => state.user)
// // const {event} = useSelector((state) => state.events)
// const logo = user.photo.imageUrl

const config = {
  reference: new Date().getTime().toString(),
  email: 'example@gmail.com',
  amount: 20000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
  publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
};

// you can call this function anything
const onSuccess = (reference) => {
  // Implementation for whatever you want to do with reference and after success call.
  console.log(reference);
};

// you can call this function anything
const onClose = () => {
  // implementation for  whatever you want to do when the Paystack dialog closed.
  console.log("closed");
};

const PaystackHookExample = () => {
  const initializePayment = usePaystackPayment(config);
  return (
    <div>
      <button className="py-5"
        onClick={() => {
          initializePayment(onSuccess, onClose);
        }}
      >
        Paystack Hooks Implementation
      </button>
    </div>
  );
};

function PaystackHook() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <PaystackHookExample />
    </div>
  );
}

export default PaystackHook;
