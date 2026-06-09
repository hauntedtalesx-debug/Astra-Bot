import React from 'react';

interface DiscordEmbedProps {
  author?: {
    name: string;
    iconUrl?: string;
  };
  title?: string;
  description?: React.ReactNode;
  color?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string };
  timestamp?: boolean;
}

export function DiscordEmbed({
  author,
  title,
  description,
  color = "#9b59b6",
  fields,
  footer,
  timestamp
}: DiscordEmbedProps) {
  const timeString = timestamp ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="bg-[#2f3136] rounded p-4 max-w-lg shadow-xl text-[0.9375rem] font-sans text-[#dcddde] border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex flex-col gap-2">
        {author && (
          <div className="flex items-center gap-2">
            {author.iconUrl && <img src={author.iconUrl} alt="Author" className="w-6 h-6 rounded-full" />}
            <span className="font-semibold text-white">{author.name}</span>
          </div>
        )}
        
        {title && <div className="font-bold text-white text-base">{title}</div>}
        
        {description && <div className="whitespace-pre-wrap">{description}</div>}
        
        {fields && fields.length > 0 && (
          <div className="grid grid-cols-12 gap-2 mt-2">
            {fields.map((field, i) => (
              <div key={i} className={field.inline ? "col-span-6" : "col-span-12"}>
                <div className="font-bold text-white text-sm mb-1">{field.name}</div>
                <div className="text-sm">{field.value}</div>
              </div>
            ))}
          </div>
        )}

        {(footer || timestamp) && (
          <div className="flex items-center gap-2 text-xs text-[#72767d] mt-2">
            {footer && <span>{footer.text}</span>}
            {footer && timestamp && <span className="w-1 h-1 rounded-full bg-[#72767d]"></span>}
            {timestamp && <span>Hoje às {timeString}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export function DiscordMessage({ 
  avatar, 
  username, 
  bot, 
  time = "Hoje às 14:32", 
  children 
}: { 
  avatar: string; 
  username: string; 
  bot?: boolean;
  time?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 p-4 hover:bg-[#32353b] transition-colors rounded">
      <img src={avatar} alt={username} className="w-10 h-10 rounded-full cursor-pointer hover:shadow-md transition-shadow" />
      <div className="flex flex-col flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-white cursor-pointer hover:underline">{username}</span>
          {bot && (
            <span className="bg-[#5865f2] text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded flex items-center">
              <span className="leading-none">APP</span>
            </span>
          )}
          <span className="text-xs text-[#72767d]">{time}</span>
        </div>
        <div className="text-[#dcddde] text-[0.9375rem] leading-[1.375rem] mt-1">
          {children}
        </div>
      </div>
    </div>
  );
}
