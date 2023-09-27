"use client"

export default function Unauthorized(){


    return(
        <section className="h-screen bg-gray-200">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
               <div className="mx-auto mt-8 max-w-screen px-4 sm:px-6 lg:px-8">
                  <div className="bg-white shadow">
                    <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                        <h1 className="font-bold text-lg">You dont have access to view this page!</h1>
                        <button className="mt-5 mr-5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide">View your orders</button>
                    </div>
                  
                  
                  </div> 
               </div>
            </div>
        </section>
    )
}