import connectToDB from "@/database";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";


export const dynamic="force-dynamic";


export async function DELETE(req){
    try {

        await connectToDB();
        const {searchParams}=new URL(req.url);
        const id=searchParams.get('id');

        // if(!id){
        //     return NextResponse.json({
        //         success:false,
        //         message:"Address ID is required"
        //     })

        // }
        const isAuthUser=await AuthUser(req)
        if(isAuthUser){
            const deletedAddress=await Address.findByIdAndDelete(id)
            if(deletedAddress){
                return NextResponse.json({
                    success:true,
                    message:"Address is deleted successfully"
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message:"failed to delete address ! Please try again"
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