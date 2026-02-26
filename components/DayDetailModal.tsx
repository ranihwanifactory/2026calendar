import React from 'react';
import { CalendarEvent, WeatherInfo } from '../types';
import { WEEKDAYS } from '../constants';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateString: string;
  events: CalendarEvent[];
  holiday?: CalendarEvent;
  weather?: WeatherInfo;
  onAddEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onToggleComplete: (event: CalendarEvent) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  dateString,
  events,
  holiday,
  weather,
  onAddEvent,
  onEditEvent,
  onToggleComplete,
}) => {
  if (!isOpen) return null;

  const date = new Date(dateString);
  const dayName = WEEKDAYS[date.getDay()];
  const displayDate = `${date.getMonth() + 1}월 ${date.getDate()}일 (${dayName})`;

  const handleShareDay = async () => {
    const holidayText = holiday ? `\n🚩 공휴일: ${holiday.title}` : '';
    const weatherText = weather ? `\n⛅ 날씨: ${weather.icon} ${Math.round(weather.minTemp)}°/${Math.round(weather.maxTemp)}°` : '';
    const eventItems = events.map(e => `${e.completed ? '✅' : '•'} ${e.title}`).join('\n');
    const eventText = events.length > 0 ? `\n📅 일정:\n${eventItems}` : '\n일정 없음';
    
    const shareText = `[2026 스마트 달력] ${displayDate} 정보${weatherText}${holidayText}${eventText}\n\n스마트한 일정 관리, 지금 바로 확인하세요!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayDate} 일정`,
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('내용이 클립보드에 복사되었습니다.');
      } catch (err) {
        alert('공유 기능을 지원하지 않는 브라우저입니다.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 no-print">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Section with Weather */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={handleShareDay}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="오늘 소식 공유"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{date.getFullYear()}년</p>
              <h2 className="text-3xl font-bold">{displayDate}</h2>
            </div>
            
            {weather && (
              <div className="text-right">
                <div className="text-4xl mb-1">{weather.icon}</div>
                <p className="text-sm font-medium">
                  <span className="text-blue-300">{Math.round(weather.minTemp)}°</span>
                  <span className="mx-1 opacity-50">/</span>
                  <span className="text-red-300">{Math.round(weather.maxTemp)}°</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-slate-50">
          <div className="space-y-6">
            {/* Holiday Display */}
            {holiday && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-red-700">{holiday.title}</h4>
                  <p className="text-xs text-red-500">법정 공휴일</p>
                </div>
              </div>
            )}

            {/* Contacts List */}
            {events.some(e => e.type === 'contact') && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-500 px-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  연락처 ({events.filter(e => e.type === 'contact').length})
                </h3>
                <div className="space-y-2">
                  {events.filter(e => e.type === 'contact').map(contact => (
                    <div key={contact.id} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-all">
                      <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                        <span className="font-bold">{contact.title.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0" onClick={() => onEditEvent(contact)}>
                        <h4 className="font-bold text-slate-800 truncate">{contact.title}</h4>
                        <p className="text-xs text-emerald-600 font-medium truncate">{contact.phoneNumber || '번호 없음'}</p>
                      </div>
                      {contact.phoneNumber && (
                        <a 
                          href={`tel:${contact.phoneNumber}`}
                          className="p-3 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition-colors"
                          title="전화 걸기"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Events List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-500 px-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                일정 목록 ({events.filter(e => e.type === 'personal').length})
              </h3>
              {events.filter(e => e.type === 'personal').length === 0 ? (
                <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-300">
                  <p className="text-slate-400 text-sm">기록된 일정이 없습니다.</p>
                </div>
              ) : (
                events.filter(e => e.type === 'personal').map(event => (
                  <div 
                    key={event.id}
                    className={`group bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-all ${event.completed ? 'opacity-60' : ''}`}
                  >
                    <button 
                      onClick={() => onToggleComplete(event)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        event.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-slate-300 hover:border-blue-500'
                      }`}
                    >
                      {event.completed && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    
                    <div className="flex-1 min-w-0" onClick={() => onEditEvent(event)}>
                      <h4 className={`font-bold text-slate-800 truncate ${event.completed ? 'line-through text-slate-400' : ''}`}>
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">{event.description}</p>
                      )}
                    </div>

                    <button 
                      onClick={() => onEditEvent(event)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-600 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-white border-t border-slate-100">
          <button 
            onClick={onAddEvent}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M12 4v16m8-8H4" />
            </svg>
            일정 추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;