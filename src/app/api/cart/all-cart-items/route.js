import connectToDB from "@/database"
import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";
import Cart from "@/models/cart";

export const dynamic="force-dynamic"

export async function GET(req){
    try {
        await connectToDB();
        const isAuthUser=await AuthUser(req)

        if(isAuthUser){
            const {searchParams}=new URL(req.url);
            const id=searchParams.get('id')
            console.log("id")
            console.log(id)
            console.log("id")


            // if(!id) return NextResponse.json({success:false,message:'please login in!'})
            const r=await Cart.findById("6515a6a11a1d2e859e8111ed")
            console.log("r")
            console.log(r)
            console.log("r")
            const extractAllCartItems=await Cart.find({userID:id}).populate('productID');
            console.log("ext")
            console.log(extractAllCartItems)
            console.log("ext")
            if(extractAllCartItems){
                return NextResponse.json({success:true,data:extractAllCartItems})

            }
            else{
                return NextResponse.json({
                    success:false,
                    message:'No Cart items are found!',
                    status:204
                })

            }

        }else{
            return NextResponse.json({
                success:false,
                message:'You are authenticated'
            })
        }
        
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:'something went wrong please try again'
        })
        
    }
}