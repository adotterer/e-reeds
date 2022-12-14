import type { SignupSchema } from '../../types/signup'
import { CommerceAPIError } from '../utils/errors'
import isAllowedOperation from '../utils/is-allowed-operation'
import type { GetAPISchema } from '..'
import { NextApiResponse } from 'next'

const signupEndpoint: GetAPISchema<
  any,
  SignupSchema
>['endpoint']['handler'] = async (ctx) => {
  const { req, res, handlers, config } = ctx

  if (
    !isAllowedOperation(req, res, {
      POST: handlers['signup'],
    })
  ) {
    return
  }

  const { cookies } = req
  const cartId = cookies[config.cartCookie]

  try {
    const body = { ...req.body, cartId }
    return await handlers['signup']({ ...ctx, body })
  } catch (error: NextApiResponse | any) {
    // console.error(error)
    // console.log('error'.padStart(60, '-.-.'))
    // console.log(error?.data, 'data?')

    if (error?.data?.errors['.customer_create']) {
      res
        .status(500)
        .json({
          data: error?.data?.errors,
          errors: [{ message: error?.data?.errors['.customer_create'] }],
        })
    } else {
      const message =
        error instanceof CommerceAPIError
          ? 'An unexpected error ocurred with the Commerce API'
          : 'An unexpected error ocurred'
      res.status(500).json({ data: error?.data?.errors, errors: [{ message }] })
    }
  }
}

export default signupEndpoint
