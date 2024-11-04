import { useEffect, useState } from 'react'    
import apiClient from '../components/utils/api-client'

const useData = (url) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState("")
    useEffect(() => {
      apiClient.get(url)
      .then(response => setData(response.data))
      .catch(error => setError(error.message))
    }, [])
    return { data, error }
}

export default useData