import React, { useState } from 'react';

/**
 * Reusable Avatar component that displays the user's uploaded photo from Supabase
 * or falls back gracefully to a stylized initial.
 */
export const UserAvatar = ({ 
  userId, 
  name, 
  sizeClass = "w-12 h-12 text-lg", 
  bgClass = "bg-gradient-to-br from-[#0b5ed7] to-indigo-500 text-white" 
}) => {
  const [imgError, setImgError] = useState(false);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  // Clean cache-buster token so it updates if they upload a new image
  const avatarUrl = userId ? `${supabaseUrl}/storage/v1/object/public/avatars/${userId}.webp` : '';
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (!userId || imgError || !avatarUrl) {
    return (
      <div className={`${sizeClass} rounded-full ${bgClass} font-bold flex items-center justify-center shrink-0 shadow-sm`}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={name}
      onError={() => setImgError(true)}
      className={`${sizeClass} rounded-full object-cover shrink-0 shadow-sm border border-slate-200`}
    />
  );
};

export default UserAvatar;
