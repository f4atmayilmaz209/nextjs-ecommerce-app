import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";


const sk_key_stripe=process.env.SK_KEY_STRIPE
const stripe=require('stripe')(sk_key_stripe)

export const dynamic='force-dynamic';

export async function POST(req){
    try {
       const isAuthUser=await AuthUser(req)

       if(isAuthUser){
            const res=await req.json()
            const session=await stripe.checkout.sessions.create({
                payment_method_types:["card"],
                line_items:res,
                mode:'payment',
                success_url:'https://nextjs-ecommerce-jeofhlu8x-f4atmayilmaz209.vercel.app/checkout'+'?status=success',
                cancel_url:'https://nextjs-ecommerce-jeofhlu8x-f4atmayilmaz209.vercel.app/checkout'+'?status=cancel'
            })

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