"use client"
import { GlobalContext } from "@/context"
import {usePathname,useRouter} from "next/navigation"
import { deletedProduct } from "@/services/product"
import ComponentLevelLoader from "@/components/Loader/componentlevel"
import { useContext } from "react"
import { toast } from "react-toastify";
import { addToCart } from "@/services/cart"

export default function ProductButton({item}){

    const pathname=usePathname()
    const router=useRouter();
    const {showcartModal,setShowCartModal,user,setCurrentUpdatedProduct,setComponentLevelLoader,componentLevelLoader}=useContext(GlobalContext)
    const isAdminView=pathname.includes("admin-view")

    async function handleDeleteProduct(item){
        setComponentLevelLoader({loading:true,id:item._id}) 
        const res=await deletedProduct(item._id)

        if(res.success){
            setComponentLevelLoader({loading:false,id:''}) 
            toast.success(res.message,{
             position:toast.POSITION.TOP_RIGHT
         })
         router.refresh()
         }else{
             toast.error(res.message,{
             position:toast.POSITION.TOP_RIGHT})
             setComponentLevelLoader({loading:false,id:''}) 
         }
    }
    async function handleAddToCart(getItem){
        setComponentLevelLoader({loading:true,id:getItem._id})
        const res=await addToCart({productID:getItem._id,userID:user._id})
        if(res.success){
            toast.success(res.message,{
                position:toast.POSITION.TOP_RIGHT
            })
            setComponentLevelLoader({loading:false,id:''})
            setShowCartModal(true)
        }else{
            toast.error(res.message,{
                position:toast.POSITION.TOP_RIGHT
            })
            setComponentLevelLoader({loading:false,id:''})
            setShowCartModal(true)
        }

    }

    return isAdminView ? (<><button onClick={()=>{setCurrentUpdatedProduct(item);router.push('/admin-view/add-product')}} className="bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white mt-1.5 flex w-full justify-center">Update</button><button onClick={()=>handleDeleteProduct(item)} className="bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white mt-1.5 flex w-full justify-center">{
        componentLevelLoader && componentLevelLoader.loading && item._id===componentLevelLoader.id ?
        <ComponentLevelLoader loading={componentLevelLoader && componentLevelLoader.loading} color={"#ffffff"} text={'Deleting Product'}/> : 'DELETE'}</button></> ): (<><button onClick={()=>handleAddToCart(item)} className="bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white mt-1.5 flex w-full justify-center">
        {
            componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id===item._id ? <ComponentLevelLoader loading={componentLevelLoader && componentLevelLoader.loading} color={"#ffffff"} text={'Adding to cart'}/> : 'Add To Cart'
        }</button></>)
}