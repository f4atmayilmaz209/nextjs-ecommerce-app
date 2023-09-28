
import Cookies from "js-cookie"


// add a new product service 


export const addNewProduct=async(formData)=>{
    try {
        const response=await fetch('/api/admin/add-product',{
        method:'POST',
        headers:{
            'content-type':'application/json',
            Authorization:`Bearer ${Cookies.get('token')}`
        },
        body:JSON.stringify(formData)
        })
        const data=await response.json();

        return data;

    } catch (error) {
        console.log(error)
        
    }
}

export const getAllAdminProducts=async()=>{
    try {
       const res=await fetch(`/api/admin/all-products`,{
        method:'GET',
        cache:'no-store',

       })

       const data=await res.json()
       return data;
    } catch (error) {
        console.log(error)
        
    }
}
export const deletedProduct=async(id)=>{
    try {
        const res=await fetch(`api/admin/delete-product?id=${id}`,{
            method:'DELETE',
            headers:{
                Authorization:`Bearer ${Cookies.get("token")}`
            }
        })
        const data=await res.json()
        return data
        
    } catch (error) {
        console.log(error)
        
    }
}

export const productByCategory=async(id)=>{


    try {

        const res=await fetch(`api/admin/product-by-category?id=${id}`,{
            method:'GET',
            cache: "no-store",
        })
        const data=await res.json();
        console.log("red")
        console.log(data)
        console.log("red")
        return data;
        
    } catch (error) {
        console.log(error)
        
    }
}

export const productById=async(id)=>{
    try {
        const res=await fetch(`/api/admin/product-by-id?id=${id}`,{
            method:'GET',
            cache:'no-store'
            
        })
        const data=await res.json()
        return data
        
    } catch (error) {
        console.log(error)
        
    }
}