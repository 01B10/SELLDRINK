import { DebouncedInput } from '../debounce-input'
import { Message } from '../../types'
import { useState } from 'react'

interface ChatInputBoxProps {
  sendANewMessage: (message: Message) => void
}

export const ChatInputBox = ({ sendANewMessage }: ChatInputBoxProps) => {
  console.log('🚀 ~ file: chat-input-box.tsx:10 ~ ChatInputBox ~ sendANewMessage:', sendANewMessage)
  const [newMessage, setNewMessage] = useState<string>('')

  const doSendMessage = () => {
    if (newMessage && newMessage.length > 0) {
      const newMessagePayload: Message = {
        sentAt: new Date(),
        sentBy: 'devlazar',
        isChatOwner: true,
        text: newMessage
      }
      sendANewMessage(newMessagePayload)
      setNewMessage('')
    }
  }

  return (
    <div className='w-100 rounded-bl-xl rounded-br-xl py-3 overflow-hidden bg-white px-5'>
      <div className='flex flex-row items-center space-x-5'>
        <DebouncedInput
          value={newMessage ?? ''}
          placeholder='Nội dung tin nhắn'
          debounce={100}
          onChange={(value) => setNewMessage(String(value))}
        />
        <button
          type='button'
          disabled={!newMessage || newMessage.length === 0}
          className='hover:bg-[#D3B673] focus:ring-4 focus:outline-none focus:ring-purple-300 disabled:opacity-50 px-3 py-2 text-xs font-medium text-center text-white bg-[#D3B673] rounded-lg'
          onClick={() => doSendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  )
}
