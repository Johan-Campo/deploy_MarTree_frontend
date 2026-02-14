import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getUserByHandle } from "../api/MarTreeApi"
import LoadingOverlay from "../components/LoadingOverlay"
import HandleData from "../components/HandleData"
import AnimatedBackground from "../components/AnimatedBackground"

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

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      {data && <HandleData data={data} />}
    </div>
  )
}