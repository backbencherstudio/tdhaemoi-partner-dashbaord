'use client';
import React, { createContext } from 'react';

// Context to provide favoriteCount and updater
export const FavoriteCountContext = createContext<{
    favoriteCount: number;
    updateFavoriteCount: () => void;
}>({ favoriteCount: 0, updateFavoriteCount: () => { } }); 