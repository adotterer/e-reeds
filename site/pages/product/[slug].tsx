import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import { Product } from '@vercel/commerce/types/product'
export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext<{ slug: string }>) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const productPromise = commerce.getProduct({
    variables: { slug: params!.slug },
    config,
    preview,
  })

  const allProductsPromise = commerce.getAllProducts({
    variables: { first: 30 },
    config,
    preview,
  })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise
  const { product } = await productPromise
  const { products: relatedProducts } = await allProductsPromise

  if (!product) {
    throw new Error(`Product with slug '${params!.slug}' not found`)
  }

  const removeShaperTips: Product[] = relatedProducts.reduce(
    (accum: Product[], curr) => {
      // console.log('curr'.padStart(25, '-'), curr)
      // console.log('curr.path', curr.path)
      if (curr.path?.includes('oboe') || curr.path?.includes('cane')) {
        accum.push(curr)
      }
      return accum
    },
    []
  )
  // console.log('.'.padEnd(300, '.'))
  // console.log('.'.padEnd(300, '.'))
  // console.log(removeShaperTips)
  // console.log('.'.padEnd(300, '.'))
  // console.log('.'.padEnd(300, '.'))
  // console.log('.'.padEnd(300, '.'))
  return {
    props: {
      pages,
      product,
      relatedProducts: removeShaperTips,
      categories,
    },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await commerce.getAllProductPaths()

  return {
    paths: locales
      ? locales.reduce<string[]>((arr, locale) => {
          // Add a product path for every locale
          products.forEach((product: any) => {
            arr.push(`/${locale}/product${product.path}`)
          })
          return arr
        }, [])
      : products.map((product: any) => `/product${product.path}`),
    fallback: 'blocking',
  }
}

export default function Slug({
  product,
  relatedProducts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <ProductView product={product} relatedProducts={relatedProducts} />
  )
}

Slug.Layout = Layout
