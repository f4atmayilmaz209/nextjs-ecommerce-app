"use client"
import { Fragment, useContext } from "react";
import CommonModal from "../CommonModal";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { useEffect } from "react";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../Loader/componentlevel";
import { useRouter } from "next/navigation";



export default function CartModal() {
    const router=useRouter()
    const { setComponentLevelLoader, componentLevelLoader, cartItems, setCartItems, showcartModal, setShowCartModal, user } = useContext(GlobalContext)

    async function extractAllCartItems() {
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
            setCartItems(updateData)
            localStorage.setItem('cartItems', JSON.stringify(updateData))
        }
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


    return (<CommonModal mainContent={cartItems && cartItems.length ? <ul role="list" className="-my-6 divide-y divide-gray-300">{
        cartItems.map(cartItem => <li key={cartItem.id} className="flex py-6"><div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border-gray-200"><img className="h-full w-full object-cover object-center" alt="Cart Item" src={cartItem && cartItem.productID && cartItem.productID.imageUrl} /></div><div className="ml-4 flex flex-1 flex-col"><div><div className="flex justify-between text-base font-medium text-gray-900"><h3><a>{cartItem && cartItem.productID && cartItem.productID.name}</a></h3></div><p className="mt-1 text-sm text-gray-600">${cartItem && cartItem.productID && cartItem.productID.price}</p></div><div className="flex flex-1 items-end justify-between text-sm"><button type="button" className="font-medium text-yellow-600 sm:order-2" onClick={() => handleDeleteCartItem(cartItem._id)}>{componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id===cartItem._id ? <ComponentLevelLoader loading={componentLevelLoader && componentLevelLoader.loading} color={"#000000"} text={'Removing to cart'}/> :'Remove'}</button></div></div></li>)
    }</ul> : null} show={showcartModal} setShow={setShowCartModal} showButtons={true} buttonComponent={<Fragment><button onClick={()=>{router.push('/cart');setShowCartModal(false)}} type="button" className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide">Go To Cart</button><button onClick={()=>{router.push('/checkout');setShowCartModal(false)}} disabled={cartItems && cartItems.length === 0} type="button" className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50">Checkout</button><div className="mt-6 flex justify-center text-center text-sm text-gray-600"><button className="font-medium text-grey" type="button">Continue Shopping<span aria-hidden="true">&rarr;</span></button></div></Fragment>} />)
}