import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getUserByHandle } from "../api/MarTreeApi"
import LoadingOverlay from "../components/LoadingOverlay"
import HandleData from "../components/HandleData"

export default function HandleView() {
  const params = useParams()
  const handle = params.handle!

  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserByHandle(handle),
    queryKey: ['handle', handle],
    retry: 1
  })

  if (isLoading) return <LoadingOverlay />
  if (error) return <Navigate to={'/404'} />

  return data ? <HandleData data={data} /> : null
}
