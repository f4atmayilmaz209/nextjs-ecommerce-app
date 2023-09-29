import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";

const stripe=require('stripe')(process.env.SK_KEY_STRIPE)

export const dynamic='force-dynamic';

export async function POST(req){
    try {
       const isAuthUser=await AuthUser(req)
       console.log("stripeee")
       if(isAuthUser){
            const res=await req.json()
            console.log("stripeeesession")
            const session=await stripe.checkout.sessions.create({
                payment_method_types:["card"],
                line_items:res,
                mode:'payment',
                success_url:'/checkout'+'?status=success',
                cancel_url:'/checkout'+'?status=cancel'
            })
            console.log("88")
            console.log(session.id)
            console.log("88")
            return NextResponse.json({
                success:true,
                id:session.id
            })

       }else{
            return NextResponse.json({
                success:true,
                message:'You are not authenticated'
        })

       }

    } catch (error) {
        return NextResponse.json({
            status:500,
            success:false,
            message:'something went wrong | Please try again'
        })
        
    }

}