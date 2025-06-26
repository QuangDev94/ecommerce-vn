import HomeCards from '@/components/home/home-cards'
import { HomeCarousel } from '@/components/home/home-carousel'
import ProductSlider from '@/components/product/product-slider'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { Card, CardContent } from '@/components/ui/card'
import {
  getAllCategories,
  getProductsByTag,
  getProductsForCard,
} from '@/lib/actions/product.actions'
import data from '@/lib/data'
import { toSlug } from '@/lib/utils'

export default async function Page() {
  const categorise = (await getAllCategories()).slice(0, 4)
  const newArrivals = await getProductsForCard({
    tag: 'new-arrival',
    limit: 4,
  })
  const featureds = await getProductsForCard({
    tag: 'featured',
    limit: 4,
  })
  const bestSellers = await getProductsForCard({
    tag: 'best-seller',
    limit: 4,
  })
  const cards = [
    {
      title: 'Categories to explore',
      link: { text: 'See more', href: '/search' },
      items: categorise.map((category) => ({
        name: category,
        href: `/search?category=${category}`,
        image: `/images/${toSlug(category)}.jpg`,
      })),
    },
    {
      title: 'Explore New Arrivals',
      link: { text: 'View All', href: '/search?tag=new-arrival' },
      items: newArrivals,
    },
    {
      title: 'Discover Best Sellers',
      link: { text: 'View All', href: '/search?tag=best-seller' },
      items: bestSellers,
    },
    {
      title: 'Featured Products',
      link: { text: 'Shop Now', href: '/search?tag=featured' },
      items: featureds,
    },
  ]

  const todaysDeals = await getProductsByTag({ tag: 'todays-deal' })
  return (
    <>
      <HomeCarousel items={data.carousels} />
      <div className='md:p-4 md:space-y-4 bg-border'>
        <HomeCards cards={cards} />
        <Card className='w-full rounded-none'>
          <CardContent className='p-4'>
            <ProductSlider title={"Today's Deals"} products={todaysDeals} />
          </CardContent>
        </Card>
      </div>
      <div className='p-4 bg-background'>
        <BrowsingHistoryList />
      </div>
    </>
  )
}
