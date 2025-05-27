'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState, useRef } from 'react';

declare global {
    interface Window {
        google: {
            translate: {
                TranslateElement: new (
                    config: {
                        pageLanguage: string;
                        includedLanguages: string;
                        autoDisplay: boolean;
                    }
                ) => void;
            };
        };
    }
}

interface LanguageSwitcherProps {
    variant?: 'default' | 'minimal';
    className?: string;
    onLanguageChange?: (lang: string) => void;
}

const LanguageSwitcher = ({ variant = 'default', className = '', onLanguageChange }: LanguageSwitcherProps) => {
    const [languageDropDown, setLanguageDropDown] = useState(false);
    const [language, setLanguage] = useState("DE");
    const languageDropdownRef = useRef(null);
    const dropdownContentRef = useRef(null);
    const { selectedLang, setSelectedLang } = useLanguage();

    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLanguageDropDown(!languageDropDown);
    };

    const handleLanguageChange = (lang: string) => {
        const languageMap = {
            'German': { code: 'de', short: 'DE', flag: '🇩🇪' },
            'English': { code: 'en', short: 'EN', flag: '🇬🇧' },
            'Arabic': { code: 'ar', short: 'AR', flag: '🇦🇪' },
            'Chinese': { code: 'zh-CN', short: 'ZH', flag: '🇨🇳' },
            'French': { code: 'fr', short: 'FR', flag: '🇫🇷' }
        };

        const langInfo = languageMap[lang as keyof typeof languageMap];

        if (langInfo) {
            setSelectedLang(langInfo.code);
            setLanguage(langInfo.short);
            setLanguageDropDown(false);
            onLanguageChange?.(langInfo.code);

            // Initialize Google Translate
            const waitForGoogleTranslate = setInterval(() => {
                if (typeof window.google !== 'undefined' && window.google.translate) {
                    clearInterval(waitForGoogleTranslate);
                    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                    if (selectElement) {
                        selectElement.value = langInfo.code;
                        selectElement.dispatchEvent(new Event('change'));
                    }
                    new window.google.translate.TranslateElement({
                        pageLanguage: 'de',
                        includedLanguages: 'en,de,ar,zh-CN,fr',
                        autoDisplay: false
                    });
                }
            }, 100);

            setTimeout(() => clearInterval(waitForGoogleTranslate), 5000);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                languageDropdownRef.current && 
                dropdownContentRef.current &&
                !(languageDropdownRef.current as HTMLElement).contains(event.target as Node) &&
                !(dropdownContentRef.current as HTMLElement).contains(event.target as Node)
            ) {
                setLanguageDropDown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Set initial language based on selectedLang
        const langMap = {
            'de': 'DE',
            'en': 'EN',
            'ar': 'AR',
            'zh-CN': 'ZH',
            'fr': 'FR'
        };
        setLanguage(langMap[selectedLang as keyof typeof langMap] || 'DE');
    }, [selectedLang]);

    const dropdownStyles = variant === 'minimal' ? 'w-[180px]' : 'w-[220px]';
    const buttonStyles = variant === 'minimal' 
        ? 'px-3 py-1.5 text-sm rounded-md bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white/90 hover:border-primary-500'
        : 'px-4 py-2 rounded-[8px] shadow-sm border border-gray-300 font-semibold hover:shadow-md hover:border-primary-500 transition-all duration-300';

    return (
        <div className={`flex items-center ${className}`}>
            <div className='relative inline-block text-left' ref={languageDropdownRef}>
                <button
                    className={`flex justify-between items-center min-w-[120px] gap-x-1.5 bg-white text-gray-900 ${buttonStyles}`}
                    onClick={handleDropdownToggle}
                >
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary-50 text-primary-600 text-xs font-medium">
                            {language}
                        </span>
                        {variant !== 'minimal' && (
                            <span className="font-medium">Language</span>
                        )}
                    </div>
                    <svg
                        className={`size-4 text-gray-500 ${languageDropDown ? "rotate-180" : "rotate-0"} transform duration-300`}
                        viewBox='0 0 20 20'
                        fill='currentColor'
                    >
                        <path
                            fillRule='evenodd'
                            d='M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z'
                            clipRule='evenodd'
                        />
                    </svg>
                </button>

                {languageDropDown && (
                    <div 
                        ref={dropdownContentRef}
                        className={`absolute right-0 mt-2 ${dropdownStyles} bg-white rounded-lg shadow-lg ring-1 ring-black/5 border border-gray-100 overflow-hidden z-[100]`}
                    >
                        {Object.entries({
                            'German': { code: 'de', short: 'DE', flag: '🇩🇪' },
                            'English': { code: 'en', short: 'EN', flag: '🇬🇧' },
                            'Arabic': { code: 'ar', short: 'AR', flag: '🇦🇪' },
                            'Chinese': { code: 'zh-CN', short: 'ZH', flag: '🇨🇳' },
                            'French': { code: 'fr', short: 'FR', flag: '🇫🇷' }
                        }).map(([lang, info]) => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 ${selectedLang === info.code ? 'bg-primary-50/50 text-primary-700 font-medium' : 'text-gray-700'}`}
                            >
                                <span className="text-base">{info.flag}</span>
                                <span className="flex-1">{lang}</span>
                                <span className="text-xs font-medium text-gray-400">{info.short}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div id="google_translate_element" className="hidden" />
        </div>
    );
};

export default LanguageSwitcher;
