import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginView from "./views/loginView"
import RegisterView from "./views/registerView"
import AuthLayout from "./layouts/authLayout"
import AppLayout from "./layouts/appLayout"
import MarTreeView from "./views/MarTreeView"
import ProfileView from "./views/profileView"
import HandleView from "./views/HandleView"
import NotFoundView from "./views/NotFoundView"
import HomeView from "./views/HomeView"

export default function Router() {

    return (
        <BrowserRouter>

            <Routes>
                <Route element={< AuthLayout />}>
                    <Route path="/auth/login" element={< LoginView />} />
                    <Route path="/auth/register" element={< RegisterView />} />
                </Route>

                <Route path="/admin" element={< AppLayout />}>
                    <Route index={true} element={< MarTreeView />} />
                    <Route path="profile" element={< ProfileView />} />
                </Route>

                <Route path="/:handle" element={< AuthLayout />}>
                    <Route element={<HandleView />} index={true} />
                </Route>

                <Route path="/" element={<HomeView/>}/>

                <Route path='/404' element={< AuthLayout />}>
                    <Route element={<NotFoundView />} index={true} />
                </Route>

            </Routes>
        </BrowserRouter >
    )
}


/*<Route path='/404' element={< AuthLayout />}>
    <Route element={<NotFoundView />} index={true} />
</Route>*/

// <Route path="*" element={<NotFoundView />} />
