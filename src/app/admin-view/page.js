"use client"

import { GlobalContext } from "@/context"
import { getAllOrdersForAllUsers } from "@/services/order"
import { useEffect } from "react"
import { useContext } from "react"
import { PulseLoader } from "react-spinners"
import { updateStatusOfOrder } from "@/services/order"
import ComponentLevelLoader from "@/components/Loader/componentlevel"


export default function AdminView(){

    const {componentLevelLoader,setComponentLevelLoader,pageLevelLoader,setPageLevelLoader,user,allOrdersForAllUsers,setAllOrdersForAllUsers}=useContext(GlobalContext)
    async function extractAllOrdersForAllUsers(){
        setPageLevelLoader(true)
        const res=await getAllOrdersForAllUsers()
        if(res.success){
            setPageLevelLoader(false)
            setAllOrdersForAllUsers(res.data && res.data.length ? res.data.filter((item)=>item.user._id!==user._id) : [])

        }else{
            setPageLevelLoader(false)

        }
    }
    useEffect(()=>{
        if(user!==null) extractAllOrdersForAllUsers()

    },[user])

    async function handleUpdateOrderStatus(getItem){
        setComponentLevelLoader({loading:true,id:getItem._id})
        const res=await updateStatusOfOrder({
            ...getItem,
            isProcessing:false
        })
        if(res.success){
            setComponentLevelLoader({loading:false,id:''})
            extractAllOrdersForAllUsers()
        }else{
            setComponentLevelLoader({loading:false,id:''})

        }
    }

    if(pageLevelLoader){
        return (
          <div className="w-full min-h-screen flex justify-center items-center">
              <PulseLoader data-testid="loader" size={30} loading={pageLevelLoader} color={"#000000"}/>

          </div>
        )
      }
    return <section>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div>
            <div className="px-4 py-6 sm:px-8 sm:py-10">
                <div className="flow-root">
                    {
                        allOrdersForAllUsers && allOrdersForAllUsers.length ? <ul className="flex flex-col gap-4">
                        {
                            allOrdersForAllUsers.map((item)=>
                                <li key={item._id} className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left">
                                    <div className="flex">
                                        <h1 className="font-bold text-lg mb-3 flex-1">#order:{item._id}</h1>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center">
                                                <p className="mr-3 text-sm font-medium text-gray-900">Username :</p>
                                                <p className="text-sm font-semibold text-gray-900">{item?.user?.name}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="mr-3 text-sm font-medium text-gray-900">Email :</p>
                                                <p className="text-sm font-semibold text-gray-900">{item?.user?.email}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="mr-3 text-sm font-medium text-gray-900">Total Paid Amount:</p>
                                                <p className="text-sm font-semibold text-gray-900">${item?.totalPrice}</p>
                                            </div>

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
                                            {item.isProcessing ? 'Order is Processing' : 'Order is Delivered'}
                                        </button>
                                        <button disabled={!item.isProcessing} onClick={()=>handleUpdateOrderStatus(item)} className="disabled:opacity-50 mt-5 mr-5 inline-block bg-black text-white px-5">
                                           
                                            {
                                                componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id===item._id ? <ComponentLevelLoader loading={componentLevelLoader && componentLevelLoader.loading} text={"Updating Order Status"} color={"#ffffff"}/> : 'Update Order Status'
                                            
                                            }
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
    </section>
}