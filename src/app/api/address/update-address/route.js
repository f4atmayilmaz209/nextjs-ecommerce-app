import connectToDB from "@/database";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";

export const dynamic="force-dynamic";


export async function PUT(req){
    try {
        await connectToDB()
        const isAuthUser=await AuthUser(req)
        if(isAuthUser){
            const data=await req.json()
            const {_id,fullName,city,address,country,postalCode}=data;
            
            const updateAddress=await Address.findOneAndUpdate({
                _id:_id,
            },{fullName,city,address,country,postalCode},{new:true})
            if(updateAddress){
                return NextResponse.json({
                    success:true,
                    message:"Address updated successfully"
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message:"failed to update address ! Please try again"
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