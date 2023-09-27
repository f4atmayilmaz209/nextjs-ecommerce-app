


export const login=async(formData)=>{

    try {
        const response=await fetch('https://nextjs-ecommerce-app-git-main-f4atmayilmaz209.vercel.app//api/login',{
            method:'POST',
            headers:{
                'content-type':'application/json',
            },
            body:JSON.stringify(formData)
        })
        const data=response.json();
        return data;
    } catch (error) {
        console.log(error)
        
    }

}