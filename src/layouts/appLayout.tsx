import { useQuery } from '@tanstack/react-query';
import { Navigate } from "react-router-dom";
import { getUser } from "../api/MarTreeApi";
import MartTree from "../components/MartTree";
import LoadingOverlay from '../components/LoadingOverlay';

export default function AppLayout() {

    const { data, isLoading, isError } = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry: 2,
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return <LoadingOverlay />
    }

    if (isError) {
        return <Navigate to={"/auth/login"} replace />;
    }

    if (data) return <MartTree data = {data} />

}

