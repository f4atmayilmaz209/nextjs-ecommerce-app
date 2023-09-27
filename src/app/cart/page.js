"use client"
import { GlobalContext } from "@/context"
import { getAllCartItems } from "@/services/cart"
import { useContext } from "react"
import { useEffect } from "react"
import CommonCart from "@/components/CommonCart"
import { PulseLoader } from "react-spinners"
import { deleteFromCart } from "@/services/cart"
import { toast } from "react-toastify";

export default function Cart(){


    const {componentLevelLoader,setComponentLevelLoader,pageLevelLoader,setPageLevelLoader,user,setCartItems,cartItems}=useContext(GlobalContext)

    async function extractAllCartItems() {
        setPageLevelLoader(true)
        const res = await getAllCartItems(user?._id)
        if (res.success) {
            const updateData=res.data && res.data.length ? res.data.map(item=>({
                ...item,
                productID:{
                    ...item.productID,
                    price:item.productID.onSale==='yes' ? parseInt((
                        item.productID.price-item.productID.price *(item.priceDrop/100)).toFixed(2)
                    ) : item.productID.price
                }
            })):[]
            setCartItems(updateData);
            setPageLevelLoader(false)
            localStorage.setItem('cartItems', JSON.stringify(updateData))
        }
        console.log(res)
    }

    useEffect(() => {
        if (user !== null) extractAllCartItems()
    }, [user])
    async function handleDeleteCartItem(getCartItemID) {
        setComponentLevelLoader({ loading: true, id: getCartItemID })
        const res = await deleteFromCart(getCartItemID)

        if (res.success) {
            setComponentLevelLoader({ loading: false, id: '' })
            toast.success(res.message, {
                position: toast.POSITION.TOP_RIGHT
            })
            extractAllCartItems()

        } else {
            toast.error(res.message, {
                position: toast.POSITION.TOP_RIGHT
            })
            setComponentLevelLoader({ loading: false, id: '' })

        }
    }


    if(pageLevelLoader){
        return (<div className="w-full min-h-screen flex justify-center items-center">
            <PulseLoader color={'#000000'} loading={pageLevelLoader} size={50} data-testid="loader"/>
        </div>)
    }

    return <CommonCart componentLevelLoader={componentLevelLoader} handleDeleteCartItem={handleDeleteCartItem} cartItems={cartItems}/>
}