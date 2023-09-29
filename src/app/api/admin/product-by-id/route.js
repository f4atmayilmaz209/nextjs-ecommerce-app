import connectToDB from "@/database";
import { NextResponse } from "next/server";
import Product from "@/models/product";




export const dynamic="force-dynamic";

export async function GET(req){
    try {
        await connectToDB();
        const {searchParams}=new URL(req.url);
        const productId=searchParams.get('id');

        // if(!productId){
        //     return NextResponse.json({
        //         success:false,
        //         status:400,
        //         messsage:'Product id is required'
        //     })

        // }
        console.log("productId")
        console.log(productId)
        console.log("productId")
        const getData=await Product.find({_id:productId})
        if(getData && getData.length){
            return NextResponse.json({success:true,data:getData[0]})
        }else{
            return NextResponse.json({
                success:false,
                status:204,
                messsage:'No Product found'
            })

        }
        
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"Something went wrong! Please try again later" 
        })
        
    }
}