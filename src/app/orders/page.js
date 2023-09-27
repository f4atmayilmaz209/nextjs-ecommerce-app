"use client"
import { GlobalContext } from "@/context"
import { getAllOrdersForUser } from "@/services/order"
import { useContext, useEffect } from "react"
import { PulseLoader } from "react-spinners"
import {toast} from "react-toastify"
import Notification from "@/components/Notification"
import { useRouter } from "next/navigation"


export default function Orders(){

    const {user,pageLevelLoader,setPageLevelLoader,allOrdersForUser,setAllOrdersForUser}=useContext(GlobalContext)
    
    const router=useRouter()
    async function extractAllOrders(){
        setPageLevelLoader(true)
        const res=await getAllOrdersForUser(user?._id)
        if (res.success){
            setPageLevelLoader(false)
            setAllOrdersForUser(res.data)
            toast.success(res.message,{
                position:toast.POSITION.TOP_RIGHT
            })

        }else{
            setPageLevelLoader(false)
            toast.error(res.message,{
                position:toast.POSITION.TOP_RIGHT
            })

        }

    }
    useEffect(()=>{
        if(user!==null) extractAllOrders()


    },[user])

    if(pageLevelLoader){
      return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <PulseLoader data-testid="loader" size={30} loading={pageLevelLoader} color={"#000000"}/>


        </div>
      )
    }

    return(
        <section className="bg-white">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div>
                        <div className="px-4 py-6 sm:px-8 sm:py-10">
                            <div className="flow-root">
                                {
                                  allOrdersForUser && allOrdersForUser.length ? <ul className="flex flex-col gap-4">
                                    {
                                        allOrdersForUser.map((item)=>
                                            <li key={item._id} className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left">
                                                <div className="flex">
                                                    <h1 className="font-bold text-lg mb-3 flex-1">#order:{item._id}</h1>
                                                    <div className="flex items-center">
                                                        <p className="mr-3 text-sm font-medium text-gray-900">Total paid amount</p>
                                                        <p className="mr-3 text-2xl font-semibold text-gray-900">${item.totalPrice}</p>
                                                    </div>
                
                                                </div>
                                                <div className="flex gap-2">
                                                    {
                                                       item.orderItems.map((orderItem,index)=><div className="shrink-0" key={index}>
                                                            <img alt="Order Item" className="h-24 w-24 max-w-full rounded-lg object-cover" src={orderItem && orderItem.product && orderItem.product.imageUrl}/>
                                                       </div>)
                                                    }

                                                </div>
                                                <div className="flex gap-5">
                                                    <button className="disabled:opacity-50 mt-5 mr-5 inline-block bg-black text-white px-5">
                                                        {item.isProcessing ? 'Order is Processing' : 'Order is delivered'}
                                                    </button>
                                                    <button onClick={()=>router.push(`/orders/${item._id}`)} className="disabled:opacity-50 mt-5 mr-5 inline-block bg-black text-white px-5">
                                                        View Order Details
                                                    </button>
                                                </div>
                                            </li>
                                        
                                        )
                                    }
                                  </ul>: null  
                                }

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Notification/>
        </section>
    ) 

}