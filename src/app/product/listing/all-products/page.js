import CommonListing from "@/components/CommonListing";
import { getAllAdminProducts } from "@/services/product";




export default async function AllProducts(){

    const getAllProducts=await getAllAdminProducts()
    console.log("6666")
    console.log(getAllProducts)
    console.log("6666")



    return <CommonListing data={getAllProducts && getAllProducts.data}/>
}