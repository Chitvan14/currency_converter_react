import { useEffect,useState } from 'react';
import './App.css';
import BannerChart from './components/BannerChart';
import CurrencyRow from './components/CurrencyRow';
const BASE_URL='https://v6.exchangerate-api.com/v6/62eef46e2964c6f134cf92cc/latest/USD'

function App() {
  const [currencyOption, setCurrencyOption] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [tocurrency, setTocurrency] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  const [exchangeRates, setExchangeRates] = useState()
  let toAmount,fromAmount
  if(amountInFromCurrency){
    fromAmount=amount
    toAmount=amount*exchangeRates
  }else{
    toAmount=amount
    fromAmount=amount / exchangeRates
  }



  useEffect(()=>{
    fetch(BASE_URL)
    .then(res=>res.json())
    .then(data=>{
      const firstCurrency=Object.keys(data.conversion_rates)[1]
      setCurrencyOption([...Object.keys(data.conversion_rates)])
      setFromCurrency(data.base_code)
      setTocurrency(firstCurrency)
      setExchangeRates(data.conversion_rates[firstCurrency])
    })

  },[])
  
  useEffect(()=>{
    if(fromCurrency!=null && tocurrency!=null){
      fetch(`https://v6.exchangerate-api.com/v6/62eef46e2964c6f134cf92cc/pair/${fromCurrency}/${tocurrency}`)
      .then(res=>res.json())
      .then(data=>setExchangeRates(data.conversion_rate))
      
    }
  },[fromCurrency,tocurrency])


function handleFromAmountChange(e){
  setAmount(e.target.value)
  setAmountInFromCurrency(true)
}
function handleToAmountChange(e){
  setAmount(e.target.value)
  setAmountInFromCurrency(false)
}



  return (
    <>
    <BannerChart
    fromCurrency={fromCurrency}
    tocurrency={tocurrency}
    exchangeRates={exchangeRates}
    />
    <div className='header'>
    <h1>Convert</h1>
    <div className='currencyrow'>
    <CurrencyRow
    currencyOption={currencyOption}
    selectedCurrency={fromCurrency}
    onChangeCurrency={e=>setFromCurrency(e.target.value)}
    amount={fromAmount}
    onChangeAmount={handleFromAmountChange}
    />
    <div className='equals'>
      =
    </div>
    <CurrencyRow
    currencyOption={currencyOption}
    selectedCurrency={tocurrency}
    onChangeCurrency={e=>setTocurrency(e.target.value)}
    amount={toAmount}
    onChangeAmount={handleToAmountChange}

    />
    </div>
    </div>
    </>
    
  );
}

export default App;
