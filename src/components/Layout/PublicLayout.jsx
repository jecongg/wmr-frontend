import { Outlet } from "react-router-dom"

export default function PublicLayout() {
    return (
        <>
            <div>
                <main>
                    <Outlet /> 
                </main>
            </div>
        </>
    )
}