"use client"
import { loginFormControls } from "@/utils"
import { useRouter } from "next/navigation"
import InputComponent from "@/components/FormElements/InputComponents"
import { useContext, useState } from "react"
import { login } from "@/services/login";
import { GlobalContext } from "@/context"
import { useEffect } from "react"
import ComponentLevelLoader from "@/components/Loader/componentlevel"
import Notification from "@/components/Notification"
import { toast } from "react-toastify";
import Cookies from "js-cookie"

const initialFormdata={
    email:'',
    password:''
}

export default function Login(){
    const [formData,setFormData]=useState(initialFormdata);
    const {isAuthUser,setIsAuthUser,user,setUser,componentLevelLoader,setComponentLevelLoader}=useContext(GlobalContext)


    const router=useRouter()


    function isValidForm(){
        return formData && formData.email && formData.email.trim()!=='' && formData.password && formData.password.trim() !=='' ? true : false
    }
    async function handleLogin(){
        setComponentLevelLoader({login:true,id:''})
        const res=await login(formData)

        if(res.success){
            toast.success(res.message,{
                position:toast.POSITION.TOP_RIGHT,
            })
            setIsAuthUser(true);
            setUser(res?.finalResult?.user);
            setFormData(initialFormdata);
            Cookies.set('token',res?.finalResult?.token);
            localStorage.setItem('user',JSON.stringify(res?.finalResult?.user))
            setComponentLevelLoader({login:false,id:''})
        }else{
            toast.error(res.message,{
                position:toast.POSITION.TOP_RIGHT,
            })
            setIsAuthUser(false)
            setComponentLevelLoader({login:false,id:''})
        }
    }

    useEffect(()=>{
        if(isAuthUser) router.push('/')
    },[isAuthUser])
    return(
    <div className="bg-white relative">
        <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row">
            <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
                <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
                    <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
                        <p className="w-full text-4xl font-medium text-center font-serif">
                            {
                                componentLevelLoader && componentLevelLoader.loading ? <ComponentLevelLoader loading={componentLevelLoader && componentLevelLoader.loading} text={"Logging In"} color={"#ffffff"}/> : 'Login'
                            }
                        </p>
                        <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                {
                                    loginFormControls.map((controlItem) => controlItem.componentType === 'input' ? (<InputComponent key={controlItem.label} label={controlItem.label} type={controlItem.type} placeholder={controlItem.placeholder} value={formData[controlItem.id]} onChange={(event)=>{
                                        setFormData({
                                            ...formData,
                                            [controlItem.id]:event.target.value
                                        })
                                    }}/>): null)
                                }
                                <button className="disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide" disabled={!isValidForm()} onClick={handleLogin}>Login</button>
                                <div className="flex flex-col gap-2">
                                    <p>
                                        New to website?
                                    </p>
                                    <button onClick={()=>router.push('/register')} className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide">Register</button>

                                </div>
                        </div>
                        
                    </div>

                </div>
            </div>
        </div>
        <Notification/>
    </div>
    )
}