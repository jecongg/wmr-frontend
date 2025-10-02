import {useForm} from 'react-hook-form'

export default function LoginPage() {
    const {register, handleSubmit, formState: {errors}} = useForm()
    return (
        <div className='w-full h-screen items-center justify-center flex p-10 bg-gray-300'>
            <div className='w-full max-w-4xl p-8 space-y-3 bg-white shadow-lg flex flex-row'>
                <div className='flex-1 px-12 '>
                    <h1></h1>
                </div>
                <div className='flex-1 mx-12 py-12 pl-12'>
                    <p className='font-bold my-1 text-3xl mb-3'>Login</p>
                    <p className='font-light my-1 mb-6'>Welcome Back! Please Login to your Account</p>    
                    <form action="" onSubmit={handleSubmit()}>
                        <div className='flex flex-col space-y-1 mb-2'>
                            <label htmlFor="" className='text-md'>Email</label>
                            <input type="text" className='mt-1 p-2 border-1 text-sm rounded-md'/>
                        </div>
                        <div className='flex flex-col space-y-1 mb-2'>
                            <label htmlFor="">Password</label>
                            <input type="text" className='mt-1 p-2 text-sm border-1 rounded-md'/>
                        </div>
                        <div className='flex flex-row space-y-1 mb-2'>
                            <input type="checkbox" className='mt-2 border-1 rounded-md'/>
                            <label htmlFor="" className='pl-2'>Remember Me</label>
                        </div>
                        <button className='w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white p-2 rounded-md mt-4 hover:scale-105 duration-300 '>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}