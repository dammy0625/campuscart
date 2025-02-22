import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden group relative border-none shadow-sm">
      <div className="relative aspect-square">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-2">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex justify-between items-center mt-1">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardContent>
    </Card>
  )
}

