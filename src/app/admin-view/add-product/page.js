"use client"

import InputComponent from "@/components/FormElements/InputComponents"
import SelectComponent from "@/components/FormElements/SelectComponent"
import TileComponent from "@/components/FormElements/TileComponent"
import { GlobalContext } from "@/context"
import { addNewProduct,updateAProduct } from "@/services/product"
import { AvailableSizes, adminAddProductformControls, firebaseConfig, firebaseStroageURL } from "@/utils"
import { initializeApp } from "firebase/app"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useContext, useState } from "react"
import Notification from "@/components/Notification"
import ComponentLevelLoader from "@/components/Loader/componentlevel"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify";
import { useEffect } from "react"


const app = initializeApp(firebaseConfig)
const storage = getStorage(app, firebaseStroageURL)
const createUniqueFileName = (getFile) => {
    const timeStamp = Date.now()
    const randomStringValue = Math.random().toString(36).substring(2, 12)
    return `${getFile.name}-${timeStamp}-${randomStringValue}`;
}
async function helperForUploadingImageToFirebase(file) {
    const getFileName = createUniqueFileName(file)
    const storageReference = ref(storage, `ecommerce/${getFileName}`);
    const uploadImage = uploadBytesResumable(storageReference, file)
    return new Promise((resolve, reject) => {
        uploadImage.on('state_changed', (snapshot) => {

        }, (error) => {
            console.log(error)
            reject(error)
        }, () => {
            getDownloadURL(uploadImage.snapshot.ref).then(downloadUrl => resolve(downloadUrl)).catch(error => reject(error))
        })
    })
}

const initialFormData={
    name:'',
    price:0,
    description:'',
    category:'men',
    sizes:[],
    deliveryInfo:'',
    onSale:'no',
    imageUrl:'',
    priceDrop:0,
}
export default function AdminAddNewProduct() {

    const [formData,setFormData]=useState(initialFormData)
    const {currentUpdatedProduct,setCurrentUpdatedProduct,componentLevelLoader,setComponentLevelLoader}=useContext(GlobalContext)
    const router=useRouter()

    useEffect(()=>{

        if(currentUpdatedProduct !==null) setFormData(currentUpdatedProduct)

    },[currentUpdatedProduct])
    async function handleImage(event) {
        console.log(event.target.files);
        const extractImageUrl = await helperForUploadingImageToFirebase(event.target.files[0])

        if(extractImageUrl !==''){
            setFormData({
                ...formData,
                imageUrl:extractImageUrl
            })
        }
    }
    console.log(formData)
    function handleTileClick(getCurrentItem){

        let cpySizes=[...formData.sizes];
        const index=cpySizes.findIndex(item=>item.id===getCurrentItem.id);
        if(index===-1){
            cpySizes.push(getCurrentItem)
        }else{
            cpySizes=cpySizes.filter(item=>item.id!==getCurrentItem.id)
        }
        setFormData({
            ...formData,
            sizes:cpySizes,
        })
    }
    async function handleAddProduct(){
        setComponentLevelLoader({loading:true,id:''})
        const res=currentUpdatedProduct !==null ? await updateAProduct(formData) : await addNewProduct(formData)

        if(res.success){
           setComponentLevelLoader({loading:false,id:''}) 
           toast.success(res.message,{
            position:toast.POSITION.TOP_RIGHT
        })
        setFormData(initialFormData)
        setCurrentUpdatedProduct(null)
        setTimeout(()=>{
            router.push('/admin-view/all-products')
        },1000)
        }else{
            toast.error(res.message,{
            position:toast.POSITION.TOP_RIGHT})
            setComponentLevelLoader({loading:false,id:''}) 
            setFormData(initialFormData)

        }
    }
    return (
        <div className="w-full mt-5 mr-0 mb-0 ml-0 relative">
            <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
                <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
                    <input onChange={handleImage} accept="image/" max="1000000" type="file" /> 

                    <div className="flex gap-2 flex-col">
                        <label>Available sizes</label>
                        <TileComponent selected={formData.sizes} onClick={handleTileClick} data={AvailableSizes} />
                    </div>
                    {
                        adminAddProductformControls.map((controlItem) => (
                            controlItem.componentType === 'input' ? (<InputComponent onChange={(event)=>{setFormData({...formData,[controlItem.id]:event.target.value})}} value={formData[controlItem.id]} type={controlItem.type} placeholder={controlItem.placeholder} label={controlItem.label} />) :
                                controlItem.componentType === 'select' ? (<SelectComponent onChange={(event)=>{setFormData({...formData,[controlItem.id]:event.target.value})}} value={formData[controlItem.id]} label={controlItem.label} options={controlItem.options} />) : null
                        ))
                    }
                    <button onClick={handleAddProduct} className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-wide">
                        {
                            componentLevelLoader && componentLevelLoader.loading ? (
                            <ComponentLevelLoader loading={componentLevelLoader && componentLevelLoader.loading} text={currentUpdatedProduct!==null ? 'Updating Product' : "Adding Product"} color={"#ffffff"}/> ): ( currentUpdatedProduct!==null ? 'Update Product' : 'Add Product')
                        }
                    </button>
                </div>
            </div>
            <Notification/>
        </div>
    )
}