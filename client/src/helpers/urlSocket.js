import baseAPIURL from "./baseAPIURL"
import axios from 'axios'
// const axios = require('axios')


var urlSocket = axios.create({
    
    baseURL: baseAPIURL,
    mode: 'no-cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: process.env.REACT_APP_APIKEY,
    },
    timeout: 5000000,

    
})

export default urlSocket