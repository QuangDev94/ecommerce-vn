import { HomeCarousel } from '@/components/home/home-carousel'
import data from '@/lib/data'

export default async function Page() {
  return <HomeCarousel items={data.casousels} />
}
