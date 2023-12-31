import connectToDB from "@/database";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";

export const dynamic="force-dynamic";


export async function GET(req){
    try {
        await connectToDB();
        const {searchParams}=new URL(req.url)
        const id=searchParams.get('id')
        // if(!id){
        //     return NextResponse.json({
        //         success:false,
        //         message:"you are not logged in"
        //     })

        // }
        const isAuthUser=await AuthUser(req)
        if(isAuthUser){
            const getAllAddresses=await Address.find({userID:id})
            if(getAllAddresses){
                return NextResponse.json({
                    success:true,
                    data:getAllAddresses
                })
    
            }else{
                return NextResponse.json({
                    success:false,
                    message:"failed to get addresses | Please try again"
                })

            }
        }else{
            return NextResponse.json({
                success:false,
                message:"something went wrong!Please try again later"
            })

        }
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success:false,
            message:"something went wrong!Please try again later"
        })
        
    }
}