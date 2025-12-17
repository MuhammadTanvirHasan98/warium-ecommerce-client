import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';


const useOrders = () => {
    // tan stack query 
    const axiosPublic =useAxiosPublic();
  
      const { data: order= [], isLoading, refetch } = useQuery({
        queryKey:['order' ],
        queryFn: async()=>{
            const res = await axiosPublic.get("/orders");

            // console.log(res.data);
            return res.data;
            
           
        }
    })

    return [order, isLoading, refetch];

  
};

export default useOrders;