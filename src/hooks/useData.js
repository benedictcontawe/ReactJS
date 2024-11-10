import apiClient from '../Network/api-client'
import { useQuery } from '@tanstack/react-query'

const useData = (endPoint, customConfig = {}, queryKey, staleTime = 300_00) => {
  const fetchFunction = () => apiClient.get(endPoint, customConfig).then(response => response.data);
    return useQuery( {
      queryKey: queryKey,
      queryFn: fetchFunction,
      staleTime: staleTime,
    } )
}

export default useData