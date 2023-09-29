import connectToDB from "@/database"
import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";
import Cart from "@/models/cart";

export const dynamic="force-dynamic"

export async function GET(req){
    try {
        await connectToDB();
        const isAuthUser=await AuthUser(req)
        console.log("hello")
        if(isAuthUser){
            const {searchParams}=new URL(req.url);
            const id=searchParams.get('id')
            console.log("id")
            console.log(id)
            console.log("id")
            // if(!id) return NextResponse.json({success:false,message:'please login in!'})
            //const extractAllCartItems=await Cart.find({userID:id}).populate({path:"productID",model:"Products"})
            const yo=await Cart.find({userID:id})
            const r=yo
            console.log("wwwwwwww")
            console.log(r[0]["productID"].toString())
            console.log("wwwwwwww")
            const extractAllCartItemsp=await Product.findById(r[0]["productID"].toString())
            console.log(extractAllCartItemsp)
            console.log("extractAllCartItemsp")
            const extractAllCartItems=await Cart.find({userID:id}).populate('productID')
            //const extractAllCartItems=await Cart.find({}).populate('productID')
            console.log("var")
            console.log(extractAllCartItems)
            console.log("var")
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