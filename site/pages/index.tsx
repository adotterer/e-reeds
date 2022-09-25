import commerce from '@lib/api/commerce'
import { useMemo } from 'react'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero } from '@components/ui'
import { Product } from '@vercel/commerce/types/product'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { featured: true },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
    revalidate: 60,
  }
}

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const featuredIds = [170, 176, 178, 180]

  const sortedProducts = products.reduce((accum: Product[], curr) => {
    if (featuredIds.includes(Number(curr.id))) {
      if (curr.name.includes('Professional')) {
        accum.unshift(curr)
      } else {
        accum.push(curr)
      }
    }
    return accum
  }, [])

  return (
    <>
      <Grid variant="filled">
        {sortedProducts.map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
              priority: true,
            }}
          />
        ))}
      </Grid>

      <Marquee variant="secondary">
        {products.slice(0, 8).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>
      <Hero
        url="/product/oboe-reed"
        headline="Build Your Own Reed"
        description="Customize the staple, diameter, hardness, and shape."
      />

      <Marquee>
        {products.map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>
      <Hero
        url="/search/cane"
        headline="Let us do the sorting"
        description="Customize your cane to your specifications. Orders over $100 ship free!"
      />
      {/* <HomeAllProductsGrid
        newestProducts={products}
        categories={categories}
        brands={brands}
      /> */}
    </>
  )
}

Home.Layout = Layout
