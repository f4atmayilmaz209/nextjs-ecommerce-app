import connectToDB from "@/database"
import { NextResponse } from "next/server"
import AuthUser from "@/middleware/AuthUser"
import Order from "@/models/order"


export const dynamic="force-dynamic"

export async function PUT(req){


    try {
        await connectToDB()
        const isAuthUser=await AuthUser(req)
        const data=await req.json()
        if(isAuthUser?.role==='admin'){

            const {_id,shippingAddress,orderItems,paymentMethod,isPaid,paidAt,isProcessing}=data

            const updateOrder=await Order.findOneAndUpdate({_id:_id},{shippingAddress,orderItems,paymentMethod,isPaid,paidAt,isProcessing},{new:true})
            if(updateOrder){
                return NextResponse.json({
                    success:true,
                    message:"Order status updated successfully",
                })
        

            }else{
                return NextResponse.json({
                    success:true,
                    message:"failed to update the status of order",
                })
            }


        }else{
            return NextResponse.json({
                success:false,
                message:"something went wrong!Please try again later",
            })

        }
        
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"something went wrong!Please try again later",
        })

        
    }
}