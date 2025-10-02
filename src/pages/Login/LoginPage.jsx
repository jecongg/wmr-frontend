import {useForm} from 'react-hook-form'

export default function LoginPage() {
    const {register, handleSubmit, formState: {errors}} = useForm()
    return (
        <div className='w-full h-screen items-center justify-center flex p-10 bg-gray-300'>
            <div className='w-full max-w-md p-8 space-y-3 bg-white shadow-lg flex flex-row'>
                <div className='flex-1'>
                    <h1>Halo</h1>
                </div>
                <div className='flex-1'>    
                    <form action="" onSubmit={handleSubmit()}>
                        <span>
                            <label htmlFor="">Email</label>
                            <input type="text" className='mt-2 p-1 border-1'/>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    )
}