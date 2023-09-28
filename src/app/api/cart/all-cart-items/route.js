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
            console.log("oo")
            const extractAllCartItems=await Cart.find({userID:id}).populate('productID');
            console.log("extr")
            console.log(extractAllCartItems)
            console.log("extr")
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