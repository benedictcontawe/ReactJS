import { useEffect, useState } from 'react'    
import apiClient from '../components/utils/api-client'

const useData = (endPoint, customConfig, dependencyList) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
      setIsLoading(true)
      apiClient.get(endPoint, customConfig)
      .then(response => {
        if (endPoint == "/products" && data && data.products && customConfig.params.page !== 1) {
          setData(prev => ({
            ...prev, products: [...prev.products, ...response.data.products]  
          }))
        } else {
          setData(response.data)
        }
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