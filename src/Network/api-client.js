import axios from "axios";
import config from '../Network/config.json'

export default axios.create( {
    baseURL: `${config.back_end_url}/api`,
} )