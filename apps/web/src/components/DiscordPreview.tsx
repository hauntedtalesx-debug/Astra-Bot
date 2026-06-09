"use client";

import React from "react";
import { parseVariables } from "./utils"; // we'll create this or just inline

interface DiscordPreviewProps {
  authorName?: string;
  authorIcon?: string;
  title?: string;
  description?: string;
  color?: string;
  image?: string;
  thumbnail?: string;
  footerText?: string;
  footerIcon?: string;
  buttonLabel?: string;
  botName?: string;
  botAvatar?: string;
}

export function DiscordPreview({
  authorName, authorIcon, title, description, color, image, thumbnail, footerText, footerIcon, buttonLabel,
  botName = "Astra", botAvatar = "https://i.imgur.com/xO9W7V3.png"
}: DiscordPreviewProps) {
  
  const borderColor = color || "#8b5cf6"; // Default Astra purple

  return (
    <div className="bg-[#313338] text-[#dbdee1] rounded-lg p-4 font-sans text-[15px] shadow-lg border border-[#1e1f22]">
      <div className="flex gap-4">
        {/* Bot Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          <img src={botAvatar} alt="Bot Avatar" className="w-10 h-10 rounded-full" />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Bot Name and Tag */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{botName}</span>
            <span className="bg-[#5865f2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              ✓ BOT
            </span>
            <span className="text-[#949ba4] text-xs">Hoje às 12:00</span>
          </div>

          {/* Embed Box */}
          <div className="mt-2 bg-[#2b2d31] rounded flex flex-col max-w-[520px]" style={{ borderLeft: `4px solid ${borderColor}` }}>
            <div className="p-4 flex flex-col gap-2">
              
              {/* Author */}
              {(authorName || authorIcon) && (
                <div className="flex items-center gap-2 mb-1">
                  {authorIcon && <img src={authorIcon} className="w-6 h-6 rounded-full" alt="Author" />}
                  {authorName && <span className="font-semibold text-white text-sm">{authorName}</span>}
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  {/* Title */}
                  {title && <div className="font-bold text-white text-base leading-tight break-words">{title}</div>}
                  
                  {/* Description */}
                  {description && (
                    <div className="text-sm whitespace-pre-wrap break-words leading-tight text-[#dbdee1]">
                      {description}
                    </div>
                  )}
                </div>
                
                {/* Thumbnail */}
                {thumbnail && (
                  <div className="flex-shrink-0">
                    <img src={thumbnail} className="max-w-[80px] max-h-[80px] rounded object-contain" alt="Thumbnail" />
                  </div>
                )}
              </div>

              {/* Image */}
              {image && (
                <div className="mt-2 rounded overflow-hidden max-h-[300px] flex">
                  <img src={image} className="object-contain w-full h-full" alt="Embed Content" />
                </div>
              )}

              {/* Footer */}
              {(footerText || footerIcon) && (
                <div className="flex items-center gap-2 mt-2 pt-1 text-xs text-[#949ba4]">
                  {footerIcon && <img src={footerIcon} className="w-5 h-5 rounded-full object-cover" alt="Footer" />}
                  <span>{footerText}</span>
                </div>
              )}

            </div>
          </div>

          {/* Components (Buttons) */}
          {buttonLabel && (
            <div className="mt-2 flex gap-2">
              <div className="bg-[#4e5058] hover:bg-[#6d6f78] transition-colors text-white px-4 py-2 rounded font-medium text-sm cursor-pointer flex items-center justify-center min-w-[60px]">
                {buttonLabel}
                <svg className="ml-2 w-4 h-4 text-[#b5bac1]" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M10 5.99997H13V17.9999H10V5.99997ZM17 5.99997H14V17.9999H17V5.99997Z" opacity="0.0000001"></path><path d="M10.293 4.29297L17 11.293V12.707L10.293 19.707L8.87886 18.293L14.4648 12L8.87886 5.70703L10.293 4.29297Z"></path></svg>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
