import connectToDB from "@/database"
import { NextResponse } from "next/server"
import AuthUser from "@/middleware/AuthUser";


export const dynamic="force-dynamic"


export async function PUT(req){
    try {
        await connectToDB();
        const extractData=await req.json();
        const isAuthUser=await AuthUser(req)
        if(isAuthUser?.role==='admin'){
            const {_id,name,price,description,category,sizes,deliveryInfo,onSale,priceDrop,imageUrl}=extractData;
            const updatedProduct=await Product.findOneAndUpdate({
                _id:_id
            },{name,price,description,category,sizes,deliveryInfo,onSale,priceDrop,imageUrl},{new:true})
            if(updatedProduct){
                return NextResponse.json({
                    success:true,
                    message:"Product updated successfully"
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message:"Failed to update the product!Please try again later"
                })

            }
        }
        else{
            return NextResponse.json({
                success:false,
                message:"You are not authenticated"
            })

        }
    } catch (error) {

        return NextResponse.json({
            success:false,
            message:"Something went wrong!Please try again later"
        })
        
    }
}

export const updateProduct=async(formData)=>{
    try {
      const res=await fetch('/api/admin/update-product',{
        method:'PUT',
        headers:{
            "content-type":"application/json",
            Authorization:`Bearer ${Cookies.get("token")}`,
        },
        body:JSON.stringify(formData),
      })
      const data=await res.json()
      return data;
    } catch (error) {
        console.log(error)
        
    }
}