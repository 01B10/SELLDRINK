import { Button } from '..'
import { ITopping } from '../../interfaces/topping.type'
import { useAppSelector } from '../../store/hooks'
import { useGetOrderUserByidQuery } from '../../store/slices/order'
import { formatCurrency } from '../../utils/formatCurrency'

// enum STATUS_ORDER {
//   DONE = 'Hoàn thành'
// }
const MyOrder = () => {
  const { user } = useAppSelector((state) => state.persistedReducer.auth)
  console.log(user._id)

  const { data: orderUser } = useGetOrderUserByidQuery(user._id ?? '')
  // console.log(orderUser)

  if (orderUser?.docs.length <= 0)
    return (
      <div className='flex flex-col items-center justify-center w-full h-screen'>
        <img
          src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/5fafbb923393b712b96488590b8f781f.png'
          alt=''
          className='max-w-[150px]'
        />
        <h4 className='mt-2 text-lg'>Chưa có đơn hàng nào!</h4>
      </div>
    )
  return (
    <div className='layout-container w-full'>
      <h2 className='title text-2xl mb-5'>Đơn hàng của tôi</h2>
      <div className='max-h-screen overflow-scroll hidden-scroll-bar '>
        {orderUser?.docs.map((order: any) => (
          <div key={order._id} className={`order-content mb-20`}>
            <div className='status py-2'>
              <span className='mr-2'>Trạng thái: </span>
              <span className='uppercase text-[#D8B979]'>{order.status}</span>
            </div>
            <div className='top py-3 px-6 shadow rounded-md max-h-[250px] overflow-y-auto hidden-scroll-bar'>
              {order.items.map((item: any) => (
                <div key={item._id} className='item flex items-center mb-5'>
                  <div className='left flex pr-4 flex-1'>
                    <div className='image w-[100px] h-[100px] shrink-0'>
                      <img className='w-full object-cover' src={item.image} alt='' />
                    </div>
                    <div className='title pl-3 flex flex-col'>
                      <h3
                        title=' Bàn làm việc gỗ, Bàn kệ lửng chân sắt dùng cho văn phòng, học bài, để máy tính cho học sinh, sinh viên
                    GIÁ XƯỞNG'
                        className='line-clamp-2 text-[16px] font-semibold uppercase '
                      >
                        Cà Phê Sữa Đá
                      </h3>
                      <div className='category'>
                        <span className='text-sm text-[#866312]'>Danh mục: Cà phê</span>
                      </div>
                      <div>
                        <div className='size'>
                          <span className='text-sm text-[#866312]'>Size: {item.size.name}</span>
                        </div>
                        <div className={`topping ${item.toppings.length > 0 ? '' : 'hidden'}`}>
                          <span className='text-sm text-[#866312]'>
                            Toppings: {item.toppings.map((topping: ITopping) => topping.name)}
                          </span>
                        </div>
                      </div>
                      <div className='quantity'>x{item.quantity}</div>
                    </div>
                  </div>
                  <div className='right'>
                    <div className='price ml-3 flex items-center'>
                      {/* <span className='old-price line-through mr-1 text-black opacity-25 overflow-hidden'>₫90.000</span> */}
                      <span className='new-price text-[#D8B979] text-sm align-middle font-medium'>
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='middle flex justify-end items-center my-1 py-2 px-6 shadow rounded-md'>
              <div className='total-price'>
                <span className='mr-[10px] text-sm text=black'>Thành tiền:</span>
                <span className='text-2xl text-[#D8B979]'>{formatCurrency(order.total)}</span>
              </div>
            </div>
            <div className='bottom flex items-center py-4 px-6 shadow rounded-md'>
              <div className='note flex-1 '>
                <span className='text-xs block w-[400px] max-w-[400px] text-left text-gray-500'>
                  Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao đến bạn và sản phẩm nhận được không có
                  vấn đề nào.
                </span>
              </div>
              <div className='confirm-button flex gap-x-3 items-center'>
                <Button onClick={() => alert('clicked')} size='medium' shape='round'>
                  Đã nhận hàng
                </Button>
                <Button
                  onClick={() => alert('clicked')}
                  size='medium'
                  shape='round'
                  style={`${order.status === 'done' && 'hidden'}`}
                >
                  Hủy đơn hàng
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrder
