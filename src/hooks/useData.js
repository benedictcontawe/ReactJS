import { useEffect, useState } from 'react'    
import apiClient from '../components/Network/api-client'

const useData = (endPoint, customConfig, dependencyList) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
      setIsLoading(true)
      apiClient.get(endPoint, customConfig)
      .then(response => {
        setData(response.data)
        setIsLoading(false)
      })
      .catch(error => {
        setError(error.message)
        setIsLoading(false)
      })
    }, dependencyList ? dependencyList : [])
    return { data, error, isLoading }
}

export default useData