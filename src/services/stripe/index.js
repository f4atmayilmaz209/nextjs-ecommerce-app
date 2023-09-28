
import Cookies from "js-cookie";

export const callStripeSession = async(formData)=>{
    try {
        const res=await fetch('api/stripe',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${Cookies.get('token')}`
            },
            body:JSON.stringify(formData)
        })
        const data=await res.json()
        console.log(data)
        console.log("99")
        return data;
    } catch (error) {
        console.log(error)
        
    }
}