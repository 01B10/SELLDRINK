import { useAppDispatch, useAppSelector } from '../../store/hooks'

import CardOrder from '../Card-Order'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store/store'
import Swal from 'sweetalert2'
import { formatCurrency } from '../../utils/formatCurrency'
import { resetAllCart } from '../../store/slices/cart.slice'
import { v4 as uuidv4 } from 'uuid'
import { useDeleteCartDBMutation, useGetAllCartDBQuery } from '../../api/cartDB'

const MyCart = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((state: RootState) => state.persistedReducer.cart)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const [deleteCartDBFn, deleteCartDBRes] = useDeleteCartDBMutation()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getAllCart = useGetAllCartDBQuery()

  /* Tính tổng tiền và tổng số lượng quantity */
  const { total, quantity } = items.reduce(
    (accumulator, item) => {
      item.items.forEach((subItem) => {
        accumulator.total += subItem.total
        accumulator.quantity += subItem.quantity
      })
      return accumulator
    },
    { total: 0, quantity: 0 }
  )
  /* xóa tất cả các item có trong cart */
  const handleDeleteAll = (): void => {
    /* confirm lai */
    Swal.fire({
      title: 'Bạn muốn xóa hết tất cả?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đúng!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Xóa!', 'Đã xóa xong.', 'success')
        user.accessToken === '' && user._id === ''
          ? dispatch(resetAllCart())
          : items.map((itemcart) => deleteCartDBFn(itemcart?._id as string))
      }
    })
  }

  // check user login when click
  // console.log('auth ', user)
  const handleCheckUser = () => {
    if (!user.accessToken && !user._id) {
      navigate('/signin')
      return
    } else {
      navigate('/products/checkout')
    }
  }
  return (
    <div className='sidebar shrink-0 w-[300px] bg-[#fff] text-[14px] rounded-sm mx-[16px] pb-[12px] h-fit hidden lg:block'>
      <div className='border border-transparent border-b-[#f1f1f1]  px-4 py-2 flex justify-between items-center'>
        <div className='uppercase'>Giỏ hàng của tôi</div>
        <div
          className={`text-[11px] cursor-pointer ${deleteCartDBRes.isLoading && 'cursor-no-drop'}`}
          onClick={() => handleDeleteAll()}
        >
          Xoá tất cả
        </div>
      </div>

      <div className='mx-[16px]'>
        {items.length > 0 && items.map((item) => <CardOrder key={uuidv4()} product={item} />)}
        <div className='cart '>
          <div className='flex items-center justify-start my-5 cart-ss2'>
            <img className='img-toco h-[40px] pr-2' src='/icon-glass-tea.png' />
            <span className='pr-2 cart-ss2-one'>x</span>
            <span className='cart-ss2-two pr-2 text-[#8a733f]'>{quantity}</span>
            <span className='pr-2 cart-ss2-three'>=</span>
            <span className='cart-ss2-four text-[#8a733f]'>{formatCurrency(total)}</span>
          </div>
          <div className='cart-ss3'>
            {/* <Link to="checkout"> */}
            <button
              disabled={items.length > 0 ? false : true}
              onClick={handleCheckUser}
              className='bg-[#d8b979] text-white text-center rounded-xl py-1 w-full'
            >
              Thanh toán
            </button>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyCart
