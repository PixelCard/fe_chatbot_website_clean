'use client';

import React, { useState } from 'react';
import { 
  Search, Paperclip, Send, Phone, Video, Info, 
  MapPin, FileText, CheckCircle2, Image as ImageIcon,
  MoreVertical, Star, ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// ================= MOCK DATA =================
const MOCK_CONTACTS = [
  {
    id: 1,
    name: "Nguyễn Thanh Toàn",
    role: "Thợ Điện Lạnh",
    avatar: "https://i.pravatar.cc/150?u=1",
    lastMessage: "Mình gửi báo giá sửa tủ lạnh nhé.",
    time: "10:24 AM",
    unread: 2,
    status: "online",
    jobStatus: "IN_PROGRESS"
  },
  {
    id: 2,
    name: "Lê Văn Tiến",
    role: "Thợ Sửa Máy Tính",
    avatar: "https://i.pravatar.cc/150?u=2",
    lastMessage: "Cảm ơn bạn đã sử dụng dịch vụ!",
    time: "Hôm qua",
    unread: 0,
    status: "offline",
    jobStatus: "COMPLETED"
  }
];

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: 'user',
    type: 'TEXT',
    content: 'Chào anh, tủ lạnh nhà em ngăn mát tự nhiên không lạnh nữa, quạt cũng không kêu.',
    time: '09:00 AM'
  },
  {
    id: 2,
    sender: 'tech',
    type: 'TEXT',
    content: 'Chào bạn, mình đã nhận đơn trên hệ thống. Bạn đợi mình 15 phút mình qua kiểm tra nhé.',
    time: '09:05 AM'
  },
  {
    id: 3,
    sender: 'system',
    type: 'STATUS',
    content: '🚀 Thợ Nguyễn Thanh Toàn đang trên đường đến (EN_ROUTE)',
    time: '09:10 AM'
  },
  {
    id: 4,
    sender: 'system',
    type: 'STATUS',
    content: '📍 Thợ đã đến nơi (ARRIVED)',
    time: '09:25 AM'
  },
  {
    id: 5,
    sender: 'tech',
    type: 'IMAGE',
    content: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&q=80',
    time: '09:40 AM'
  },
  {
    id: 6,
    sender: 'tech',
    type: 'TEXT',
    content: 'Mình kiểm tra thì thấy hỏng quạt gió và rơ-le xả đá rồi. Mình gửi bạn báo giá thay linh kiện nhé.',
    time: '09:42 AM'
  },
  {
    id: 7,
    sender: 'tech',
    type: 'QUOTE_CARD',
    quoteId: 101,
    title: 'Thay quạt gió & Rơ-le xả đá tủ lạnh',
    amount: '450.000đ',
    status: 'ACCEPTED', // Có thể đổi thành PENDING để test giao diện
    time: '09:45 AM'
  },
  {
    id: 8,
    sender: 'system',
    type: 'STATUS',
    content: '✅ Khách hàng đã chấp nhận báo giá. Đơn hàng chuyển sang IN_PROGRESS.',
    time: '09:50 AM'
  },
  {
    id: 9,
    sender: 'user',
    type: 'TEXT',
    content: 'Dạ anh tiến hành thay luôn giúp em nhé.',
    time: '09:51 AM'
  }
];

export default function ChatLayout() {
  const router = useRouter();
  const [messageInput, setMessageInput] = useState('');
  
  // STATE ĐỂ TEST 2 GIAO DIỆN
  const [role, setRole] = useState<'CLIENT' | 'TECHNICIAN'>('CLIENT');
  
  // STATE ĐIỀU HƯỚNG MOBILE: Bật/Tắt danh sách chat trên điện thoại
  const [showMobileList, setShowMobileList] = useState(false);

  return (
    <div className="client-theme relative flex h-[100dvh] w-full overflow-hidden bg-[var(--client-shell-soft-bg)] font-sans text-[var(--client-text-primary)] transition-colors md:h-[calc(100vh-64px)]">
      
      {/* ================= NÚT CHUYỂN ĐỔI ROLE (Dùng để test) ================= */}
      <div className="absolute right-4 top-4 z-[60] flex items-center gap-2 rounded-full border border-[var(--client-card-border)] bg-[var(--client-card-bg)]/90 px-3 py-1.5 shadow-[var(--client-card-shadow)] backdrop-blur-sm">
        <span className="hidden sm:inline text-xs font-bold text-gray-500">Chế độ xem:</span>
        <select 
          value={role} 
          onChange={(e) => {
            const nextRole = e.target.value as 'CLIENT' | 'TECHNICIAN';
            setRole(nextRole);
            setShowMobileList(nextRole === 'TECHNICIAN');
          }}
          className="client-accent-text bg-transparent text-sm font-bold outline-none cursor-pointer"
        >
          <option value="CLIENT">Khách (1 cột)</option>
          <option value="TECHNICIAN">Thợ (3 cột)</option>
        </select>
      </div>

      {/* ================= CỘT 1: DANH SÁCH CHAT (CHỈ HIỆN CHO THỢ) ================= */}
      {role === 'TECHNICIAN' && (
        <aside 
          className={`shrink-0 flex-col border-r border-[var(--client-card-border)] bg-[var(--client-shell-soft-bg)]
          ${showMobileList ? 'flex w-full' : 'hidden'} md:flex md:w-80`}
        >
          {/* Header Tìm kiếm */}
            <div className="mt-12 border-b border-[var(--client-card-border)] p-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm tin nhắn..." 
                className="client-input-focus w-full rounded-full border border-[var(--client-control-border)] bg-[var(--client-control-bg)] py-2 pl-9 pr-4 text-sm text-[var(--client-text-primary)] outline-none transition-all"
              />
            </div>
          </div>

          {/* Danh sách người liên hệ */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Đang xử lý</div>
            {MOCK_CONTACTS.map((contact, index) => (
              <div 
                key={contact.id} 
                onClick={() => setShowMobileList(false)} // Click vào chuyển sang Khung Chat trên Mobile
                className={`flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-[var(--client-control-hover-bg)] ${index === 0 ? 'border-l-4 border-[var(--client-primary)] bg-[var(--client-primary-soft)]' : ''}`}
              >
                <div className="relative">
                  <img src={contact.avatar} alt="avatar" className="h-12 w-12 rounded-full object-cover shadow-sm" />
                  {contact.status === 'online' && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-[#151E32]"></span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between">
                    <h4 className="truncate text-sm font-bold dark:text-white">{contact.name}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="truncate text-xs text-gray-600 dark:text-gray-400">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <span className="client-accent-gradient flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* ================= CỘT 2: KHUNG CHAT CHÍNH ================= */}
      <main 
        className={`flex-col bg-[var(--client-shell-bg)]
        ${!showMobileList ? 'flex w-full' : 'hidden'} md:flex 
        ${role === 'CLIENT' ? 'w-full md:max-w-3xl md:mx-auto md:border-x md:shadow-2xl border-gray-200 dark:border-white/10' : 'flex-1'}`}
      >
        
        {/* Header Chat */}
        <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-[var(--client-card-border)] bg-[var(--client-shell-bg)] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Nút Back: Nếu là Thợ thì quay về danh sách (chỉ hiện trên Mobile), nếu là Khách thì quay về Lịch sử đơn */}
            {role === 'CLIENT' ? (
            <button onClick={() => router.push('/')} className="mr-1 text-gray-400 transition-colors hover:text-[var(--client-primary)] sm:mr-2">
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <button 
                onClick={() => setShowMobileList(true)} 
                className="mr-1 text-gray-400 transition-colors hover:text-[var(--client-primary)] md:hidden sm:mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            
            <img src={MOCK_CONTACTS[0].avatar} alt="avatar" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover" />
            <div className="max-w-[120px] sm:max-w-full">
              <h2 className="truncate text-sm sm:text-base font-bold dark:text-white">{MOCK_CONTACTS[0].name}</h2>
              <p className="text-[10px] sm:text-xs text-green-500 font-medium">● Đang hoạt động</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 text-gray-500 dark:text-gray-400 mr-24 sm:mr-0">
            <button className="transition-colors hover:text-[var(--client-primary)]"><Phone className="h-5 w-5" /></button>
            <button className="transition-colors hover:text-[var(--client-primary)]"><Video className="h-5 w-5" /></button>
            {role === 'CLIENT' && (
              <button className="transition-colors hover:text-[var(--client-primary)]"><Info className="h-5 w-5" /></button>
            )}
          </div>
        </header>

        {/* Khu vực Tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="flex justify-center">
            <span className="rounded-full bg-[var(--client-muted-bg)] px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              Hôm nay, 22 Tháng 5
            </span>
          </div>

          {MOCK_MESSAGES.map((msg) => {
            if (msg.type === 'STATUS') {
              return (
                <div key={msg.id} className="flex justify-center my-4">
                  <div className="client-accent-soft client-accent-border max-w-[90%] rounded-lg border px-4 py-2 text-center text-[11px] font-medium sm:text-xs">
                    {msg.content}
                  </div>
                </div>
              );
            }

            const isMe = role === 'CLIENT' ? msg.sender === 'user' : msg.sender === 'tech';

            return (
              <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && <img src={MOCK_CONTACTS[0].avatar} alt="avatar" className="h-8 w-8 rounded-full mr-2 self-end mb-5 object-cover hidden sm:block" />}
                
                <div className="flex flex-col max-w-[90%] sm:max-w-[70%]">
                  
                  {msg.type === 'TEXT' && (
                    <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${isMe ? 'client-accent-gradient text-white rounded-br-none' : 'bg-[var(--client-muted-bg)] text-[var(--client-text-primary)] rounded-bl-none'}`}>
                      {msg.content}
                    </div>
                  )}

                  {msg.type === 'IMAGE' && (
                    <div className="rounded-2xl rounded-bl-none overflow-hidden border border-[var(--client-card-border)] bg-[var(--client-muted-bg)] p-1 shadow-sm">
                      <img src={msg.content} alt="Sự cố" className="rounded-xl w-64 max-w-full h-auto object-cover" />
                    </div>
                  )}

                  {msg.type === 'QUOTE_CARD' && (
                    <div className="max-w-full rounded-2xl rounded-bl-none border border-[var(--client-card-border)] bg-[var(--client-card-bg)] p-4 shadow-[var(--client-card-shadow)] w-64 sm:w-72">
                      <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-3 dark:border-white/5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20">
                          <FileText className="h-4 w-4" />
                        </div>
                        <h4 className="font-bold text-sm dark:text-white">Phiếu Báo Giá</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{msg.title}</p>
                      <p className="mb-4 text-xl font-bold text-[var(--client-primary)]">{msg.amount}</p>
                      
                      {msg.status === 'PENDING' ? (
                        <div className="flex gap-2">
                          {role === 'CLIENT' ? (
                            <>
                              <button className="flex-1 rounded-lg bg-[var(--client-muted-bg)] py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-[var(--client-control-hover-bg)] dark:text-gray-300">Từ chối</button>
                              <button className="client-accent-gradient flex-1 rounded-lg py-2 text-xs font-bold text-white shadow-sm transition-colors hover:brightness-105">Chấp nhận</button>
                            </>
                          ) : (
                            <div className="w-full text-center text-xs font-bold text-yellow-600 dark:text-yellow-500 py-2">Đang chờ khách duyệt...</div>
                          )}
                        </div>
                      ) : (
                        <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-50 py-2 text-xs font-bold text-green-600 dark:bg-green-500/10">
                          <CheckCircle2 className="h-4 w-4" />
                          Đã chấp nhận
                        </div>
                      )}
                    </div>
                  )}

                  <span className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Khu vực Nhập tin nhắn (Footer) */}
        <div className="shrink-0 border-t border-[var(--client-card-border)] bg-[var(--client-shell-bg)] p-3 sm:p-4">
          <div className="flex items-center gap-2 rounded-full bg-[var(--client-muted-bg)] px-3 py-2 sm:gap-3 sm:px-4">
            <button className="text-gray-400 transition-colors hover:text-[var(--client-primary)]">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="hidden text-gray-400 transition-colors hover:text-[var(--client-primary)] sm:block">
              <ImageIcon className="h-5 w-5" />
            </button>
            
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-transparent px-2 text-sm outline-none dark:text-white placeholder:text-gray-400"
            />
            
            <button className="client-accent-gradient client-accent-shadow flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform hover:scale-105 active:scale-95 sm:h-9 sm:w-9">
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </div>
        </div>
      </main>

      {/* ================= CỘT 3: THÔNG TIN THỢ (CHỈ HIỆN CHO THỢ VÀ CHỈ HIỆN TRÊN DESKTOP) ================= */}
      {role === 'TECHNICIAN' && (
        <aside className="hidden w-72 shrink-0 flex-col border-l border-[var(--client-card-border)] bg-[var(--client-shell-soft-bg)] lg:flex">
          <div className="flex flex-col items-center border-b border-[var(--client-card-border)] p-6">
            <img src={MOCK_CONTACTS[0].avatar} alt="profile" className="h-24 w-24 rounded-full object-cover shadow-md mb-4 border-4 border-white dark:border-[#0B1221]" />
            <h3 className="text-lg font-bold dark:text-white">{MOCK_CONTACTS[0].name}</h3>
            <p className="text-sm text-gray-500 mb-2">{MOCK_CONTACTS[0].role}</p>
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold dark:bg-yellow-500/20 dark:text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              4.9 (128 đánh giá)
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Thông tin liên hệ</h4>
              <div className="space-y-3 text-sm dark:text-gray-300">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>090 123 4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>Khu vực Gò Vấp, Q12</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Ảnh đã chia sẻ</h4>
              <button className="client-accent-text text-xs hover:underline">Xem tất cả</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&q=80" className="h-16 w-full rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity" alt="media" />
                <div className="flex h-16 w-full cursor-pointer items-center justify-center rounded-lg bg-[var(--client-muted-bg)] transition-colors hover:bg-[var(--client-control-hover-bg)]">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

    </div>
  );
}
