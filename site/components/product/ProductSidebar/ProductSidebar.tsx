import s from './ProductSidebar.module.css'
import { useAddItem } from '@framework/cart'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { ProductOptions } from '@components/product'
import type { Product } from '@commerce/types/product'
import Quantity from '@components/ui/Quantity'
import { Button, Text, Rating, Collapse, useUI } from '@components/ui'
import {
  getProductVariant,
  selectDefaultOptionFromProduct,
  SelectedOptions,
} from '../helpers'

interface ProductSidebarProps {
  product: Product
  className?: string
}

const ProductSidebar: FC<ProductSidebarProps> = ({ product, className }) => {
  const addItem = useAddItem()
  const { openSidebar, setSidebarView } = useUI()
  const [loading, setLoading] = useState(false)
  const isCane: boolean = [176, 178, 181].includes(Number(product.id))
  const [quantity, setQuantity] = useState(isCane ? 5 : 1)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  const increaseQuantity = async (n = 1) => {
    if (isCane && n < 0 && quantity === 5) return
    const val = Number(quantity) + n
    setQuantity(val)
  }

  useEffect(() => {
    selectDefaultOptionFromProduct(product, setSelectedOptions)
  }, [product])

  const variant = getProductVariant(product, selectedOptions)
  const addToCart = async () => {
    // console.log(selectedOptions, 'Selected Options')
    setLoading(true)
    try {
      console.log('this is product id', product.id)
      await addItem({
        productId: String(product.id),
        variantId: String(variant ? variant.id : product.variants[0]?.id),
        quantity,
      })
      setSidebarView('CART_VIEW')
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }
  const handleChange = async ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (isCane && Number(value) < 5) return
    return setQuantity(Number(value))
  }

  return (
    <div className={className}>
      <ProductOptions
        options={product.options}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
      <Collapse title="Description">
        <Text
          className="pb-4 break-words w-full max-w-xl"
          html={product.descriptionHtml || product.description}
        />
      </Collapse>
      <div className="flex flex-row justify-between items-center">
        <Rating value={5} />
        {/* <div className="text-accent-6 pr-1 font-medium text-sm">36 reviews</div> */}
      </div>
      <div id="quanAddContainer">
        <label className="quantityLabel" htmlFor="quantity">
          QUANTITY:
        </label>
        <Quantity
          value={quantity}
          handleRemove={() => setQuantity(0)}
          handleChange={handleChange}
          max={50}
          increase={() => increaseQuantity(1)}
          decrease={() => increaseQuantity(-1)}
        />
        {/* <input
          type="number"
          id="pdp-quantity"
          name="quantity"
          onChange={(e) => setQuantity(Number(e.target.value))}
          value={quantity}
          min={isCane ? 5 : 1}
          max="50"
        /> */}
        {process.env.COMMERCE_CART_ENABLED && (
          <Button
            aria-label="Add to Cart"
            type="button"
            className={s.button}
            onClick={addToCart}
            loading={loading}
            disabled={variant?.availableForSale === false}
          >
            {variant?.availableForSale === false
              ? 'Not Available'
              : 'Add To Cart'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default ProductSidebar
