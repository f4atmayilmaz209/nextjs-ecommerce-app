import connectToDB from "@/database";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";



export const dynamic="force-dynamic";
 
export async function GET(req){
    try {
        await connectToDB()
        const isAuthUser=await AuthUser(req)
        if(isAuthUser?.role==='admin'){
            const getAllOrders=await Order.find({}).populate('orderItems.product').populate('user')
            if(getAllOrders){
                return NextResponse.json({
                    success:true,
                    data:getAllOrders
                })

            }else{
                return NextResponse.json({
                    success:false,
                    message:"failed to fetch the orders!Please try again after something",
                })

            }

        }else{
            return NextResponse.json({
                success:false,
                message:"something went wrong!Please try again later",
            })

        }
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success:false,
            message:"something went wrong!Please try again later",
        })
        
    }
}