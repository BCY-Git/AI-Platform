import { ref, reactive, computed } from 'vue'

export function useChat() {
  const currentUser = {
    id: 'u1',
    name: 'Me',
    avatar: 'https://github.com/shadcn.png'
  }

  const sessions = ref([
    {
      id: 's1',
      type: 'group',
      name: '产品研发组',
      avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Product',
      unreadCount: 2,
      lastMessage: { content: '下周的发布计划定了吗？', time: Date.now() - 1000 * 60 * 5 }
    },
    {
      id: 's2',
      type: 'group',
      name: '摸鱼小分队',
      avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Fish',
      unreadCount: 0,
      lastMessage: { content: '中午吃什么？', time: Date.now() - 1000 * 60 * 60 }
    },
    {
      id: 's3',
      type: 'direct',
      name: 'Boss',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Boss',
      unreadCount: 5,
      lastMessage: { content: '来我办公室一下', time: Date.now() - 1000 * 60 * 30 }
    }
  ])

  const currentSessionId = ref('s1')

  // Mock messages storage
  const messages = reactive({
    's1': [
      { id: 'm1', senderId: 'u2', senderName: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', content: '大家早上好！', type: 'text', createdAt: Date.now() - 1000 * 60 * 60 * 2, isSelf: false },
      { id: 'm2', senderId: 'u1', senderName: 'Me', avatar: 'https://github.com/shadcn.png', content: '早安~', type: 'text', createdAt: Date.now() - 1000 * 60 * 60 * 2 + 5000, isSelf: true },
      { id: 'm3', senderId: 'u3', senderName: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', content: '下周的发布计划定了吗？', type: 'text', createdAt: Date.now() - 1000 * 60 * 5, isSelf: false }
    ],
    's2': [
       { id: 'm4', senderId: 'u3', senderName: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', content: '中午吃什么？', type: 'text', createdAt: Date.now() - 1000 * 60 * 60, isSelf: false }
    ],
    's3': [
      { id: 'm5', senderId: 'u4', senderName: 'Boss', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Boss', content: '来我办公室一下', type: 'text', createdAt: Date.now() - 1000 * 60 * 30, isSelf: false }
    ]
  })

  const currentMessages = computed(() => {
    return messages[currentSessionId.value] || []
  })

  const currentSession = computed(() => {
    return sessions.value.find(s => s.id === currentSessionId.value)
  })

  function selectSession(id) {
    currentSessionId.value = id
    // Clear unread count
    const session = sessions.value.find(s => s.id === id)
    if (session) {
      session.unreadCount = 0
    }
  }

  function sendMessage(content) {
    if (!content.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      avatar: currentUser.avatar,
      content: content,
      type: 'text',
      createdAt: Date.now(),
      isSelf: true,
      status: 'sending'
    }

    if (!messages[currentSessionId.value]) {
      messages[currentSessionId.value] = []
    }
    messages[currentSessionId.value].push(newMessage)

    // Update session last message
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (session) {
      session.lastMessage = {
        content: content,
        time: Date.now()
      }
    }

    // Simulate sending
    setTimeout(() => {
      newMessage.status = 'sent'
      // Simulate reply
      if (Math.random() > 0.3) {
        setTimeout(() => {
           receiveMockReply(currentSessionId.value)
        }, 1500)
      }
    }, 500)
  }

  function receiveMockReply(sessionId) {
     const replies = ['收到', '好的', '很有道理', '我也觉得', '稍等一下', '这个问题需要再讨论', '赞同', '哈哈哈哈']
     const randomReply = replies[Math.floor(Math.random() * replies.length)]
     const newMessage = {
      id: Date.now().toString(),
      senderId: 'u99',
      senderName: 'AutoBot',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bot',
      content: randomReply,
      type: 'text',
      createdAt: Date.now(),
      isSelf: false
    }
     if (!messages[sessionId]) {
      messages[sessionId] = []
    }
    messages[sessionId].push(newMessage)

    // Update session last message
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.lastMessage = {
        content: randomReply,
        time: Date.now()
      }
      if (currentSessionId.value !== sessionId) {
        session.unreadCount++
      }
    }
  }

  return {
    currentUser,
    sessions,
    currentSessionId,
    currentSession,
    currentMessages,
    selectSession,
    sendMessage
  }
}
