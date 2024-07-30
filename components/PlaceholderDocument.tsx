'use client'

import { PlusCircleIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

const PlaceholderDocument = () => {

    const router = useRouter();

    const handleClick = () => {
        router.push('/dashboard/upload')
    }

  return (
    <Button className="flex flex-col items-center justify-center w-64 h-80 rounded-xl bg-gray-100 drop-shadow-md text-gray-400 hover:bg-gray-200/90" onClick={handleClick}>
        <PlusCircleIcon className="h-16 w-16"/>
        <p>Add a document</p>
    </Button>
  )
}

export default PlaceholderDocument