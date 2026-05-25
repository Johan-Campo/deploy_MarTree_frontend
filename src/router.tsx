import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginView from "./views/LoginView"
import RegisterView from "./views/RegisterView"
import AuthLayout from "./layouts/authLayout"
import PublicLayout from "./layouts/PublicLayout"
import AppLayout from "./layouts/appLayout"
import MarTreeView from "./views/MarTreeView"
import ProfileView from "./views/ProfileView"
import HandleView from "./views/HandleView"
import NotFoundView from "./views/NotFoundView"
import HomeView from "./views/HomeView"
import AnalyticsView from "./views/AnalyticsView"
import CustomLinksView from "./views/CustomLinksView"
import QRView from "./views/QRView"

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
                    <Route path="custom-links" element={< CustomLinksView />} />
                    <Route path="profile" element={< ProfileView />} />
                    <Route path="qr" element={< QRView />} />
                    <Route path="analytics" element={< AnalyticsView />} />
                </Route>

                <Route path="/:handle" element={<PublicLayout />}>
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
