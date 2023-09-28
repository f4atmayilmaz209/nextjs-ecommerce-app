import connectToDB from "@/database";
import { NextResponse } from "next/server";
import Product from "@/models/product";


export const dynamic="force-dynamic";

export async function GET(req){

    try{
        await connectToDB();

        const extractAllproducts=await Product.find({})
        console.log("gggghghghg")
        console.log(extractAllproducts)
        console.log("gggghghghg")
        if(extractAllproducts){
            return NextResponse.json({
                success:true,
                data:extractAllproducts
            })
        }else{

            return NextResponse.json({
                success:false,
                status:204,
                message:'No products found',
            })
        }


    }catch(e){
        console.log(e)
        return NextResponse.json({
            success:false,
            message:"Something went wrong ! Please try again later"
        })

    }
}